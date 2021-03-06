import {
  Util
} from '../../../../utils/util.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.CONFIG.BGCOLOR,
    selfTags: [],
    tags: [],
    selfTagsSelected: [],
    moreTagsSelected: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    self.getTags();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /* 获取标签列表 */
  getTags() {
    let self = this;
    self.setData({
      selfTags: app.globalData.userInfo.tag_list
    });
    app.api.getTags().then(res => {
      let tags = res.data.data;
      let selfTags = self.data.selfTags;
      if (selfTags.length == 0) {
        self.setData({
          tags: tags
        });
        return;
      }
      let selfTagsIDs = selfTags.map(x => x.id.toString());
      let filterTags = tags.filter(x => !Util.arrayIsContain(selfTagsIDs, x.id.toString()));
      self.setData({
        tags: filterTags
      });
      self.saveSelectedHoverClass();
    });
  },

  /* 选择更多兴趣标签触发 */
  selectInterestLable(e) {
    let self = this;
    Util.handleTagsSelected(e, 'moreTagsSelected', self);
    console.log('选择的更多兴趣标签: ', self.data.moreTagsSelected);
  },

  /* 选择删除我的兴趣标签触发 */
  deleteInterestLable(e) {
    let self = this;
    Util.handleTagsSelected(e, 'selfTagsSelected', self);
    console.log('选择的删除我的兴趣标签: ', self.data.selfTagsSelected);
  },

  /* 点击添加触发 */
  addTag(e) {
    let self = this;
    let tags = self.data.tags;
    let selfTags = self.data.selfTags;
    let moreTagsSelected = self.data.moreTagsSelected;
    if (moreTagsSelected.length == 0) {
      Util.showModal({
        content: '请选择你要添加的标签'
      });
      return;
    }
    let postTags = selfTags.map(x => x.id).concat(moreTagsSelected);
    app.api.setTags(postTags).then(res => {
      Util.getUserInfo().then(() => {
        self.setData({
          moreTagsSelected: []
        });
        self.clearAllHoverClass();
        self.getTags();
      });
    });
  },

  /* 点击删除触发 */
  deleteTag(e) {
    let self = this;
    let selfTags = self.data.selfTags;
    let selfTagsSelected = self.data.selfTagsSelected.map(x => x.toString());
    if (selfTagsSelected.length == 0) {
      Util.showModal({
        content: '请选择你要删除的标签'
      });
      return;
    }
    let postTags = selfTags.filter(x => !Util.arrayIsContain(selfTagsSelected, x.id.toString())).map(x => x.id);
    app.api.setTags(postTags).then(res => {
      Util.getUserInfo().then(() => {
        self.setData({
          selfTagsSelected: []
        });
        self.clearAllHoverClass();
        self.getTags();
      });
    });
  },

  /* 清除所有hover样式 */
  clearAllHoverClass() {
    let self = this;
    self.data.selfTags.length > 0 && self.data.selfTags.forEach(x => {
      self.selectComponent(`#st_${x.id}`).clearHoverCss();
    });
    self.data.tags.length > 0 && self.data.tags.forEach(x => {
      self.selectComponent(`#mt_${x.id}`).clearHoverCss();
    });
  },

  /* 保留之前选择的标签的hover样式 */
  saveSelectedHoverClass() {
    let self = this;
    self.data.selfTagsSelected.length > 0 && self.data.selfTagsSelected.forEach(x => {
      self.selectComponent(`#st_${x}`).setHoverCss();
    });
    self.data.moreTagsSelected.length > 0 && self.data.moreTagsSelected.forEach(x => {
      self.selectComponent(`#mt_${x}`).setHoverCss();
    });
  }
})