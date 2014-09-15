/**
 * Module dependencies
 */
var request = require('superagent')
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
  return this._parts.push(part), this;
};

/**
 * Youtube#done - run query
 * @param {Function} cb - (err, body) response body
 * @return {Request}
 */
Youtube.prototype.done = function (cb) {
  return request
    .get(endpoint)
    .query({id: this.opts.id})
    .query({key: this._id})
    .query({part: this._parts.join(',')})
    .end(function (err, res) {
      return cb(err, res.body);
    });
};
