// pages/personal/my_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    goodsData: [{
        name: '全部',
        type: 1,
        detail: []
      },
      {
        name: '待付款',
        type: 2,
        detail: []
      },
      {
        name: '待发货',
        type: 3,
        detail: []
      }, {
        name: '待收货',
        type: 4,
        detail: []
      }, {
        name: '待评价',
        type: 5,
        detail: []
      }
    ],
    allOrder: [{
      img: "../../img/order_hd.png",
      title: "盘子女人坊古装艺术写真",
      tips: "套装组合",
      price: "2000",
      price_: "3000",
      num: 1,
      total: 2000
    }, {
      img: "../../img/order_hd.png",
      title: "盘子女人坊古装艺术写真",
      tips: "套装组合",
      price: "2000",
      price_: "3000",
      num: 1,
      total: 2000
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 导航栏切换
  houseChange(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  switchNav(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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