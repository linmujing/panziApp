// pages/community/community.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: '',
    currentTab: 0,
    navScrollLeft: 0,
    show: false,
    goodsData: [{
      name: '热门',
      type: 1,
    }, {
      name: '关注',
      type: 2,
      detail: []
    }, {
      name: '影视',
      type: 3,
      detail: []
    }, {
      name: '客片',
      detail: []
    }, {
      name: '变装',
      detail: []
    }, {
      name: '同城',
      detail: []
    }, {
      name: '门店',
      detail: []
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取设备可视窗口高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // winHeight: res.windowHeight - 100
          winHeight: res.windowHeight - 10
        });
      }
    })
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    var reqBody = {
      token: userInfo.token
    };
    util.post(util.url.category, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        // wx.setNavigationBarTitle({
        //   title: res.data.title
        // })
        // var list = that.data.themeData.navList
        // list = list.concat(res.data);
        // that.getThemeList()
        // that.setData({
        //   banner: res.banner,
        //   'themeData.navList': list
        // })
      }
    })

    var reBody = {
      token: userInfo.token,
      pageSize: 8,
      pageNumber: 1,
      // searchText: '社区',
      // category_id: 1
    };
    util.post(util.url.index_list, reBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        var list = res.data
        that.setData({
          detail: list
        })
      }
    })
  },



  // that.detail = [{
  //     headerUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146046871,2611785107&fm=27&gp=0.jpg",
  //     name: "我是昵称",
  //     time: "07:49",
  //     content: "的身份绝对是决定是否看活动时间何带上几点开始对接凤凰军事开发诞节和杀害读书电话黑客技术很疯狂的手机号",
  //     bigUrl: ["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg", "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1752243568,253651337&fm=27&gp=0.jpg"],
  //     zhuanfa: 299,
  //     huifu: 613,
  //     dianzan: 218,
  //     'hasChange': false
  //   },
  //   {
  //     headerUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146046871,2611785107&fm=27&gp=0.jpg",
  //     name: "我是昵称",
  //     time: "07:49",
  //     content: "的身份绝对是决定是否看活动时间何带上几点开始对接凤技术撒 打死奥斯卡的撒卡是和 爱就是核算黑客技术很疯狂的手机号",
  //     bigUrl: ["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg", "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1752243568,253651337&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=123807196,3598291508&fm=27&gp=0.jpg"],
  //     zhuanfa: 299,
  //     huifu: 613,
  //     dianzan: 200,
  //     'hasChange': false
  //   }
  // ]
  // that.setData({
  //   detail: this.detail
  // })



  // 点赞
  // praiseThis: function (e) {
  //   console.log(e)
  //   var index = e.currentTarget.dataset.curindex;
  //   console.log(index)
  //   if (this.detail[index]) {
  //     var hasChange = this.detail[index].hasChange;
  //     if (hasChange !== undefined) {
  //       var onum = this.detail[index].dianzan;
  //       if (hasChange) {
  //         this.detail[index].dianzan = (onum - 1);
  //         this.detail[index].hasChange = false;
  //       } else {
  //         this.detail[index].dianzan = (onum + 1);
  //         this.detail[index].hasChange = true;
  //       }
  //       this.setData({
  //         detail: this.detail
  //       })
  //     }
  //   }
  // },


  // 预览图片
  toIndex(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    this.setData({
      ID: id
    })
  },

  handleImagePreview(e) {
    var id = this.data.ID
    const index = e.currentTarget.dataset.index
    console.log(index)
    var detail = this.data.detail[id]
    wx.previewImage({
      current: detail.bigUrl[index], // 当前显示图片的http链接
      urls: detail.bigUrl // 需要预览的图片http链接列表
    })
  },

  // 顶部导航切换
  switchNav(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 详情页内容滑动
  houseChange(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },

  // 转发功能
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {}
    return {
      title: '转发',
      path: '/pages/community/community',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  // 跳转动态详情页面
  link_details(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './dongtai_details?id=' + id
    })
  },
  // 跳转搜索页面
  link_search() {
    wx.navigateTo({
      url: './search'
    })
  },
  // 跳转发布动态页面
  link_to: function () {
    wx.navigateTo({
      url: './release'
    })
  },
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})