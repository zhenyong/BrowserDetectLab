var fs = require('fs');
var path = require('path');
var assert = require("assert")


function loadBrowserData(brandName) {
	var str = path.join(__dirname, '../data', brandName + '.json');
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', brandName + '.json')));
}

/*
	数字.=>  (?:\d+.?)+
*/

/*
Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16


A) Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14
B) Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0) Opera 12.14
C) Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14
*/

/*


Mozilla 或 Opera
/xx.xx        // 斜杠可能用空格代替
==========================
左括号
	操作系统信息
右括号
==========================		 	|
Presto /  xx.xx 					|
或									|这部分可能没,如 #B
Gecko/xxxxxxx    //极少出现，如#A 		|
==========================			|
==========================			|
Version								|这部分可能没有，如#C
/12.0.742.100						|
==========================
Firefox/4.0 Opera 12.14		|这部分可能没有
*/

var testOperaReg = /((Opera|Mozilla)[\/\s](?:\d+.?)+)\s?\(.*(?:windows|x11|mac|linux|unix|sunos|s60|Nintendo|OpenSolaris|FreeBSD).*?\)(\s(Presto\/(?:\d+.?)+|Gecko\/\d+))?(\sVersion\/(\d+.?)+)?(\sFirefox\/(\d+.?)+)?(\sOpera\/(\d+.?)+)/i;

// var testOperaReg = /(?:Mozilla|Chrome)\/(?:\d+.?)+(?:\s+Slackware\/(?:\d+.?)+)?(?:\s+ArchLinux)?(?:\s+\(.*(?:windows|x11|mac|linux).+\)?)(?:\s+AppleWebKit\/(?:\d+.?)+|Gecko\/\d+)?(?:\s+\(?KHTML[,;]?\s*like Gecko;?\)?)?(?:\s+Slackware\/)?(?:Chrome|Version)\/(?:(?:\d+.?)+)?(?:\s+Chromium\/(?:[\d\w]+.?)+)?(?:\s+mobile\/(?:[\d\w]+.?)+)?(?:[\s;]+Safari\/(?:[\d\w]+.?)+)?$/i;


function everyUseragnet(brandName, fn) {
	var data = loadBrowserData(brandName);
	outter: for (var brandVersion in data) {
		for(var i = 0, ln = data[brandVersion].length; i < ln; i++){
			if(fn(brandVersion, data[brandVersion][i]) === false) {
				break outter;
			}
		}
	}
}

var errStrAgent;
var isError = false;
everyUseragnet('Opera', function(brandVersion, strAgent) {
	var match = strAgent.match(testOperaReg);
	if(!match) {
		errStrAgent = strAgent;
		isError = true;
		console.error(strAgent);
		return false;
	}
})