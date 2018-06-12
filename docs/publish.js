var request = require('request');
var fs = require('fs');
var DEV_ADMIN_AUTH = process.env.DEV_ADMIN_AUTH;

//request.debug = true;
var options = {
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


/**
devAdminRequest - Request to SmartDocs extend service
@param formData - Form data to Post
**/

function devAdminRequest(uri, formData) {
  var opts = options;
  opts.uri = uri;
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
  devAdminRequest('/', newModelformData)
    .then(function(){
      return devAdminRequest('/geolocation-ts/import', openapiformData);
    })
    .then(function(){
      return devAdminRequest('/geolocation-ts/render', {});
    })
    .catch(function(error){
      console.log(error);
    });
}

publish();
