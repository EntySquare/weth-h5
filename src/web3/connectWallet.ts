import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { login } from '@/api/user'
import { getToken, setToken } from "@/utils/auth"; //*获取计划列表
import useHomeStore from '@/store/modules/home' //* 导入store
import { storeToRefs } from 'pinia' //* 导入storeToRefs
import { get } from 'http';

declare global { // 声明全局变量
    interface Window { // 声明window全局变量
        ethereum: any; // 声明ethereum全局变量
    }
}

// Bsc网络ID
const Bsc_CHAIN_ID = '0x38';// BSC网络的链ID 64进制

// Bsc网络ID
const Bsc_CHAIN_ID_DECIMAL = '56';// BSC网络的链ID 10进制


// BNB合约地址
const WETHContractAddress = '0x9d0307Ffa462A475417B801F46FAe459b1608888';//
const WETCContractAddress = '0xc3D135dc5e8705f01abBcAb21F3bd3609241b547';//
const ContractAddress = '0x49e810e143b81e05a2f1B3b9847F682d42dDaF5c';//BNB子代币USDT001合约地址

const tokenApi: AbiItem[] = [{
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
},
{
    constant: true,
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
},
{
    constant: true,
    inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
},
{
    constant: false,
    inputs: [
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
},
{
    constant: false,
    inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
},
{
    constant: false,
    inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
},
]

// ERC20合约ABI（仅包含transfer函数）
const erc20Abi: AbiItem[] = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenBddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenBNum",
                "type": "uint256"
            }
        ],
        "name": "AmountOut",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "WETCAddress",
                "type": "address"
            }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "name": "inSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountInA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountInB",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenB",
                "type": "address"
            }
        ],
        "name": "inTrimSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "reduceSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "changeAddress",
                "type": "address"
            }
        ],
        "name": "setNoNeedQuotaAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "setOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "timer",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reducePoint",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "divideNum",
                "type": "uint256"
            }
        ],
        "name": "setReduceConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "changeAddress",
                "type": "address"
            }
        ],
        "name": "setSignAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderNo",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expireTimer",
                "type": "uint256"
            }
        ],
        "name": "swapWETH",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCanReduce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderNo",
                "type": "uint256"
            }
        ],
        "name": "getOrderStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];



