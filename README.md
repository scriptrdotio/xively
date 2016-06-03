# Xively connector

## About Xively

Xively (formerly known as Cosm and Pachube) is a division of LogMeIn Inc (LOGM), a global, public company that is a leading provider of essential remote services. Organizations worldwide rely on LogMeIn's suite of SaaS customer care, remote IT management, access and collaboration products. Xively is built on LogMeIn's cloud platform Gravity, which handles over 255 million devices, users and customers across 7 datacenters worldwide.

Xively by LogMeIn offers an award-winning enterprise IoT platform and application solution for enterprises building connected products and services. Xively enables companies to securely and robustly connect their products, manage data from those connections, and engage more closely with their customers. The solution gives physical products a voice in the relationships that they facilitate between a company and all of its constituents (customers, partners, vendors, installers, etc.) in order to better develop, market, sell and support the next generation of connected products.

## Purpose of the scriptr.io connector for Xively

This connector simplifies and streamlines the way you access Xively's APIs from scriptr.io, by providing a few native objects that you can seamlessly integrate into your own scripts.

## Components

*   xively/xivelyclient: this is the main object to interact with. It allows you to list end-users, devices and timeseries
*   xively/httplient: a generic http client that handles requests and responses for Xively's APIs
*   xively/oauth2/config: the configuration file used mainly to specify your topics and credentials
*   xively/samples/test: wraps all available functions in one test

### Deployment

- Deploy the scripts in your scriptr account, in a folder named "xively" or import that module using the import feature
- Set you Xively accountId, password, and email address credentials in "xively/Oauth2/config" script.
- Create a test script in scriptr, or use the script provided in "xively/samples/test".

### Use the connector

In order to use the connector, you need to import the main module: ```xively/xivelyclient```, as described below:
```
var Xivelyclient = require("/modules/xively/xivelyclient");
```
You then need to create an instance of the Xivelyclient class, using one of the following options:
```
// option 1: you provide your app's emailAddress, accountId and password of the xively API
var credentials = {
  "emailAddress": "XXXXX",  
  "password": "XXXXXX",  
  "accountId": "XXXXXX"
};
var xively = new xivelyClient.Xively(credentials);

// option 2: you have specified your app's emailAddress, accountId and password of the xively API in the config file
 
var xively = new xivelyClient.Xively({});
``` 

The XivelyClient class provides many methods to obtain data related to the end users, devices and timeseries.

In order to get a specific device based in it's id you can use :
```
data.getDevice = xively.getDevice("DEVICE_ID");
```
In order to list all devices you can use :
```
data.listDevices=xively.listDevices("1");
```
In order to list all end users you can use :
```
data.listUsers= xively.listUsers("1");
```
In order to get a specific end user based on it's id you can use:
```
data.getUser=xively.getUser("USER_ID");
```
In order to retreive latest time series you can use this function with pagesize parameter:
``` 
//retrieve time series
var latestTimeSeries =xively.retrieveLatestTimeSeries({"pageSize":5});
```
If you need to get time series with datetime interval you can use:
```
//retrieve time series
var timeSeriesByDate =xively.retrieveTimeSeries({"startDateTime":"2015-05-23T19:30:03.287Z","endDateTime":"2016-05-10T19:30:03.287Z"}
``` 

*Check the list of all available methods in the ```xively/samples/test``` script.*
