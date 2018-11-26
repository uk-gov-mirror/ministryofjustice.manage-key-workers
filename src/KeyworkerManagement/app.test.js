import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import mockHistory from '../test/mockHistory'

jest.mock('../Spinner/index', () => '')

const config = {
  maintainRolesEnabled: 'false',
  keyworkerProfileStatsEnabled: 'false',
  keyworkerDashboardStatsEnabled: false,
  notmEndpointUrl: '/notm/endpoint',
  mailTo: 'email@test.com',
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

describe('App component', () => {
  it('should handle session timeout error response and display alert', async () => {
    const component = shallow(
      <App
        switchCaseLoad={jest.fn()}
        config={config}
        user={user}
        history={mockHistory}
        setErrorDispatch={jest.fn()}
        userDetailsDispatch={jest.fn()}
        switchAgencyDispatch={jest.fn()}
        configDispatch={jest.fn()}
        setMessageDispatch={jest.fn()}
        boundSetMenuOpen={jest.fn()}
        setTermsVisibilityDispatch={jest.fn()}
        error=""
        page={0}
        shouldShowTerms={false}
        resetErrorDispatch={jest.fn()}
        keyworkerSettingsDispatch={jest.fn()}
        message=""
        allowAuto={false}
        migrated={false}
      />
    )
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
    const component = shallow(
      <App
        switchCaseLoad={jest.fn()}
        config={config}
        user={user}
        history={mockHistory}
        setErrorDispatch={jest.fn()}
        userDetailsDispatch={jest.fn()}
        switchAgencyDispatch={jest.fn()}
        configDispatch={jest.fn()}
        setMessageDispatch={jest.fn()}
        boundSetMenuOpen={jest.fn()}
        setTermsVisibilityDispatch={jest.fn()}
        error=""
        page={0}
        shouldShowTerms={false}
        resetErrorDispatch={jest.fn()}
        keyworkerSettingsDispatch={jest.fn()}
        message=""
        allowAuto={false}
        migrated={false}
      />
    )
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

  it('should close the menu when the content is clicked', () => {
    const setMenuOpen = jest.fn()

    const component = shallow(
      <App
        switchCaseLoad={jest.fn()}
        history={mockHistory}
        config={config}
        user={user}
        setErrorDispatch={jest.fn()}
        userDetailsDispatch={jest.fn()}
        switchAgencyDispatch={jest.fn()}
        configDispatch={jest.fn()}
        setMessageDispatch={jest.fn()}
        menuOpen
        boundSetMenuOpen={setMenuOpen}
        setTermsVisibilityDispatch={jest.fn()}
        error=""
        page={0}
        shouldShowTerms={false}
        resetErrorDispatch={jest.fn()}
        keyworkerSettingsDispatch={jest.fn()}
        message=""
        allowAuto={false}
        migrated={false}
      />
    )

    component.find('.inner-content').simulate('click')

    expect(setMenuOpen).toHaveBeenCalledWith(false)
  })
})
