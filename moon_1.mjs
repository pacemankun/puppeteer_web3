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

  const mapUserId = new Map([
    [1, "j4nek8t"],
    [2, "j4smqc1"],
    [3, "j4smqcn"],
    [4, "j4smqcw"],
    [5, "j4smqd2"],
    [6, "j4smqde"],
    [7, "j4smqds"],
    [8, "j4smqed"],
    [9, "j4smqev"],
    [10, "j4smqfe"],
    [11, "j5rfpmb"],
    [12, "j4smqi6"],
    [13, "j4smqj7"],
    [14, "j4smqjq"],
    [15, "j4smqk7"],
    [16, "j4smqkr"],
    [17, "j4smql0"],
    [18, "j4smqlh"],
    [19, "j4smqm1"],
    [20, "j4smqmh"],
    [21, "j5rfplq"],
    [22, "j5rfplr"],
    [23, "j5rfpls"],
    [24, "j5rfplt"],
    [25, "j5rfplu"],
    [26, "j5rfplv"],
    [27, "j5rfplw"],
    [28, "j5rfplx"],
    [29, "j5rfply"],
    [30, "j5rfpm0"],
    [31, "j5rfpm1"],
    [32, "j5rfpm2"],
    [33, "j5rfpm3"],
    [34, "j5rfpm4"],
    [35, "j5rfpm5"],
    [36, "j5rfpm6"],
    [37, "j5rfpm7"],
    [38, "j5rfpm8"],
    [39, "j5rfpm9"],
    [40, "j5rfpma"],
    [41, "j57hb0x"],
    [42, "j57hb0y"],
    [43, "j57hb10"],
    [44, "j57hb11"],
    [45, "j57hb12"],
    [46, "j57hb13"],
    [47, "j57hb14"],
    [48, "j57hb15"],
    [49, "j57hb16"],
    [50, "j57hby6"],
  ]);
  const isHead = 0,
    timeout = 35000;
  let openBoxCount; // Symbol[iterator] 443

  for (const item of mapUserId) {
    try {
      console.info(chalk.yellow(`名称:${item[0]}(${item[1]})开始执行...`));
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

      // 遍历打开的页面并关闭它们
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
      const openPages = await browser.pages();
      for (const page of openPages) {
        if (!page.url().includes("moonlight")) {
          await page.close();
        }
      }

      // create page1:receiving gift
      // 当 Puppeteer 尝试导航到指定的 URL 时，如果遇到网络连接重置的错误(net::ERR_CONNECTION_RESET)
      // 表示网络连接被重置，通常是由于网络问题或服务器端的问题导致的 设置 timeout 选项来延长超时时间 {timeout}
      const page1 = await browser.newPage();
      try {
        await page1.goto("https://mission.ultiverse.io/project/moonlight/9", {
          timeout,
        });
      } catch (error) {
        if (error.message.includes("net::ERR_CONNECTION_RESET")) {
          console.info("与服务器之间的连接被意外地中断或重置,尝试重连...");
          await page1.goto("https://mission.ultiverse.io/project/moonlight/9", {
            timeout,
          });
        }
      }
      await page1.waitForSelector(".action_item-info__R3ZOi > button", {
        timeout,
      });
      const el_check1 = await page1.$(".action_item-info__R3ZOi > button");
      el_check1.click();

      const selector_ = ".task_modal-claim__czjHN > button";
      await page1.waitForFunction(
        (selector) => {
          const button = document.querySelector(selector);
          return button && !button.disabled;
        },
        { timeout },
        selector_
      );
      const el_claim1 = await page1.$(selector_);
      el_claim1.click();
      console.info(chalk.green("step1:领取礼盒完成"));

      await page1.waitForFunction(
        (selector) => {
          const button = document.querySelector(selector);
          return button && button.disabled;
        },
        {},
        selector_
      );

      // create page2:girlFriend-list
      const page2 = await browser.newPage();
      try {
        await page2.goto("https://moonlight.ultiverse.io/list", {
          timeout,
        });
      } catch (error) {
        if (error.message.includes("net::ERR_CONNECTION_RESET")) {
          console.info("与服务器之间的连接被意外地中断或重置,尝试重连...");
          await page2.goto("https://moonlight.ultiverse.io/list", {
            timeout,
          });
        }
      }

      //  get girl-ids
      await page2.waitForSelector(".vh_girl-id__rZdfE", {
        timeout,
      });
      let girlIds = await page2.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".vh_girl-id__rZdfE > span:first-child")
        ).map((element) => element.innerText.match(/\d+/g)[0]);
      });
      console.info(chalk.green("总女友池:", girlIds));

      // 找到无效女友
      const il_girlIds = await page2.evaluate(() => {
        const arr1_in_girl = document.querySelectorAll(
          ".vh_girl-id-wrapper__rpx_7 > button[style*='background']"
        );
        if (arr1_in_girl.length) {
          return Array.from(arr1_in_girl).map(
            (item) =>
              item.parentElement.firstElementChild.firstElementChild.innerText.match(
                /\d+/g
              )[0]
          );
        } else {
          console.info("没有异常女友"); // 输出到了browser 这个方法特殊
          return [];
        }
      });

      console.info(chalk.green("无效女友池:", il_girlIds));

      // 开始过滤
      girlIds = girlIds.filter((item) => !il_girlIds.includes(item));
      // girlIds.splice(0, 6); // 测试用途

      console.info(chalk.green(`过滤后将要执行的女友们编号:${girlIds}`));
      await page2.close();

      // create page3:girlModel _1
      openBoxCount = "" + girlIds.length;
      for (const [index_, id] of girlIds.entries()) {
        try {
          const page3 = await browser.newPage();
          try {
            await page3.goto(
              `https://moonlight.ultiverse.io/list/${id}?modal-id=feature-modal`,
              {
                timeout,
              }
            );
          } catch (error) {
            if (error.message.includes("net::ERR_CONNECTION_RESET")) {
              console.info("与服务器之间的连接被意外地中断或重置,尝试重连...");
              await page3.goto(
                `https://moonlight.ultiverse.io/list/${id}?modal-id=feature-modal`,
                {
                  timeout,
                }
              );
            }
          }

          // page3 -dialog-abort [必等dialog]-start
          try {
            await page3.waitForSelector(
              ".common_Success_Tips_Content__CEcsR .common_Tips_Close__a4BBR",
              {
                timeout: 15000,
              }
            );
            const el_dialogX_1 = await page3.$(
              ".common_Success_Tips_Content__CEcsR .common_Tips_Close__a4BBR"
            );
            await page3.waitForTimeout(1000);
            el_dialogX_1.click();
            console.info(chalk.green("讨厌的弹窗被点击关闭"));
          } catch (error) {
            console.info(chalk.green("讨厌的弹窗等15s不出现,那我继续走了"));
          }

          if (index_ === 0) {
            // 只用开第一个女友盒子
            await page3.waitForSelector(
              ".gift_Gift_Item_Container__lteUZ img[src='/space/mystery.png']",
              {
                timeout,
              }
            );
            const el_openGiftBox1 = await page3.$(
              ".gift_Gift_Item_Container__lteUZ img[src='/space/mystery.png']"
            );

            await page3.waitForTimeout(1000); // secret_box_dialog

            el_openGiftBox1.click(); // gift-box dialog show

            await page3.waitForSelector("input.Tips_Input_Num__J3ftt", {
              timeout,
            });

            await page3.type("input.Tips_Input_Num__J3ftt", openBoxCount);
            await page3.waitForSelector(".Tips_Open_Button__X6wu2", {
              timeout,
            });
            const el_btnOpen = await page3.$(".Tips_Open_Button__X6wu2");

            el_btnOpen.click(); // what you get things dialog
            console.info(chalk.green("step2:首个女友的额外操作:打开礼盒完成"));

            await page3.waitForSelector(
              ".Tips_Success_Tips_Content__XoSUg .Tips_OK__rPPKz",
              {
                timeout,
              }
            );
            const el_view1 = await page3.$(
              ".Tips_Success_Tips_Content__XoSUg .Tips_OK__rPPKz"
            );
            el_view1.click(); // go Gift tabs
          }

          // go NFT-Gift tabs
          await page3.waitForSelector(
            ".Modal_Tab__XuS5B > div:nth-of-type(3)",
            {
              timeout,
            }
          );
          const el_NFT_tab = await page3.$(
            ".Modal_Tab__XuS5B > div:nth-of-type(3)"
          );
          await page3.waitForTimeout(2000);
          el_NFT_tab.click(); // NFT-Gift tabs display
          await page3.waitForTimeout(2000);

          await page3.waitForSelector(
            ".gift_Gift_Item_Container__lteUZ img:first-child",
            {
              timeout,
            }
          );

          const el_chocolate = await page3.$(
            ".gift_Gift_Item_Container__lteUZ img:first-child"
          );
          el_chocolate.click(); // choose count dialog

          await page3.waitForSelector(
            ".Tips_Action__6jv8b > svg:nth-of-type(2)",
            {
              timeout,
            }
          );
          const el_svg1 = await page3.$(
            ".Tips_Action__6jv8b > svg:nth-of-type(2)"
          );

          el_svg1.click(); // digit=>2
          await page3.waitForTimeout(2000);

          await page3.waitForSelector(".Tips_Select_Gift__Mmtox > button", {
            timeout,
          });
          const el_select1 = await page3.$(".Tips_Select_Gift__Mmtox > button");
          el_select1.click(); // another dialog for send_btn

          await page3.waitForSelector(
            ".selected_Selected_Action__0QbkD > button:nth-of-type(1)",
            {
              timeout,
            }
          );
          const el_send1 = await page3.$(
            ".selected_Selected_Action__0QbkD > button:nth-of-type(1)"
          );
          el_send1.click(); // send
          console.info(chalk.green("start iframe operating..."));
          //  iframe
          await new Promise((res) => setTimeout(res, 3000));
          await page3.waitForSelector("iframe", {
            timeout,
          });
          const iframeElement = await page3.$("iframe");
          const iframeContent = await iframeElement.contentFrame();

          await page3.waitForTimeout(1500);
          await iframeContent.waitForSelector(
            ".btn-box button:nth-of-type(2)",
            {
              timeout,
            }
          );
          const el_confirm = await iframeContent.$(
            ".btn-box button:nth-of-type(2)"
          );
          await page3.waitForTimeout(1500);
          el_confirm.click();
          try {
            await page3.waitForSelector(".Tips_Success_Tips_Content__XoSUg", {
              timeout: 20000, // await send successful message dialog
            });
          } catch (error) {
            console.info(chalk.green("女友交任务后,等待接口结果已超20s"));
          }
          console.info(chalk.blue(`第${index_ + 1}个女友#${id}:执行完毕!`));

          page3.close();
        } catch (error) {
          console.info(`第${index_ + 1}个女友#${id}报错`, error);
          continue;
        }
      }

      // create page4
      let page4 = await browser.newPage();
      try {
        await page4.goto("https://mission.ultiverse.io/project/moonlight/10", {
          timeout,
        });
      } catch (error) {
        if (error.message.includes("net::ERR_CONNECTION_RESET")) {
          console.info("与服务器之间的连接被意外地中断或重置,尝试重连...");
          await page4.goto(
            "https://mission.ultiverse.io/project/moonlight/10",
            {
              timeout,
            }
          );
        }
      }
      // 防女巫执行
      await page4.waitForTimeout(3000);
      if (!page4.url().includes("10")) {
        console.count(chalk.green("最后交任务/10,触发了女巫策略"));
        await page4.goBack();
        const pages = await browser.pages();
        page4 = pages[pages.length - 1];
        console.count(chalk.green("最后交任务/10,女巫策略已处理"));
      }

      // wait_catch_operate
      await page4.waitForSelector(".action_item-info__R3ZOi > button", {
        timeout,
      });
      const el_check2 = await page4.$(".action_item-info__R3ZOi > button");
      el_check2.click(); // ajax-loading

      // wait a moment  for able claim
      const selector_2 = ".task_modal-claim__czjHN > button";
      await page4.waitForFunction(
        (selector) => {
          const button = document.querySelector(selector);
          return button && !button.disabled;
        },
        { timeout },
        selector_2
      );
      const el_claim2 = await page4.$(selector_2);
      el_claim2.click();
      console.info(chalk.green("step3:交任务完成"));
      console.info(chalk.cyan(`名称:${item[0]}(${item[1]})执行完毕!`));
      await page4.waitForTimeout(1500);
      await page4.close();
      browser.close();
    } catch (error) {
      console.info(`名称:${item[0]}(${item[1]})报错`, error);
      continue;
    }
  }
  console.timeEnd(chalk.red("总耗时"));
})();
