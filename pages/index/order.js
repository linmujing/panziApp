// pages/index/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    popup_state: true,
    gift: app.globalData.imgUrl + 'gift.jpg',
    num: 1
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
  blur_remark: function (e) {
    // this.setData({
    //   'tel': e.detail.value
    // })
  },
  //增加数量
  click_plus: function () {
    var that = this;
    var num = that.data.num;
    num++;
    that.setData({ num: num })
  },
  //减少数量
  click_minus: function () {
    var that = this;
    var num = that.data.num;
    if (num <= 1) {
      wx.showToast({
        title: '已经不能再少啦~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    num--;
    that.setData({ num: num })
  },
  click_tijiao: function (e) {
    var popup_state = this.data.popup_state
    this.setData({
      popup_state: !popup_state
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