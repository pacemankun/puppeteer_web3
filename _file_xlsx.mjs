import fs from "fs";
import path from "path";
import XLSX from "xlsx"; // xlsx 模块中的大多数方法都是同步的

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

//  创建文档
fs.writeFile(filePath, "", (err) => {
  if (err) {
    return;
  }
  console.log(`成功创建文件：${fileName}`);
});

// excel_示例
// 创建 工作簿（workbook）对象
const workbook = XLSX.utils.book_new();

// 整备数据1: 将二维数组=>xlsx格式数据【非主流数据,Map是2维数组】
const sheetData = XLSX.utils.aoa_to_sheet([
  // 每个元素代表 Excel 表格的一行
  ["Name", "Age", "salary"],
  ["John", 30, 6000],
  ["Jane", 25, 7000],
  ["Tom", 35, 32000],
]);

// 将数据注入到Sheetlk工作表中(不存在就创建),再将工作表注入工作簿
XLSX.utils.book_append_sheet(workbook, sheetData, "Sheetlk");

// 把工作簿写入excel文件(不存在就生成)
XLSX.writeFile(workbook, "../xixi3.xlsx"); // 同步

// 整备数据2: 将数组json=>xlsx格式数据【主流数据格式】
const sheetData2 = XLSX.utils.json_to_sheet([
  { Name: "John1", Age: 300 },
  { Name: "Jane2", Age: 250 },
  { Name: "Tom3", Age: 350 },
]);
// 将数据注入到Sheetlk2工作表中(不存在就创建),再将工作表注入工作簿
XLSX.utils.book_append_sheet(workbook, sheetData2, "Sheetlk2");
// 把工作簿写入excel文件(不存在就生成)
XLSX.writeFile(workbook, "../xixi3.xlsx"); // 同步

// 追加数据
const workbook3 = XLSX.readFile("../xixi3.xlsx"); // 选中工作簿
const worksheet_prepareAdd = workbook3.Sheets["Sheetlk2"]; // 选中要追加的表

XLSX.utils.sheet_add_json(
  worksheet_prepareAdd,
  [
    { Name: "222John", Age: 30 },
    { Name: "222Jane", Age: 25 },
    { Name: "2222Tom", Age: 35 },
  ],
  { origin: -1, skipHeader: true } // 尾部插入+新数据的表头也占一行(大部分都是true跳过表头选择,不占行)
);
XLSX.writeFile(workbook3, "../xixi3.xlsx");

// 读取
const workbook2 = XLSX.readFile("../xixi3.xlsx"); // 选中工作簿
const worksheet = workbook2.Sheets["Sheetlk2"]; // 选中要追加的表
const jsonData = XLSX.utils.sheet_to_json(worksheet);

console.log(jsonData);
