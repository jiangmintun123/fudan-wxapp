import Util from 'utils/util.js';
import {
  Api
} from 'wxapp/api/api.js';
import {
  MockData
} from 'wxapp/mock/mockData.js';
const CONFIG = require('wxapp/api/config.js');
const api = new Api();
const mockData = new MockData();

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },

  /* 全局设置 */
  globalData: {
    userInfo: null,
    sysConfig: null
  },
  CONFIG: CONFIG,
  api: api,
  mockData: mockData
})