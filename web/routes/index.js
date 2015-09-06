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

/**
 *
 * @param
 * @return
 */
module.exports = function(app){
	proc_front(app);
	proc_back(app);
	proc_manage(app);
};

/**
 *
 * @param
 * @return
 */
function proc_front(app){
	app.get('/test$', front.site.testUI);
	app.get('/', front.site.indexUI);
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