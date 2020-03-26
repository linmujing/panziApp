// pages/index/hanFu_client.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Page_slide: true,
    clientData: {
      current: 0,
      page: 1,
      search: '',
      list: [],
    },
    detailData:{},
    specData: {
      state: false,
      info: [],
      cur: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })
    that.getList()
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
  getList: function () {
    var that = this
    var reqBody = {
      pageSize: 10,
      pageNum: that.data.clientData.page,
      name: that.data.clientData.search,
      type: that.data.clientData.type,
      token: that.data.userInfo.token,
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.hfclientList, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        wx.setNavigationBarTitle({
          title: res.title
        })
        var list = that.data.clientData.list
        list = list.concat(res.data);
        that.setData({
          'clientData.list': list,
          'clientData.page': that.data.clientData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.clientData.list.length
        if (leg < res.count) {
          that.setData({
            Page_slide: true
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      }else if (res.state == 2){
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 2000)
      }
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
        var detailData = res.data
        that.setData({
          detailData: detailData,
          'specData.info': detailData.nature
        })
        if (detailData.stock <= 0) {
          wx.showToast({
            title: '库存为0~',
            icon: 'none',
            duration: 1000
          })
          return
        }
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
      }
    })
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'hanFu_detail?id=' + id,
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
    var nature = that.data.specData
    var natureVal = ''
    if (nature != ''){
      natureVal = nature.cur
    }
    
    var info = that.data.detailData
    info.goods_nature = natureVal
    info.money = info.cost
    app.globalData.hfInfo = info

    wx.navigateTo({
      url: 'order',
    })
  },
  select: function (e) {
    var that = this;
    var val = e.currentTarget.dataset.val;
    that.setData({
      'specData.cur': val
    })
  },
  showModal: function (e) {
    this.setData({
      'specData.cur': ''
    })
    var id = e.currentTarget.dataset.id;
    this.getInfo(id)
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
    this.setData({
      'clientData.list': [],
      'clientData.page': 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})