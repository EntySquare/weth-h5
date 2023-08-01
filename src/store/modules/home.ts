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
            this.Balance = C.balance; //* 当前余额
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
      if (+balance === 0) {
        return "0.00";
      }
      balance = balance.split("").reverse().join(""); //* 将字符串倒序
      //* 字符串长度大于18，说明有小数点
      if (balance.length > 18) {
        // 添加小数点
        balance = balance.slice(0, 18) + "." + balance.slice(18);
      } else {
        let zero = 18 - balance.length;
        for (let i = 0; i < zero; i++) {
          balance += "0";
        }
        balance = balance.slice(0, 18) + "." + '0';
      }
      balance = balance.split("").reverse().join(""); //* 将字符串倒序
      if (balance.length > 18) {
        //* 去掉小数点后两位再往后的所有字符
        balance = balance.split('.')[0] + '.' + balance.split('.')[1].slice(0, 2);
      } else if (balance.length === 18) {
        balance = "0" + balance;
      }
      return balance
    },
  },
  getters: {}
})
export default useHomeStore

