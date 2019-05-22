// pages/personal/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_state: true,
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    if (userInfo) {
      this.setData({
        login_state: false,
        userInfo: userInfo
      })
    } else {
      this.setData({
        login_state: true,
      })
    }
  },

  // 授权登录
  click_UserInfo: function (e) {
    // console.log(e)
    var that = this;
    wx.login({
      success: res => {
        // 如果需要，res里面可以拿到登录成功的code
        var code = res.code
        var userInfo = e.detail.userInfo;
        console.log(code)
        console.log(userInfo)
        wx.setStorageSync('userInfoToken', code);
        wx.setStorageSync('userInfo', userInfo);
        // 用户信息
        if (userInfo) {
          wx.showToast({
            title: '登录中……',
            icon: 'none',
            duration: 300
          })
          that.setData({
            // token: code,
            login_state: false,
            userInfo: userInfo
          })
        } else {
          wx.showModal({
            title: "为了您更好的体验,请先同意授权",
          });
        }
      }
    })
  },
  // 跳转所有订单
  link_allOrder() {
    wx.navigateTo({
      url: './my_order'
    })
  },
  // 跳转设置
  link_setting() {
    wx.navigateTo({
      url: './zh_setting'
    })
  },
  // 跳转我发布的
  link_release() {
    wx.navigateTo({
      url: './my_fabu'
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