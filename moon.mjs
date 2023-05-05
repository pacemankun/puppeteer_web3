import puppeteer from "puppeteer";
import axios from "axios";
import chalk from "chalk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cron = require("node-cron");

cron.schedule("59 28 23 * * *", async () => {
  const mapUserId = new Map([
    // [50, "j57hby6"],
    // [49, "j57hb16"],
    // [48, "j57hb15"],
    // [47, "j57hb14"],
    // [46, "j57hb13"],
    // [45, "j57hb12"],
    // [44, "j57hb11"],
    // [43, "j57hb10"],
    // [42, "j57hb0y"],
    // [41, "j57hb0x"],
    // [40, "j5rfpma"],
    // [39, "j5rfpm9"],
    // [38, "j5rfpm8"],
    // [37, "j5rfpm7"],
    // [36, "j5rfpm6"],
    // [35, "j5rfpm5"],
    // [34, "j5rfpm4"],
    // [33, "j5rfpm3"],
    // [32, "j5rfpm2"],
    // [31, "j5rfpm1"],
    // [30, "j5rfpm0"],
    // [29, "j5rfply"],
    // [28, "j5rfplx"],
    // [27, "j5rfplw"],
    // [26, "j5rfplv"],
    // [25, "j5rfplu"],
    // [24, "j5rfplt"],
    // [23, "j5rfpls"],
    // [22, "j5rfplr"],
    // [21, "j5rfplq"],
    // [20, "j4smqmh"],
    // [19, "j4smqm1"],
    // [18, "j4smqlh"],
    // [17, "j4smql0"],
    // [16, "j4smqkr"],
    // [15, "j4smqk7"],
    // [14, "j4smqjq"],
    // [13, "j4smqj7"],
    // [12, "j4smqi6"],
    // [11, "j5rfpmb"],
    // [10, "j4smqfe"],
    // [9, "j4smqev"],
    // [8, "j4smqed"],
    // [7, "j4smqds"],
    // [6, "j4smqde"],
    // [5, "j4smqd2"],
    // [4, "j4smqcw"],
    [3, "j4smqcn"],
    [2, "j4smqc1"],
    [1, "j4nek8t"],
  ]);
  const isHead = 0,
    timeout = 10000,
    openBoxCount = "2"; // Symbol[iterator] 443
  for (const item of mapUserId) {
    console.info(chalk.yellow("Start batch processing..." + item));
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
      defaultViewport: null, // 取消默认视口限制
    });
    console.log(chalk.green("stash1>>>>>>broswer start done!"));

    // 遍历打开的页面并关闭它们
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
    const openPages = await browser.pages();

    // create page1:receiving gift
    const page1 = await browser.newPage();
    await page1.goto("https://mission.ultiverse.io/project/moonlight/9");

    for (const page of openPages) {
      if (!page.url().includes("moonlight")) {
        await page.close();
      }
    }

    // wait_catch_operate
    await page1.waitForSelector(".action_item-info__R3ZOi > button", {
      timeout,
    });
    const el_check1 = await page1.$(".action_item-info__R3ZOi > button");
    el_check1.click(); // ajax-loading

    // wait a moment  for able claim
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
    console.info(chalk.green("stash2 >>>>>>receiving gift done!"));

    // wait a moment for nextStick【多余了，直接跳走了】
    await page1.waitForFunction(
      (selector) => {
        const button = document.querySelector(selector);
        return button && button.disabled;
      },
      {},
      selector_
    );
    await page1.close();

    // create page2:girlFriend-list
    const page2 = await browser.newPage();
    await page2.goto("https://moonlight.ultiverse.io/list");

    //  get girl-ids for:new page
    await page2.waitForSelector(".vh_girl-id__rZdfE", {
      timeout,
    });
    const girlIds = await page2.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".vh_girl-id__rZdfE > span:first-child")
      ).map((element) => element.innerText.match(/\d+/g)[0]);
    });
    console.info(chalk.green(`stash3 >>>>>> catch girlIds done:${girlIds}`));
    await page2.close();

    // create page3:girlModel _1
    for (const [index_, id] of girlIds.entries()) {
      if (index_ > 0) {
        break;
      } else {
        const page3 = await browser.newPage();
        await page3.goto(
          `https://moonlight.ultiverse.io/list/${id}?modal-id=feature-modal`
        );

        // page3 -dialog-abort [必等dialog]-start
        await page3.waitForSelector(
          ".common_Success_Tips_Content__CEcsR .common_Tips_Close__a4BBR",
          {
            timeout,
          }
        );
        const el_dialogX_1 = await page3.$(
          ".common_Success_Tips_Content__CEcsR .common_Tips_Close__a4BBR"
        );
        el_dialogX_1.click();
        console.info(chalk.green("stash4>>>>>> page3-dialog-closed"));

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

        await page3.type("input.Tips_Input_Num__J3ftt", openBoxCount); // input 2
        await page3.waitForSelector(".Tips_Open_Button__X6wu2", {
          timeout,
        });
        const el_btnOpen = await page3.$(".Tips_Open_Button__X6wu2");

        el_btnOpen.click(); // what you get things dialog
        console.log(chalk.green("stash5>>>>>>what you get things dialog"));

        // wait_catch_operate
        await page3.waitForSelector(
          ".Tips_Success_Tips_Content__XoSUg .Tips_OK__rPPKz",
          {
            timeout,
          }
        );
        const el_view1 = await page3.$(
          ".Tips_Success_Tips_Content__XoSUg .Tips_OK__rPPKz"
        );
        el_view1.click(); // page3_tab_Gift

        await page3.waitForTimeout(2000);

        // go NFT-Gift tabs
        await page3.waitForSelector(".Modal_Tab__XuS5B > div:nth-of-type(3)", {
          timeout,
        });
        const el_NFT_tab = await page3.$(
          ".Modal_Tab__XuS5B > div:nth-of-type(3)"
        );
        el_NFT_tab.click(); // NFT-Gift tabs display

        // ---------------
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
        await page3.waitForTimeout(1500);

        console.log(chalk.green("stash6>>>>>> start iframe operating..."));

        //  iframe
        await page3.waitForSelector("iframe", {
          timeout,
        });
        const iframeElement = await page3.$("iframe");
        const iframeContent = await iframeElement.contentFrame();

        await page3.waitForTimeout(1500);
        await iframeContent.waitForSelector(".btn-box button:nth-of-type(2)", {
          timeout,
        });
        const el_confirm = await iframeContent.$(
          ".btn-box button:nth-of-type(2)"
        );
        await page3.waitForTimeout(1500);
        el_confirm.click();
        await page3.waitForSelector(".Tips_Success_Tips_Content__XoSUg", {
          timeout: 60000, // await send successful message dialog
        });
        console.log(
          chalk.green("stash7>>>>>>Congratulations! gas is consumed")
        );
        page3.close();
      }
      // create page4:last_step
      const page4 = await browser.newPage();
      await page4.goto("https://mission.ultiverse.io/project/moonlight/10");

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

      console.info(
        chalk.magentaBright(
          "current Pages:" + openPages.length,
          "current acount done:" + item
        )
      );
      await page4.waitForTimeout(1500);
      await page4.close();
      browser.close();
    }
  }
});
