
/**
 * Module dependencies.
 */
require('newrelic');
var express = require('express');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var config = require('./config')

var options = {
	server: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	}
};

var mongodbUri = config.db();
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
	startApp();
});

function startApp() {
	require('./models/cards');
	require('./models/ability');
	var routes = require('./routes');
	var user = require('./routes/user');
	var http = require('http');
	var path = require('path');

	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	app.use(express.static(path.join(__dirname, 'public')));

	app.use(app.router);

	// app.use('/public/javascripts', express.static('/public/javascripts'));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	// app.get('/*', routes.index);
	app.param('card', routes.card);
	app.param('ability', routes.ability);
	app.get('/', routes.index);
	app.get('/data/cards', routes.getcards);
	app.post('/data/cards', routes.addcard);
	app.get('/data/cards/:card', routes.getcard);
	app.get('/data/abilities', routes.getabilities);
	app.post('/data/ability', routes.addability);
	app.get('/data/ability/:ability', routes.getability);
	app.post('/data/abilities/remove', routes.removeability);
	app.get('/data/users', user.list);
	app.get('/*', routes.index);

	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
};
