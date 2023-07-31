<script setup lang='ts' name="HomeView">
import * as echarts from 'echarts';
import useHomeStore from '@/store/modules/home' //* 导入store
import { storeToRefs } from 'pinia' //* 导入storeToRefs
import { nextTick } from 'vue';
const state = useHomeStore() //* 获取store
const { formatBalance } = state //* 获取store中的方法
let { Account, Balance, isLoading } = storeToRefs(state)//* 获取store中的变量
var chartDom;
nextTick(() => {
  chartDom = document.getElementById('main')!;
  var myChart = echarts.init(chartDom);
  type EChartsOption = echarts.EChartsOption;
  var option: EChartsOption;
  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };

  option && myChart.setOption(option);
})
</script>
<template>
  <div class="home_view">
    <div class="container">
      <div class="echarts" id="main"></div>
      <div class="btn">
        K线走势详情
      </div>
      <div class="title">
        <div class="img">
          <img src="" alt="">
          <div class="img_text">
            USDT
          </div>
        </div>
        <div class="text">支付</div>
        <div class="flex_one">
          <div class="content">
            钱包资产: {{ formatBalance(Balance + '') }}
          </div>
        </div>
      </div>
      <div class="input">
        <input type="text">
      </div>
      <div class="loop">
        <div class="body">
          <img src="@/assets/images/loop.svg" alt="" srcset="">
        </div>
      </div>
      <div class="title">
        <div class="img">
          <img src="" alt="">
          <div class="img_text">
            HTT
          </div>
        </div>
        <div class="text1">接收</div>
        <div class="flex_one">
          <div class="content">
            可使用配额: {{ formatBalance(Balance + '') }}
          </div>
        </div>
      </div>
      <div class="input">
        <input type="text">
      </div>
      <div class="massage">
        <div class="left">滑点 2.0% <i>!</i></div>
        <div class="right">{{ 0 }} HTT</div>
      </div>
      <div class="btn" style=" margin: 36px 0;">
        确认
      </div>
    </div>
  </div>
</template>
<style scoped lang='less'>
.home_view {
  width: 100%;
  background: #e8f5e9;
  // color: #673ab7;

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
    padding: 0 16px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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
        background: #ebf4fe;
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
    background: linear-gradient(270deg, #6731b89e 0%, #673ab7 100%);
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    cursor: pointer;
  }
}
</style>