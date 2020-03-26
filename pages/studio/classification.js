// pages/studio/classification.js
var util = require('../../utils/util.js');
Page({
  data: {
    userinfo: "",
    type: '',
    page: 1,
    page_hd: true,
    cid: "",
    array: [],
    xitong: ''
  },
  onLoad: function (options) {
    var xitong = wx.getStorageSync('xitong');
    this.setData({
      xitong
    })

    var thda = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        if (options.type == 1) {
          thda.setData({
            type: 1,
            userinfo
          });
          thda.hotlist(userinfo)
        } else {
          thda.setData({
            cid: options.cid,
            userinfo
          });
          thda.request(userinfo)
        }
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    });
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  request: function (e, type) {
    var thda = this;
    this.setData({
      page_hd: true
    })
    var reqBody = {
      openid: e.openid,
      cid: parseInt(this.data.cid),
      p: this.data.page,
      num: 10
    };
    util.post(util.url.zx_cateList, reqBody, (data) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      var list = data.list;
      console.log(data.state)
      if (data.state == 1002) {
        if (list.length < 10) {
          thda.setData({
            page_hd: false
          })
        }
        for (var i = 0; i < list.length; i += 1) {
          if (type == 1) {
            list[i].load = true
          } else {
            list[i].load = false
          }
        }
        if (thda.data.page != 1) {
          var a = thda.data.array;
          list = a.concat(list)
        }
        thda.setData({
          array: list
        })
      } else {
        thda.setData({
          page_hd: false
        })
      }
    })
  },
  hotlist: function (e, type) {
    var thda = this;
    var reqBody = {
      openid: e.openid,
      p: this.data.page,
      num: 10
    };
    util.post(util.url.zx_hotlist, reqBody, (data) => {
      this.setData({
        page_hd: true
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      var list = data.data;
      if (data.state == 1002) {
        if (list.length < 10) {
          thda.setData({
            page_hd: false
          })
        }
        for (var i = 0; i < list.length; i += 1) {
          if (type == 1) {
            list[i].load = true
          } else {
            list[i].load = false
          }
        }
        if (thda.data.page != 1) {
          var a = this.data.array;
          list = a.concat(list)
        }
        thda.setData({
          array: list
        })
      } else {
        thda.setData({
          page_hd: false
        })
      }
    })
  },
  click_amount: function (e) {
    var id = e.currentTarget.dataset.id;
    this.Browsing(1, id);
    var title = e.currentTarget.dataset.title;
    wx.setStorage({
      key: "title",
      data: title
    })
  },
  Browsing: function (type, e) {
    var thda = this;
    if (type == 1) {
      var reqBody = {
        gid: e,
        openid: this.data.userinfo.openid
      }
    } else {
      var reqBody = {
        cid: e,
        openid: this.data.userinfo.openid
      }
    }
    util.post(util.url.zx_addView, reqBody, (data) => { })
  },
  imageLoad: function (e) {
    var index = e.currentTarget.dataset.index;
    var array = this.data.array;
    array[index].load = true;
    this.setData({
      array
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    if (this.data.type == 1) {
      this.hotlist(this.data.userinfo, 1)
    } else {
      this.request(this.data.userinfo, 1)
    }
  },
  onReachBottom: function () {
    console.log(this.data.page_hd)
    console.log(this.data.type)
    if (this.data.page_hd) {
      util.showLoading();
      var page = this.data.page + 1;
      this.setData({
        page,
        page_hd: false
      });
      if (this.data.type == 1) {
        this.hotlist(this.data.userinfo)
      } else {
        this.request(this.data.userinfo)
      }
    }
  }
});