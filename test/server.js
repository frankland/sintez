/**
 * @deprecated
 */


import gulp from 'gulp';

var Manager = require('../tasks/manager');

var WebpackDevServer = require('webpack-dev-server');
var join  = require('path').join;

var Environment = require('../environment');

var Clear = require('../tasks/src/clear');
var HtmlWatch = require('../tasks/src/html/watch');
var LessWatch = require('../tasks/src/less/watch');
var StaticWatch = require('../tasks/src/static/watch');
var Server = require('../tasks/src/server');

var configObjectEntries = join(__dirname, './configs/object-entries.yml');
var env = Environment.fromPath(configObjectEntries);


var htmlWatch = new HtmlWatch(env);
var lessWatch = new LessWatch(env);
var staticWatch = new StaticWatch(env);
var clear = new Clear(env);
var server = new Server(env);

var manager = new Manager(gulp);

manager.add(clear)();
manager.add(htmlWatch)();
manager.add(lessWatch)();
manager.add(staticWatch)();

manager.add(server)();
