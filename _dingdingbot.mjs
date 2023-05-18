/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2023-05-18 10:46:18
 * @LastEditTime: 2023-05-18 11:20:16
 * @LastEditors: liukun liukun0227@163.com
 */
import axios from "axios";

await axios
  .post(
    `https://oapi.dingtalk.com/robot/send?access_token=b109fbc1a9fc1eaf9346cb9ae8c236bf1bd2bd6af86627f7e546c7635468054f`,
    // {
    //   msgtype: "text",
    //   at: {
    //     // atMobiles: ["180xxxxxx"],
    //     atUserIds: ["songshuting2018"],
    //     isAtAll: false,
    //   },
    //   text: {
    //     content: "回家 ——report——conference",
    //   },
    // }

    {
      msgtype: "markdown",
      markdown: {
        title: "回家不",
        text: "# 回家不? \n  1.8点半了\n2.我也饿了 3.蛋壳也想回家挨 \n 换行1 \n换行2 conference",
      },
      at: {
        atMobiles: ["18500227993"],
        atUserIds: [""],
        isAtAll: false,
      },
    }
  )
  .catch((err) => {
    console.err(err);
  });
