/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2023-05-18 19:59:17
 * @LastEditTime: 2023-05-19 14:15:29
 * @LastEditors: liukun liukun0227@163.com
 */
import puppeteer from "puppeteer";
import axios from "axios";
import chalk from "chalk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cron = require("node-cron");

// cron.schedule("20 04 20 * * *",
(async function () {
  console.info(chalk.red(new Date().toLocaleString()));
  console.time(chalk.red("总耗时"));
  // 随机整数[1,9)
  function createRandomInteger(min, max) {
    return ~~(Math.random() * (max - min) + min);
  }
  // 缓动函数
  function smoothScrollTo(targetY, duration) {
    const element = document.documentElement;
    const startY = element.scrollTop;
    const distance = targetY - startY;
    const startTime = performance.now();

    function scrollStep(timestamp) {
      const currentTime = timestamp - startTime;
      const scrollRatio = currentTime / duration;
      const scrollValue = startY + distance * easeInOutQuad(scrollRatio);

      element.scrollTop = scrollValue;

      if (currentTime < duration) {
        window.requestAnimationFrame(scrollStep);
      }
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    window.requestAnimationFrame(scrollStep);
  }
  const mapUserId = new Map([
      [1, "j4nek8t"],
      [2, "j4smqc1"],
      [3, "j4smqcn"],
      [4, "j4smqcw"],
      [5, "j4smqd2"],
    ]),
    timeout = 35000;

  for (const item of mapUserId) {
    let girlIds = []; //每个账号要循环的女友名单
    let openBoxCount; // 每个账号几个女友开几个盒子 Symbol[iterator] 4-4-3

    try {
      console.info(chalk.yellow(`名称${item[0]}:(${item[1]})开始执行...`));
      const {
        data: {
          data: {
            ws: { puppeteer: browserWSEndpoint },
          },
        },
      } = await axios
        .get(
          `http://localhost:50325/api/v1/browser/start?headless=${isHead}&user_id=${item}`
        )
        .catch((err) => {
          console.err(err);
        });
      // 连接到 adspower 启动的: browser instance
      const browser = await puppeteer.connect({
        browserWSEndpoint,
        defaultViewport: { width: 1100, height: 900 }, // 取消默认视口限制
      });
      console.info(chalk.green("broswer start..."));

      // 遍历已打开的页面关闭到只剩1个
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      const openPages = await browser.pages();
      for (const page of openPages) {
        if (openPages.length === 1) {
          break;
        }
        await page.close();
        openPages.unshift();
      }
      console.info(chalk.green("开启的浏览器清除到只剩1个page"));

      let page1 = await browser.newPage();
      try {
        await page1.goto("https://twitter.com/home", {
          timeout,
        });
      } catch (error) {
        console.info(chalk.green(`捕获网络故障:${error}`));

        for (let i = 1; ; i++) {
          await new Promise((res) => setTimeout(res, i * 1000));
          const reload_url = await page1.url();
          console.info(chalk.green(`reload_url:${reload_url}`));
          await page1.reload();
          console.info(chalk.green("打点确认是否page1上下文没被摧毁"));
          await new Promise((res) => setTimeout(res, 1500));
          const pageIsOrdinary = await page1.evaluate(() => {
            console.info(document.querySelector("html").innerHTML);
            return (
              document.querySelector("html").innerHTML.indexOf("ERR") === -1
            );
          });
          console.info(
            chalk.green(
              `第${i}次尝试修复链接:${pageIsOrdinary ? "成功" : "失败"}`
            )
          );
          if (pageIsOrdinary) break;
        }
      }
      // 滑动
      await page1.evaluate(() => {
        smoothScrollTo(createRandomInteger(5000, 10000)); // 10s-滑动-5屏
      });
      console.info("滑完");

      console.info(chalk.yellow(`名称${item[0]}:(${item[1]})执行完毕!`));
    } catch (err) {
      console.info(`名称${item[0]}:(${item[1]})报错`, error);
      continue;
    }
  }
  console.timeEnd(chalk.red("总耗时"));
})();
