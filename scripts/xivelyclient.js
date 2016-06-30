/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var httpclient = require("./httpclient.js");
var config = require("./oauth2/config.js");
var util = require("./oauth2/util.js");
var tokenmanager = require("./oauth2/tokenmanager.js");
var pubsub = require("pubsub");

/**
 * A mix of all the other scripts into one class to make the code more reusable
 * @class Xively
 * @constructor
 * @param {Object} [dto] // credentials
 * @param {String} [dto.emailAddress]
 * @param {String} [dto.password] 
 * @param {String} [dto.accountId]
 * @throws Error
 */
function Xively(dto) {
  var params = null;
  if (dto && dto.emailAddress && dto.password && dto.accountId) {
   params = {
            "emailAddress" : dto.emailAddress,
            "password":dto.password,
            "accountId":dto.accountId
    }
  }
  
  this.tokenManager = new tokenmanager.TokenManager(params);
  this.httpClient = new httpclient.HttpClient({tokenMgr:this.tokenManager});
  this.accountId= this.tokenManager.getaccountParams().account_id;
}

/**
 * Retrieves a specific device based on its id /
 * A device is the digital representation of a physical internet-connected device.
 * Devices are generally created in Blueprint when they are created in reality.
 * (c.f. http://developer.xively.com/api/blueprint/devices/)
 * @method getDevice
 * @param {Numeric} deviceId: the device id .
 * @return  {Object} device
 * @throws Error
 */
Xively.prototype.getDevice = function(deviceId) {
	 
    if (!deviceId) {
     throw {

        errorCode: "Invalid_Parameter",
        errorDetail: "Xively.getDevice: deviceId cannot be null or empty"
      };
    } 
  
    var url = config.getDeviceURL+deviceId;
	var query = {
		url: url,
		method: "GET"
	};
  return this.httpClient.callApi(query);
};
/**
 * Retrieves all the devices related to a specified account /
 * A device is the digital representation of a physical internet-connected device. Devices are generally created in Blueprint when they are created in reality.
 * (c.f. http://developer.xively.com/api/blueprint/devices/)
 * @method listDevices
 * @param {Numeric} page: the number of the page to return. Optional, defaults to 1
 * @param {object} params Optional: 
 *@param {String} authorization : Authorization header
	*@param {String} accountId : account identifier
	*@param {String} deviceTemplateId : deviceTemplate identifier
	*@param {String} organizationId 	: organization identifier 
	*@param {String} serialNumber : Serial number of the device. (Partial filter matches allowed)
	*@param {String} provisioningState : The current state of the device in the provisioning flow
	*@param {String} firmwareVersion : Device Firmware Version. (Partial filter matches allowed) 
	*@param {number} latitude : Device Latitude
	*@param {number} longitude : Device Longitude
	*@param {boolean} connected : Device Connection Status
	*@param {date} lastConnected : When the device was last connected
	*@param {String} externalIp : Device External IP Address
	*@param {number} geoIpLatitude : Device Latitude Based On GeoIp
	*@param {number} geoIpLongitude : Device Longitude Based On GeoIp
	*@param {String} reverseDns : Device Hostname Based On ReverseDNS
	*@param {boolean} meta : Include meta information in response
	*@param {boolean} results : Include results in response
	*@param {integer} pageSize : Number of items per page
	*@param {string} sortBy : Sort by field
	*@param {string} sortOrder : Sort direction
	*@param {string} expand : Expand parent references (account, device-template, organization)
 * @return  {Object} devices
 * @throws Error
 */
Xively.prototype.listDevices = function(page, params) {
	var url = config.listDevicesURL;
    if(!params){
         params={};
       }
	var parameters = {
			accountId: this.accountId,
			page: page ? "" + page : "1",
	};
  params=util.concatObjects(parameters,params);
	var query = {
		url: url,
		method: "GET",
		params: params
	};
    return this.httpClient.callApi(query);
};
/**
 * Retrieves all the End Users under a specified account /
 * An end-user is a customer of your company.End users have permission to take ownership of devices and to organize those devices. 
 * They can only make requests to the endpoints: end-users, organizations, and devices. They cannot modify anything else in the account.
 * (c.f. http://developer.xively.com/api/blueprint/users/endusers/)
 * @method listUsers
* @param {object} params Optional: 
 *@param {String} authorization : Authorization header
	*@param {String} userId : Idm user identifier
	*@param {String} endUserTemplateId : endUserTemplate identifier
	*@param {String} organizationId 	: organization identifier 
	*@param {boolean} meta : Include meta information in response
	*@param {boolean} results : Include results in response
	*@param {integer} pageSize : Number of items per page
	*@param {string} sortBy : Sort by field
	*@param {string} sortOrder : Sort direction
	*@param {string} expand : Expand parent references (account, device-template, organization)
 * @return  {Object} users
 * @throws Error
 */
