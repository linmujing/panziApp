// pages/index/my_photos.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [],
    imgDatas: [],
    imgArr: [],
    allCheck: false,
    percent_n: 0,
    preview: {
      preview_state: true,
      btn_state: false,
      imgSrc: '',
      num: 0
    },
    order: '',
    survey: {
      popup_state: false,
    },
    total: {
      one: 0,
      two: 5
    },
    gradeList: [{
        title: '摄影服务',
        one: 0,
        two: 5
      },
      {
        title: '化妆服务',
        one: 0,
        two: 5
      },
      {
        title: '数码服务',
        one: 0,
        two: 5
      },
      {
        title: '选片体验',
        one: 0,
        two: 5
      },
      {
        title: '产品品质',
        one: 0,
        two: 5
      },
      {
        title: '服务态度',
        one: 0,
        two: 5
      },
    ],
    radioData: [{
        name: '是',
        value: 1
      },
      {
        name: '否',
        value: 2
      }
    ],
    intro: '',
    advise: '',
    page: 1,
    Page_slide: true,
    video: {},
    number: 0,
    down_state: true,
    video_state: true,
    current: 0,
    notes: {
      txt: "因底片占用空间大，为防止遗失，请您在收到产品后，90天内完成底片下载，感谢您的配合，谢谢！",
      state: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight - 40
        });
      },
    })
    that.setData({
      options: options
    })
    that.yzsurvey()
    that.getList()
  },

  close_notes: function () {
    this.setData({
      'notes.state': true
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
  click_myMovie: function () {
    wx.navigateTo({
      url: '/pages/index/myMovies',
    })
  },

  // 跳转P图高手
  click_ptgs(){
    wx.navigateToMiniProgram({
      appId: 'wx670c2bb8bbc0d58f',
      path: 'pages/index/index',
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

 // 领取优惠券
 getCoupon: function () {
  var that = this
  var userInfo = wx.getStorageSync('userInfo');
  console.log(userInfo)
  var reqBody = {
    token: userInfo.token,
    discount: 1,
    unionId: userInfo.unionId,
    // unionId: "",
    tel: userInfo.tel
  };
  util.post(util.url.acquire, reqBody, (res) => {
    if (res.state == 1) {
      wx.showToast({
        title: res.info,
        icon: "none",
        duration: 2000,
      })
      setTimeout(function(){
        that.click_ptgs()
      },2000)
    }else if (res.state == -1) {
      wx.clearStorageSync()
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    else{
      wx.showToast({
        title: res.info,
        icon: "none",
        duration: 1000,
      })
    }
  })
},


  yzsurvey: function () {
    var that = this
    var reqBody = {
      order: that.data.options.order
    };
    util.post(util.url.yzsurvey, reqBody, (res) => {
      if (res.state == 0) {
        that.setData({
          'survey.popup_state': false
        })
      }
    })
  },
  getList: function () {
    var that = this
    var reqBody = {
      order: that.data.options.order,
      tel: that.data.options.tel,
      ems: that.data.options.ems,
      // order: '2019071500055',
      // tel: '18774092987',
      // order: 'NB0419103',
      // tel: '13456107212',
      // order: 'Abc9999999999',
      // tel: '18774092987',
      // pageNumber: that.data.page,
      // pageSize: 10
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.wx_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.code == 1) {
        // if (that.data.page == 1){
        //   that.setData({
        //     'survey.popup_state': false
        //   })
        // }
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].check = false
        }
        // var list = that.data.imgData
        // list = list.concat(res.data.list);
        if (that.data.page == 1) {
          that.setData({
            video: res.data.video,
            number: res.data.number
          })
        }
        that.setData({
          imgDatas: res.data.list,
          imgData: res.data.list.slice(0, 10),
          page: that.data.page + 1,
          allCheck: false,
          content: res.data.content
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 1000,
          success(res) {
            setTimeout(function () {
              wx.navigateBack();
            }, 1000)
          }
        })
      }
    })
  },
  // 分页
  paging: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var imgData = that.data.imgData
    var imgDatas = that.data.imgDatas
    if (imgData.length == imgDatas.length) {
      this.setData({
        Page_slide: false
      })
    } else {
      that.setData({
        Page_slide: true,
        imgData: imgDatas.slice(0, imgData.length + 10),
        allCheck: false
      })
    }
    setTimeout(function () {
      wx.hideLoading();
    }, 800)
  },
  checkboxChange(e) {
    var checkArr = e.detail.value
    var imgData = this.data.imgData
    var imgArr = []
    for (var i = 0; i < imgData.length; i++) {
      imgData[i].check = false
      for (var j = 0; j < checkArr.length; j++) {
        if (checkArr[j] == i) {
          imgData[i].check = true
          imgArr.push(imgData[i].img)
        }
      }
    }
    var len = this.data.imgData.length
    var allCheck = false
    if (checkArr.length == len) {
      allCheck = true
    } else {
      allCheck = false
    }
    this.setData({
      imgArr: imgArr,
      imgData: imgData,
      allCheck: allCheck
    })
  },
  // 全选
  checkboxAll(e) {
    var allCheck = this.data.allCheck
    var imgData = this.data.imgData
    var lists = []
    for (var i = 0; i < imgData.length; i++) {
      if (!allCheck) {
        imgData[i].check = true
        lists.push(imgData[i].img)
      } else {
        imgData[i].check = false
        lists = []
      }

    }
    this.setData({
      allCheck: !allCheck,
      imgData: imgData,
      imgArr: lists
    })
  },
  // 预览图片
  previewImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var imgData = that.data.imgData
    console.log(index)
    that.setData({
      'preview.preview_state': false,
      'preview.imgSrc': imgData[index].img,
      'preview.url': imgData[index].url,
      'preview.num': imgData[index].count,
      current: index
    })

    // var lists = []
    // for (var i = 0; i < imgData.length; i++) {
    //   lists.push(imgData[i].img)
    // }
    // wx.previewImage({
    //   current: lists[index], // 当前显示图片的http链接
    //   urls: lists // 需要预览的图片http链接列表
    // })
  },
  hide: function (e) {
    this.setData({
      'preview.preview_state': true,
      'preview.imgSrc': ''
    })
  },
  // 下载图片
  downloadImg(src, index, total, callback) {
    var that = this
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    const downloadTask = wx.downloadFile({
      url: src,
      success: function (res) {
        var temp = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: temp,
          success: function () {},
          fail: function () {
            wx.showToast({
              title: '第' + index + '下载失败',
              icon: "none",
              mask: true
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '下载失败',
          icon: "none"
        })
      }
    })

    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '下载进度' + res.progress + '%',
        mask: true
      })
      if (res.progress == 100) {
        callback(res.progress);
        var count = that.data.percent_n; //统计下载多少次了
        that.setData({
          percent_n: count + 1
        })
        if (that.data.percent_n == total) { //判断是否下载完成
          that.setData({ //完成后，清空percent-N,防止多次下载后，出错
            percent_n: 0
          })
        }
      }
    })

  },
  // 保存缩略图
  savePic: function () {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        // 用户已经同意小程序使用相册的授权
        wx.showToast({
          title: "图片保存中……",
          icon: 'loading',
          duration: 2000,
          mask: true
        });
        this.down_thumbnail(0)
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '获取授权失败',
        })
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              that.setData({
                down_state: false
              })
            }
          }
        })
      }
    })

  },
  down_thumbnail: function (i) {
    var that = this
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    var data = that.data.imgArr
    var all_n = data.length;
    if (i < all_n) {
      const downloadTask = wx.downloadFile({
        url: data[i],
        success: function (res) {
          var temp = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function () {
              wx.showLoading({
                title: '第' + (i + 1) + '张保存成功',
                mask: true
              })
              that.down_thumbnail(i + 1);
            },
            fail: function () {
              wx.showLoading({
                title: '第' + (i + 1) + '张保存失败',
                mask: true
              })
              that.down_thumbnail(i);
            }
          })
        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: '获取图片临时路径失败',
          })
        }
      })

      downloadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: i + '/' + all_n + '下载至' + res.progress + '%',
          mask: true
        })
      })
    } else {
      wx.showToast({
        title: '下载完成',
        duration: 1000
      })
      that.downloadnum()
      setTimeout(function () {
        wx.switchTab({
          url: 'index'
        })
      }, 2000)
    }

  },
  click_close: function () {
    this.setData({
      'survey.popup_state': true
    })
  },
  // 统计下载次数
  downloadnum: function () {
    var reqBody = {
      order: this.data.options.order,
      tel: this.data.options.tel
    };
    util.post(util.url.downloadnum, reqBody, (res) => {
      if (res.code == 1) {}
    })
  },
  judgeWifi: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.getConnectedWifi({
      success(res) {
        that.save_gqImg(index)
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '您当前的网络是4G网络，是否确认用4G网络下载高清图？(ps:高清图建议连接wifi后下载哦~)',
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.save_gqImg(index)
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  // 高清图统计下载次数
  downloadgqnum: function (url, type) {
    var reqBody = {
      order: this.data.options.order,
      tel: this.data.options.tel,
      url: url,
      type: type
    };
    util.post(util.url.downloadgqnum, reqBody, (res) => {
      if (res.code == 1) {

      }
    })
  },
  // 高清图下载
  save_gqImg: function (index) {
    var that = this
    var imgData = that.data.imgData
    var index = index
    var url = imgData[index].url
    var num = imgData[index].count
    if (num == that.data.number) {
      wx.showToast({
        title: that.data.content,
        icon: "none",
        duration: 5000
      })
      return
    }
    var reqBody = {
      url: url,
      order: that.data.options.order,
      tel: that.data.options.tel
    };
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        wx.showLoading({
          title: '下载中',
          mask: true
        })
        // 用户已经同意小程序使用保存到相册功能
        util.post(util.url.getdownloadImg, reqBody, (res) => {
          if (res.code == 1) {
            that.downloadImg(res.data, 1, 1, (text) => {
              if (text == 100) {
                wx.showToast({
                  title: '下载完成',
                  icon: 'none'
                })
                that.downloadgqnum(url, 0)
                  ++imgData[index].count
                that.setData({
                  imgData: imgData
                })
              } else {
                wx.showToast({
                  title: '下载失败',
                  icon: 'none'
                })
              }
              that.hide()
              console.log('拿到值了是' + text);
            })
          }
        })

      },
      fail: function () {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) {
              that.setData({
                down_state: false
              })
            }
          }
        })
      }
    })
  },
  // 视频下载
  save_video: function (e) {
    var that = this
    var url = e.currentTarget.dataset.url
    var num = e.currentTarget.dataset.num
    if (num == that.data.number) {
      wx.showToast({
        title: '下载次数已到上限哦~',
        icon: "none",
        duration: 1000
      })
      return
    }
    var reqBody = {
      url: url,
      order: that.data.options.order,
      tel: that.data.options.tel
    };
    wx.showLoading({
      title: '下载中',
      mask: true
    })
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        util.post(util.url.getdownloadImg, reqBody, (res) => {
          if (res.code == 1) {
            wx.setKeepScreenOn({
              keepScreenOn: true
            })
            // 用户已经同意小程序使用保存到相册功能
            const downloadTask = wx.downloadFile({
              url: res.data,
              success: function (res) {
                var temp = res.tempFilePath
                console.log(res)
                wx.saveVideoToPhotosAlbum({
                  filePath: temp,
                  success: function () {},
                  fail: function () {
                    wx.showToast({
                      title: '下载失败',
                      icon: "none"
                    })
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '下载失败',
                  icon: "none"
                })
              }
            })
            downloadTask.onProgressUpdate((res) => {
              wx.showLoading({
                title: '下载进度' + res.progress + '%',
                mask: true
              })
              if (res.progress == 100) {
                wx.showToast({
                  title: '下载完成',
                })
                wx.hideLoading()
              }
            })
          } else {
            wx.showToast({
              title: '下载失败',
              icon: 'none'
            })
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) {
              that.setData({
                down_state: false
              })
            }
          }
        })
      }
    })
  },
  // 高清图一键下载
  saveAllPic: function () {
    var that = this
    var reqBody = {
      order: that.data.options.order,
      tel: that.data.options.tel
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        // 用户已经同意小程序使用相册的授权
        util.post(util.url.wx_gqlist, reqBody, (res) => {
          wx.hideLoading()
          if (res.code == 1) {
            that.setData({
              gqPic: res.data
            })
            setTimeout(function () {
              wx.showToast({
                title: "图片保存中……",
                icon: 'loading',
                duration: 2000,
                mask: true
              });
              that.dow_temp(0)
            }, 300)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.msg,
            })
          }
        })

      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '获取授权失败',
        })
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              that.setData({
                down_state: false
              })
            }
          }
        })
      }
    })

  },
  dow_temp: function (i) {
    var that = this
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    var gqPic = that.data.gqPic
    var all_n = gqPic.length;
    if (i < all_n) {
      const downloadTask = wx.downloadFile({
        url: gqPic[i].img,
        success: function (res) {
          var temp = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function () {
              wx.showLoading({
                title: '第' + (i + 1) + '张保存成功',
                mask: true
              })
              var reqBody = {
                order: that.data.options.order,
                tel: that.data.options.tel,
                url: gqPic[i].url,
                type: 3
              };
              util.post(util.url.downloadgqnum, reqBody, (res) => {
                if (res.code == 1) {
                  that.dow_temp(i + 1);
                }
              })
            },
            fail: function () {
              wx.showLoading({
                title: '第' + (i + 1) + '张保存失败',
                mask: true
              })
              that.dow_temp(i);
            }
          })
        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: '获取图片临时路径失败',
          })
        }
      })

      downloadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: i + '/' + all_n + '下载至' + res.progress + '%',
          mask: true
        })
      })

    } else {
      wx.showToast({
        title: '下载完成',
        duration: 1000
      })
      var reqBody = {
        order: that.data.options.order,
        tel: that.data.options.tel,
        url: '',
        type: 4
      };
      util.post(util.url.downloadgqnum, reqBody, (res) => {
        if (res.code == 1) {
          setTimeout(function () {
            wx.switchTab({
              url: 'index'
            })
          }, 2000)
        }
      })
    }

  },
  judgeWifiGq: function () {
    var that = this
    wx.getConnectedWifi({
      success(res) {
        that.saveAllPic()
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '您当前的网络是4G网络，是否确认用4G网络下载高清图？(ps:高清图建议连接wifi后下载哦~)',
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.saveAllPic()
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  // 授权设置
  set_callback: function (e) {
    console.log(e)
    var that = this
    var data = e.detail.authSetting
    if (!data['scope.writePhotosAlbum']) {
      that.setData({
        down_state: false
      })
    } else {
      wx.showToast({
        title: '授权成功！',
        duration: 1000
      })
      that.setData({
        down_state: true
      })
    }
  },
  //视频观看
  video_Play: function (e) {
    var that = this
    var video = that.data.video
    // if (video.count == video.number){
    //   wx.showToast({
    //     title: '播放次数已到上限哦~',
    //     icon: "none",
    //     duration: 1000
    //   })
    //   return
    // }
    var reqBody = {
      url: video.url,
      order: this.data.options.order,
      tel: this.data.options.tel
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.getVideo, reqBody, (res) => {
      if (res.code == 1) {
        that.setData({
          video: res.data,
          video_state: false
        })
        //停止正在播放的视频
        var videoContext = wx.createVideoContext('myVideo')
        videoContext.stop();
        setTimeout(function () {
          //将点击视频进行播放
          videoContext.play();
          wx.hideLoading()
        }, 500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        wx.hideLoading()
      }
    })
  },
  // 星星评分
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var gradeList = this.data.gradeList;
    var index = e.currentTarget.dataset.index;
    var one;
    if (in_xin === 'use_sc2') {
      one = Number(e.currentTarget.id);
    } else {
      one = Number(e.currentTarget.id) + gradeList[index].one;
    }
    gradeList[index].one = one
    gradeList[index].two = 5 - one
    this.setData({
      gradeList: gradeList
    })
    this.calculate()
  },
  // 计算总分
  calculate: function () {
    var gradeList = this.data.gradeList;
    var score = 0;
    var fullNum = 0;
    for (var i = 0; i < gradeList.length; i++) {
      score += gradeList[i].one
    }
    var totalScore = (score / 30 * 10) / 2;
    if (totalScore >= 1 && totalScore < 2) {
      fullNum = 1
    } else if (totalScore >= 2 && totalScore < 3) {
      fullNum = 2
    } else if (totalScore >= 3 && totalScore < 4) {
      fullNum = 3
    } else if (totalScore >= 4 && totalScore < 5) {
      fullNum = 4
    } else if (totalScore == 5) {
      fullNum = 5
    }
    this.setData({
      'total.one': fullNum,
      'total.two': 5 - fullNum
    })
  },
  radioChange: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  blur_advise: function (e) {
    this.setData({
      advise: e.detail.value
    })
  },
  // 提交
  click_submit: function () {
    var that = this
    var gradeList = that.data.gradeList;
    var totle = that.data.total.one
    var intro = that.data.intro
    var advise = that.data.advise
    var flag = false
    var score = []
    for (var i = 0; i < gradeList.length; i++) {
      if (gradeList[i].one > 5) {
        gradeList[i].one = 5
      }
      score.push(gradeList[i].one)
      if (gradeList[i].one == 0) {
        wx.showToast({
          title: '请为' + gradeList[i].title + '评分~',
          icon: "none",
          duration: 800
        })
        flag = false
        return
      } else {
        flag = true
      }
    }
    if (!flag) {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    if (intro == '') {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    var reqBody = {
      order: that.data.options.order,
      tel: that.data.options.tel,
      ztpf: totle,
      score: JSON.stringify(score),
      recommend: intro,
      content: advise
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.survey, reqBody, (res) => {
      this.setData({
        'survey.popup_state': true
      })
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 800
      })
      wx.hideLoading()
    })
    // console.log(score)
    // console.log(intro)
    // console.log(advise)

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
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.paging()
    }
  },


})