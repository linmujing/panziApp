// pages/community/community.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: '',
    themeData: {
      navList: [],
      current: 0,
      search: '',
      page: 1,
      themeList: [],
      cid: ''
    },
    Page_slide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 分类列表
    // var reqBody = {
    //   token: userInfo.token
    // };
    // util.post(util.url.category, reqBody, (res) => {
    //   console.log(res)
    //   if (res.state == 1) {
    //     wx.setNavigationBarTitle({
    //       title: res.data.title
    //     })
    //     var list = that.data.themeData.navList
    //     list = list.concat(res.data);
    //     that.getThemeList()
    //     that.setData({
    //       banner: res.banner,
    //       'themeData.navList': list
    //     })
    //   }
    // })

  },

  // 顶部搜索
  blur_search: function (e) {
    this.setData({
      'themeData.search': e.detail.value
    })
  },
  confirm_search: function () {
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': '',
      'themeData.current': 0
    })
    this.getThemeList()
  },

  // 加载列表数据
  getThemeList: function () {
    var userInfo = this.data.userInfo;
    var that = this
    console.log(that.data.themeData.page)
    var reqBody = {
      token: userInfo.token,
      pageSize: 5,
      pageNumber: that.data.themeData.page,
      searchText: that.data.themeData.search,
      // pageNum: that.data.themeData.page,
      // seach: that.data.themeData.search,
      // cid: that.data.themeData.cid
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.index_list, reqBody, (res) => {
      console.log(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].check = false
        }
        var list = that.data.themeData.themeList
        list = list.concat(res.data);
        console.log(list)
        that.setData({
          'themeData.themeList': list,
          'themeData.page': that.data.themeData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.themeData.themeList.length
        console.log(leg)
        // if (leg < res.count) {
        if (leg < 100) {
          console.log('可以')
          that.setData({
            Page_slide: true,
            // 'themeData.page': that.data.themeData.page + 1
          })
        } else {
          console.log('不可以')
          that.setData({
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
    var detail = that.data.themeData.themeList[id]
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
    var list = that.data.themeData.themeList
    // var type = 'add'
    if (list[index].my_zan) {
      // type = 'del'
      --list[index].zan
    } else {
      // type = 'add'
      ++list[index].zan
    }
    list[index].my_zan = !list[index].my_zan
    var userInfo = that.data.userInfo;
    // var id = e.currentTarget.dataset.id

    var reqBody = {
      token: userInfo.token,
      id: list[index].id,
      type: "zan"
    };
    util.post(util.url.edit_sns, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        // console.log(list)
        that.setData({
          'themeData.themeList': list
          // zan: res.data.zan
          // detail: list
        })
      }
    })
  },

  // 跳转发布动态页面
  link_to: function () {
    wx.navigateTo({
      url: './release'
    })
  },

  // 跳转动态详情页面
  link_details(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './dongtai_details?id=' + id
    })
  },
  // 跳转搜索页面
  // link_search() {
  //   wx.navigateTo({
  //     url: './search'
  //   })
  // },

  // 删除动态
  close: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var oldarr = this.data.detail
    oldarr.splice(index, 1);
    if (oldarr.length < 1) {
      // oldarr = [0] //如果循环内容长度为0即删完了，必须要留一个默认的。这里oldarr只要是数组并且长度为1，里面的值随便是什么
    }
    this.setData({
      detail: oldarr
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
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1
    })
    that.getThemeList()
    // 获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // winHeight: res.windowHeight - 100
          winHeight: res.windowHeight - 10
        });
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
    console.log('下拉')
    this.setData({
      'themeData.search': '',
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': '',
      'themeData.current': 0
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
      var list = that.data.themeData.themeList
      console.log(list)
        ++list[index].share

      var userInfo = that
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
            'themeData.themeList': list
          })
        }
      })
    }
    return {
      title: this.data.detailData,
      path: 'pages/community/community'
    }
  }
})