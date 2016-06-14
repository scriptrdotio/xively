/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 // The URL of the default UAA authentiction service
var uaa = "https://id.xively.com/api/v1/auth/login-user";

// The URL of the session renew
var renewURL = "https://id.xively.com:443/api/v1/sessions/renew-session";

// The URL of get device
var getDeviceURL = "https://blueprint.xively.com:443/api/v1/devices/";

// The URL of get device
var getUserURL = "https://blueprint.xively.com:443/api/v1/end-users/";

// The URL of list devices
var listDevicesURL = "https://blueprint.xively.com:443/api/v1/devices";

// The URL of list users
var listUsersURL = "https://blueprint.xively.com:443/api/v1/end-users";

// The Base URL of Time series
var retrieveTimeSeriesBaseURL="https://timeseries.xively.com/api/v4/data/";
							   
// Latest time series URL
var retrieveLatestTimeSeriesURL = "xi/blue/v1/afcacc3f-d852-4485-a74f-1f857edeba42/d/de8689f6-ba3a-4a1b-bc31-0a643b0e7070/Default%20Channel%203/latest";

//Time series URL
var retrieveTimeSeriesURL = "xi/blue/v1/afcacc3f-d852-4485-a74f-1f857edeba42/d/de8689f6-ba3a-4a1b-bc31-0a643b0e7070/Default%20Channel%203";
							 
// The accountId of the xively application
var accountId = "";

// The password of the xively application
var password = "";

//The email address of the xively application
var emailAddress = "";			