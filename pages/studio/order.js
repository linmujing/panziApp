// pages/studio/order.js
let util = require('../../utils/util.js');
Page({
  data: {
    page_h: 0,
    page_top: 0,
    userinfo: '',
    array: [],
    page: 1,
    pagezt: false,
    page_hd: true
  },
  onLoad: function (options) {

    this.cache();
    var thda = this;
    wx.getSystemInfo({
      success: function (res) {
        thda.setData({
          page_h: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.order_list(userinfo);
        thda.setData({
          userinfo
        })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  },
  onReady: function () {
    var thda = this;
    var query = wx.createSelectorQuery();
    if (this.data.array.length) {
      setTimeout(function () {
        query.select('.list_nr').boundingClientRect(function (rect) {
          if (rect.width) {
            thda.setData({
              grzx_liw: rect.width
            });
          }
        }).exec()
      }, 200)
    }
  },
  click: function (e) {
    var title = e.currentTarget.dataset.title;
    wx.setStorage({
      key: "title",
      data: title
    })
  },
  cache: function () {
    var that = this;
    wx.getStorage({
      key: 'personal',
      success: function (res) {
        that.setData({
          array: res.data
        })
      }
    })
  },
  order_list: function (e) {
    var reqBody = {
      openid: e.openid,
      page: this.data.page
    };
    util.post(util.url.zx_orderList, reqBody, (data) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      if (data.state == 1002) {
        if (data.data.length > 10) {
          this.setData({
            page_hd: false
          })
        }
        if (this.data.page > 1) {
          var a = this.data.array;
          a = a.concat(data.data);
          this.setData({
            array: a
          })
        } else {
          wx.setStorage({
            key: "personal",
            data: data.data
          });
          this.setData({
            array: data.data
          })
        }
      } else {
        if (this.data.page == 1) {
          this.setData({
            array: []
          });
          wx.setStorage({
            key: "personal",
            data: []
          })
        }
        this.setData({
          page_hd: false
        })
      }
    })
  },
  onShow: function () {
    if (this.data.pagezt) {
      this.order_list(this.data.userinfo)
    }
    this.setData({
      pagezt: true
    })
  },
  onPullDownRefresh: function () {
    console.log(this.data.page_hd)
    if (this.data.page_hd && !this.data.kf_state) {
      this.setData({
        page_hd: true,
        page: 1
      });
      this.order_list(this.data.userinfo)
    }
  },
  onReachBottom: function () {
    if (this.data.page_hd && this.data.array.length >= 10 && !this.data.kf_state) {
      var page = this.data.page + 1;
      this.setData({
        page
      });
      this.order_list(this.data.userinfo)
    }
  },
  touchS: function (e) {
    var thda = this;
    if (!thda.data.grzx_liw) {
      var query = wx.createSelectorQuery();
      query.select('.list_nr').boundingClientRect(function (rect) {
        //console.log(rect.width)
        if (rect.width) {
          thda.setData({
            grzx_liw: rect.width
          });
        }
      }).exec()
    }
    var hdid = e.currentTarget.dataset.id
    var hdx = e.changedTouches[0].pageX
    this.setData({
      hdid,
      hdx
    })
  },
  touchM: function (e) {
    var id = e.currentTarget.dataset.id;
    var x = e.changedTouches[0].pageX;
    if (this.data.hdid === id && this.data.hdx > (x + 60)) {
      //console.log('开启滑动')
    }
  },
  touchE: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var x = e.changedTouches[0].pageX;
    if (this.data.hdid === id && this.data.hdx > (x + 60)) {
      //console.log('开启滑动');
      var array = this.data.array;
      for (var i = 0; i < array.length; i++) {
        if (index != i) {
          array[i].mal = false
        }
      }
      array[index].mal = true
      this.setData({
        array
      })
    } else if (this.data.hdid === id && this.data.hdx < x) {
      var array = this.data.array;
      array[index].mal = false
      this.setData({
        array
      })
    }
  },
  deletings: function (e) {
    var thda = this;
    //console.log('删除')
    wx.showModal({
      content: "确定删除订单",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          var id = e.currentTarget.dataset.id;
          var index = e.currentTarget.dataset.index;

          thda.Remove(index, id);
          var array = thda.data.array;
          array[index].mal = false
          thda.setData({
            array
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
          var array = thda.data.array;
          for (var i = 0; i < array.length; i++) {
            array[i].mal = false
          }
          thda.setData({
            array
          })
        }
      }
    })
  },
  Remove: function (index, e) {

    var thda = this;
    var array = this.data.array;
    var userinfo = this.data.userinfo
    var reqBody = {
      oid: e,
      openid: userinfo.openid
    };
    util.post(util.url.zx_delOrder, reqBody, (data) => {
      if (data.state == 1002) {
        if (index > -1) {
          array.splice(index, 1);
        }
        thda.setData({
          array
        })
        if (this.data.array.length == 0) {
          this.order_list(this.data.userinfo);
        }
        setTimeout(function () {
          wx.showToast({
            title: "删除成功",
            duration: 800
          })
        }, 200);
      } else {
        setTimeout(function () {
          wx.showToast({
            image: '/image/cancel.png',
            title: "删除失败",
            duration: 800
          })
        }, 200);
      }
    })
  },
  customer_service_start: function (e) {
    this.setData({
      kf_state: true
    })
    var query = wx.createSelectorQuery();
    var that = this;
    //获取客服/面页大小
    query.select('.customer_service').boundingClientRect(function (rect) {
      that.setData({
        kfwh: rect.height
      })
    }).exec();
    wx.stopPullDownRefresh();
    console.log('开始');
  },
  drag_service: function (e) {//拖动客服
    var kfwh = this.data.kfwh;
    var Y = e.touches[0].clientY;
    wx.stopPullDownRefresh();
    console.log(e.touches[0])

    if (Y + 60 <= (this.data.page_h) && Y > 20) {
      this.setData({
        page_top: Y
      })
    }
  },
  drag_service_end: function (e) {
    wx.stopPullDownRefresh();
    var thda = this;
    console.log('结束')
    setTimeout(function () {
      thda.setData({
        kf_state: false
      })
    }, 200)
  }

});