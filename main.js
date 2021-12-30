// ==UserScript==
// @name         Summarizer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  summarizes paragraphs to you.
// @author       sashank tungaturthi
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=theverge.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  fetch('API_KEY.js').then(data =>data.body)
    .then(data=>console.log(data));
  // Your code here...

  console.log("summarizer loaded...");
  var paras = document.getElementsByTagName("p");
  var summaries = [];

  console.log("paras : ", paras);
  for (let i = 0; i < paras.length; i++) {
    //paras[i].addEventListener("click", () => summarize(paras[i]));
      var innerText = paras[i].innerText;
      console.log("inner : " , innerText,innerText.length);
      if(innerText && innerText.length > 200) {
              createButton(paras, i);
      }
  }

  function summarize(paras, i) {
    var url = "https://api.openai.com/v1/engines/davinci/completions";

    var text = paras[i].innerText;

    console.log("clicked on para :: ", text);
    //text = extractContent(text);
    const summaries = [];
    const gptPrompt = createGPTPrompt(text);

    console.log("attempting to summarize : ", text);
    postData(url, gptPrompt).then((data) => {``
      const summary = data.choices[0].text;
      console.log("gpt response : ", summary);

      createSummaryNode(summary, paras[i]);
    });
  }

  function extractContent(s) {
    var span = document.createElement("span");
    span.innerHTML = s;
    console.log("attempting to extract text :: ", s);
    return span.textContent || span.innerText;
  }

  function createButton(paras, i) {
    var zNode = document.createElement("div");
    zNode.innerHTML =
         `<button id="summarizer_button_${i}" type="button">S</button>`;
    zNode.setAttribute("id", "myContainer");
    console.log("appending child : ", zNode);

    paras[i].appendChild(zNode);

    //--- Activate the newly added button.
    document
      .getElementById("summarizer_button_"+i)
      .addEventListener("click", () => summarize(paras, i), false);
    //--- Style our newly added elements using CSS.

    var summarizer_button = document.getElementById("summarizer_button_"+i);
    summarizer_button.style.background = "red";
    summarizer_button.style.fontSize = "1rem";
    summarizer_button.style.borderRadius = "50%";
  }

  function ButtonClickAction(zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    var zNode = document.createElement("p");
    zNode.innerHTML = "The button was clicked.";
    document.getElementById("myContainer").appendChild(zNode);
  }

  function createSummaryNode(summary, para) {
    var textNode = document.createTextNode(summary);

    var bold = document.createElement("strong");
    bold.style.color = "#ed3535";
    //textNode.setAttribute("id", "summary");
    bold.appendChild(textNode);

    para.appendChild(bold);
  }

  async function postData(url = "", data = {}) {
    const API_KEY = "<ADD_API_KEY>";

    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  function createGPTPrompt(text) {
    console.log("creating gpt prompt : ", text);

    var prompt = text + "\n\ntl;dr:";
    var request = {
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    return request;
  }
})();
