Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {
      headerUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146046871,2611785107&fm=27&gp=0.jpg",
      name: "我是昵称",
      time: "07:49",
      content: "的身份绝对是决定是否看活动时间何带上几点开始对接凤凰军事开发诞节和杀害读书电话黑客技术很疯狂的手机号",
      bigUrl: ["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg", "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1752243568,253651337&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg", "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=123807196,3598291508&fm=27&gp=0.jpg"],
      zhuanfa: 299,
      huifu: 613,
      dianzan: 218,
      hasChange: false
    },
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