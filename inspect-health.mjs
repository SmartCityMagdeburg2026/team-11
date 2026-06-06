import ExcelJS from "exceljs";
import path from "node:path";
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(path.join('src','data','health','Daten_Gesundheit und Soziales_05.06.2026.xlsx'));
console.log('sheets', workbook.worksheets.map(ws => ws.name));
for (const ws of workbook.worksheets) {
  console.log('sheet', ws.name);
  let i = 0;
  for (const row of ws.getRows(1, 15)) {
    if (!row) continue;
    console.log(row.values.slice(1));
    if (++i >= 10) break;
  }
}
