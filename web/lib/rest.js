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
 * 对象属性名排序
 *
 * @param
 * @return 新对象
 */
function sortByObjAttr(obj){
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
function toLowObjAttr(obj){
	var keys = _.keys(obj);
	var newObj = {};

	for(var i in keys){
		var key = sortBy[i];
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
function removeObjAttr(obj, key){
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
	var paramStr = sortByObjAttr(data).join('&');
	var signature = crypto.createHmac('sha1', seckey).update(paramStr.toLowerCase()).digest().toString('base64');
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
	return !0;
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
	var result = encodeURIComponent(key.toString('utf-8'));
	return result;
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