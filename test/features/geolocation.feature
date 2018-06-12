Feature: A lonely developer can converse with this Geolocation API

Scenario: Get on Geolocation API call should send a good response
  When I GET /v1/geolocation
  Then response code should be 404
