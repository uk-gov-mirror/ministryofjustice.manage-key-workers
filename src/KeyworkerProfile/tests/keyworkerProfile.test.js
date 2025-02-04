import React from 'react'
import { shallow } from 'enzyme'
import KeyworkerProfile from '../components/KeyworkerProfile'
import mockHistory from '../../test/mockHistory'

const NO_DATA = '--'
const OFFENDER_NAME_COLUMN = 0
const NOMS_ID_COLUMN = 1
const LOCATION_COLUMN = 2
const CRD_COLUMN = 3
const CSRA_COLUMN = 4
const KW_ACTIVITY_COLUMN = 5
const LAST_KW_SESSION_DATE_COLUMN = 6
const KEYWORKER_SELECT_COLUMN = 7

const keyworkerList = [
  {
    firstName: 'Frank',
    lastName: 'Butcher',
    staffId: 123,
    agencyId: 'TEST',
    autoAllocationAllowed: false,
    capacity: 10,
    numberAllocated: 5,
    status: 'Active',
    agencyDescription: 'Agency description',
    scheduleType: '',
    stats: [],
  },
  {
    firstName: 'David',
    lastName: 'Loo',
    staffId: 143,
    agencyId: 'TEST',
    autoAllocationAllowed: false,
    capacity: 10,
    numberAllocated: 5,
    status: 'Active',
    agencyDescription: 'Agency description',
    scheduleType: '',
    stats: [],
  },
  {
    firstName: 'Special',
    lastName: 'Baby',
    staffId: 211,
    agencyId: 'TEST',
    autoAllocationAllowed: false,
    capacity: 10,
    numberAllocated: 5,
    status: 'Active',
    agencyDescription: 'Agency description',
    scheduleType: '',
    stats: [],
  },
]

const keyworker = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'INACTIVE',
  statusDescription: 'Inactive',
  capacity: 8,
  agencyDescription: 'Agency Description',
  agencyId: 'TEST',
  autoAllocationAllowed: false,
  numberAllocated: 5,
  scheduleType: '',
  stats: [],
}

const keyworkerWithActiveDate = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'UNAVAILABLE_ANNUAL_LEAVE',
  statusDescription: 'Inactive',
  capacity: 8,
  activeDate: '2018-06-28',
  agencyDescription: 'Agency Description',
  agencyId: 'TEST',
  autoAllocationAllowed: false,
  numberAllocated: 5,
  scheduleType: '',
  stats: [],
}

const allocatedOffenders = [
  {
    bookingId: 1,
    lastName: 'Rendell',
    firstName: 'Steve',
    offenderNo: 'ZZ124WX',
    internalLocationDesc: 'L-1-1',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'Standard',
    lastKeyWorkerSessionDate: '2018-05-01',
    numKeyWorkerSessions: 5,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 4,
    staffId: 123,
    deallocOnly: false,
  },
  {
    bookingId: 2,
    lastName: 'Rendell2',
    firstName: 'Steve2',
    offenderNo: 'ZZ125WX',
    internalLocationDesc: 'L-1-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'High',
    lastKeyWorkerSessionDate: '2018-06-15',
    numKeyWorkerSessions: 2,
    keyworkerDisplay: NO_DATA,
    staffId: 999,
    deallocOnly: false,
  },
  {
    bookingId: 3,
    lastName: 'Bennett',
    firstName: 'Lucinda',
    offenderNo: 'ZB125WX',
    internalLocationDesc: 'L-2-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: NO_DATA,
    lastKeyWorkerSessionDate: '2018-06-01',
    numKeyWorkerSessions: 3,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 5,
    staffId: 123,
  },
]

const allocatedOffendersWithDangling = [
  {
    bookingId: 1,
    lastName: 'Rendell',
    firstName: 'Steve',
    offenderNo: 'ZZ124WX',
    internalLocationDesc: 'L-1-1',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'Standard',
    lastKeyWorkerSessionDate: '2018-05-01',
    numKeyWorkerSessions: 6,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 4,
    staffId: 123,
    deallocOnly: false,
  },
  {
    bookingId: 2,
    lastName: 'Bennett',
    firstName: 'Lucinda',
    offenderNo: 'ZB125WX',
    internalLocationDesc: 'L-2-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: NO_DATA,
    lastKeyWorkerSessionDate: '2018-06-01',
    numKeyWorkerSessions: 4,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 5,
    staffId: 123,
    deallocOnly: false,
  },
  {
    bookingId: 3,
    lastName: 'Buckley',
    firstName: 'Jeff',
    offenderNo: 'ZB195WX',
    internalLocationDesc: 'LPI-A-2-2',
    confirmedReleaseDate: '2020-10-20',
    crsaClassification: NO_DATA,
    lastKeyWorkerSessionDate: '2018-04-01',
    numKeyWorkerSessions: 3,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 5,
    staffId: 123,
    deallocOnly: true,
  },
]

