'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

exports['default'] = function (server) {
  var updateMetadata = _asyncToGenerator(function* (urlId, urlDoc) {
    var client = server.plugins.elasticsearch.client;
    var kibanaIndex = server.config().get('kibana.index');

    try {
      yield client.update({
        index: kibanaIndex,
        type: 'url',
        id: urlId,
        body: {
          doc: {
            'accessDate': new Date(),
            'accessCount': urlDoc._source.accessCount + 1
          }
        }
      });
    } catch (err) {
      server.log('Warning: Error updating url metadata', err);
      //swallow errors. It isn't critical if there is no update.
    }
  });

  var getUrlDoc = _asyncToGenerator(function* (urlId) {
    var urlDoc = yield new Promise(function (resolve, reject) {
      var client = server.plugins.elasticsearch.client;
      var kibanaIndex = server.config().get('kibana.index');

      client.get({
        index: kibanaIndex,
        type: 'url',
        id: urlId
      }).then(function (response) {
        resolve(response);
      })['catch'](function (err) {
        resolve();
      });
    });

    return urlDoc;
  });

  var createUrlDoc = _asyncToGenerator(function* (url, urlId) {
    var newUrlId = yield new Promise(function (resolve, reject) {
      var client = server.plugins.elasticsearch.client;
      var kibanaIndex = server.config().get('kibana.index');

      client.index({
        index: kibanaIndex,
        type: 'url',
        id: urlId,
        body: {
          url: url,
          'accessCount': 0,
          'createDate': new Date(),
          'accessDate': new Date()
        }
      }).then(function (response) {
        resolve(response._id);
      })['catch'](function (err) {
        reject(err);
      });
    });

    return newUrlId;
  });

  function createUrlId(url) {
    var urlId = _crypto2['default'].createHash('md5').update(url).digest('hex');

    return urlId;
  }

  return {
    generateUrlId: _asyncToGenerator(function* (url) {
      var urlId = createUrlId(url);
      var urlDoc = yield getUrlDoc(urlId);
      if (urlDoc) return urlId;

      return createUrlDoc(url, urlId);
    }),
    getUrl: _asyncToGenerator(function* (urlId) {
      try {
        var urlDoc = yield getUrlDoc(urlId);
        if (!urlDoc) throw new Error('Requested shortened url does not exist in kibana index');

        updateMetadata(urlId, urlDoc);

        return urlDoc._source.url;
      } catch (err) {
        return '/';
      }
    })
  };
};

;
module.exports = exports['default'];
