var request = require('request');
var fs = require('fs');
var DEV_ADMIN_AUTH = process.env.DEV_ADMIN_AUTH;
var CRON_KEY = process.env.CRON_KEY;
var BASE_URL = process.env.BASE_URL;

request.debug = true;
var optionsDefault = {
  baseUrl: BASE_URL + '/smartdocs/apis/models',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Basic ' + DEV_ADMIN_AUTH
  }
};

var newModelformData = {
  name: "atmlocation-ts",
  display_name:"ATM Locations API (T)",
  description: "API to get ATM Location data"
};

var openapiformData = {
  api_definition: fs.createReadStream(__dirname + '/openapi.yaml'),
};

var cronDataOptions = {
  url: BASE_URL + '/cron.php?cron_key=' + CRON_KEY,
  method: 'GET'
}

var deleteModelOptions = {
  baseUrl: BASE_URL + '/smartdocs/apis/models',
  method: 'DELETE',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Basic ' + DEV_ADMIN_AUTH
  }
}
/**
devAdminRequest - Request to SmartDocs extend service
@param formData - Form data to Post
**/

function devAdminRequest(uri, formData, options) {
  var opts;

  if(options) {
    opts = options;
  } else {
    console.log('using default options')
    opts = optionsDefault;
  }

  if(uri) {
    opts.uri = uri;
  }

  if(formData) {
    opts.formData = formData;
  }

  return new Promise(function(resolve, reject){
    request(opts, function(error, response, body) {
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
  devAdminRequest('/atmlocation-ts', null, deleteModelOptions)
    .then(function(){
      return devAdminRequest('/', newModelformData, null);
    })
    .then(function(){
      return devAdminRequest('/atmlocation-ts/import', openapiformData, null);
    })
    .then(function(){
      return devAdminRequest('/atmlocation-ts/render', {}, null);
    })
    .then(function(){
      return devAdminRequest(null, null, cronDataOptions);
    })
    .catch(function(error){
      console.log(error);
    });
}

publish();
