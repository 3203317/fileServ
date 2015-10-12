/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	express = util.express;

var front = {
	site: require('../controllers/front/site')
};
var back = {};
var manage = {};

var gps = require('../controllers/gps');

/**
 *
 * @param
 * @return
 */
module.exports = function(app){
	proc_front(app);
	proc_back(app);
	proc_manage(app);
	proc_gps(app);
};

/**
 *
 * @param
 * @return
 */
function proc_front(app){
	app.get('/test/', front.site.testUI);

	app.get('/upload/', front.site.signature_validate, front.site.uploadUI);
	app.post('/api$', front.site.signature_validate, front.site.api);

	app.get('/user/login$', front.site.loginUI);
	app.get('/', front.site.indexUI);
}

function proc_gps(app){
	app.get('/gps$', gps.api);
}

/**
 *
 * @param
 * @return
 */
function proc_back(app){
	// TODO
}

/**
 *
 * @param
 * @return
 */
function proc_manage(app){
	// TODO
}