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

var proxy = {
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

	var user = req.flash('user')[0];
	if(!user) return res.redirect('/user/login?refererUrl='+ req.url);

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
			user: user,
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
		userid: '6eb3e005b155437283fc4968840f59f1',
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
	// TODO
	proxy.user.findByApiKey(query.apikey, function (err, doc){
		if(err) return next(err);
		req.flash('user', doc);
		next();
	});
};

(function (exports){
	/**
	 * 上传组件
	 *
	 * @param
	 * @return
	 */
	function uploader(req, user, cb){
		var result = { success: false };
		result.success = true;
		result.data = {
			name: '',
			url: 'http://127.0.0.1:3013/public/files/201503/1/201508/img2.jpg',
			type: '.jpg'
		};
		cb(null, result);
	}

	/**
	 * 上传
	 *
	 * @param
	 * @return
	 */
	function upload(req, user, cb){
		uploader(req, user, function (err, result){
			if(err) return cb(err);
			cb(null, result);
		});
	}

	/**
	 * api
	 *
	 * @param
	 * @return
	 */
	exports.api = function(req, res, next){
		var query = req.query;
		// TODO
		var curTime = (new Date()).valueOf();
		if(!((curTime - conf.html.sign_ts) < query.ts && query.ts < (curTime + conf.html.sign_ts))){
			return res.send({ success: false, msg: '签名已失效' });
		}
		// TODO
		var user = req.flash('user')[0];
		if(!user) return res.send({ success: false, msg: 'Not Found.' });
		// TODO
		var apiParams = {
			userid: query.userid,
			apikey: query.apikey,
			command: query.command,
			ts: query.ts,
			signature: query.signature
		};
		if(!rest.validate(apiParams, user.SECKEY)){
			return res.send({ success: false, msg: '签名验证失败' });
		}
		// TODO
		switch(query.command){
			case 'upload':
				upload(req, user, function (err, result){
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

(function (exports){
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