// ==UserScript==
// @name         安全教育作业自动完成
// @author       hotwords
// @match        https://*.xueanquan.com/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	class ErrorMessage extends Error {}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function doTest(cid, cg) {
		return new Promise((resolve, reject) => {
			const url = new URL('EscapeSkill/SeeVideo.aspx', location.href);

			url.searchParams.set('gid', cg);
			url.searchParams.set('li', cid);

			const win = window.open(url.href);

			if (!win)
				return reject(new ErrorMessage('无法打开新窗口。请检查你的浏览器是否阻止了弹出窗口。'));

			win.addEventListener('load', async () => {
				await sleep(500);

				win.ShowTestPaper();

				await sleep(500);

				win.$('#test_three input[type="radio"][value="1"]').prop('checked', true);
				win.$('#input_button').click();

				await sleep(500);

				resolve();

				await sleep(1000);

				win.close();
			}, false);
		});
	};

	window.doHomework = async () => {
		try {
			const tasks = [];
	
			$('a[name^="workToUrl"]').each((i, a) => {
				const $a = $(a);
				const params = eval('[' + $a.attr('onclick').match(/\((.+)\)/)[1] + ']');
	
				if (params[2] === 1 && $a.parent().parent().find('.wcnodiv').length > 0) {
					tasks.push(() => doTest(params[0], params[3]));
				}
			});
	
			if (!tasks.length)
				throw new ErrorMessage('没有发现可以自动完成的作业。');
	
			for (const cb of tasks)
				await cb();
		} catch (err) {
			if (err instanceof ErrorMessage) {
				alert(err.message);
			} else {
				console.error(err);
			}
		}
	};

})();
