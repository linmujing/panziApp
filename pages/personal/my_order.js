// pages/personal/my_order.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    type: '',
    tabArr: [
      { name: '全部', type: '' },
      { name: '待付款', type: 0 },
      { name: '待发货', type: 1 },
      { name: '待收货', type: 2 },
      { name: '已收货', type: 3},
    ],
    list: [],
    Page_slide: true,
    page: 1,
    logis: {
      popup_state: true,
      wl_company: '暂无',
      wl_order: '暂无'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    var type = ''
    if (options.type){
      type = options.type
    }
    var currentTab = 0
    if (type == ''){
      currentTab = 0
    }else{
      currentTab = (parseInt(type) + 1)
    }
    this.setData({
      currentTab: currentTab,
      type: type
    })
    this.getOrder()
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
        currentTab: e.target.dataset.current,
        type: e.target.dataset.type,
        list: [],
        page: 1
      })
      that.getOrder()
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
  click_comment: function (e) {
    wx.navigateTo({
      url: 'order_comment',
    })
  },
  getOrder: function () {
    var that = this
    var type = that.data.type
    var reqBody = {
      pageNum: that.data.page,
      token: that.data.userInfo.token
    };
    if(type !== ''){
      reqBody.type = type
    }
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.myorder_new, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        var list = that.data.list
        list = list.concat(res.data);
        that.setData({
          list: list,
          page: that.data.page + 1
        })
        // 判断上拉加载
        var leg = that.data.list.length
        if (leg < res.count) {
          this.setData({
            Page_slide: true
          })
        } else {
          this.setData({
            Page_slide: false
          })
        }
      }
    })
  },
  click_pay: function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.list[index]
    console.log(list.type)
    if (list.type == 2){
      wx.navigateTo({
        url: '/pages/shopCart/order?id=' + list.convert_no,
      })
    }else{
      wx.navigateTo({
        url: '/pages/index/order?id=' + list.id,
      })
    }
   
  },
  click_qrsh: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var oid = e.currentTarget.dataset.oid;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reqBody = {
      id: id,
      convert_no: oid,
      token: that.data.userInfo.token
    };
    util.post(util.url.finish_order, reqBody, (res) => {
      if (res.state == 1) {
        wx.hideLoading()
        wx.showToast({
          title: '确认收货成功~',
          icon: "none",
          duration: 1000
        })
        that.setData({
          list: [],
          page: 1
        })
        that.getOrder()
      }else{
        wx.hideLoading()
        wx.showToast({
          title: res.info,
          icon: "none"
        })
      }
    })
  },
  click_open: function (e) {
    var name = e.currentTarget.dataset.name;
    var order = e.currentTarget.dataset.order;
    name == null ? name = '暂无' : name
    order == null ? order = '暂无' : order
    this.setData({
      'logis.popup_state': false,
      'logis.wl_company': name,
      'logis.wl_order': order
    })
  },
  click_close: function () {
    this.setData({
      'logis.popup_state': true
    })
  },
  del_order: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.list;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reqBody = {
      id: list[index].id,
      convert_no: list[index].convert_no,
      token: that.data.userInfo.token
    };
    util.post(util.url.delOrder, reqBody, (res) => {
      if (res.state == 1) {
        wx.hideLoading()
        that.data.list.splice(index, 1);
        that.setData({
          list: list
        })
        wx.showToast({
          title: '删除成功~',
          icon: "none",
          duration: 1000
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.info,
          icon: "none"
        })
      }
    })
  },
  copyText: function (e) {
    var text = e.currentTarget.dataset.text;
    console.log(text)
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res) // data
            wx.showToast({
              title: '复制成功~',
              icon: "none",
              duration: 1000
            })
          }
        })
      }
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
    this.setData({
      list: [],
      page: 1
    })
    this.getOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getOrder()
    }
  },

})