/**
 * Module dependencies
 */
var request = require('superagent')
  , q = require('q')
  , _ = require('underscore');

// Api endpoint
var endpoint = 'https://www.googleapis.com/youtube/v3/videos';

var Youtube = module.exports = function Youtube (opts) {
  if (!(this instanceof Youtube)) return new Youtube(opts);

  var opts = this.opts = opts;

  _.defaults(this, {
    _parts: []
  });
};

/**
 * Youtube#id - set api key
 * @param {String} id - api key
 * @return this
 */
Youtube.prototype.id = function (id) {
  return this._id = id, this;
};

/**
 * Youtube#part - add a partial resource
 * @param {String} part - name of partial resource (snippet, contentDetails...)
 * @return this
 */
Youtube.prototype.part = function (part) {
  part = _.toArray(part);
  return this._parts.concat(part), this;
};

/**
 * Youtube#done - run query
 * @param {Function} cb - (err, body) response body
 * @return {Request}
 */
Youtube.prototype.done = function (cb) {
  var deferred = q.defer();

  request
    .get(endpoint)
    .query({id: this.opts.id})
    .query({key: this._id})
    .query({part: this._parts.join(',')})
    .end(function (err, res) {
      if (err) return deferred.reject(err);
      return deferred.resolve(res.body);
    });

  return deferred.promise.nodeify(callback);
};
