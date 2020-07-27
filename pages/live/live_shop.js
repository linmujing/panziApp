// pages/index/live_shop.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    detailData: {},
    goods_id: '',
    natureIndex: 0,
    specData: {
      state: false,
      info: [],
      cur: '',
      type: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      goods_id: options.id,
      // goods_id: 186
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

    this.getInfo()
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
    this.setData({
      natureIndex: 0
    })
  },
  click_dui: function (e) {
    if (this.data.detailData.stock <= 0) {
      wx.showToast({
        title: '库存为0~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var nature = this.data.specData
    var natureVal = ''
    if (nature != ''){
      natureVal = nature.cur
    }
    
    var info = this.data.detailData
    info.goods_nature = natureVal
    info.money = info.cost
    app.globalData.hfInfo = info

    wx.navigateTo({
      url: 'order',
    })
  },
  getInfo: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var reqBody = {
      token: that.data.userInfo.token,
      id: that.data.goods_id
    };
    util.post(util.url.goodsInfo, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        if (res.data.goods_content){
          res.data.goods_content = res.data.goods_content.replace(/\<img/gi, '<img style="width:100%;height:auto;display: block;" ')
        }
        wx.setNavigationBarTitle({
          title: res.data.goods_name
        })
        that.setData({
          detailData: res.data,
          'specData.info': res.data.nature
        })
      }
    })
  },
  // 选规格确定
  click_confirm: function () {
    var that = this;
    var specData = that.data.specData;
    if (specData.cur == '') {
      wx.showToast({
        title: '请选择规格~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // type=1,加入购物车。
    if (specData.type == 1){
      // that.click_addCart()
    }else{
      that.click_dui()
    }
  },
  select: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.val;
    that.setData({
      'specData.cur': val
    })
  },
  showModal: function (e) {
    if (this.data.detailData.stock <= 0) {
      wx.showToast({
        title: '库存为0~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.detailData.nature == ''){
      this.click_dui()
      return
    }
    var type = e.currentTarget.dataset.type;
    this.setData({
      'specData.type': type
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(800).step()
    this.setData({
      animationData: animation.export(),
      'specData.state': true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(800).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        'specData.state': false
      })
    }.bind(this), 200)
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      
    }
    return {
      title: this.data.detailData.goods_name,
      path: 'pages/pages/live/live_shop?id=' + this.data.goods_id
    }
  },
})