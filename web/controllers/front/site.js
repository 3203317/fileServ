/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var formidable = require('formidable');

var qiniu = require('qiniu');

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
		return res.redirect('/user/login?refererUrl='+ escape(req.url));
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
	// TODO
	for(var i in apiParams){
		apiParams[i] = encodeURIComponent(apiParams[i]);
	}

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
	// TODO
	proxy.user.findByApiKey('apikey', function (err, doc){
		if(err) return next(err);
		// TODO
		var apiParams = {
			userid: '4fc93b468ac94c9f8d2be56b80af8e96',
			apikey: doc.APIKEY,
			command: 'upload',
			ts: (new Date()).valueOf()
		};
		// 生成票据
		apiParams.signature = rest.genSignature(apiParams, doc.SECKEY);
		// TODO
		for(var i in apiParams){
			apiParams[i] = encodeURIComponent(apiParams[i]);
		}
		// render
		res.render('front/Test', {
			conf: conf,
			title: '上传测试 | '+ conf.corp.name,
			description: '',
			keywords: ',fileServ,html5',
			data: {
				apiParams: apiParams
			}
		});
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
	if(!((curTime - conf.upload.sign_ts) < query.ts && query.ts < (curTime + conf.upload.sign_ts))){
		if(req.xhr) return res.send({ success: false, msg: '签名已失效' });
		return res.redirect('/user/login?refererUrl='+ escape(req.url));
	}
	// TODO
	proxy.user.findByApiKey(query.apikey, function (err, doc){
		if(err) return next(err);
		// TODO
		if(!doc){
			if(req.xhr) return res.send({ success: false, msg: 'Not Found.' });
			return res.redirect('/user/login?refererUrl='+ escape(req.url));
		}
		// TODO
		if(rest.validate(query, doc.SECKEY)){
			req.flash('user', doc);
			return next();
		}
		if(req.xhr) return res.send({ success: false, msg: '签名验证失败' });
		res.redirect('/user/login?refererUrl='+ escape(req.url));
	});
};

(function (exports){
	/**
	 * 原型
	 *
	 * @param
	 * @return
	 */
	formidable.IncomingForm.prototype.write = function(buffer){
		if (this.error) {
			return;
		}
		if (!this._parser) {
			this._error(new Error('uninitialized parser'));
			return;
		}

		// TODO
		var rems = [];
		for(var i = 0, j = buffer.length; i < j; i++){
			var r = buffer[i];
			var n = buffer[i+1];
			if(13 === r && 10 === n) rems.push(i);
		}

		var content_type = buffer.slice(rems[5], rems[6]);
		if('Content-Type: application/octet-stream' !== content_type.toString().trim()){
			// File type error
			this._error(new Error('FILE_TYPE_ERR'));
			return;
		}

		var content_dis = buffer.slice(rems[3] + 46, rems[5]);
		var filename = content_dis.toString().match(/filename=".*"/g)[0].split('"')[1];
		// 该文件类型允许的最大上传文件大小
		var maxSize = this.allowFileType[getFileSuffix(filename)];

		if(!maxSize){
			// File type deny
			this._error(new Error('FILE_TYPE_DENY'));
			return;
		}

		this.bytesReceived += buffer.length;
		// TODO
		if(maxSize < this.bytesReceived){
			// File size exceeds the maximum file size limit allowed
			this._error(new Error('FILE_SIZE_OUT'));
			return;
		}
		this.emit('progress', this.bytesReceived, this.bytesExpected);

		var bytesParsed = this._parser.write(buffer);
		if (bytesParsed !== buffer.length) {
			this._error(new Error('parser error, '+bytesParsed+' of '+buffer.length+' bytes parsed'));
		}

		return bytesParsed;
	};

	/**
	 * 原型
	 *
	 * @param
	 * @return
	 */
	formidable.IncomingForm.prototype._uploadPath = function(filename){
		var name = util.uuid();

		if (this.keepExtensions) {
		var ext = path.extname(filename);
			ext = ext.replace(/(\.[a-z0-9]+).*/i, '$1');
			name += ext;
		}

		return path.join(this.uploadDir, name);
	};

	/**
	 * 获取文件后缀
	 *
	 * @param
	 * @return
	 */
	function getFileSuffix(fileName){
		var idx = fileName.lastIndexOf('.');
		if(-1 === idx) return '';
		var suffix = fileName.substring(idx, fileName.length);
		return suffix.toLowerCase();
	}

	/**
	 * 上传组件
	 *
	 * @param
	 * @return
	 */
	function uploader(req, res, cb){
		var result = { success: false };
		// TODO
		var user = req.flash('user')[0];
		// TODO
		var folderName = util.format(new Date(), 'YYMMdd');
		// 创建年月日目录
		fs.exists(path.join(conf.upload.save, user.id, folderName), function (exists){
			if(!exists){
				var model = fs.mkdirSync(path.join(conf.upload.save, user.id, folderName), 777);
				if(model) return cb(new Error(model));
			}

			// 获取上传对象
			var uploader = new formidable.IncomingForm();  // 创建上传表单
			uploader.encoding = 'utf-8';  // 设置编码
			uploader.uploadDir = path.join(conf.upload.save, user.id, folderName);  // 设置上传目录
			uploader.keepExtensions = !0;  // 保留后缀
			uploader.maxFieldsSize = 1024 * 20;  // 文件大小
			uploader.allowFileType = user.UPLOADS;

			// TODO
			uploader.on('progress', function (bytesReceived, bytesExpected){
				// console.log('progress');
				// console.log(arguments);
			});

			uploader.on('error', function (err){
				result.msg = err.message;
				cb(null, result);
			});

			uploader.on('field', function (name, value){
				// console.log('field');
				// console.log(arguments);
			});

			uploader.on('fileBegin', function (name, file){
				// console.log('fileBegin');
				// console.log(arguments);
			});

			uploader.on('file', function (name, file){
				// console.log('file');
				// console.log(arguments);
			});

			// 准备上传
			uploader.parse(req, function (err, fields, files){
				if(err) return;
				// 后缀
				var suffix = getFileSuffix(fields.Filename);
				// 文件名+后缀
				var fileName = path.basename(files.foreworld.path);
				// TODO
				var newInfo = {
					tenantid: user.id,
					userid: req.query.userid,
					fileName: fileName,
					url: folderName +'/'+ fileName
				};
				proxy.upload.saveNew(newInfo, function (err, doc){
					if(err){
						// 删除已上传的文件
						// TODO
						return cb(err);
					}
					// 返回值
					result.data = {
						name: '',
						url: conf.upload.http + user.id +'/'+ newInfo.url,
						type: suffix
					};
					result.success = true;
					cb(null, result);
				});
			});
		});
	}


	function upload_qiniu(req, res, cb){
		//需要填写你的 Access Key 和 Secret Key
		qiniu.conf.ACCESS_KEY = 'x1FV4QyepwWQkjXgKtYUnejyibKO5ZABB2P4oxQe';
		qiniu.conf.SECRET_KEY = 'reC7PeI9zY0tLzVfilUWbbibbFtO8riWfBKngETv';

		//要上传的空间
		var bucket = 'goldxin';

		//上传到七牛后保存的文件名
		var key = 'rr/my-nodejs-logo.jpg';

		//构建上传策略函数
		function uptoken(bucket, key) {
			var putPolicy = new qiniu.rs.PutPolicy(bucket +':'+ key);
			return putPolicy.token();
		}

		//生成上传 Token
		var token = uptoken(bucket, key);

		//要上传文件的本地路径
		var filePath = 'd:/5e1b287fgw1f3ex6kz06wj20xc1e07wh.JPG';

		//构造上传函数
		function uploadFile(uptoken, key, localFile){
			var extra = new qiniu.io.PutExtra();
			qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret){
				if(err) return next(err);
				cb(null, result);
			});
		}

		//调用uploadFile上传
		uploadFile(token, key, filePath);
	}

	/**
	 * 上传
	 *
	 * @param
	 * @return
	 */
	function upload(req, res, cb){
		uploader(req, res, function (err, result){
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
				upload(req, res, function (err, result){
					if(err) return next(err);
					res.send(result);
				});
				break;
			case 'upload_qiniu':
				upload_qiniu(req, res, function (err, result){
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