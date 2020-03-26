// pages/shopCart/index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: false,
    allCheck: false,
    listData: {
      page: 1,
      list: []
    },
    Page_slide: true,
    totalPrice: 0,
    checkList: [],
    specData: {
      state: false,
      info: {},
      cur: 0,
      index: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/index',
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
    this.setData({
      'listData.page': 1,
      'listData.list': []
    })
    this.getList()
  },
  getList: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this
    var reqBody = {
      token: userInfo.token,
      pageSize: 10,
      pageNum: that.data.listData.page
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.car_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if(res.state == 1){
        var list = that.data.listData.list
        var data = res.data.list
        for (var i = 0; i < data.length;i++){
          data[i].check = false
        }
        list = list.concat(data);
        that.setData({
          'listData.list': list,
          'listData.page': that.data.listData.page + 1
        })
        // 判断上拉加载
        var leg = list.length
        if (leg < res.data.total) {
          that.setData({
            Page_slide: true,
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      }
    })
  },
  touchS: function (e) {
    var slide = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
    this.setData({
      slide
    })
  },
  touchE: function (e) {
    if (this.data.active || this.data.active === 0) {
      this.setData({
        active: false
      })
      return
    } else {
      var index = e.currentTarget.dataset.index;
      var slide = this.data.slide;
      var data = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
      if (data.x + 50 < slide.x) {
        // console.log('向左滑')
        this.setData({
          active: index
        })

      } else if (data.x - 50 > slide.x) {
        // console.log('向右滑')
        this.setData({
          active: false
        })
      } else if (data.x === slide.x && data.y === slide.y) {
        // console.log('点击查看详情')
        this.setData({
          active: false
        })
        // var datar = this.data.list[index];
        // wx.navigateTo({
        //   url: 'add_address?type=2&data=' + JSON.stringify(datar)
        // })
      }
    }
  },
  // 删除消息
  click_del: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.listData.list
    var reqBody = {
      token: that.data.userInfo.token,
      id: list[index].id
    };
    util.post(util.url.goods_del, reqBody, (res) => {
      if (res.state == 1) {
        list.splice(index, 1)
        that.setData({
          'listData.list': list
        })
        wx.showToast({
          title: '删除成功~',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '删除失败~',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  click_minus: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.listData.list
    if (list[index].num <= 1) {
      wx.showToast({
        title: '已经不能再少啦~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    var reqBody = {
      token: that.data.userInfo.token,
      id: list[index].id
    };
    util.post(util.url.goods_reduce, reqBody, (res) => {
      if (res.state == 1) {
        --list[index].num
        that.setData({
          'listData.list': list
        })
        that.countPrice()
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  click_plus: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.listData.list
    var limit = list[index].limit;
    if (list[index].num >= limit && limit != -1) {
      wx.showToast({
        title: '已经到达该商品上限啦~',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var reqBody = {
      token: that.data.userInfo.token,
      id: list[index].id
    };
    util.post(util.url.goods_increase, reqBody, (res) => {
      if (res.state == 1) {
        list[index].num++
        that.setData({
          'listData.list': list
        })
        that.countPrice()
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  checkboxChange: function (e) {
    var that = this
    var checkArr = e.detail.value
    var list = that.data.listData.list
    var checkList = []
    for (var i = 0; i < list.length; i++) {
      list[i].check = false
      for (var j = 0; j < checkArr.length; j++) {
        if (checkArr[j] == i) {
          list[i].check = true
          checkList.push(list[i])
        }
      }
    }
    var len = list.length
    var allCheck = false
    if (checkArr.length == len) {
      allCheck = true
    } else {
      allCheck = false
    }
    this.setData({
      'listData.list': list,
      checkList: checkList,
      allCheck: allCheck
    })
    that.countPrice()
  },
  checkboxAll: function (e) {
    var that = this
    var allCheck = this.data.allCheck
    var list = that.data.listData.list
    var checkList = []
    for (var i = 0; i < list.length; i++) {
      if (!allCheck) {
        list[i].check = true
        checkList = list
      } else {
        list[i].check = false
        checkList = []
      }

    }
    that.setData({
      'listData.list': list,
      checkList: checkList,
      allCheck: !allCheck
    })
    that.countPrice()
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/hanFu_detail?id=' + id,
    })
  },
  // 计算总价
  countPrice: function () {
    var that = this
    var checkList = that.data.checkList
    var price = 0
    if (checkList.length == 0){
      that.setData({
        totalPrice: 0
      })
      return
    }
    for (var i = 0; i < checkList.length; i++){
      price += checkList[i].cost * checkList[i].num
    }
    that.setData({
      totalPrice: price.toFixed(2)
    })
    
  },
  calculate: function () {
    var that = this
    var checkList = that.data.checkList
    var reqBody = {
      token: that.data.userInfo.token,
      ids: 48
    };
    util.post(util.url.goods_price, reqBody, (res) => {
      if (res.state == 1) {
        console.log(res)
      }
    })
  },
  select: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      'specData.cur': index
    })
  },
  // 选规格确定
  click_confirm: function () {
    var that = this;
    var specData = that.data.specData;
    var list = that.data.listData.list
    if (specData.info.nature[specData.cur] == list[specData.index].spec){
      that.hideModal()
      return
    }
    var reqBody = {
      token: that.data.userInfo.token,
      nature: specData.info.nature[specData.cur],
      id: list[specData.index].id
    };
    util.post(util.url.goods_nature, reqBody, (res) => {
      if (res.state == 1) {
        list[specData.index].spec = specData.info.nature[specData.cur]
        that.setData({
          'listData.list': list
        })
        that.hideModal()
      }
    })
    
  },
  showModal: function (e) {
    var index = e.currentTarget.dataset.index;
    var data = this.data.listData.list[index];
    var cur = 0
    for (var i = 0; i < data.nature.length; i++) {
      if (data.spec == data.nature[i]){
        cur = i
      }
    }
    this.setData({
      'specData.cur': cur,
      'specData.info': data,
      'specData.index': index
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
  click_order: function () {
    var that = this
    var checkList = that.data.checkList
    if (checkList.length == 0){
      wx.showToast({
        title: '还没有选择商品哦~',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var ids = []
    for (var i = 0; i < checkList.length; i++) {
      ids.push(checkList[i].id)
    }
    var reqBody = {
      token: that.data.userInfo.token,
      ids: ids
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.goods_order_car, reqBody, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        console.log(res)
        wx.navigateTo({
          url: '/pages/shopCart/order?id=' + res.data.convert_no,
        })
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
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
      'listData.page': 1,
      'listData.list': []
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false,
        allCheck: false
      })
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})