Xively.prototype.listUsers = function(page, params) {
  	var topic = config.listUsersURL;
    if(!params){
         params={};
       }
	var parameters = {
			accountId: this.accountId,
			page: page ? "" + page : "1",
	};
    params=util.concatObjects(parameters,params);
	var query = {
		url: topic,
		method: "GET",
		params: params
	};
    return this.httpClient.callApi(query);
};

/**
 * Retrieves a specific end-user based on it's id /
 * An end-user is a customer of your company.End users have permission to take ownership of devices and to organize those devices. 
 * They can only make requests to the endpoints: end-users, organizations, and devices. They cannot modify anything else in the account.
 * (c.f. http://developer.xively.com/api/blueprint/users/endusers/)
 * @method getUser
 * @param {Numeric} userId: the user id .
 * @return  {Object} user
 * @throws Error
 */
Xively.prototype.getUser = function(userId) {
	 if (!userId) {
     throw {

        errorCode: "Invalid_Parameter",
        errorDetail: "Xively.getUser: userId cannot be null or empty"
      };
    } 
    var topic = config.getUserURL+userId;
	var query = {
		url: topic,
		method: "GET"
	};
  return this.httpClient.callApi(query);

};

/**
 * Publish some data on Xively's timeseries stream
 * @method publish
 * @param {Object} [dto]
 * @param {String} name: the name of the value to publish (key)
 * @param {String} value: the value to publish
 * @return {Object}
 * @throws Error
 */
Xively.prototype.publish = function(dto) {
  
  if (!dto || !dto.name || !dto.value) {
  
    throw {
      errorCode: "Invalid_Parameter",
      errorDetail: "Xively.publish: dto, dto.name and dto.value cannot be null or empty"
    };
  }
  var message = {
    "e":[{"n": dto.name,
         "v": dto.value}]
  }
  
  return pubsub.publish("mqttbridge", JSON.stringify(message));
};

/**
 * List timeseries by date (c.f. http://developer.xively.com/api/timeseries/timeseries-retrieve/)
 * @method retrieveTimeSeries
 * @param {Object} [dto]
   * @param {String} startDateTime : date in ISO string format, start reading time series from this date 
   * (e.g. "2015-05-23T19:30:03.287Z")
   * @param {String} topic : Topic name (xi/blue/v1/{accountId}/{ownerType}/ {ownerId}/{channelTemplate})
   * @param {String} endDateTime : date in ISO string format, start reading time series from this date
   * (e.g. "2016-05-9T19:30:03.287Z")
 * @return  {Object} time series
 * @throws Error
 */
Xively.prototype.retrieveTimeSeries = function(dto) {
  
  if (!dto || !dto.startDateTime || !dto.endDateTime) {
  
    throw {
      errorCode: "Invalid_Parameter",
      errorDetail: "Xively.retrieveTimeSeries:dto, dto.startDateTime, and dto.endDateTime cannot be null or empty"
    };
  }
  var topic = dto.topic ? dto.topic : config.retrieveTimeSeriesURL;
  
  var parameters = {
      startDateTime: dto.startDateTime,
      endDateTime: dto.endDateTime
  };
  
  var request = {
  	url: topic,
  	method: "GET",
 	params: parameters
  };
  
  return this._retrieveTimeSeries(request);
};

/**
 * Retrieves the latest timeseries page (with pageSize elements in the page)
 * (c.f. http://developer.xively.com/api/timeseries/timeseries-retrieve/)
 * @method retrieveLatestTimeSeries
 * @param {Object} [dto]
   * @param {Numeric} pageSize: the number of elements to return. Optional, defaults to 5
   * @param {String} topic : Topic name (xi/blue/v1/{accountId}/{ownerType}/ {ownerId}/{channelTemplate})
 * @return  {Object} time series
 * @throws Error
 */
Xively.prototype.retrieveLatestTimeSeries = function(dto) {
  
  var topic = dto && dto.topic ? dto.topic : config.retrieveLatestTimeSeriesURL;
 
  var parameters = {
    pageSize: dto.pageSize ? "" + dto.pageSize : "5"
  };

  var request = {
    url: topic,
    method: "GET",
    params: parameters
  };
	
  return this._retrieveTimeSeries(request);
};

/*
 * Factorization of timeseries API invocation
 */
Xively.prototype._retrieveTimeSeries = function(query) {
  
  var url = config.retrieveTimeSeriesBaseURL;
  query.url = url + query.url;
  return this.httpClient.callApi(query);
};			