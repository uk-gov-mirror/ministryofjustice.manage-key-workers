const { formatName, putLastNameFirst, formatTimestampToDate, ensureIsArray } = require('../utils')

module.exports = ({ allocationService, keyworkerApi, oauthApi }) => {
  const formatNumberAllocated = (number) => (number ? `(${number})` : '')

  const renderTemplate = async (req, res, offenderResponse, allocationMode = 'manual') => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const [currentRoles, prisonStatus] = await Promise.all([
      oauthApi.currentRoles(res.locals),
      keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId),
    ])
    const isKeyWorkerAdmin = currentRoles.some((role) => role.roleCode === 'OMIC_ADMIN')

    const recentlyAllocated = req.flash('recentlyAllocated')

    const recentlyAllocatedOffenderNumbers = recentlyAllocated.map((allocation) => allocation.offenderNo)

    const offenderKeyworkers = recentlyAllocatedOffenderNumbers.length
      ? await keyworkerApi.offenderKeyworkerList(res.locals, activeCaseLoadId, recentlyAllocatedOffenderNumbers)
      : []

    const offenderNumbers = [...recentlyAllocated, ...offenderResponse].map(({ offenderNo }) => offenderNo)

    const allKeyworkers = offenderNumbers.length
      ? await keyworkerApi.keyworkerSearch(res.locals, { agencyId: activeCaseLoadId, searchText: '', statusFilter: '' })
      : []

    const allocationHistoryData = offenderNumbers.length
      ? await keyworkerApi.allocationHistorySummary(res.locals, offenderNumbers)
      : []

    const recentlyUpdatedAllocations = offenderKeyworkers.map((offender) => {
      const keyworkerUser = allKeyworkers.find((keyworker) => offender.staffId === keyworker.staffId)
      const offenderDetails = recentlyAllocated.find((o) => offender.offenderNo === o.offenderNo)

      return {
        assignedLivingUnitDesc: offenderDetails.location,
        confirmedReleaseDate: offenderDetails.releaseDate,
        firstName: offenderDetails.firstName,
        keyworkerDisplay: formatName(keyworkerUser.firstName, keyworkerUser.lastName),
        lastName: offenderDetails.lastName,
        numberAllocated: keyworkerUser.numberAllocated,
        offenderNo: offender.offenderNo,
        staffId: offender.staffId,
      }
    })

    const allPrisoners = [...recentlyUpdatedAllocations, ...offenderResponse]
      .map((offender) => ({ ...offender, name: putLastNameFirst(offender.firstName, offender.lastName) }))
      .sort((left, right) => left.name.localeCompare(right.name))

    return res.render('allocateKeyWorker', {
      activeCaseLoadId,
      allocationMode,
      canAutoAllocate: Boolean(prisonStatus.migrated && prisonStatus.autoAllocatedSupported && isKeyWorkerAdmin),
      recentlyAllocated: JSON.stringify(recentlyAllocated),
      prisoners: allPrisoners.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const isManualAllocation = allocationMode === 'manual'
        const selectableKeyworkers = isManualAllocation
          ? allKeyworkers.filter((keyworker) => keyworker.staffId !== offender.staffId && keyworker.status === 'ACTIVE')
          : allKeyworkers.filter((keyworker) => keyworker.staffId === offender.staffId || keyworker.status === 'ACTIVE')
        const sortedSelectableKeyworkers = selectableKeyworkers.sort(
          (left, right) => left.numberAllocated - right.numberAllocated
        )

        const location = offender.assignedLivingUnitDesc || offender.internalLocationDesc

        return {
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo)?.hasHistory,
          keyworkerName:
            staffId &&
            isManualAllocation &&
            `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: sortedSelectableKeyworkers.map((keyworker) => {
            const isAutoAllocated = keyworker.staffId === offender.staffId
            return {
              text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
                keyworker.numberAllocated
              )}`,
              value: JSON.stringify({
                allocationType: isAutoAllocated ? 'A' : 'M',
                firstName: offender.firstName,
                lastName: offender.lastName,
                location,
                offenderNo,
                releaseDate: confirmedReleaseDate,
                staffId: keyworker.staffId,
              }),
              selected: isAutoAllocated,
            }
          }),
          location,
          name: offender.name,
          prisonNumber: offenderNo,
          releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
        }
      }),
    })
  }

  const index = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const offenderResponse = await allocationService.unallocated(res.locals, activeCaseLoadId)

    return renderTemplate(req, res, offenderResponse)
  }

  const auto = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const { allocatedResponse } = await allocationService.allocated(res.locals, activeCaseLoadId)

    return renderTemplate(req, res, allocatedResponse, 'auto')
  }

  const post = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allocateKeyworker, recentlyAllocated, allocationMode } = req.body

    const selectedKeyworkerAllocations = ensureIsArray(allocateKeyworker).filter((keyworker) => keyworker)

    const keyworkerAllocations = selectedKeyworkerAllocations.map((keyworker) => JSON.parse(keyworker))

    const allAllocations = [...keyworkerAllocations, ...JSON.parse(recentlyAllocated)]

    if (allAllocations.length) req.flash('recentlyAllocated', allAllocations)

    if (allocationMode === 'auto') await keyworkerApi.autoAllocateConfirm(res.locals, activeCaseLoadId)

    await Promise.all(
      keyworkerAllocations.map(async ({ staffId, offenderNo, allocationType }) => {
        if (allocationType === 'M') {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            allocationType,
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
        }
      })
    )

    return res.redirect('/manage-key-workers/allocate-key-worker')
  }

  return { auto, index, post }
}
