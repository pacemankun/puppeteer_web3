/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2023-05-18 19:59:17
 * @LastEditTime: 2023-05-25 23:52:26
 * @LastEditors: liukun liukun0227@163.com
 */
import puppeteer from "puppeteer";
import axios from "axios";
import chalk from "chalk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cron = require("node-cron");

// 随机整数[1,9)
function createRandomInteger(min, max) {
  return ~~(Math.random() * (max - min) + min);
}

// cron.schedule("20 04 20 * * *",
(async function () {
  console.info(chalk.red(new Date().toLocaleString()));
  console.time(chalk.red("总耗时"));

  const mapUserId = new Map([
      [1, "j4nek8t"],
      [2, "j4smqc1"],
      [3, "j4smqcn"],
      [4, "j4smqcw"],
      [5, "j4smqd2"],
    ]),
    timeout = 35000,
    isHead = 0,
    slideH = 5000, // 5屏高度+5s
    tweetContent =
      "wwStop spamming your referral co33des he777re, the idea is you go outside of the community to refer people. Work for the 💸 sirs3333";

  for (const item of mapUserId) {
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

      let page1 = await browser.newPage();

      await page1.goto("https://twitter.com/home", {
        timeout,
      });
      await new Promise((res) => setTimeout(res, 3000));
      console.info("开始滑动");

      // ①滑动
      await page1.evaluate((h, s) => {
        // 缓动函数
        function smoothScrollTo(targetY) {
          const element = document.documentElement;
          const startY = element.scrollTop;
          const distance = targetY - startY;
          const startTime = performance.now();

          function scrollStep(timestamp) {
            const currentTime = timestamp - startTime;
            const scrollRatio = currentTime / targetY;
            const scrollValue = startY + distance * easeInOutQuad(scrollRatio);

            element.scrollTop = scrollValue;

            if (currentTime < targetY) {
              window.requestAnimationFrame(scrollStep);
            }
          }

          function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }

          window.requestAnimationFrame(scrollStep);
        }
        // evaluate函数下面的代码不会等待滑动结束,而是刚开始滑动就继续执行了
        // evaluate函数会马上执行,但是不会等待执行完毕,因此在打印‘滑动完成’时,并没有执行完滑动过程
        // 因此需要手动等待滑动完成的整体时间,多1s保证滑动结束后再继续执行后续代码
        smoothScrollTo(h, s);
      }, slideH);
      await new Promise((res) => setTimeout(res, slideH + 1000));
      console.info("滑动完成");

      // ②点赞
      await new Promise((res) => setTimeout(res, 1000));
      console.info(`开始点赞`);
      const svgArr = await page1.$$(
        "svg[class='r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi']"
      );
      console.info(`total:[${svgArr.length}]个svgNode`);

      const random = createRandomInteger(0, (svgArr.length - 3) / 6);
      const heartIndex = 3 + random * 6;
      console.info(`3+6n随机出点赞的下标${heartIndex}`);

      const ele_1 = await svgArr[heartIndex].evaluateHandle(
        (node) => node.parentElement
      );
      await new Promise((res) => setTimeout(res, 1000));
      ele_1.click();
      console.info(`点赞完成`);

      // ③转发
      await new Promise((res) => setTimeout(res, 1000));
      console.info(`开始转发`);
      const zhuanIndex = 2 + random * 6;
      console.info(`2+6n随机出转发的下标${zhuanIndex}`);

      const ele_2 = await svgArr[zhuanIndex].evaluateHandle(
        (node) => node.parentElement
      );
      await new Promise((res) => setTimeout(res, 1000));
      ele_2.click().catch((err) => {
        console.info("转发弹窗报错:" + err);
        return;
      }); // 转发选择框出现
      await new Promise((res) => setTimeout(res, 1000));
      const ele_2_ = await page1.$(
        "div[data-testid='Dropdown'] > div:nth-of-type(1)"
      );
      ele_2_.click().catch((err) => {
        console.info("转发按钮报错:" + err);
      });
      // 必须转发点赞的内容，因为点赞自动定位到视图中间,转发按钮不在视图中是被detached
      console.info(`转发完成`);
      await new Promise((res) => setTimeout(res, 1500));
      await page1.close();

      // ④发文
      console.info(`开始发文`);
      const page2 = await browser.newPage();
      await page2.goto("https://twitter.com/compose/tweet");
      await new Promise((res) => setTimeout(res, 2000));

      await page2.type(
        "div[data-testid='tweetTextarea_0RichTextInputContainer']",
        tweetContent
      );
      await new Promise((res) => setTimeout(res, 1000));
      await page2.click('div[data-testid="tweetButton"]');
      console.info(`发文完成`);
      const result = await page2
        .close()
        .then(() => true)
        .catch(() => false);
      if (!result) {
        console.info(`发文page2关闭时捕获错误,继续下轮`);
        continue;
      }
      // ⑤下轮循环
      console.info(chalk.yellow(`名称${item[0]}:(${item[1]})执行完毕!`));
    } catch (err) {
      console.info(`名称${item[0]}:(${item[1]})报错`, err);
      continue;
    }
  }
  console.timeEnd(chalk.red("总耗时"));
})();
