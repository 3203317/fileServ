/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var formidable = require('formidable');

var conf = require('../../settings');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	qs = require('querystring'),
	velocity = require('velocityjs');

var biz = {
	// TODO
};

var exports = module.exports;

/**
 *
 * @param
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('front/Index', {
		conf: conf,
		title: conf.corp.name,
		description: '',
		keywords: ',fileServ,html5'
	});
};

/**
 * 上传页面
 *
 * @param
 * @return
 */
exports.uploadUI = function(req, res, next){
	var query = req.query;

	if('upload' !== query.command){
		return next(new Error('参数异常'));
	}

	res.render('front/Upload', {
		conf: conf,
		title: '文件上传 | '+ conf.corp.name,
		description: '',
		keywords: ',fileServ,html5',
		data: {
			userid: query.userid,
			apikey: query.apikey,
			command: query.command,
			ts: query.ts,
			signature: query.signature
		}
	});
};

/**
 *
 * @param
 * @return
 */
exports.testUI = function(req, res, next){
	res.render('front/Test', {
		conf: conf,
		title: '上传测试',
		description: '',
		keywords: ',fileServ,html5',
		data: {
			userid: 'f39bf8f8f0d44ab98c2ff77240aad5e0',
			apikey: '123456789',
			command: 'upload',
			ts: (new Date()).valueOf(),
			signature: '987654321'
		}
	});
};

(function (exports){

	/**
	 * 参数验证
	 *
	 * @param
	 * @return
	 */
	function validate(){
		// TODO
	}

	/**
	 * 处理上传
	 *
	 * @param
	 * @return
	 */
	function procUpload(req, res, next){
		var result = { success: false };
		result.success = true;
		res.send(result);
	}

	/**
	 *
	 * @param
	 * @return
	 */
	exports.api = function(req, res, next){
		var result = { success: false },
			query = req.query;

		switch(query.command){
			case 'upload':
				procUpload(req, res, next);
				break;
			default:
				res.send(result);
				break;
		}
	};
})(exports);

/**
 *
 * @param
 * @return
 */
exports.upload = function(req, res, next){
	var result = { success: false },
		data = req._data;

	exports.getUploader().parse(req, function (err, fields, files){
		if(err) return next(err);

		result.msg = '上传成功';
		result.data = data;
		res.send(result);
	});
};

(function(exports){
	var _uploader = null;
	/**
	 * 上传组件
	 *
	 * @param
	 * @return
	 */
	exports.getUploader = function(){
		if(!!_uploader) return _uploader;

		var _uploader = new formidable.IncomingForm();  // 创建上传表单
		_uploader.encoding = 'utf-8';  // 设置编辑
		_uploader.uploadDir = path.join(cwd, 'public', 'files');  // 设置上传目录
		_uploader.keepExtensions = !0;  // 保留后缀
		_uploader.maxFieldsSize = 2 * 1024 * 1024;  // 文件大小
		return _uploader;
	};
})(exports);