const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const { elite2ApiFactory } = require('./api/elite2Api')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { oauthApiFactory } = require('./api/oauthApi')

const errorResponse = {
  response: {
    data: {
      status: 500,
      userMessage: 'Test error',
    },
  },
}

describe('Routes', () => {
  let client
  let oauthApi
  let elite2Api
  let keyworkerApi
  let app

  beforeEach(() => {
    client = {
      get: () => Promise.reject(errorResponse),
      post: () => Promise.reject(errorResponse),
      put: () => Promise.reject(errorResponse),
      del: () => Promise.reject(errorResponse),
    }

    oauthApi = oauthApiFactory(client, {})
    elite2Api = elite2ApiFactory(client, {})
    keyworkerApi = keyworkerApiFactory(client, {})

    app = express()
    app.use(bodyParser.json())
    app.use(routes({ oauthApi, elite2Api, keyworkerApi }))
  })

  const getRoutes = [
    'me',
    'usercaseloads',
    'setactivecaseload',
    'unallocated',
    'allocated',
    'keyworkerAllocations',
    'searchOffenders',
    'userLocations',
    'allocationHistory',
    'keyworker',
    'keyworkerSearch',
    'autoAllocateConfirmWithOverride',
    'keyworkerUpdate',
    'autoAllocateMigrate',
    'manualAllocateMigrate',
    'keyworkerSettings',
    'keyworker-profile-stats',
    'keyworker-prison-stats',
  ]

  getRoutes.map((route) =>
    it(`GET /api/${route} should go through error handler`, () =>
      request(app).get(`/api/${route}`).set('Accept', 'application/json').expect(500).expect('"Test error"'))
  )

  it('POST api/manualoverride should go through error handler', () =>
    request(app).post('/api/manualoverride').set('Accept', 'application/json').expect(500))
})