const props = {
  user: {
    writeAccess: true,
    activeCaseLoadId: 'TEST',
    caseLoadOptions: [],
    expiredFlag: false,
    firstName: 'Test',
    lastName: 'User',
    lockedFlag: false,
    maintainAccess: false,
    maintainAccessAdmin: false,
    migration: false,
    staffId: 1,
    username: 'TestUser',
  },
  keyworkerAllocations: allocatedOffenders,
  keyworkerChangeList: [],
  keyworkerList,
  keyworker,
  handleKeyworkerChange: jest.fn(),
  handleAllocationChange: jest.fn(),
  handleEditProfileClick: jest.fn(),
  config: {
    keyworkerProfileStatsEnabled: 'false',
    keyworkerDashboardStatsEnabled: false,
    mailTo: 'test@email.com',
    notmEndpointUrl: 'http://notm.url',
    prisonStaffHubUrl: 'http://psh.url',
  },
  history: mockHistory,
  message: '',
  loaded: false,
}
const component = shallow(<KeyworkerProfile {...props} />)

describe('Keyworker Profile component', () => {
  it('should render component correctly', async () => {
    expect(component.find('#keyworker-status').at(0).prop('className')).toContain('inactiveStatus')
    expect(component.find('tr').length).toEqual(4) // includes header tr
    expect(component.find('tr').at(3).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Bennett, Lucinda')
    expect(component.find('tr').at(3).find('td').at(NOMS_ID_COLUMN).text()).toEqual('ZB125WX')
    expect(component.find('tr').at(3).find('td').at(LOCATION_COLUMN).text()).toEqual('L-2-2')
    expect(component.find('tr').at(3).find('td').at(CRD_COLUMN).text()).toEqual('20/10/2019')
    expect(component.find('tr').at(3).find('td').at(CSRA_COLUMN).text()).toEqual(NO_DATA)
    expect(component.find('tr').at(3).find('td').at(KW_ACTIVITY_COLUMN).text()).toEqual('01/06/2018')
    expect(component.find('tr').at(3).find('td').at(LAST_KW_SESSION_DATE_COLUMN).text()).toEqual('3')
    expect(component.find('#updateAllocationButton').length).toEqual(1)
    expect(component.find('#active-date').length).toEqual(0)
  })

  it('should remove keyworker from select if currently allocated', async () => {
    expect(component.find('tr').at(2).find('td').at(KEYWORKER_SELECT_COLUMN).find('option').length).toEqual(4)
  })

  it('should handle click correctly', async () => {
    component.find('#updateAllocationButton').simulate('click')

    expect(props.handleAllocationChange.mock.calls.length).toEqual(1)
  })

  it('should handle edit profile click correctly', async () => {
    component.find('#editProfileButton').simulate('click')

    expect(props.handleEditProfileClick.mock.calls.length).toEqual(1)
  })

  it('should render active date if status = annual leave', async () => {
    component.setProps({ keyworker: keyworkerWithActiveDate })
    expect(component.find('#active-date').at(0).text()).toEqual('28/06/2018')
  })

  it('should show the edit profile and update buttons when the user has write access', () => {
    expect(component.find('#editProfileButton').length).toBe(1)
    expect(component.find('#updateAllocationButton').length).toBe(1)
  })

  it('should not disable the allocate new key worker drop down when the user has write access', () => {
    const dropDown = component.find('tr').at(1).find('td').at(KEYWORKER_SELECT_COLUMN).find('select')

    expect(dropDown.props().disabled).toBe(false)
  })

  describe('when the user does not have write access', () => {
    it('should hide the edit profile and update buttons when the user does not have write access', () => {
      component.setProps({ user: { ...props.user, writeAccess: false } })
      expect(component.find('#editProfileButton').length).toBe(0)
      expect(component.find('#updateAllocationButton').length).toBe(0)
    })

    it('should disable the allocate new key worker drop down', () => {
      const dropDown = component.find('tr').at(1).find('td').at(KEYWORKER_SELECT_COLUMN).find('select')

      expect(dropDown.props().disabled).toBe(true)
    })
  })

  it('should only show the de-allocate KW drop down when the offender in different prison', async () => {
    component.setProps({ keyworkerAllocations: allocatedOffendersWithDangling })

    expect(component.find('tr').at(3).find('td').at(KEYWORKER_SELECT_COLUMN).find('option').length).toEqual(2)
  })

  it('should not provide offender link when the offender in different prison', () => {
    const activeLink = component.find('tr').at(1).find('td').at(OFFENDER_NAME_COLUMN).find('a')
    expect(activeLink.props().href).toBe('offenders/ZZ124WX/quick-look')

    const nextActiveLink = component.find('tr').at(2).find('td').at(OFFENDER_NAME_COLUMN).find('a')
    expect(nextActiveLink.props().href).toBe('offenders/ZB125WX/quick-look')

    const noLink = component.find('tr').at(3).find('td').at(OFFENDER_NAME_COLUMN).html()
    expect(noLink).toBe('<td class="row-gutters">Buckley, Jeff</td>')
  })

  it('should hide save button if no allocations', async () => {
    component.setProps({ keyworkerAllocations: [] })
    expect(component.find('#updateAllocationButton').length).toEqual(0)
  })
})
