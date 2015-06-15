//import { server as logger } from './log';
//
//import { resolve } from 'path';

//import gutil from 'gulp-util';

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

//import isFunction from 'lodash/lang/isFunction';
//import cloneDeep from 'lodash/lang/cloneDeep';

var _path = require('path');

//
//import sintez from '../../configs/sintez-config';

var _baseServer = require('../base-server');

var _baseServer2 = _interopRequireDefault(_baseServer);

var local = {
  server: Symbol('webpack-server')
};

var WebpackServer = (function (_BaseServer) {
  function WebpackServer(config) {
    _classCallCheck(this, WebpackServer);

    _get(Object.getPrototypeOf(WebpackServer.prototype), 'constructor', this).call(this, config);

    // TODO: check builder instance
  }

  _inherits(WebpackServer, _BaseServer);

  _createClass(WebpackServer, [{
    key: 'setupIndexAsEntry',
    value: function setupIndexAsEntry() {
      var server = this[local.server];

      var index = this.config.index;
      var resolvedIndex = (0, _path.resolve)(index);

      server.app.get('*', function (req, res) {
        res.sendFile(resolvedIndex);
      });
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return {
        contentBase: this.config.dest,
        quiet: true,
        noInfo: true,
        lazy: false,
        watchDelay: true,
        headers: {
          'X-Custom-Header': 'yes'
        },
        stats: {
          colors: true
        },
        index: (0, _path.basename)(this.config.index)
      };
    }
  }, {
    key: 'getInstance',
    value: function getInstance() {
      if (!this[local.server]) {
        var webpack = this.builder.getInstance();
        var serverConfig = this.getConfig();

        this[local.server] = new _webpackDevServer2['default'](webpack, serverConfig);
        this.setupIndexAsEntry();
      }

      return this[local.server];
    }
  }, {
    key: 'run',
    value: function run(cb) {
      var host = this.config.host;
      var port = this.config.port;

      var server = this.getInstance();

      server.listen(port, host, cb);
    }
  }]);

  return WebpackServer;
})(_baseServer2['default']);

exports['default'] = WebpackServer;
module.exports = exports['default'];