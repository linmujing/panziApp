var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    show: false,
    comment_reply: '',
    details: [],
    // details: {
    //   headerUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146046871,2611785107&fm=27&gp=0.jpg",
    //   name: "我是昵称",
    //   time: "07:49",
    //   content: "的身份绝对是决定是否看活动时间何带上几点开始对接凤凰军事开发诞节和杀害读书电话黑客技术很疯狂的手机号",
    //   bigUrl: ["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg", "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1752243568,253651337&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=123807196,3598291508&fm=27&gp=0.jpg"],
    //   zhuanfa: 299,
    //   huifu: 613,
    //   dianzan: 218,
    //   hasChange: false
    // },
    comment: [{
        headerUrl: "../../img/header.png",
        name: "我是昵称",
        content: "哇！你在哪里拍的？真好看",
        huifu: [{
          Comment_title: "麻花晶",
          Comment_text: "这个看起来像盘子女人坊",
        }, {
          Comment_title: "李大海",
          Comment_text: "我也觉得是",
        }],
        time: "4-9",
      },
      {
        headerUrl: "../../img/header.png",
        name: "我是昵称",
        content: "哇！你在哪里拍的？真好看",
        Comment_title: "草原没有海",
        Comment_text: "这个看起来像盘子女人坊",
        time: "4-9"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var id = options.id
    var userInfo = wx.getStorageSync('userInfo');

    // 动态详情
    var reBody = {
      token: userInfo.token,
      id: id
    };
    util.post(util.url.details, reBody, (res) => {
      // console.log(res)
      if (res.state == 1) {
        var list = that.data.details
        // list = list.concat(res.data);
        list = res.data;
        console.log(list)
        that.setData({
          // details: list
          details: list,
        })
      }
    })

    // 评论回复列表
    var reqBody = {
      token: userInfo.token,
      id: id,
      pageSize: 3,
      pageNumber: 1,
    };
    util.post(util.url.details_comment, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        var list = res.data
        this.setData({
          comment: list
        })
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
    // console.log(e)
    this.setData({
      comment_reply: e.detail.value,
      focus: false,
      show: false
    })
  },
  on_input(e) {
    console.log(e)
    this.setData({
      focus: true,
      show: true
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