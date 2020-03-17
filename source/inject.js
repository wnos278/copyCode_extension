'use strict';

//kiem tra neu trang web hien tai la mot trong cac trang web duoc chon
chrome.storage.local.get(null, function (result) { // Luu tru du lieu nguoi dung
	var allowedSites = result.allowedSites; // Có thể cài đặt những trang web mà extension này xử lý
	if(!result.allowedSites) {
		allowedSites = ["stackoverflow.com"]; // Trang web cho phep
		chrome.storage.local.set({allowedSites: allowedSites}); // lưu dữ liệu trang web được xử lý
    }
    // Khởi tạo vùng nhớ, clipboard
	for (let i = 0; i < allowedSites.length; i++) {
		if (window.location.href.indexOf(allowedSites[i]) > -1) { // Kiem tra trong duong dan URL co chua chuoi la ten trang web trong danh sach
			chrome.storage.local.get(null, function (result) {
				if (!result.snippetHistory) {
					chrome.storage.local.set({ snippetHistory: [] }); // snippet History: bộ nhở trích đoạn - vùng nhớ clipboard
					// Phan nay khoi tao bo nho
				}
				// if (!result.numSnippets) { // nếu số lượng snippet không có, thì tạo snippet có kích thướng là 5
				// 	chrome.storage.local.set({ numSnippets: 1 });
				// }
				// if (!result.numChars) {
				// 	chrome.storage.local.set({ numChars: 500 }); // chưa cài đặt số lượng ký tự trong snippet, cài đặt bằng 500
				// }
			});

			Array.from(document.getElementsByTagName('pre')) // get all code snippets
				.forEach(function (block) { // với mỗi block, nếu có sự kiện double click vào block
					block.addEventListener('dblclick', function (event) { // bắt sự kiện double click
						var range = document.createRange(); // Khởi tạo đối tượng range chứa code của block
						range.selectNode(block); // chọn khối chứa thông tin mã nguồn 
						try {
							window.getSelection().removeAllRanges(); // xóa các range trước đó
							window.getSelection().addRange(range); // thêm vào range vừa được chọn, phạm vi là window
							document.execCommand('copy'); // chạy câu lệnh copy sau khi đã add các phần từ vào khối
							// chrome.storage.local.get(null, function (result) {
							// 	console.log(result);
							// 	if (result.snippetHistory.length >= result.numSnippets) { // nếu quá bộ nhớ, xóa
							// 		result.snippetHistory.pop();
							// 	}
							// 	result.snippetHistory.unshift({
							// 		snippet: range.toString().substring(0, Number(result.numChars)), // lưu vào clipboard dưới dạng string
							// 		URI: range.commonAncestorContainer.baseURI,
							// 		date: new Date().toString()
							// 	});
							// 	chrome.storage.local.set({ snippetHistory: result.snippetHistory });
							// });

							// Bao hieu la da copy
							window.getSelection().removeAllRanges();
							block.style.outline = '5px solid #00A9DD';
							setTimeout(function () {
								return block.style.outline = 'none';
							}, 500);
						} catch (err) {
							console.log('Failed to copy', err);
						}
					});
				});

			break;
		}
	}
});