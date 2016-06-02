/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 /*************************************************************************************************
*
*  Base64 encode
*  http://www.webtoolkit.info/
*
***************************************************************************************************/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
   var output = "";
   var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
   var i = 0;

   input = Base64._utf8_encode(input);

   while (i < input.length) {

       chr1 = input.charCodeAt(i++);
       chr2 = input.charCodeAt(i++);
       chr3 = input.charCodeAt(i++);

       enc1 = chr1 >> 2;
       enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
       enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
       enc4 = chr3 & 63;

       if (isNaN(chr2)) {
           enc3 = enc4 = 64;
       } else if (isNaN(chr3)) {
           enc4 = 64;
       }

       output = output +
       this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
       this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

   }

   return output;
},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
   string = string.replace(/\r\n/g,"\n");
   var utftext = "";

   for (var n = 0; n < string.length; n++) {

       var c = string.charCodeAt(n);

       if (c < 128) {
           utftext += String.fromCharCode(c);
       }
       else if((c > 127) && (c < 2048)) {
           utftext += String.fromCharCode((c >> 6) | 192);
           utftext += String.fromCharCode((c & 63) | 128);
       }
       else {
           utftext += String.fromCharCode((c >> 12) | 224);
           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
           utftext += String.fromCharCode((c & 63) | 128);
       }

   }

   return utftext;
}
}

/*
* Turns dots in the username into "_dot_" to avoid problems when persisting the username as a property key
*/
function toStorableUserName(username) {
 return username.replace(/\./g, "_dot_");
};

/*
* Turns "_dot_" in the username into "."
*/
function fromStorableUserName(username) {
 return username.replace(/_dot_/g, ".");
};
/*
concat 2 objects
*/
function concatObjects (obj1 , obj2) {
   for (var key in obj1) {
    obj2[key] = obj1[key];
   }
   return obj2;
};

//e.g. 2013-10-30 10:00:37
function formatDate(date) {

 var useDate = date ? date :  new Date();
 var sDate = useDate.getFullYear() + "-" + _twoDigits(useDate.getMonth() + 1) + "-" + _twoDigits(useDate.getDate()) + " ";
 sDate+= _twoDigits(useDate.getHours()) + ":" + _twoDigits(useDate.getMinutes()) + ":" + _twoDigits(useDate.getSeconds());
 return sDate;
}

// e.g. 3 --> 03
function _twoDigits(value) {
 
 var svalue = "" + value;
 return svalue.length < 2 ? "0" +  svalue : svalue;
}			