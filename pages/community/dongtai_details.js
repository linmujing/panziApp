var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    focus: false,
    show: false,
    comment_reply: '',
    details: [],
    comment: [],
    page: 1,
    comment_id: '',
    Page_slide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      options
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    // 动态详情
    that.getDetail()
    // 评论回复列表
    that.getComment()
  },
  // 动态详情
  getDetail: function(id){
    var that = this
    var reBody = {
      token: that.data.userInfo.token,
      id: that.data.options.id
    };
    util.post(util.url.details, reBody, (res) => {
      if (res.state == 1) {
        that.setData({
          details: res.data,
        })
      }
    })
  },
  // 评论回复列表
  getComment: function (id) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      id: that.data.options.id,
      pageSize: 10,
      pageNumber: that.data.page,
    };
    util.post(util.url.details_comment, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var comment = that.data.comment
        comment = comment.concat(res.data.list);
        that.setData({
          comment: comment,
          page: that.data.page + 1
        })
        // 判断上拉加载
        var leg = that.data.comment.length
        if (leg < res.data.total) {
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
  // 图片预览
  handleImagePreview(e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    const current = e.currentTarget.dataset.current
    // var detail = that.data.detail[id]
    var detail = that.data.details
    wx.previewImage({
      current: detail.images[current], // 当前显示图片的http链接
      urls: detail.images // 需要预览的图片http链接列表
    })
  },

  // 点赞
  click_zan: function (e) {
    // console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.details
    // var type = 'add'
    if (list.my_zan) {
      // type = 'del'
      --list.zan
    } else {
      // type = 'add'
      ++list.zan
    }
    list.my_zan = !list.my_zan
    var userInfo = wx.getStorageSync('userInfo');
    // var id = e.currentTarget.dataset.id

    var reqBody = {
      token: userInfo.token,
      id: list.id,
      type: "zan"
    };
    util.post(util.url.edit_sns, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        // console.log(list)
        that.setData({
          // 'themeData.themeList': list
          details: list
        })
      }
    })
  },
  bindBlur(e) {
    this.setData({
      comment_reply: e.detail.value,
      focus: false,
      show: false
    })
  },
  on_input(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      comment_id: id,
      focus: true,
      show: true
    })
  },
  send_msg: function () {
    var that = this
    var comment_id = that.data.comment_id
    var reqBody = {
      token: that.data.userInfo.token,
      pid: comment_id,
      sns_id: that.data.details.id,
      content: that.data.comment_reply
    };
    util.post(util.url.add_content, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          comment: [],
          page: 1
        })
        that.getComment()
      }
    })
  },
  confirm_send: function(e){
    var msg = e.detail.value
    this.setData({
      comment_reply: msg
    })
    this.send_msg()
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
      comment: [],
      page: 1
    })
    this.getComment()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getComment()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮

      var that = this
      var index = res.target.dataset.index;
      var id = res.target.dataset.id
      console.log(index)
      var list = that.data.details
      console.log(list)
        ++list.share

      var userInfo = wx.getStorageSync('userInfo');
      var id = res.target.dataset.id

      var reBody = {
        token: userInfo.token,
        id: id,
        type: "share"
      };
      util.post(util.url.edit_sns, reBody, (res) => {
        console.log(res)
        if (res.state == 1) {
          // var data = res.data
          that.setData({
            details: list
          })
        }
      })
    }
    return {
      title: this.data.detailData,
      path: 'pages/community/dongtai_details'
    }
  }
})