async function connectWallet() { // 连接钱包
    const { ethereum } = window; // 获取window.ethereum
    const web3 = new Web3(ethereum); // 初始化Web3

    if (!ethereum) { // 检查MetaMask是否已安装
        console.log('请安装MetaMask!')
        return;
    }
    // * 检查网络是否为BSC网络
    const chainId = await ethereum.request({ method: 'eth_chainId' }); // 获取网络ID
    if (chainId !== Bsc_CHAIN_ID) { // 检查当前网络是否为BSC网络
        console.log('添加BSC网络.....................')
        try { // 切换到BSC网络
            await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: Bsc_CHAIN_ID }] }); // 切换到BSC网络
        } catch (switchError: any) { // 捕获错误
            if (switchError.code === 4902) { // 如果错误码为4902，则尝试添加BSC网络
                try {
                    const res = await ethereum.request({
                        method: 'wallet_addEthereumChain', // 添加BSC网络
                        params: [
                            {
                                chainId: Bsc_CHAIN_ID, // BSC网络ID
                                chainName: 'Binance Smart Chain Mainnet', // BSC网络名称
                                nativeCurrency: {
                                    name: 'BNB', // BNB代币名称
                                    symbol: 'BNB', // BNB代币符号
                                    decimals: 18, // BNB代币精度
                                },
                                rpcUrls: [
                                    'https://bsc-dataseed.binance.org',
                                    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
                                    'https://polygon-bor.publicnode.com',
                                    'https://polygon.llamarpc.com',
                                    'https://polygon.meowrpc.com',
                                    'https://polygon.meowrpc.com',
                                    'https://1rpc.io/matic',
                                ], // BSC网络RPC节点
                                blockExplorerUrls: [
                                    'https://bscscan.com',
                                ], // BSC网络区块浏览器
                            },
                        ],
                    });
                    console.log('添加成功.....................')
                } catch (addError) {
                    alert("添加网络失败! 为你跳转到chainlist.org，请手动添加Binance Smart Chain"); // 添加BSC网络失败
                    window.open('https://chainlist.org/chain/56', '_blank'); // 打开BSC网络添加页面
                    console.error('无法添加Binance Smart Chain:', addError); // 打印日志
                }
            } else {
                console.error('无法切换到Binance Smart Chain:', switchError); // 打印日志
            }
        }
    }


    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // 获取账户

    const address = accounts[0]; // 获取账户地址
    // const resLogin = await login({ address: address, token: getToken() }) //*
    // const dataToSignfunc = async () => { // 请求MetaMask签名数据
    //     const cTimestamp = Math.floor(Date.now()).toString();
    //     const msg = '登录签名_7B_SWAP_' + cTimestamp; // 待签名的数据
    //     const sig = await web3.eth.personal.sign(msg, address, "");// 签名
    //     console.log('resLogin.data.json:', resLogin.data)
    //     setToken(resLogin.data);
    //     return { address, msg, sig }
    // }

    // 转账
    const transferUSDT = async (id: string, amount: number, hashFC: (i: any) => void, verifyFC: () => void, errFC: () => void) => {
        const state = useHomeStore() //* 获取store
        let { isConfirming } = storeToRefs(state)//* 获取store中的变量
        const { goGetbalance } = state //* 获取store中的方法

        // 检查MetaMask是否已安装
        if (!window.ethereum) {
            console.error('请先安装MetaMask插件');
            return;
        }
        try {

            // amount = 1
            console.log('amount:', amount)
            const wetcContract = new web3.eth.Contract(tokenApi, WETCContractAddress);
            const wetcdecimals = 18;
            // const amountInSmallestUnit = web3.utils.toBN(amount * Math.pow(10, decimals));
            // const amountInSmallestUnit = amount + "00000000000000000";
            const wetcamountInSmallestUnit = amount + "000000000000000000";
            const wetcgasPrice = await web3.eth.getGasPrice();
            // 获取时间戳加10分钟
            const wetctransaction = wetcContract.methods
                .approve(ContractAddress, wetcamountInSmallestUnit)
                .send({ from: address, gasPrice: wetcgasPrice, gas: "0x" + BigInt(100000).toString(16), })

            wetctransaction.on('transactionHash', function (hash: any) {

                hashFC(hash); // 回调函数，处理交易哈希
            });

            wetctransaction.on('confirmation', async function (confirmationNumber: any, receipt: any) {
                if (confirmationNumber === 1) {
                    goGetbalance()

                    isConfirming.value = false;
                    // amount = 1
                    console.log('amount:', amount)
                    const usdtContract = new web3.eth.Contract(erc20Abi, ContractAddress);
                    const decimals = 18;
                    // const amountInSmallestUnit = web3.utils.toBN(amount * Math.pow(10, decimals));
                    // const amountInSmallestUnit = amount + "00000000000000000";
                    const amountInSmallestUnit = amount + "000000000000000000";
                    const gasPrice = await web3.eth.getGasPrice();
                    // 获取时间戳加10分钟
                    const cTimestamp = Math.floor(Date.now() / 1000) + 600;
                    const transaction = usdtContract.methods
                        .swapWETH(id, amountInSmallestUnit.toString(), 0, cTimestamp * 1000)
                        .send({ from: address, gasPrice: gasPrice, gas: "0x" + BigInt(100000).toString(16), })

                    transaction.on('transactionHash', function (hash: any) {
                        hashFC(hash); // 回调函数，处理交易哈希
                    });

                    transaction.on('confirmation', function (confirmationNumber: any, receipt: any) {
                        if (confirmationNumber === 1) {
                            isConfirming.value = false;
                            goGetbalance()

                            // alert('成功');
                            verifyFC(); // 回调函数，处理交易确认
                        }
                    });

                    transaction.on('error', function (error: any) {
                        isConfirming.value = false;
                        goGetbalance()
                        console.error('USDT转账失败', error);
                        errFC();
                        // alert('USDT转账失败');
                    });
                }
            });




        } catch (error) {
            console.error('USDT转账失败', error);
            isConfirming.value = false;
            goGetbalance()

        }
    };

    let balance: any;// 账户余额
    let cBalance: any;// 账户余额
    let balanceChain: any;// 账户余额
    const getBalance = async () => {
        try {
            const tokenContract = new web3.eth.Contract(tokenApi, WETHContractAddress); // 初始化合约
            const tokenContract2 = new web3.eth.Contract(tokenApi, WETCContractAddress); // 初始化合约
            cBalance = await tokenContract2.methods.balanceOf(address).call()
            balance = await tokenContract.methods.balanceOf(address).call()  // 获取账户余额
        } catch (e) {

        }
        try {
            balanceChain = await web3.eth.getBalance(address);// 获取账户余额
        } catch (e) {

        }
        return { balance, cBalance, balanceChain }
    };
    await getBalance();
    console.log('连接成功.....................')
    return { web3, address, balance, cBalance, balanceChain, transferUSDT, getBalance }; // 返回web3、账户地址、账户余额、转账函数
}

export default connectWallet;
