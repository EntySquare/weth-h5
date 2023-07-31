// 管理分类导航的数据
import { defineStore } from 'pinia'
import connectWallet from "@/web3/connectWallet";
import { ElMessage } from 'element-plus'

let useHomeStore = defineStore('home', {
  state: () => ({
    Account: '', //* 当前账户
    Balance: 0, //* 当前余额
    isLoading: false, //* 连接加载状态
  }),
  actions: {
    //* 连接 钱包
    async connectWallet() {
      console.log('连接中.....................')
      if (this.Account) return   //* 判断是否连接
      this.isLoading = true; //* 打开加载状态
      return new Promise(async (resolve, reject) => {
        try {
          await connectWallet().then((C: any) => {
            this.Account = C.address; //* 当前账户
            this.Balance = this.formatBalance(C.balance); //* 当前余额
            this.ToSignfunc = C.dataToSignfunc //* 签名方法
            this.transferUSDT = C.transferUSDT; //* 赋值转账方法
            console.log('C:', C)
            this.isLoading = false;
            resolve(C); //返回数据
          })
        } catch (error) {
          this.isLoading = false;
          reject(error); //返回错误
          console.log('error:', error)
        }
      });
    },
    //* 被C 赋值的签名方法，用于后续调用
    ToSignfunc(): any { },
    //* 被C 赋值的转账方法，用于后续调用
    transferUSDT(recipient: string, amount: number, hash: (hash: string) => void, verifyFC: () => void, err: () => void) { },
    //* 格式化金额
    formatBalance(balance: string) {
      balance = balance.split("").reverse().join(""); //* 将字符串倒序
      balance = balance.slice(0, 18) + "." + balance.slice(18); //* 在第18位后面插入小数点
      balance = balance.split("").reverse().join(""); //* 将字符串倒序
      balance = parseFloat(balance).toFixed(2); //* 保留两位小数
      return balance
    },
  },
  getters: {}
})
export default useHomeStore

