'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BaseServer = (function () {
  function BaseServer(serverConfig) {
    _classCallCheck(this, BaseServer);

    this.builder = serverConfig.builder.getApplicationBuilder();
    this.config = serverConfig;
  }

  _createClass(BaseServer, [{
    key: 'run',
    value: function run(cb) {
      throw new Error('@run method should be implemented');
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      throw new Error('@getConfig method should be implemented');
    }

    //getInstance() {
    //  throw new Error('@getInstance method should be implemented');
    //}

  }]);

  return BaseServer;
})();

exports['default'] = BaseServer;
module.exports = exports['default'];