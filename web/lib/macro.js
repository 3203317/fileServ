/*!
 * foreworld-fileServ
 * Copyright(c) 2015 foreworld-fileServ <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	velocity = require('velocityjs'),
	util = require('speedt-utils'),
	cwd = process.cwd();

module.exports = {
	parse: function(file){
		var tpl = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return this.eval(tpl);
	}, include: function(file){
		var tpl = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return tpl;
	}, toMon: function(t){
		return util.padLeft(t.getMonth() + 1, '0', 2);
	}, toDay: function(t){
		return util.padLeft(t.getDate(), '0', 2);
	}, formatDate: function(t){
		return util.format(t, 'YY-MM-dd hh:mm:ss.S');
	}, num2Money: function(n){
		return util.currencyformat(n);
	}, toSDate: function(t){
		var y = t.getFullYear();
		var m = util.padLeft(t.getMonth() + 1, '0', 2);
		var d = util.padLeft(t.getDate(), '0', 2);
		return y +'-'+ m +'-'+ d;
	}, toHtml: function(s){
		return velocity.render(s);
	}, toSex: function(n){
		switch(n){
			case 1: return '男';
			case 2: return '女';
			default: return '未知';
		}
	}, userState: function(n){
		switch(n){
			case 0: return '未激活';
			case 1: return '邮箱';
			case 2: return '短信';
			default: return '未知';
		}
	}
};