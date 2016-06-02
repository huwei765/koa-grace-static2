'use strict';

const path = require('path');
const debug = require('debug')('koa-grace:static');
const send = require('koa-send');
const minimatch = require('minimatch');

/**
 * 生成路由控制
 * @param {String} prefix url prefix
 * @param {Object} options 配置项
 * @param {String} options.dir koa-grace app dir
 * @param {object} options.maxage options.maxage config
 * @return {function}       
 */
function _static(prefix, options) {
  let PATH_CACHE = {};

  return function*(next) {

    let curPath = this.path;
    let filePath = matchPath(prefix, curPath);

    if (!filePath) {
      return yield * next;
    }

    debug(path.resolve(options.dir + filePath));
    yield send(this, filePath, { 
      root: options.dir, 
      maxage: options.maxage 
    });

    // 如果发现是静态文件，直接交回执行权限即可，不用执行下一个中间件
    // return yield * next;
  }

  /**
   * 匹配路由并做记录
   * @param  {Array|String} prefix 匹配规则
   * @param  {String}       path   url path
   */
  function matchPath(prefix, path) {
    // 如果缓存存在，则直接返回结果
    if (PATH_CACHE[path]) {
      return PATH_CACHE[path];
    }

    // 如果匹配规则是一个String则直接匹配
    if (typeof prefix == 'string') {
      let match = minimatch(path, prefix);
      if (!match) {
        return false;
      }

      PATH_CACHE[path] = path;

      return PATH_CACHE[path];
    }

    // 如果匹配规则不是String则只能是Array
    if (!prefix.length || prefix.length < 1) {
      return false;
    }

    for (let i = 0; i < prefix.length; i++) {
      let match = minimatch(path, prefix[i]);
      if (match) {
        PATH_CACHE[path] = path;
        return PATH_CACHE[path];
      }
    }

    return false;
  }
};

module.exports = _static;
