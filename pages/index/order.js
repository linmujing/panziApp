// pages/index/order.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
    popup_state: true,
    gift: app.globalData.imgUrl + 'gift.jpg',
    num: 1,
    addr: {},
    addr_state: true,
    info: {},
    totle_cost: 0,
    totle_price: 0,
    remark: '',
    type: 0,
    goods_img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      // types: options.types,
      // orderId: options.id,
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getOrder(options.id)
    } else {
      console.log(info)
      var info = app.globalData.hfInfo
      var totle_cost = info.money + info.postage
      this.setData({
        info: info,
        totle_cost: totle_cost.toFixed(2),
        type: info.type,
        goods_img: info.goods_img[0]
      })
    }

    this.getAddrList()
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
    if (app.globalData.Select_address) {
      this.setData({
        addr: app.globalData.Select_address,
        addr_state: false
      })
    }
  },

  getOrder: function (id) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reqBody = {
      token: that.data.userInfo.token,
      order_id: id
    };
    util.post(util.url.orderInfo, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        var totle_cost = res.order.money * res.order.num + res.order.postage
        var totle_price = res.order.money_jf * res.order.num
        that.setData({
          info: res.order,
          goods_img: res.order.goods_img,
          totle_cost: totle_cost.toFixed(2),
          totle_price: totle_price.toFixed(2),
          type: res.order.type,
          num: res.order.num
        })
      }
    })
  },
  getAddrList: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    util.post(util.url.addrList, reqBody, (res) => {
      if (res.state == 1) {
        for (var i = 0; i < res.info.length; i++) {
          if (res.info[i].type == 1) {
            that.setData({
              addr: res.info[i],
              addr_state: false
            })
          }
        }
      }
    })
  },
  blur_remark: function (e) {
    this.setData({
      'remark': e.detail.value
    })
  },
  //增加数量
  click_plus: function () {
    var that = this;
    var num = that.data.num;
    var limit = that.data.info.limit;
    if (num >= limit && limit != -1) {
      wx.showToast({
        title: '已经到达该商品上限啦~',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    num++;
    var totle_cost = that.data.info.money * num + that.data.info.postage
    var totle_price = that.data.info.money_jf * num
    that.setData({
      num: num,
      totle_cost: totle_cost.toFixed(2),
      totle_price: totle_price.toFixed(2),
    })
  },
  //减少数量
  click_minus: function () {
    var that = this;
    var num = that.data.num;
    if (num <= 1) {
      wx.showToast({
        title: '已经不能再少啦~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    num--;
    var totle_cost = (that.data.info.money * num + that.data.info.postage).toFixed(2)
    var totle_price = (that.data.info.money_jf * num).toFixed(2)
    console.log(that.data.info.money_jf * num)
    that.setData({
      num: num,
      totle_cost: totle_cost,
      totle_price: totle_price
    })
  },

  click_tijiao: function (e) {
    var that = this

    if (that.data.addr_state) {
      wx.showToast({
        title: '请选择收货地址~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    if (that.data.type == 1) {
      if (that.data.info.money_jf > 0) {
        that.pay_goods()
      } else {
        that.integral() // 积分兑换
      }

    } else if (that.data.type == 2) {
      that.create_order() // 汉服生成订单
    } else if (that.data.type == 3 || that.data.type == 4) {
      that.lotto() // 积分抽奖
    }
    // if (that.data.types == 8080) {
    //   console.log(111)
    //   that.zplotto() //转盘抽奖
    // }
  },
  // 积分兑换 + 支付
  pay_goods: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      goods_id: that.data.info.goods_id,
      address_id: that.data.addr.id,
      money: that.data.totle_cost,
      remark: that.data.remark,
      convert_no: that.data.info.convert_no,
      num: that.data.num
    };
    util.post(util.url.pay_goods, reqBody, (res) => {
      wx.hideLoading()
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          wx.showToast({
            title: "完成订单支付"
          })
          var popup_state = that.data.popup_state
          that.setData({
            popup_state: !popup_state
          })
        },
        'fail': function (res) {
          wx.redirectTo({
            url: '/pages/personal/my_order'
          })

        }
      })
    })
  },

  // 转盘抽奖提交
  zplotto() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      address_id: that.data.addr.id,
      remark: that.data.remark,
      convert_no: that.data.orderId
    };
    util.post(util.url.zplotto, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        var popup_state = that.data.popup_state
        that.setData({
          popup_state: !popup_state
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/personal/my_order',
          })
        }, 800)
      }
    })
  },

  // 积分抽奖
  lotto: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      address_id: that.data.addr.id,
      remark: that.data.remark,
      convert_no: that.data.info.convert_no,
      // order_id: that.data.orderId
    };
    util.post(util.url.convert_lotto, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        var popup_state = that.data.popup_state
        that.setData({
          popup_state: !popup_state
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/personal/my_order',
          })
        }, 800)
      }
    })
  },
  // 汉服提交订单支付
  payment: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      goods_id: that.data.info.goods_id,
      address_id: that.data.addr.id,
      money: that.data.totle_cost,
      remark: that.data.remark,
      convert_no: that.data.info.convert_no,
      num: that.data.num
    };
    util.post(util.url.copePay, reqBody, (res) => {
      wx.hideLoading()
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          wx.showToast({
            title: "完成订单支付"
          })
          var popup_state = that.data.popup_state
          that.setData({
            popup_state: !popup_state
          })
        },
        'fail': function (res) {
          wx.redirectTo({
            url: '/pages/personal/my_order'
          })

        }
      })
    })
  },
  // 积分兑换
  integral: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认兑换该商品？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          console.log('用户点击确定')
          var reqBody = {
            token: that.data.userInfo.token,
            goods_id: that.data.info.goods_id,
            address_id: that.data.addr.id,
            money: that.data.totle_cost,
            remark: that.data.remark,
            convert_no: that.data.info.convert_no,
            num: that.data.num
          };
          util.post(util.url.orderConvert, reqBody, (res) => {
            wx.hideLoading()
            if (res.state == 1) {
              var popup_state = that.data.popup_state
              that.setData({
                popup_state: !popup_state
              })
            } else {
              wx.showToast({
                title: res.info,
                icon: 'none'
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/personal/my_order',
                })
              }, 800)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  select_addr: function () {
    wx.navigateTo({
      url: '/pages/personal/address?source=1000',
    })
  },
  click_order: function () {
    wx.navigateTo({
      url: '/pages/personal/my_order',
    })
  },
  click_index: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 汉服生成订单
  create_order: function () {
    var info = this.data.info
    var reqBody = {
      token: this.data.userInfo.token,
      goods_id: info.id,
      goods_nature: info.goods_nature,
      num: this.data.num
    };
    util.post(util.url.goodsOrder_new, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        this.setData({
          'info.convert_no': res.data.convert_no
        })
        this.payment()
      } else {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})