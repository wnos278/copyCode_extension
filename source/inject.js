'use strict';

//kiem tra neu trang web hien tai la mot trong cac trang web duoc chon
chrome.storage.local.get(null, function (result) {
	var allowedSites = result.allowedSites;
	if(!result.allowedSites) {
		allowedSites = ["stackoverflow.com"]; // Trang web cho phep
		chrome.storage.local.set({allowedSites: allowedSites});
    }
    // Khởi tạo vùng nhớ, clipboard
	for (let i = 0; i < allowedSites.length; i++) {
		if (window.location.href.indexOf(allowedSites[i]) > -1) {
			chrome.storage.local.get(null, function (result) {
				if (!result.snippetHistory) {
					chrome.storage.local.set({ snippetHistory: [] });
				}
				if (!result.numSnippets) {
					chrome.storage.local.set({ numSnippets: 5 });
				}
				if (!result.numChars) {
					chrome.storage.local.set({ numChars: 500 });
				}
			});

			Array.from(document.getElementsByTagName('pre')) // get all code snippets
				.forEach(function (block) {

					block.addEventListener('dblclick', function (event) { // bắt sự kiện double click
						var range = document.createRange();
						range.selectNode(block); // chọn khối chứa thông tin mã nguồn 
						try {
							window.getSelection().removeAllRanges(); // xóa các thẻ bao
							window.getSelection().addRange(range);
							document.execCommand('copy'); // chạy câu lệnh copy sau khi đã add các phần từ vào khối
							chrome.storage.local.get(null, function (result) {
								console.log(result);
								if (result.snippetHistory.length >= result.numSnippets) {
									result.snippetHistory.pop();
								}
								result.snippetHistory.unshift({
									snippet: range.toString().substring(0, Number(result.numChars)),
									URI: range.commonAncestorContainer.baseURI,
									date: new Date().toString()
								});
								chrome.storage.local.set({ snippetHistory: result.snippetHistory });
							});

							window.getSelection().removeAllRanges();
							block.style.outline = '2px solid #0D0';
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