// pages/studio/share.js
var util = require('../../utils/util.js');
Page({
  data: {
    pgae_state: false,
    hcimg: '',
    list: []
  },
  onLoad: function (options) {
    this.setData({
      hcimg: options.hcimg
    });
    this.hotlist()
  },
  // onReady: function(){
  //   console.log(1)
  //   this.setData({
  //     pgae_state: true
  //   })
  // },
  // onShow: function(){
  //   console.log(this.data.pgae_state)
  //   if (this.data.pgae_state){
  //     wx.switchTab({
  //       url: '../home/index'
  //     })
  //   }else{

  //   }
  // },
  hotlist: function (e, type) {
    var thda = this;
    var reqBody = {};
    util.post(util.url.zx_hotlistr, reqBody, (data) => {
      if (data.state == 1002) {
        let list = data.data;
        thda.setData({
          list
        })
      }
    })
  },
  click_huanzhuan: function (e) {
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo.openid) {
      wx.navigateTo({
        url: '/pages/studio/index'
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  },
  click_material: function (e) {
    console.log(e.currentTarget.dataset)
    var e = e.currentTarget.dataset;
    var scid = e.scid;
    var scimg = e.scimg;
    var cid = e.cid;
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo.openid) {
      wx.navigateTo({
        url: '/pages/studio/material?scid=' + scid + '&scimg=' + scimg + '&cid=' + cid
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

});