// pages/personal/my_fabu.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData: {
      navList: [],
      current: 0,
      search: '',
      page: 1,
      themeList: [],
      cid: ''
    },
    Page_slide: true,
    stimg: app.globalData.imgUrl + 'noSt.png',
    // 分享朋友圈
    share: {
      img: '',
      state: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getThemeList()
  },

  // 加载列表数据
  getThemeList: function () {
    var that = this
    var userInfo = that.data.userInfo;
    var reqBody = {
      token: userInfo.token,
      pageSize: 10,
      pageNumber: that.data.themeData.page
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.my_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.themeData.themeList
        list = list.concat(res.data.list);
        that.setData({
          'themeData.themeList': list,
          'themeData.page': that.data.themeData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.themeData.themeList.length
        if (leg < res.data.total) {
          that.setData({
            Page_slide: true
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      }
    })
  },

  delate(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确定删除？',
      success(res) {
        if (res.confirm) {
          const id = e.currentTarget.dataset.id
          var userInfo = wx.getStorageSync('userInfo');
          var reBody = {
            token: userInfo.token,
            id: id
          }
          util.post(util.url.del_sns, reBody, (res) => {
            if (res.state == 1){
              wx.showToast({
                title: '删除成功~',
                icon: 'none',
                duration: 1000
              })
              that.setData({
                'themeData.themeList': [],
                'themeData.page': 1,
              })
              that.getThemeList()
            }else{
              wx.showToast({
                title: res.info,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/community/dongtai_details?id=' + id
    })
  },
  click_fabu: function () {
    wx.navigateTo({
      url: '/pages/community/release',
    })
  },
  getShareCode: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reBody = {
      token: that.data.userInfo.token,
      id:id
    };
    util.post(util.url.shareCode, reBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        var list = []
        list.push(res.data)
        wx.previewImage({
          current: list[0], // 当前显示图片的http链接
          urls: list // 需要预览的图片http链接列表
        })
        wx.showToast({
          title: '长按图片保存~',
          icon: 'none',
          duration: 5000
        })
        var param = {
          token: that.data.userInfo.token,
          id: id,
          type: "share"
        };
        util.post(util.url.edit_sns, param, (res) => {})
      }
      wx.hideLoading()
    })
  },
  close_share: function (id) {
    this.setData({
      'share.state': true
    })
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
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1,
    })
    this.getThemeList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getThemeList()
    }
  },

})