<script setup lang='ts' name="HomeView">
import * as echarts from 'echarts';
import Loading from "vue-loading-overlay"; // 导入加载组件
import useHomeStore from '@/store/modules/home' //* 导入store
import { storeToRefs } from 'pinia' //* 导入storeToRefs
import { nextTick, ref } from 'vue';
const state = useHomeStore() //* 获取store
import { ElMessage } from 'element-plus'
const { formatBalance, replaceStr } = state //* 获取store中的方法
let { Account, Balance, isLoading } = storeToRefs(state)//* 获取store中的变量
import axios from 'axios'
const btn1 = ref(false)
const btn2 = ref(false)
const loop = ref(false)
const reverse = ref(false)
const mouseupFun = () => {
  setTimeout(() => {
    btn1.value = false
    btn2.value = false
    loop.value = false
  }, 100);
}
var chartDom;
type EChartsOption = echarts.EChartsOption;
var option = ref<EChartsOption>();
const getEchartsData = async () => {
  try {
    const { data } = await axios.get('http://104.194.79.218:9900/kline/get')
    let xData: any = [];
    let yData: any = [];
    data.data.map((item: any) => {
      if (item.createTime.split(' ')[1].slice(0, 2) === '00') {
        let day = item.createTime.split(' ')[0].split('-')
        xData.push(day[1] + '-' + day[2])
      } else {
        xData.push(item.createTime.split(' ')[0].split('-')[2] + '/' + item.createTime.split(' ')[1].slice(0, 2) + ':00')
      }
      yData.push(item.nowPrice)
    })
    option.value = {
      title: [
        {
          left: 'center',
          text: 'WETC价格'
        },
      ],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: yData,
          type: 'line'
        }
      ]
    };
  } catch (error) {
    // alert('请关闭代理网路')
  }
}
nextTick(async () => {
  chartDom = document.getElementById('main')!;
  var myChart = echarts.init(chartDom);
  await getEchartsData()
  option.value && myChart.setOption(option.value);
})
const weth = ref('')
const wetc = ref('')
const setRevese = () => {
  loop.value = true
  reverse.value = !reverse.value
  wetc.value = ''
  weth.value = ''
}
</script>
<template>
  <div class="home_view">
    <div class="container">
      <div class="top_address">

        <loading v-if="Account == ''" :height="20.59" :width="20.59" transition="none" color="#673ab7"
          :active="isLoading">
        </loading>
        <span v-else>{{ Account != '' ? replaceStr(Account) : '连接钱包' }}</span>
      </div>
      <div class="echarts" id="main"></div>
      <div class="btn" :style="{ opacity: btn1 ? 0.8 : 1 }" @mousedown="btn1 = true" @mouseup="mouseupFun">
        K线走势详情
      </div>
      <div class="input_body" :style="{ flexDirection: reverse ? 'column-reverse' : 'column' }">
        <div class="body_box">
          <div class="title">
            <div class="img">
              <img src="" alt="">
              <div class="img_text">
                WETH
              </div>
            </div>
            <div :class="[reverse ? 'text1' : 'text']">{{ reverse ? '接收' : '支付' }}</div>
            <div class="flex_one">
              <div class="content">
                {{ reverse ? '可使用配额: ' : '钱包资产: ' }} {{ formatBalance(Balance + '') }}
              </div>
            </div>
          </div>
          <div class="input">
            <input type="text" v-model="weth" placeholder="0">
          </div>
        </div>
        <div class="loop">
          <div @click="setRevese" :style="{ opacity: loop ? 0.8 : 1 }" @mousedown="loop = true" @mouseup="mouseupFun"
            class="body">
            <img src="@/assets/images/loop.svg" alt="" srcset="">
          </div>
        </div>
        <div class="body_box">
          <div class="title">
            <div class="img">
              <img src="" alt="">
              <div class="img_text">
                WETC
              </div>
            </div>
            <div :class="[!reverse ? 'text1' : 'text']">{{ !reverse ? '接收' : '支付' }}</div>
            <div class="flex_one">
              <div class="content">
                {{ !reverse ? '可使用配额: ' : '钱包资产: ' }} {{ formatBalance(Balance + '') }}
              </div>
            </div>
          </div>
          <div class="input">
            <input type="text" v-model="wetc" placeholder="0">
          </div>
        </div>
      </div>
      <div class="massage">
        <div class="right">{{ 0 }} WETC</div>
      </div>
      <div class="btn" :style="{ margin: '36px 0', opacity: btn2 ? 0.8 : 1 }" @mousedown="btn2 = true"
        @mouseup="mouseupFun">
        确认
      </div>
    </div>
  </div>
</template>
<style scoped lang='less'>
.home_view {
  width: 100%;
  background: #E8F5E9;

  .echarts {
    height: 60vh;
    width: 100%;

    canvas {
      width: 100vw !important;
      height: 100% !important;
    }
  }

  .container {
    width: 100%;
    height: 100%;
    padding: 20px 16px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .top_address {
      height: 3rem;
      width: 100%;
      font-size: 1.2rem;
      color: #673ab7;
      display: flex;
      justify-content: end;
      align-items: center;
      padding: 0 10px;

      span {
        background: #82A0DD7A;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 20px;
      }
    }

    .input_body {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;

      .body_box {
        width: 100%;
      }
    }

    .title {
      margin: 16px 0;
      width: 100%;
      display: flex;
      align-items: center;

      .img {
        height: 10vw;
        max-height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;

        .img_text {
          color: #000;
          font-size: 1.2rem;
          font-weight: 500;
        }
      }

      .text {
        padding: 6px 10px;
        background: #FFF9CE;
        color: #E2BA42;
        border-radius: 8px;
        font-size: .8rem;
        font-weight: bold;
        margin: 0 10px;
      }

      .text1 {
        padding: 6px 10px;
        background: #DDECFE;
        color: #82a1dd;
        border-radius: 8px;
        font-size: .8rem;
        font-weight: bold;
        margin: 0 10px;
      }

      .flex_one {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .content {
          padding: 6px 10px;
          color: #848484;
          border-radius: 8px;
          font-size: .8rem;
          font-weight: bold;
        }
      }
    }

    .input {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #E8E8E8;
      border-radius: 6px;


      input {
        background: transparent;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        border: none;
        outline: none;
        padding: 0 10px;
        font-size: 1rem;
        color: #000;
      }
    }

    .loop {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;

      .body {
        width: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;
        border-radius: 50%;
        background: #00000094;

        img {
          width: 100%;
          max-width: 1.4rem;
        }
      }
    }

    .massage {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      color: #9B9B9B;
      font-size: .8rem;
      font-weight: 600;

      .left {
        display: flex;
        align-items: center;

        i {
          font-style: normal;
          color: #C60000;
          display: inline-block;
          height: .8rem;
          width: .8rem;
          font-size: .6rem;
          border: 1px solid #C60000;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .right {
        color: #C60000;
      }
    }
  }

  .btn {
    overflow: hidden;
    max-width: 300px;
    width: 100vw;
    height: 40px;
    background: linear-gradient(200deg, #6731B84C 0%, #673ab7 100%);
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    cursor: pointer;
  }
}
</style>