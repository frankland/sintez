var Manager = require('../src-native/tasks/manager');

var WebpackDevServer = require('webpack-dev-server');
var join  = require('path').join;

var Environment = require('../src-native/environment');

var Clear = require('../src-native/tasks/src/clear');
var HtmlWatch = require('../src-native/tasks/src/html/watch');
var LessWatch = require('../src-native/tasks/src/less/watch');
var StaticWatch = require('../src-native/tasks/src/static/watch');
var Server = require('../src-native/tasks/src/server');

var configObjectEntries = join(__dirname, './configs/object-entries.yml');
var env = Environment.fromPath(configObjectEntries);


var htmlWatch = new HtmlWatch(env);
var lessWatch = new LessWatch(env);
var staticWatch = new StaticWatch(env);
var clear = new Clear(env);
var server = new Server(env);

var manager = new Manager();

manager.add(clear)();
manager.add(htmlWatch)();
manager.add(lessWatch)();
manager.add(staticWatch)();

manager.add(server)();


//var webpack = env.getWebpack();
//var server = webpack.getServer();

//server.setupIndexAsEntry();
//server.run();?
