/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var conf = require('../settings'),
	rest = require('../lib/rest');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	qs = require('querystring'),
	velocity = require('velocityjs');

var exports = module.exports;

(function (exports){
	function insert(req, res, cb){
		var result = { success: false };
		result.msg = 'insert';
		// TODO
		fs.mkdirSync(path.join(conf.upload.save, '6eb3e005b155437283fc4968840f59f1', util.format(null, 'YYMMddhhmmss')), 777);
		cb(null, result);
	}

	/**
	 *
	 * @param
	 * @return
	 */
	exports.api = function(req, res, next){
		var query = req.query;
		// TODO
		switch(query.command){
			case 'insert':
				insert(req, res, function (err, result){
					if(err) return next(err);
					res.send(result);
				});
				break;
			default:
				res.send({ success: false });
				break;
		}
	};
})(exports);