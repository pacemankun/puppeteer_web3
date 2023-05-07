import puppeteer from "puppeteer";
import axios from "axios";
import chalk from "chalk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cron = require("node-cron");

cron.schedule("00 43 23 * * *", async () => {
  const mapUserId = new Map([
    [50, "j57hby6"],
    [49, "j57hb16"],
    [48, "j57hb15"],
    [47, "j57hb14"],
    [46, "j57hb13"],
    [45, "j57hb12"],
    [44, "j57hb11"],
    [43, "j57hb10"],
    [42, "j57hb0y"],
    [41, "j57hb0x"],
    [40, "j5rfpma"],
    [39, "j5rfpm9"],
    [38, "j5rfpm8"],
    [37, "j5rfpm7"],
    [36, "j5rfpm6"],
    [35, "j5rfpm5"],
    [34, "j5rfpm4"],
    [33, "j5rfpm3"],
    [32, "j5rfpm2"],
    [31, "j5rfpm1"],
    [30, "j5rfpm0"],
    [29, "j5rfply"],
    [28, "j5rfplx"],
    [27, "j5rfplw"],
    [26, "j5rfplv"],
    [25, "j5rfplu"],
    [24, "j5rfplt"],
    [23, "j5rfpls"],
    [22, "j5rfplr"],
    [21, "j5rfplq"],
    [20, "j4smqmh"],
    [19, "j4smqm1"],
    [18, "j4smqlh"],
    [17, "j4smql0"],
    [16, "j4smqkr"],
    [15, "j4smqk7"],
    [14, "j4smqjq"],
    [13, "j4smqj7"],
    [12, "j4smqi6"],
    [11, "j5rfpmb"],
    [10, "j4smqfe"],
    [9, "j4smqev"],
    [8, "j4smqed"],
    [7, "j4smqds"],
    [6, "j4smqde"],
    [5, "j4smqd2"],
    [4, "j4smqcw"],
    [3, "j4smqcn"],
    [2, "j4smqc1"],
    [1, "j4nek8t"],
  ]);
  const isHead = 0,
    timeout = 10000,
    openBoxCount = "2"; // Symbol[iterator] 443
  for (const item of mapUserId) {
    console.info(chalk.green("Start keep-alive..." + item));
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

    // 遍历打开的页面并关闭它们
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
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
    await page1.waitForTimeout(2000);
    await page1.waitForSelector(
      ".styles_header-operation__9rnfD img[src='/images/avatar.png']",
      {
        timeout,
      }
    );

    browser.close();
  }
});
