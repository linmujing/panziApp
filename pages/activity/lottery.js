var util = require('../../utils/util.js');
const app = getApp()
// 上下文对象
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play: false, // 是否在运动中，避免重复启动bug
    available_num: 3, // 可用抽奖的次数，可自定义设置或者接口返回
    start_angle: 0, // 转动开始时初始角度=0位置指向正上方，按顺时针设置，可自定义设置
    base_circle_num: 9, // 基本圈数，就是在转到（最后一圈）结束圈之前必须转够几圈 ，可自定义设置
    low_circle_num: 5, // 在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
    add_angle: 10, // 追加角度，此值越大转动越快，请保证360/add_angle=一个整数，比如1/2/3/4/5/6/8/9/10/12等
    use_speed: 1, // 当前速度，与正常转速值相等
    nor_speed: 1, // 正常转速，在减速圈之前的转速，可自定义设置
    low_speed: 15, // 减速转速，在减速圈的转速，可自定义设置
    end_speed: 25, // 最后转速，在结束圈的转速，可自定义设置
    random_angle: 20, // 中奖角度，也是随机数，也是结束圈停止的角度，这个值采用系统随机或者接口返回
    change_angle: 0, // 变化角度计数，0开始，一圈360度，基本是6圈，那么到结束这个值=6*360+random_angle；同样change_angle/360整除表示走过一整圈
    result_val: "未中奖", // 存放奖项容器，可自定义设置
    Jack_pots: [ // 奖项区间 ，360度/奖项个数 ，一圈度数0-360，可自定义设置
      // random_angle是多少，在那个区间里面就是中哪个奖项
      {
        startAngle: 1,
        endAngle: 40,
        val: "阿玛尼粉底液"
      },
      {
        startAngle: 41,
        endAngle: 82,
        val: "50积分"
      },
      {
        startAngle: 83,
        endAngle: 121,
        val: "故宫冰箱贴"
      },
      {
        startAngle: 122,
        endAngle: 162,
        val: "故宫眼影刷"
      },
      {
        startAngle: 163,
        endAngle: 203,
        val: "完美日记唇釉"
      },
      {
        startAngle: 204,
        endAngle: 244,
        val: "谢谢参与"
      },
      {
        startAngle: 245,
        endAngle: 286,
        val: "花西子化妆棉"
      },
      {
        startAngle: 287,
        endAngle: 322,
        val: "故宫帆布包"
      },
      {
        startAngle: 323,
        endAngle: 360,
        val: "香奈儿发香雾"
      }
    ],
    isPrize: null, //是否中奖
    hasPrize: null, //是否中奖
    gzShow: false,
    prizeShow: false,
    contentList: [],
    listI: -1,
    content: {
      name: "Sunny",
      goods_name: "香奈儿发香雾"
    },
    prize_angle: 0,
    myjf: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    setInterval(() => {
      that.update(this.getListInfo())
    }, 3000)
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    that.getData()
  },


  getData() {
    var reqBody = {
      token: this.data.userInfo.token,
      cid: 13
    };

    util.post(util.url.dial_list, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        that.setData({
          contentList: res.order_list,
          myjf: res.cost
        })
        // wx.navigateTo({
        //   url: 'order?id=' + res.data.order_id,
        // })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 抽奖
  getCj() {

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reqBody = {
      token: this.data.userInfo.token,
      cid: 13
    };

    util.post(util.url.getcj, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        that.getData()
        if (res.goods_name == "谢谢参与") {
          that.setData({
            isPrize: false,
            hasPrize: false
          })
        } else {
          that.setData({
            isPrize: true,
            hasPrize: true
          })
        }
        if (res.goods_name == "谢谢参与") {
          that.setData({
            prize_angle: 220
          })
        } else if (res.goods_name == "阿玛尼粉底液") {
          that.setData({
            prize_angle: 20
          })
        } else if (res.goods_name == "50积分") {
          that.setData({
            prize_angle: 60,
            hasPrize: true,
            isPrize: false
          })
        } else if (res.goods_name == "故宫冰箱贴") {
          that.setData({
            prize_angle: 100
          })
        } else if (res.goods_name == "故宫眼影刷") {
          that.setData({
            prize_angle: 140
          })
        } else if (res.goods_name == "完美日记唇釉") {
          that.setData({
            prize_angle: 180
          })
        } else if (res.goods_name == "花西子化妆棉") {
          that.setData({
            prize_angle: 260
          })
        } else if (res.goods_name == "故宫帆布包") {
          that.setData({
            prize_angle: 300
          })
        } else if (res.goods_name == "香奈儿发香雾") {
          that.setData({
            prize_angle: 340
          })
        }
        if (res.order_id) { //实物生成订单
          that.setData({
            orderId: res.order_id
          })
        }
        that.luckDrawStart()
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },



  // 抽奖记录&我的奖品
  linkHistory(e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: 'lottery_ history?type=' + type,
    })
  },

  // 再来一次
  again_prize() {
    that.setData({
      prizeShow: false
    })
  },

  // 立即领取
  receive_prize() {
    var orderId = that.data.orderId
    wx.navigateTo({
      url: '/pages/index/order?id=' + orderId + '&types=8080',
    })
  },

  prize_close() {
    that.setData({
      prizeShow: false
    })
  },


  /**
   * 启动抽奖
   */
  luckDrawStart: function () {
    // 阻止运动中重复点击
    if (!that.data.is_play) {
      // 设置标识在运动中
      that.setData({
        is_play: true
      });
      // 重置参数
      that.luckDrawReset();

      console.log(that.data.prize_angle)
      that.setData({
        // random_angle: Math.ceil(Math.random() * 360)
        random_angle: that.data.prize_angle
      });
      // 运动函数
      setTimeout(that.luckDrawChange, that.data.use_speed);
    };
  },
  /**
   * 转盘运动
   */
  luckDrawChange: function () {
    // 继续运动
    if (that.data.change_angle >= that.data.base_circle_num * 360 + that.data.random_angle) { // 已经到达结束位置
      // 提示中奖，
      setTimeout(function () {
        that.getLuckDrawResult();
      }, 500)
      // 运动结束设置可用抽奖的次数和激活状态设置可用
      that.luckDrawEndset();
    } else { // 运动
      if (that.data.change_angle < that.data.low_circle_num * 360) { // 正常转速
        // console.log("正常转速")
        that.data.use_speed = that.data.nor_speed
      } else if (that.data.change_angle >= that.data.low_circle_num * 360 && that.data.change_angle <= that.data.base_circle_num * 360) { // 减速圈
        // console.log("减速圈")
        that.data.use_speed = that.data.low_speed
      } else if (that.data.change_angle > that.data.base_circle_num * 360) { // 结束圈
        // console.log("结束圈")
        that.data.use_speed = that.data.end_speed
      }
      // 累加变化计数
      that.setData({
        change_angle: that.data.change_angle + that.data.add_angle >= that.data.base_circle_num * 360 + that.data.random_angle ? that.data.base_circle_num * 360 + that.data.random_angle : that.data.change_angle + that.data.add_angle
      });
      setTimeout(that.luckDrawChange, that.data.use_speed);
    }

  },

  /**
   * 重置参数
   */
  luckDrawReset: function () {
    // 转动开始时首次点亮的位置，可自定义设置
    that.setData({
      start_angle: 0
    });
    // 当前速度，与正常转速值相等
    that.setData({
      use_speed: that.data.nor_speed
    });
    // 中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
    that.setData({
      random_angle: 0
    });
    // 变化计数，0开始，必须实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
    that.setData({
      change_angle: 0
    });
  },

  /**
   * 获取抽奖结果
   */
  getLuckDrawResult: function () {
    for (var j = 0; j < that.data.Jack_pots.length; j++) {
      if (that.data.random_angle >= that.data.Jack_pots[j].startAngle && that.data.random_angle <= that.data.Jack_pots[j].endAngle) {
        that.setData({
          result_val: that.data.Jack_pots[j].val,
          prizeShow: true
        });
        // wx.showModal({
        //   title: '抽奖结果',
        //   content: that.data.Jack_pots[j].val,
        // })
        break;
      };
    };
  },

  /**
   * 更新状态（运动结束设置可用抽奖的次数和激活状态设置可用）
   */
  luckDrawEndset: function () {
    // 是否在运动中，避免重复启动bug
    that.setData({
      is_play: false
    })
    // 可用抽奖的次数，可自定义设置
    that.setData({
      available_num: that.data.available_num - 1
    });
  },

  openGz() {
    that.setData({
      gzShow: true
    })
  },
  closeGz() {
    that.setData({
      gzShow: false
    })
  },


  // 通知栏
  update(content) {
    var that = this
    var animation = wx.createAnimation()
    // 旧消息向上平移
    animation.translateY(-30).step({
      duration: 1000,
      timingFunction: 'ease-in'
    })
    // 为了实现下一条新内容向上平移的效果，必须把内容很快平移到下方，并且不能被用户看见，这里其原理类似轮播图的思路。
    // 实现方法：动画时间设置为1ms，过渡效果设置为’动画第一帧就跳至结束状态直到结束‘
    animation.opacity(0).translateY(30).step({
      duration: 1,
      timingFunction: 'step-start'
    })
    // 新消息向上平移的同时恢复透明
    animation.opacity(1).translateY(0).step({
      duration: 1000,
      timingFunction: 'ease-out'
    })
    that.setData({
      animationData: animation.export()
    })
    // 更新内容的延时必须大于第一步动画时间
    setTimeout(() => {
      that.setData({
        content: content
      })
    }, 4000)
  },

  // 获取通知栏消息
  getListInfo() {
    if (this.data.listI >= this.data.contentList.length - 1) {
      this.data.listI = -1
      this.getListInfo()
    } else {
      this.data.listI++
    }
    return this.data.contentList[this.data.listI]
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