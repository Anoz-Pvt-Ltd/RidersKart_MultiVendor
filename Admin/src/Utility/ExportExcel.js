import XLSX from "xlsx";

export const ExportExcel = (data, fileName) => {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
};

export const ExportExcelWithHeadersAndTitle = (data, fileName, headers, title) => {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(data, { header: headers });

  // Add title to the first row
  const titleCell = XLSX.utils.encode_cell({ c: 0, r: 0 });
  ws[titleCell] = { v: title, t: "s" };
  ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: 0 } }];

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
};
