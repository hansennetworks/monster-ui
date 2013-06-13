define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster');

	var app = {

		name: 'scaffold',

		i18n: [ 'en-US', 'fr-FR' ],

		requests: {
			'scaffold.data': {
				url: ..,
				verb: ..
			}
		},

		subscribe: {
			'scaffold.event': function(data){
				console.log(data);
			}
		},

		load: function(callback){
			var self = this;

			callback && callback(self);
		},

		render: function(container){

		}
	};

	return app;
});