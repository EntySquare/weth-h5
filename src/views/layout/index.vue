<script setup lang="ts">
// 导入组件
import AppTopNavVue from './components/app-topnav.vue'
import AppFooterVue from './components/app-footer.vue'
import AppTopnav from './components/app-topnav.vue'
import AppFooter from './components/app-footer.vue'
import { clearAll, getToken, getACC_KEY, setACC_KEY } from "@/utils/auth"; //* 导入token
import useHomeStore from '@/store/modules/home' //* 导入store
import { storeToRefs } from 'pinia' //* 导入storeToRefs
const state = useHomeStore() //* 获取store
const { connectWallet } = state //* 获取store
let { Account } = storeToRefs(state)//* 获取store中的变量
//* 检查MetaMask是否已安装
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask已安装!')
  //* 检查当前账户
  window.ethereum.on('accountsChanged', (accounts: any) => {
    console.log('账户已切换............')
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  })
  //* 检查当前网络
  window.ethereum.on('chainChanged', (chainId: any) => {
    console.log('网络已切换............')
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  })

  //* 页面加载时自动连接钱包
  try {
    connectWallet();
    console.log('token:', getToken() != null);
    console.log('当前账户:', Account.value);
  } catch (error) {
    console.log('连接钱包失败:', error);
  };
} else {
  console.log('MetaMask未安装!')
}
</script>
<script lang="ts">
export default {
  name: 'layout'
}
</script>
<template>
  <!-- 顶部通栏组件 -->
  <!-- <AppTopNavVue></AppTopNavVue> -->
  <!-- 二级路由出口 -->
  <router-view></router-view>
  <!-- 底部通栏组件 -->
  <!-- <AppFooterVue></AppFooterVue> -->
</template>
<style scoped lang="less"></style>