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

//Mozilla/5.0 (X11; CrOS i686 4319.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36

//A) Mozilla/5.0 ArchLinux (X11; Linux x86_64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1
//B) Chrome/15.0.860.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/15.0.860.0
//C) Mozilla/5.0 Slackware/13.37 (X11; U; Linux x86_64; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/12.0.742.91
//D) Mozilla/5.0 (Windows; U; Windows NT 6.1; ru-RU; AppleWebKit/534.16; KHTML; like Gecko; Chrome/10.0.648.11;Safari/534.16)
//E) Mozilla/6.0 (Windows; U; Windows NT 6.0; en-US) Gecko/2009032609 Chrome/2.0.172.6 Safari/530.7
//F) Mozilla/5.0 (Windows; U; Windows NT 5.1; de-DE) Chrome/4.0.223.3 Safari/532.2
//G) Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.30 (KHTML, like Gecko) Slackware/Chrome/12.0.742.100 Safari/534.30
//H) Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.91 Chromium/12.0.742.91 Safari/534.30
//I) Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36 Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10
/*


Mozilla 或 Chrome  //极少会出现chrome 如 #B
/xx.xx        
==========================
Slackware/xx.xx //极少出现，如 #C 
 或 								
ArchLinux     //极少出现, 如 #A 
==========================
左括号
	操作系统信息
右括号		//这个括号可能在末尾 如 #D
==========================		    \
AppleWebKit /  xx.xx 				|
或									| 可能没有, 如 F
Gecko/xxxxxxx    //极少出现，如#E 		|
==========================		    /
(\(?KHTML[,;]?\s*like Gecko;?\)?)?
==========================
Slackware/			//极少出现, 如
Chrome或Version		//Version 极少可能， 如 #B
/12.0.742.100
==========================
Chromium/12.0.742.91	//极少出现，如 #H
或
Mobile/7B334b //极少出现，如I
==========================
可能用分号
Safari/534.30

*/

var testChromeReg = /(?:Mozilla|Chrome)\/(?:\d+.?)+(?:\s+Slackware\/(?:\d+.?)+)?(?:\s+ArchLinux)?(?:\s+\(.*(?:windows|x11|mac|linux).+\)?)(?:\s+AppleWebKit\/(?:\d+.?)+|Gecko\/\d+)?(?:\s+\(?KHTML[,;]?\s*like Gecko;?\)?)?(?:\s+Slackware\/)?(?:Chrome|Version)\/(?:(?:\d+.?)+)?(?:\s+Chromium\/(?:[\d\w]+.?)+)?(?:\s+mobile\/(?:[\d\w]+.?)+)?(?:[\s;]+Safari\/(?:[\d\w]+.?)+)?$/i;
var chromeReg = /(Chrome)\/((?:\d+.?)+)?/i;

//TODO 放到工具方法
//TODO 用上 mocha
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
everyUseragnet('Chrome', function(brandVersion, strAgent) {
	var match = strAgent.match(testChromeReg);
	if(!match) {
		errStrAgent = strAgent;
		isError = true;
		console.error(strAgent);
		return false;
	}
	console.log(match);
})


var testChromeReg_BAK = /(?:Mozilla|Chrome)\/(?:\d+.?)+\s+(?:Slackware\/(?:\d+.?)+\s+)?(?:ArchLinux\s+)?(\(.*(?:windows|x11|mac|linux).+\)?\s+)(?:AppleWebKit\/(?:\d+.?)+|Gecko\/\d+)?(\s+\(?KHTML[,;]?\s*like Gecko;?\)?)?(?:\s+Slackware\/)?(?:Chrome|Version)\/((?:\d+.?)+)?(\s+Chromium\/(?:[\d\w]+.?)+)?(\s+mobile\/(?:[\d\w]+.?)+)?([\s;]+Safari\/(?:[\d\w]+.?)+)?$/i;
