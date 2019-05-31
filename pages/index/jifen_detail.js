// pages/index/jifen_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    detailData: {
      img: app.globalData.imgUrl + 'week1.jpg',
      name: '盘子女人坊古装艺术写真油画布框',
      info: '古装艺术写真油画布框辅助介绍',
      jifen: 2000,
      sale: 997,
      pay: 2,
      kucun: 2255
    },
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  click_dui: function (e) {
    // var popup_state = this.data.popup_state
    // this.setData({
    //   popup_state: !popup_state
    // })
    wx.navigateTo({
      url: 'order',
    })
  },
  click_index: function (e) {
    wx.switchTab({
      url: 'index',
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