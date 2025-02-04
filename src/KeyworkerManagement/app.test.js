import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import mockHistory from '../test/mockHistory'

jest.mock('../Spinner/index', () => '')

const config = {
  keyworkerProfileStatsEnabled: 'false',
  keyworkerDashboardStatsEnabled: false,
  notmEndpointUrl: '/notm/endpoint',
  prisonStaffHubUrl: '/prisonStaffHubUrl',
  mailTo: 'email@test.com',
  supportUrl: '/supportUrl',
}

const user = {
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
  writeAccess: false,
}

const props = {
  switchCaseLoad: jest.fn(),
  config,
  user,
  history: mockHistory,
  setErrorDispatch: jest.fn(),
  userDetailsDispatch: jest.fn(),
  switchAgencyDispatch: jest.fn(),
  configDispatch: jest.fn(),
  setMessageDispatch: jest.fn(),
  boundSetMenuOpen: jest.fn(),
  setTermsVisibilityDispatch: jest.fn(),
  error: '',
  page: 0,
  shouldShowTerms: false,
  resetErrorDispatch: jest.fn(),
  keyworkerSettingsDispatch: jest.fn(),
  message: '',
  allowAuto: false,
  migrated: false,
  dispatchLoaded: jest.fn(),
}

describe('App component', () => {
  it('should handle session timeout error response and display alert', async () => {
    const component = shallow(<App {...props} />)
    const appInstance = component.instance()
    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({
      response: { status: 401, data: { message: 'Session expired', reason: 'session-expired' } },
    })
    expect(component.instance().displayAlertAndLogout).toBeCalledWith(
      'Your session has expired, please click OK to be redirected back to the login page'
    )

    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({ response: { status: 401, data: { message: 'another 401' } } })
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()

    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({ response: { status: 400 } })
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()

    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({})
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()
  })

  it('should handle non-session timout error responses without the session timeout alert', async () => {
    const component = shallow(<App {...props} />)
    const appInstance = component.instance()
    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({ response: { status: 401, data: { message: 'another 401' } } })
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()

    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({ response: { status: 400 } })
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()

    appInstance.displayAlertAndLogout = jest.fn()
    appInstance.handleError({})
    expect(component.instance().displayAlertAndLogout).not.toBeCalled()
  })

  it('should pass through correct props to the footer container', () => {
    const component = shallow(<App {...props} />)

    expect(
      component.find({ supportUrl: `${config.supportUrl}feedback-and-support` }).prop('prisonStaffHubUrl')
    ).toEqual(config.prisonStaffHubUrl)
  })
})
