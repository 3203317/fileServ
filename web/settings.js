/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports = {
	cookie: {
		secret: 'foreworld-fileServ'
	}, corp: {
		name: '文件服务器',
		website: 'http://www.foreworld.net/'
	}, mysql: {
		database: 'fileServ',
		host: '127.0.0.1',
		port: 22306,
		user: 'root',
		password: 'password',
		connectionLimit: 50
	}, html: {
		// cdn: 'http://127.0.0.1:24080/js/',
		cdn: 'http://www.foreworld.net/js/',
		static_res: '/public/',
		external_res: 'http://www.foreworld.net/public/',
		pagesize: 10,
		sign_ts: 1000 * 15,
		cache_time: 1000 * 3
	}, mail: {
		secureConnection: true,
		host: 'smtp.163.com',
		port: 465,
		to: ['huangxin@foreworld.net'],
		auth: {
			user: 'firefrog@163.com',
			pass: ''
		}
	}
};