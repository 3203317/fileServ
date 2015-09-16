/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	cwd = process.cwd();

var crypto = require('crypto');

var util = require('speedt-utils');

var exports = module.exports;

(function (exports){
	// TODO
})(exports);

/**
 * 生成签名
 *
 * @param
 * @return
 */
exports.genSignature = function(data, seckey){
	// seckey = 'KFD85H9SmyZd8FSopX_CxxG5VgLFW71LiYc35PxZWXABX9BsANvPUQpLBCrPz25JpSy2_bt2Z0gWRCA6ePsKww';
	// data = 'apiKey=J4_EFO3ZlBZynJC7dACIFiivoCniAvJlLr-H_dIex-eAdyz1ykGgMtrvcJ7PBCrPKsJRuPaiRKdDuL5LTL_Jag&command=listAccounts&listAll=true&response=json';
	var signature = crypto.createHmac('sha1', seckey).update(data.toLowerCase()).digest().toString('base64');
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