require('dotenv').config();

// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights');
const path = require('path');
const express = require('express');
const app = express();
const login = require('./controllers/login');
const userCaseLoads = require('./controllers/usercaseloads');
const setActiveCaseLoad = require('./controllers/setactivecaseload');
const unallocated = require('./controllers/unallocated');
const userLocations = require('./controllers/userLocations');
const searchOffenders = require('./controllers/searchOffenders');
const allocated = require('./controllers/allocated');
const manualoverride = require('./controllers/manualoverride');
const keyworkerSearch = require('./controllers/keyworkerSearch');
const keyworkerAllocations = require('./controllers/keyworkerAllocations');
const keyworkerProfile = require('./controllers/keyworkerProfile');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bunyanMiddleware = require('bunyan-middleware');
const log = require('./log');
const fs = require('fs');

function getAppInfo () {
  const packageData = JSON.parse(fs.readFileSync('./package.json'));
  const buildVersion = fs.existsSync('./build-info.json') ? JSON.parse(fs.readFileSync('./build-info.json')).buildNumber : packageData.version;

  return {
    name: packageData.name,
    version: buildVersion,
    description: packageData.description
  };
}

app.use(bunyanMiddleware({
  logger: log,
  obscureHeaders: ['Authorization']
}));

app.use('/login', jsonParser, login);
app.use('/usercaseloads', jsonParser, userCaseLoads);
app.use('/setactivecaseload', jsonParser, setActiveCaseLoad);
app.use('/unallocated', jsonParser, unallocated.router);
app.use('/allocated', jsonParser, allocated.router);
app.use('/userLocations', jsonParser, userLocations);
app.use('/searchOffenders', jsonParser, searchOffenders.router);
app.use('/manualoverride', jsonParser, manualoverride);
app.use('/keyworkerSearch', jsonParser, keyworkerSearch);
app.use('/keyworker', jsonParser, keyworkerProfile.router);
app.use('/keyworkerAllocations', jsonParser, keyworkerAllocations.router);

app.use('/health', require('express-healthcheck')());

app.use('/info', (req, res) => {
  res.json(getAppInfo());
});

app.use('/', express.static(path.join(__dirname, '../build')));

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Backend running on port %s', port);
});
