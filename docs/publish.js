var request = require('request');
var fs = require('fs');
var DEV_ADMIN_AUTH = process.env.DEV_ADMIN_AUTH;
var CRON_KEY = process.env.CRON_KEY;

//request.debug = true;
var optionsOrig = {
  baseUrl: 'http://dev-rblbank.devportal.apigee.io/smartdocs/apis/models',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Basic ' + DEV_ADMIN_AUTH
  }
};

var newModelformData = {
  name: "geolocation-ts",
  display_name:"Geo Location API (T)",
  description: "API to Get Location data from Google"
};

var openapiformData = {
  api_definition: fs.createReadStream(__dirname + '/openapi.yaml'),
};

var cronDataOptions = {
  url: 'http://dev-rblbank.devportal.apigee.io/cron.php?cron_key=' + CRON_KEY,
  method: 'GET'
}

/**
devAdminRequest - Request to SmartDocs extend service
@param formData - Form data to Post
**/

function devAdminRequest(uri, formData, options) {
  var opts;

  if(options)
    opts = options;
  else
    opts = optionsOrig;

  if(uri)
    opts.uri = uri;
  else
    opts.uri = '';

  if(formData)
    opts.formData = formData;

  return new Promise(function(resolve, reject){
    request(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        console.log(body);
        resolve();
      }
    });
  });
}

function publish() {
  devAdminRequest('/', newModelformData, null)
    .then(function(){
      return devAdminRequest('/geolocation-ts/import', openapiformData, null);
    })
    .then(function(){
      return devAdminRequest('/geolocation-ts/render', null, null);
    })
    .then(function(){
      return devAdminRequest(null, null, cronDataOptions);
    })
    .catch(function(error){
      console.log(error);
    });
}

publish();
