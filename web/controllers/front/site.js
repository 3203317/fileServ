/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var formidable = require('formidable');

var conf = require('../../settings'),
	rest = require('../../lib/rest');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	qs = require('querystring'),
	velocity = require('velocityjs');

var biz = {
	user: require('../../biz/user')
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
		return res.redirect('/user/login?refererUrl='+ req.url);
	}

	var apiParams = {
		userid: query.userid,
		apikey: query.apikey,
		command: query.command,
		ts: query.ts,
		signature: query.signature
	};

	res.render('front/Upload', {
		conf: conf,
		title: '文件上传 | '+ conf.corp.name,
		description: '',
		keywords: ',fileServ,html5',
		data: {
			apiParams: apiParams
		}
	});
};

/**
 *
 * @param
 * @return
 */
exports.testUI = function(req, res, next){
	var apiParams = {
		userid: 'f39bf8f8f0d44ab98c2ff77240aad5e0',
		apikey: '123456789',
		command: 'upload',
		ts: (new Date()).valueOf()
	};
	// 生成票据
	apiParams.signature = rest.genSignature(apiParams, getSecKey());

	res.render('front/Test', {
		conf: conf,
		title: '上传测试',
		description: '',
		keywords: ',fileServ,html5',
		data: {
			apiParams: apiParams
		}
	});
};

/**
 * 签名验证
 *
 * @param
 * @return
 */
exports.signature_validate = function(req, res, next){
	var query = req.query;
	var apiParams = {
		userid: query.userid,
		apikey: query.apikey,
		command: query.command,
		ts: query.ts,
		signature: query.signature
	};
	biz.user.findByApiKey(apiParams.apikey, function(err, doc){
		if(err) return next(err);
		// 没有找到该用户
		if(!doc){
			if(req.xhr) return res.send({ success: false, msg: 'Not Found.' });
			return res.redirect('/user/login?refererUrl='+ req.url);
		}
		// 签名验证
		if(rest.validate(apiParams, doc.seckey)) return next();
		if(req.xhr) return res.send({ success: false, msg: '签名验证失败' });
		res.redirect('/user/login?refererUrl='+ req.url);
	});
};

(function(exports){
	/**
	 * api
	 *
	 * @param
	 * @return
	 */
	exports.api = function(req, res, next){
		var result = { success: false },
			query = req.query;
		// TODO
		switch(query.command){
			case 'upload':
				break;
			default:
				res.send(result);
				break;
		}
	};
})(exports);

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
		// TODO
		var _uploader = new formidable.IncomingForm();  // 创建上传表单
		_uploader.encoding = 'utf-8';  // 设置编辑
		_uploader.uploadDir = path.join(cwd, 'public', 'files');  // 设置上传目录
		_uploader.keepExtensions = !0;  // 保留后缀
		_uploader.maxFieldsSize = 2 * 1024 * 1024;  // 文件大小
		return _uploader;
	};
})(exports);

/**
 * 获取系统Key
 *
 * @param
 * @return
 */
function getSecKey(){
	return 'ABCDEFGHI';
}