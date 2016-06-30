/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var http = require("http");
var util = require("./util.js");
var oauthconfig = require("./config.js");

/**
 * Obtains authentication tokens according to a given client id and password , and optionally according to given a email ,password and accountId of an account.
 * against a given UAA service
 * @class TokenManager
 * @constructor
 * @param {Object} [dto]
 * @param {String} [dto.uaa] : the URL of the UAA service to use for authentication
 * optional, if not provided, defaults to oauthconfig.uaa
 * @param {String} [dto.accountId] : the accountId of xively account
 * optional, if not provided, defaults to oauthconfig.accountId
 * @param {String} [dto.password] : the xively account password
 * optional, if not provided, defaults to oauthconfig.password
 * @param {String} [dto.emailAddress] : the emailAddress of xively account
 * optional, if not provided, defaults to oauthconfig.emailAddress
 */

function TokenManager(dto) {
 
  if (!storage.global.xively){
    storage.global.xively = {};
  }
  
  this.uaa = dto && dto.uaa ? dto.uaa : oauthconfig.uaa;
  this.password = dto && dto.password ? dto.password : oauthconfig.password;
  this.emailAddress = dto && dto.emailAddress ? dto.emailAddress : oauthconfig.emailAddress;
  this.accountId = dto && dto.accountId ? dto.accountId : oauthconfig.accountId;
  
  if(dto && dto.emailAddress && dto.password && dto.accountId){
    this.user = {"emailAddress" : dto.emailAddress, "password" :dto.password, "accountId":dto.accountId };
  }
  
}

/**
 * Obtain an oauth token for the current client Id and password at the specified uaa service
 * or for the given user if provided as a parameter or if provided when intanciating the TokenManager class
 * token is saved into the global storage (storage.global.xively[util.toStorableUserName(this.user.emailAddress)]
 *or storage.global.xively[clientId]  )
 * @method obtainToken
 * @return {String) returns the accessToken
 * @throws Exception
 */
TokenManager.prototype.getToken = function() {
  if(this.user){
    if(storage.global.xively[util.toStorableUserName(this.user.emailAddress)]){
      return storage.global.xively[util.toStorableUserName(this.user.emailAddress)];
    }
  }else{
    if(storage.global.xively[this.accountId]){
     	return storage.global.xively[this.accountId];
    }
  }
  
  var requestParams = {
    url: oauthconfig.uaa,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },    
    bodyString: '{"emailAddress": "' + this.emailAddress + '", "password": "' + this.password + '", "accountId": "' + this.accountId + '"}' 
  };
  
  var response = http.request(requestParams); //return response;
  
  return this._parseTokenResponse(response);
};

/**
 * @method refreshToken
 */
TokenManager.prototype.refreshToken = function() {
	storage.global.xively="";
  var requestParams = {
      url: oauthconfig.renewURI,
      method: "POST",
      headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + storage.global.xively[util.toStorableUserName(this.user.emailAddress)]
      }
  };
  
  var response = http.request(requestParams); //return response;
  
  return this._parseTokenResponse(response);
 
};

/**
 * Parse the authentication response and set the token in the global storage
 * @method _parseTokenResponse
 * @param {object} response
 * @return {String} {accessToken}
 * @throws Exception
 */
TokenManager.prototype._parseTokenResponse = function(response) {
   if (Number(response.status) < 200 || Number(response.status) >= 400) {
    throw {
      errorCode: "Authentication_Failure",
      errorDetail: "TokenManager.otbainToken - Authentication failed with the following message " +  response.body
    };
  }
  var bodyMsg = JSON.parse(response.body);
  if(!storage.global.xively){
    storage.global.xively;
  }
  if (this.user) {    
    storage.global.xively[util.toStorableUserName(this.user.emailAddress)] = bodyMsg['jwt'];
  }
  
  return bodyMsg['jwt'];
};

TokenManager.prototype.getUserParams = function(user) {
   return {
    emailAddress: user.emailAddress,
    password: user.password
  }; 
};

TokenManager.prototype.getaccountParams = function() {
  return {
    account_id: this.accountId
  };
};			