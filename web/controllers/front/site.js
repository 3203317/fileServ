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
	upload: require('../../biz/upload'),
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
	// TODO
	var user = req.flash('user')[0];

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
		title: '上传测试 | '+ conf.corp.name,
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
	var curTime = (new Date()).valueOf();
	if(!((curTime - conf.html.sign_ts) < query.ts && query.ts < (curTime + conf.html.sign_ts))){
		if(req.xhr) return res.send({ success: false, msg: '签名已失效' });
		return res.redirect('/user/login?refererUrl='+ req.url);
	}
	// TODO
	proxy.user.findByApiKey(query.apikey, function (err, doc){
		if(err) return next(err);
		// TODO
		if(!doc){
			if(req.xhr) return res.send({ success: false, msg: 'Not Found.' });
			return res.redirect('/user/login?refererUrl='+ req.url);
		}
		// TODO
		if(rest.validate(query, doc.SECKEY)){
			req.flash('user', doc);
			return next();
		}
		if(req.xhr) return res.send({ success: false, msg: '签名验证失败' });
		res.redirect('/user/login?refererUrl='+ req.url);
	});
};

(function (exports){
	/**
	 * 获取上传对象
	 *
	 * @param
	 * @return
	 */
	function getUploader(user){
		var uploader = new formidable.IncomingForm();  // 创建上传表单
		uploader.encoding = 'utf-8';  // 设置编辑
		uploader.uploadDir = path.join(cwd, 'public', 'files', '_tmp');  // 设置上传目录
		uploader.keepExtensions = !0;  // 保留后缀
		uploader.maxFieldsSize = 1024 * user.MAX_UPLOAD_SIZE;  // 文件大小
		return uploader;
	}

	/**
	 * 获取文件后缀
	 *
	 * @param
	 * @return
	 */
	function getFileSuffix(filename){
		var idx = filename.lastIndexOf('.');
		var suffix = filename.substring(idx, filename.length);
		return suffix.toLowerCase();
	}

	/**
	 * 上传组件
	 *
	 * @param
	 * @return
	 */
	function uploader(req, cb){
		var result = { success: false };
		// TODO
		var user = req.flash('user')[0];
		// 获取上传对象
		var uploader = getUploader(user);
		// 准备上传
		uploader.parse(req, function (err, fields, files){
			if(err) return cb(err);
			// TODO
			proxy.upload.saveNew({}, function (err, doc){
				if(err){
					// 删除已上传的文件
					// TODO
					return cb(err);
				}
				// 后缀
				var suffix = getFileSuffix(fields.Filename);
				// 文件名+后缀
				var filename = util.uuid() + suffix;
				// 目录
				var folder = util.format(new Date(), 'YYMMdd');
				// 检测目录是否存在
				fs.exists(path.join(cwd, 'public', 'files', user.id, folder), function (exists){
					if(!exists){
						var model = fs.mkdirSync(path.join(cwd, 'public', 'files', user.id, folder), 777);
						if(model) return cb(null, result);
					}
					// 重命名
					fs.rename(files.Filedata.path, path.join(cwd, 'public', 'files', user.id, folder, filename), function (err){
						if(err) return cb(err);
						// 返回值
						result.data = {
							name: '',
							url: 'http://127.0.0.1:3013/public/files/'+ user.id +'/'+ folder +'/'+ filename,
							type: suffix
						};
						result.success = true;
						cb(null, result);
					});
				});
			});
		});
	}

	/**
	 * 上传
	 *
	 * @param
	 * @return
	 */
	function upload(req, cb){
		uploader(req, function (err, result){
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
		switch(query.command){
			case 'upload':
				upload(req, function (err, result){
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

/**
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('front/Login', {
		conf: conf,
		title: '用户登陆 | '+ conf.corp.name,
		description: '',
		keywords: ',fileServ,html5',
		refererUrl: escape(req.url)
	});
};

/**
 * 获取系统Key
 *
 * @param
 * @return
 */
function getSecKey(){
	return 'ABCDEFGHI';
}