import {
  Api
} from '../wxapp/api/api.js';
const api = new Api();

class Util {
  constructor() {
    let self = this;
  }

  /* 格式化时间 */
  static formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const formatNumber = n => {
      n = n.toString();
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }

  /* 判断A字符串是否包含B字符串 */
  static strIsContain(strA, strB) {
    if (strA.toString().indexOf(strB.toString() > -1)) return true;
    else return false;
  }

  /* 判断数组是否包含某个元素 */
  static arrayIsContain(array, arg) {
    if (!array || array.length == 0) return false;
    else return array.indexOf(arg) > -1 ? true : false;
  }

  /* 模态弹窗 */
  static showModal(options) {
    let defaultOption = {
      title: '提示',
      content: '',
      confirmText: '确定',
      cancelText: '知道了'
    };
    options = Object.assign(defaultOption, options || {});
    return new Promise(function(resolve, reject) {
      wx.showModal({
        title: options.title,
        content: options.content,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        success: function(res) {
          if (res.confirm) {
            resolve('模态弹窗确定!');
          } else {
            reject('模态弹窗取消!');
          }
        }
      })
    });
  }

  /* 验证授权并保存用户信息 */
  static checkIsAuthorized(event, cb) {
    let self = this;
    let userInfo = event.detail.userInfo;
    /* 用户点击拒绝授权 */
    if (!userInfo) {
      self.showModal({
        content: '游客身份无法进行正常浏览'
      });
      return;
    }
    /* 保存用户信息 */
    api.setUserInfo(userInfo).then(res => {
      console.log('保存用户信息成功: ', res);
      typeof cb == 'function' && cb();
      wx.navigateTo({
        url: getApp().CONFIG.PAGE.SELECTID
      });
    }, res => {
      console.log('保存用户信息失败！');
      self.showModal({
        content: '授权失败，请再次点击'
      });
    });
  }

  /* 判断用户是否已经授权 */
  static getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                console.log('用户已授权:', res);
                getApp().globalData.isAuthorized = true;
                resolve();
              }
            });
          } else {
            console.log('用户未授权！');
            reject();
          }
        }
      });
    });
  }

  /* 微信用户登录 */
  static wxlogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          let code = res.code;
          console.log('登录code:', code);
          api.wxlogin(code).then(res => {
            console.log('登录成功！');
            wx.setStorageSync('session_id', res.data.data.session_id);
            resolve(res.data.data.session_id);
          });
        },
        fail: res => {
          reject(res);
        }
      });
    });
  }

  /* 获取用户信息并且保存到全局变量中 */
  static getUserInfo() {
    return api.getUserInfo().then(res => {
      getApp().globalData.userInfo = res.data.data;
    });
  }

  /* 分享和转发 */
  static onShareAppMessage(title, path, imageUrl, cb) {
    let defaultImageUrl = '../../images/share.jpg';
    return {
      title: title,
      path: path,
      imageUrl: imageUrl || defaultImageUrl,
      success(res) {
        console.log('分享转发成功！', res);
        if (!res.shareTickets) {
          api.shareFriend().then(() => {
            console.log('分享转发到个人成功!');
            typeof cb == 'function' && cb();
          });
        } else {
          let st = res.shareTickets[0];
          wx.getShareInfo({
            shareTicket: st,
            success(res) {
              let iv = res.iv
              let encryptedData = res.encryptedData;
              api.groupShare(encryptedData, iv).then(res => {
                console.log('分享转发到群成功!', res);
                typeof cb == 'function' && cb();
              });
            }
          });
        }
      },
      fail: function(res) {
        console.log('分享转发失败！');
      }
    };
  }

  /* 用户下拉重新加载数据 */
  static onPullDownRefresh(ctx, apifunc, cb, pageTitle) {
    let self = this;
    wx.stopPullDownRefresh();
    wx.showNavigationBarLoading();
    wx.setNavigationBarTitle({
      title: '正在刷新...'
    });
    ctx.setData({
      isLoading: true
    });
    let finallyfunc = () => {
      ctx.setData({
        isLoading: false
      });
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({
        title: pageTitle || ''
      })
    }
    self.strIsContain(apifunc, 'Promise') && apifunc.then(res => {
      typeof cb == 'function' && cb(res);
      finallyfunc();
    }, res => {
      console.error('重新加载失败: ', res);
      finallyfunc();
    });
  }

  /* tabBar页面跳转后执行页面的OnLoad事件 */
  static switchTabToOnload(url, cb) {
    if (!url) return;
    wx.switchTab({
      url: url,
      success: res => {
        typeof cb == 'function' && cb();
        let page = getCurrentPages().pop();
        page && page.onLoad();
      }
    });
  }

  /* 处理选择的兴趣标签 */
  static handleTagsSelected(e, param, ctx) {
    let tid = e.detail.tid;
    let isSelect = e.detail.isSelect;
    let selectedTags = ctx.data[param];
    if (isSelect) {
      if (!Util.arrayIsContain(selectedTags, tid)) {
        selectedTags.push(tid);
      }
    } else {
      if (Util.arrayIsContain(selectedTags, tid) && selectedTags.length > 0) {
        let res = [];
        for (let i = 0; i < selectedTags.length; i++) {
          if (selectedTags[i] != tid) {
            res.push(selectedTags[i]);
          }
        }
        let obj = {};
        obj[param] = res;
        ctx.setData(obj);
      }
    }
  }
}

module.exports = {
  Util: Util
}