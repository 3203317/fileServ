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
		APIKEY: 'QyRzk8sm7AkiJIYmBaaoJpZ3NMGwNEhipQQ4ubKtSOk=',
		SECKEY: 'qGdOYeX/ECVCJlVLi0+hLJjKInrtyGThlmzt22P013Y=',
		UPLOADS: {
			'.jpg': 1024 * 100,  // B 字节
			'.png': 1024 * 101
		}
	};
	cb(null, doc);
};