function onEdit(e) {
  // Lấy thông tin về sheet và ô được chỉnh sửa
  const sheet = e.source.getActiveSheet();
  const range = e.range; // Ô được chỉnh sửa
  const row = range.getRow(); // Dòng của ô được chỉnh sửa

  // Kiểm tra nếu chỉnh sửa nằm trong vùng dữ liệu (bỏ qua tiêu đề)
  if (row > 1) {
    // Lấy dữ liệu của dòng được chỉnh sửa
    const data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Kiểm tra nếu tất cả các cột cần thiết đã được điền
    if (data[0] && data[1] && data[2] && data[3]) { // Kiểm tra cột 1 (Tên), cột 2 (Email), cột 3 (Số điện thoại), cột 4 (người phụ trách)
      sendDataToGetfly(row); // Gửi dữ liệu của dòng được chỉnh sửa
    } else {
      Logger.log(`Dữ liệu dòng ${row} chưa đầy đủ, không gửi.`);
    }
  }
}

function sendDataToGetfly(row) {
  // Lấy dữ liệu từ Google Sheets
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0]; // Lấy dữ liệu của dòng được chỉnh sửa

  // URL API của Getfly
  const url = "https://demosale01.getflycrm.com/api/v6/accounts";

  // API Key
  const apiKey = "NlmUK5r1rJbeOXrReHYePx1O9ciydP";

  // Tạo payload (dữ liệu gửi đi)
  const payload = {
    account_name: data[0], // Cột 1: Tên
    email: data[1], // Cột 2: Email
    phone_office: data[2], // Cột 3: Số điện thoại
    account_manager: data[4], // Cột 5: Người phụ trách khách hàng
    custom_fields: {
      google_sheet_test: [3] // Cột 4: Trường thông tin tự tạo
    },
  };
  Logger.log(JSON.stringify(payload, null, 2)); // In payload dưới dạng JSON đẹp

  // Cấu hình yêu cầu HTTP
  const options = {
    method: "post", // Phương thức POST
    contentType: "application/json",
    headers: {
      "x-api-key": apiKey, // Thêm API Key vào header
    },
    payload: JSON.stringify(payload), // Chuyển payload thành JSON
  };

  // Gửi yêu cầu HTTP
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(`Dữ liệu dòng ${row} đã được gửi: ${response.getContentText()}`);
  } catch (error) {
    Logger.log(`Lỗi khi gửi dữ liệu dòng ${row}: ${error.message}`);
  }
}

