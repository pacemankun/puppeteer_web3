import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // esm 导致的折中方案

//脚本记录
const start = new Date();
const fileName = (start.toLocaleString() + ".txt").replace(
  /:|\//g,
  (item) => "-" // 2023/12/12 12:32:12   =>  2023-12-12 12-32-12
);
const filePath = path.join(__dirname, fileName); // 拼接文件路径
console.info("文件路径:", filePath);

fs.writeFile(filePath, "", (err) => {
  if (err) {
    return;
  }
  console.log(`成功创建文件：${fileName}`);
});

fs.mkdir("./888", (err) => {
  console.info(err);
});
