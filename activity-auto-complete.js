// ==UserScript==
// @name         安全教育活动自动完成
// @author       hotwords
// @match        https://huodong.xueanquan.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function parseCookie() {
    return new Map(document.cookie.split(';').map(s => s.trim().split('=')));
  }

  async function ajax(method, url, body = null) {
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
    }
    const resp = await fetch(url, {
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json"
      },
      body, method,
      mode: "cors",
      credentials: "include"
    });
    return resp.json();
  }

  async function getAPIBaseRoute() {
    const cookieMap = parseCookie();
    const serverSide = cookieMap.get('ServerSide');

    const url = "https://huodongapi.xueanquan.com/Topic/topic/main/api/v1/users/get-serviceside?serviceSide=";

    return ajax("GET", url + encodeURIComponent(serverSide));
  }

  async function autoComplete() {
    const apiBaseRoute = await getAPIBaseRoute();

    const specialId = document.body.getAttribute('data-specialId');

    for (const step of [1, 2]) {
      const data = await ajax("POST", apiBaseRoute + "/Topic/topic/platformapi/api/v1/records/sign", { specialId, step });
      console.log(`Step ${step}: ${data.result ? "Success" : "Failed"} ${data.msg}`);
    }
  }

  window.autoComplete = autoComplete;
})();
