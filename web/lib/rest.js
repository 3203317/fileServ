/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	cwd = process.cwd();

var crypto = require('crypto');
var _ = require('underscore');

var util = require('speedt-utils');

var exports = module.exports;

(function (exports){
	// TODO
})(exports);

/**
 * 对象属性名转小写
 *
 * @param
 * @return 新对象
 */
function toReqParamByObj(obj){
	var keys = _.keys(obj);
	var arr = [];

	for(var i in keys){
		var key = keys[i];
		arr.push(key +'='+ obj[key]);
	}
	return arr;
}

/**
 * 对象属性名排序
 *
 * @param
 * @return 新对象
 */
function sortByObjKey(obj){
	var keys = _.keys(obj);
	var sortBy = _.sortBy(keys, function (key){ return key; });
	var newObj = {};

	for(var i in sortBy){
		var key = sortBy[i];
		newObj[key] = obj[key];
	}
	return newObj;
}

/**
 * 对象属性名转小写
 *
 * @param
 * @return 新对象
 */
function toLowObjKey(obj){
	var keys = _.keys(obj);
	var newObj = {};

	for(var i in keys){
		var key = keys[i];
		newObj[key.toLowerCase()] = obj[key];
	}
	return newObj;
}

/**
 * 移除对象属性
 *
 * @param
 * @return 新对象
 */
function removeObjKey(obj, key){
	if(obj.hasOwnProperty(key)) delete obj[key];
}

/**
 * 生成签名
 *
 * @param
 * @return
 */
exports.genSignature = function(data, seckey){
	// seckey = 'KFD85H9SmyZd8FSopX_CxxG5VgLFW71LiYc35PxZWXABX9BsANvPUQpLBCrPz25JpSy2_bt2Z0gWRCA6ePsKww';
	// data = 'apiKey=J4_EFO3ZlBZynJC7dACIFiivoCniAvJlLr-H_dIex-eAdyz1ykGgMtrvcJ7PBCrPKsJRuPaiRKdDuL5LTL_Jag&command=listAccounts&listAll=true&response=json';
	// TODO
	var newObj = toLowObjKey(data);
	removeObjKey(newObj, 'signature');
	newObj = sortByObjKey(newObj);
	var arr = toReqParamByObj(newObj);
	// TODO
	var paramStr = (arr.join('&')).toLowerCase();
	var signature = crypto.createHmac('sha1', seckey).update(paramStr).digest().toString('base64');
	return encodeURIComponent(signature);
};

/**
 * 验证签名
 *
 * @param
 * @return
 */
exports.validate = function(data, seckey){
	// TODO
	var signature1 = data.signature;
	var signature2 = this.genSignature(data, seckey);
	return signature1 === signature2;
};

/**
 * 生成ApiKey
 *
 * @param
 * @return
 */
var genApiKey = exports.genApiKey = function(){
	var diffiehellman = crypto.createDiffieHellman(256);
	var key = diffiehellman.generateKeys('base64');
	var result = key.toString('utf-8');
	return encodeURIComponent(result);
};

/**
 * 生成秘钥
 *
 * @param
 * @return
 */
exports.genSecKey = function(){
	return genApiKey();
};