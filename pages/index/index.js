import {
  Util
} from '../../utils/util.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.CONFIG.BGCOLOR,
    newsDetailUrl: app.CONFIG.PAGE.NEWSDETAILS,
    isLoading: false,
    newsItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.api.mockTest().then(res => {
      if (res.data.code == 200) {
        this.setData({
          newsItem: res.data.data.news
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    let apifunc = app.api.mockTest();
    let cb = res => {
      self.setData({
        newsItem: res.data.data.news
      });
    };
    let pageTitle = '复旦大学';
    Util.onPullDownRefresh(self, apifunc, cb, pageTitle);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /* 搜索获取焦点触发 */
  search() {
    wx.navigateTo({
      url: app.CONFIG.PAGE.SEARCH
    });
  }
})