/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var md5 = require('speedt-utils').md5;

/**
 * 查找用户
 *
 * @params
 * @return
 */
exports.findByApiKey = function(apikey, cb){
	var doc = {
		id: 'f39bf8f8f0d44ab98c2ff77240aad5e0',
		apikey: '123456789',
		seckey: 'ABCDEFGHI'
	};
	cb(null, doc);
};