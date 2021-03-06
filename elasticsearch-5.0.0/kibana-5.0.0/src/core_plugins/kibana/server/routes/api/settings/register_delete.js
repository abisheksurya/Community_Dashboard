'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = registerDelete;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function registerDelete(server) {
  server.route({
    path: '/api/kibana/settings/{key}',
    method: 'DELETE',
    handler: function handler(req, reply) {
      var key = req.params.key;

      var uiSettings = server.uiSettings();
      uiSettings.remove(key).then(function () {
        return uiSettings.getUserProvided().then(function (settings) {
          return reply({ settings: settings }).type('application/json');
        });
      })['catch'](function (reason) {
        return reply(_boom2['default'].wrap(reason));
      });
    }
  });
}

module.exports = exports['default'];
