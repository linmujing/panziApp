// pages/theme/detail.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    img:{
      hengping: app.globalData.imgUrl + 'henping.png',
      heng: app.globalData.imgUrl + 'heng.png',
      shu: app.globalData.imgUrl + 'shu.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.themeInfo(options.id, options.type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  themeInfo: function (id, type) {
    var that = this
    var url = ''
    switch (type){
      case '1':
        url = util.url.themeInfo;
        break;
      case '2':
        url = util.url.slicesInfo;
        break;
    }
    var reqBody = {
      id: id
    };
    util.post(url, reqBody, (res) => {
      if (res.state == 1) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          info: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})