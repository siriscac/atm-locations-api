Feature: A lonely developer can converse with this Geolocation API

Scenario: Get on Geolocation API call should send a good response
  When I GET /v1/geolocation
  Then response code should be 404

Scenario: Echo API call should send back hello in response
	 Given I set query parameter key to `API_KEY`
   Given I set body to {"carrier": "Vodaphone", "cellTowers": [{"age": 0,"cellId": 21532831,"locationAreaCode": 2862,"mobileCountryCode": 214,"mobileNetworkCode": 7,"signalStrength": 0,"timingAdvance": 0}],"homeMobileCountryCode": 310,"homeMobileNetworkCode": 410,"radioType": "WCDMA","wifiAccessPoints": [{"age": 0,"channel": 0,"macAddress": "","signalStrength": 0,"signalToNoiseRatio": 0}]}
   When I POST /v1/geolocation
   Then response code should be 200
