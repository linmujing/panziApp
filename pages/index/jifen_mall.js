// pages/index/product_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortData: {
      sortList: ['综合', '销量', '新品', '价格'],
      current: 0,
    },
    productList: [
      { img: app.globalData.imgUrl + 'week1.jpg', name: '盘子女人坊艺术写真', price: 276, yPrice: 24278, pay: 30 },
      { img: app.globalData.imgUrl + 'week2.jpg', name: '盘子女人坊艺术写真', price: 156, yPrice: 4278, pay: 30 },
      { img: app.globalData.imgUrl + 'week3.jpg', name: '盘子女人坊艺术写真', price: 1766, yPrice: 33278, pay: 30 },
      { img: app.globalData.imgUrl + 'week4.jpg', name: '盘子女人坊艺术写真', price: 236, yPrice: 2278, pay: 30 }
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
  click_sort: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      'sortData.current': index,
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