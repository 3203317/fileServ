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
		id: '6eb3e005b155437283fc4968840f59f1',
		MAX_UPLOAD_SIZE: 20,  // KB
		APIKEY: 'fBgUxl32qsRGeB6uWION9pHFMUMA8TF8Vffz5E56gGg%3D',
		SECKEY: 'YBiOXsQ0qBUe8m99zjP8tZweqAWi2TXcLVWN289uFFU%3D'
	};
	cb(null, doc);
};