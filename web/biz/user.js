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
		APIKEY: 'EpjQPzyG1WKcK0tn4UukJXj2qHdxkgE%2BQLikKNAw%2FU8%3D',
		SECKEY: 'cCIziQoHa8R4V9mLBIOjgi1MxB7DY9e1p8Cwd46cuMs%3D'
	};
	cb(null, doc);
};