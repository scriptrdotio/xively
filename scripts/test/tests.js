/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
var xivelyClient = require("../xivelyclient");

var credentials = {
  "emailAddress": "XXXXX",  
  "password": "XXXXXX",  
  "accountId": "XXXXXX"
};

try {
  var data = {};
  var xively = new xivelyClient.Xively(credentials);
  data.getDevice = xively.getDevice("DEVICE_ID");
  data.listDevices=xively.listDevices("1");
  data.listUsers= xively.listUsers("1");
  data.getUser=xively.getUser("USER_ID");
  data.retrieveLatestTimeSeries=xively.retrieveLatestTimeSeries({"pageSize":5});
  data.retrieveTimeSeries=xively.retrieveTimeSeries({"startDateTime":"2015-05-23T19:30:03.287Z","endDateTime":"2016-05-10T19:30:03.287Z"});  
  return data;
}catch(exception) {
  return exception;
}
