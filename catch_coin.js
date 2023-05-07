import { bitget } from "ccxt";
import fs from "fs";

// 常量定义
const in_addr = "in_addr.txt"; // 存放提币地址的文件
const out_addr = "out_addr.txt"; // 存放提币结果的文件
const coin = process.argv[2]; // 要提的币
const network = "ERC20"; // 要提的链
const A_MIN = parseFloat(process.argv[3]);
const A_MAX = parseFloat(process.argv[4]);
const x = parseInt(process.argv[5]); // 保留x位小数
const T_MIN = parseInt(process.argv[6]) || 1000; // 提币最小时间间隔，默认1秒
const T_MAX = parseInt(process.argv[7]) || 5000; // 提币最大时间间隔，默认5秒
const apiKey = ""; // 填写您的API Key
const secret = ""; // 填写您的Secret

// 读取地址列表
const addresses = fs
  .readFileSync(`${__dirname}/${in_addr}`)
  .toString()
  .split("\n")
  .filter((addr) => addr); // 过滤最后的空行

// 初始化 Bitget 实例
const exchange = new bitget({
  apiKey: apiKey,
  secret: secret,
  enableRateLimit: true,
  options: {
    network: network,
  },
});

// 定义提币函数
async function multi_withdraw() {
  let i = 0;
  while (i < addresses.length) {
    const amount = parseFloat(Math.random() * (A_MAX - A_MIN) + A_MIN).toFixed(
      x
    );
    if (amount > A_MAX) {
      // 合法限制
      amount = A_MIN;
    }
    try {
      const res = await exchange.withdraw(coin, amount, addresses[i]);
      const s = `${coin}\t${addresses[i]}\t${amount}\n`;
      fs.appendFileSync(`${__dirname}/${out_addr}`, s); // 将提币结果写入文件
      console.log(res);
    } catch (err) {
      console.error(err);
    }
    i++;
    if (i < addresses.length - 1) {
      const time_value = parseInt(Math.random() * (T_MAX - T_MIN) + T_MIN);
      await new Promise((resolve) => setTimeout(resolve, time_value)); // 等待一段时间
    }
  }
  console.log(`success total is ${addresses.length}`);
}

// 判断是否作为主程序执行，如果是，则执行提币函数
if (require.main === module) {
  multi_withdraw();
}

export default multi_withdraw;
