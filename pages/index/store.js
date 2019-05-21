// pages/index/store.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList: [
      { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
      { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
      { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
      { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
      { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
      { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
      { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
      { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
      { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
      { img: app.globalData.imgUrl + 'store4.jpg', name: '上海静安' }
    ],
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
  blur_search: function (e) {
    // this.setData({
    //   'tel': e.detail.value
    // })
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