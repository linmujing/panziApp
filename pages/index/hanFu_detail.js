// pages/index/jifen_detail.js
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
    recommend: [],
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
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      goods_id: options.id
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

    this.getInfo(options.id)
    this.getRecommend()
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
  click_index: function (e) {
    wx.switchTab({
      url: 'index',
    })
  },
  getInfo: function (id) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var reqBody = {
      token: that.data.userInfo.token,
      id: id
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
  getRecommend: function (id) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    util.post(util.url.recommend_new, reqBody, (res) => {
      // console.log(res)
      if (res.state == 1) {
        that.setData({
          recommend: res.data,
        })
      }
    })
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'hanFu_detail?id=' + id,
    })
  },
  bindPickerChange: function (e) {
    if (e.detail.value == 0){
      wx.showToast({
        title: '请选择尺码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      natureIndex: e.detail.value
    })
    this.click_dui()
  },
  click_cart: function () {
    wx.navigateTo({
      url: '/pages/shopCart/index',
    })
  },
  click_addCart: function (e) {
    var that = this
    var specData = that.data.specData
    var spec = ''
    if (specData.info != ''){
      spec = specData.cur
    }
    var reqBody = {
      token: that.data.userInfo.token,
      num: 1,
      goods_id: that.data.goods_id,
      spec: spec
    };
    util.post(util.url.add_car, reqBody, (res) => {
      if (res.state == 1) {
        that.hideModal()
        wx.showToast({
          title: '添加成功~',
          icon: 'none',
          duration: 1000
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
      that.click_addCart()
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
      // 来自页面内转发按钮
      // console.log("111", res);
    } else {
      // console.log("222", res);
    }
    return {
      title: this.data.detailData.goods_name,
      path: 'pages/index/hanFu_detail?id=' + this.data.goods_id
    }
  },
})