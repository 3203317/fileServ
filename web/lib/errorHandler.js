/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	cwd = process.cwd(),
	macros = require('./macro');

var util = require('speedt-utils'),
	mailService = util.service.mail;

exports.appErrorProcess = function(app){

	app.configure(function(){
		// error hanlder
		app.use(function (req, res, next){
			if(req.xhr){
				return res.send({ success: false, msg: 'Not found' });
			}
			res.send(404, 'Not found');
		});

		app.use(function (err, req, res, next){
			if(!err) return next();
			console.error(err);
			// send mail
			mailService.sendMail({
				subject: 'fileServ.foreworld.net [Web Error]',
				template: [
					path.join(cwd, 'lib', 'ErrorMail.vm.html'), {
						data: {
							error: err,
							time: util.format(new Date(), 'YY-MM-dd hh:mm:ss.S')
						}
					}, macros
				]
			}, function (err, info){
				if(err) console.error(err);
			});
			// res send
			if(req.xhr){
				return res.send({ success: false, msg: err.message });
			}
			res.send(500, err.message);
		});

		process.on('uncaughtException', function (err){
			console.error(err);
			// send mail
			mailService.sendMail({
				subject: 'fileServ.foreworld.net [Web Uncaught Error]',
				template: [
					path.join(cwd, 'lib', 'ErrorMail.vm.html'), {
						data: {
							error: err,
							time: util.format(new Date(), 'YY-MM-dd hh:mm:ss.S')
						}
					}, macros
				]
			}, function (err, info){
				if(err) console.error(err);
			});
		});
	});
};