import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option;
  const data = [
    [
      [3, 56, 56, '脱发', '1'],
      [5, 45, 60, '头痛', '1', '124'],
      [3, 49, 56, '眼部问题', '1'],
      [1, 45, 60, '耳部问题', '1'],
      [3, 42, 56, '口腔问题', '1'],
      [3, 34.5, 56, '喉部问题', '1'],
      [1.2, 24, 60, '肩部问题', '1'],
      [4.8, 24, 60, '背部问题', '1'],
      [0.2, 16, 60, '胸痛', '1'],
      [5.8, 16, 60, '腹痛', '1'],
      [3, 4, 60, '生殖', '1'],
    ], [
      [1.5, 52, 60, '睡眠困难', '2'],
      [4.5, 52, 60, '听力问题', '2'],
      [3, 26.5, 56, '恶心呕吐', '2','101'],
      [3, 19, 56, '气短', '2'],
      [3, 11.5, 56, '腹泻', '2'],
      [1.2, 8, 60, '排尿', '2'],
      [4.9, 8, 60, '排便', '2'],
      [1.5, 38, 60, '流感', '2'],
      [4.5, 38, 60, '发热', '2', '103']
    ], [
      [1.6, 16, 60, '体重异常', '3'],
      [4.4, 16, 60, '身体不适', '3']
    ]
  ];
  option = {
    grid: {
      left: '8%',
      top: '5%',
      bottom: '3%'
    },
    color: ['#31afdd' ,'#c255e0' ,'#f0ca20'],
    xAxis: { show: false },
    yAxis: { show: false },
    series: [
      {
        name: '身体',
        data: data[0],
        type: 'scatter',
        symbolSize: function (data) {
          return data[2];
        },
        emphasis: {
          itemStyle: {
            color: 'red'
          }
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              color: "white",
              formatter: param => {
                let labelText = param.data[3];
                if (labelText.length >2){
                    return labelText.substring(0, 2) + "\n"+ labelText.substring(2, labelText.length);
                }else{
                  return labelText;
                }
              },
              position: 'inside',
              textStyle: {
                fontSize: 14, 
                lineHeight:17
              }
            }
          }
        }
      },
      {
        name: '功能',
        data: data[1],
        type: 'scatter',
        symbolSize: function (data) {
          return data[2];
        },
        emphasis: {
          itemStyle: {
            color: 'red'
          }
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              color: "white",
              formatter: param => {
                let labelText = param.data[3];
                if (labelText.length >2){
                    return labelText.substring(0, 2) + "\n"+ labelText.substring(2, labelText.length);
                }else{
                  return labelText;
                }
              },
              position: 'inside',
              textStyle: {
                fontSize: 14, 
                lineHeight:17
              }
            }
          }
        }
      },
      {
        name: '疾病',
        data: data[2],
        type: 'scatter',
        symbolSize: function (data) {
          return data[2];
        },
        emphasis: {
          itemStyle: {
            color: 'red'
          }
        },
        itemStyle: {
          normal: {
            //此处起作用，展示你需要的标签
            label: {
              show: true,
              color: "black",
              formatter: param => {
                let labelText = param.data[3];
                if (labelText.length >2){
                    return labelText.substring(0, 2) + "\n"+ labelText.substring(2, labelText.length);
                }else{
                  return labelText;
                }
              },
              position: 'inside',
              textStyle: {
                fontSize: 14, 
                lineHeight:17
              }
            }
          }
        }
      }
    ]
  };
  chart.setOption(option);

  // 气泡点击
  chart.on('click', { componentType: 'markPoint' }, function (parmas) {
    let roomToken = {
      bg: parmas.data[4],
      roomId: parmas.data[5],
      roomName: parmas.data[3],
      userId: 'lucky',
      avatar: './../../static/images/my-avatar.png'
    };
    wx.navigateTo({
      url: `../consult_room/consult_room?roomToken=` + JSON.stringify(roomToken)
    })

  });
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: '懒得去医院了，打开小程序自己诊断一下吧！！！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },
  onReady() {
  },
  onLoad() {
    // 设置自诊室标题
    wx.setNavigationBarTitle({
      title: '症状自测'
    });
  },
  showUserNotice(){
    wx.showModal({
      title: '用户须知',
      content: '“症状自测”小程序是为了方便您根据症状进行自我评估。本程序是在军事医学科学出版社《家庭保健百科全书》的基础上，按照情景对话式风格设计。\n需要注意的是本程序只是帮助您判断当前症状的可能病因及对应处理方式，不适用于所有情况，更不可以替代医生诊疗。如果你不确定评估结果是否适合您，应当咨询医生，用药或治疗更应该在医生指导下完成。 \n友情提醒：新冠肺炎以发热、干咳、乏力、嗅觉味觉减退、鼻塞、流涕、咽痛、结膜炎、肌痛和腹泻为主要表现，如出现任何一种症状就应该及时前往感染科、发热门诊进行排查（带好口罩，途中勿乘坐公共交通）或拨打120急救电话，并告知医护人员做好隔离防范。具体如下：\n1、隔离：有近期新冠流行病学史的人员出现上述症状，要在指定场所隔离观察两周，同时行新冠病毒核酸和抗体检测。\n2、排查：对于无新冠流行病学史的患者，伴有咳嗽、发热时，需要常规完善新冠病毒核酸检测，来排除是否有新冠病毒感染。'
    })
  }
});
