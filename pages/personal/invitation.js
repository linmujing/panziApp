// pages/personal/invitation.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitate_info: {},
    hasOrder: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo,
      order_id: options.id
    })
    this.invitation_info()
  },

  // 邀约信息
  invitation_info() {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      // token:'d53589c7df29cf8a31d4b6ac165e398d',
      id: that.data.order_id
    };
    util.post(util.url.invite, reqBody, (res) => {
      console.log(res)
      if (res.state === 1) {
        that.setData({
          invitate_info: res.data,
          hasOrder: true
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
        that.setData({
          hasOrder: false
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/index/hanFu'
          })
        }, 1000)
      }
    })
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