// pages/theme/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: app.globalData.imgUrl + 'ad3.jpg',
    navData: {
      navList: ['最新', '热拍', '影视', '情侣', '闺蜜', '亲子', '外景'],
      current: 0,
    },
    themeList: [
      { img: app.globalData.imgUrl + 'ad1.jpg', name: '明星同款主题【竹】', collect: 276, look: 24278, zan: 1 },
      { img: app.globalData.imgUrl + 'ad2.jpg', name: '明星同款主题【竹】', collect: 156, look: 4278, zan: 0 },
      { img: app.globalData.imgUrl + 'ad3.jpg', name: '明星同款主题【竹】', collect: 1766, look: 33278, zan: 1 },
      { img: app.globalData.imgUrl + 'ad4.jpg', name: '明星同款主题【竹】', collect: 236, look: 2278, zan: 0 }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
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
  blur_search: function (e) {
    // this.setData({
    //   'tel': e.detail.value
    // })
  },
  click_nav: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      'navData.current': index,
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