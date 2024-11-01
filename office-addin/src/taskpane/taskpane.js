/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

/**
 * Office Event Listener
 */

let popupTimeout;
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, () => {
      clearTimeout(popupTimeout);
      popupTimeout = setTimeout(rephraseConfirmation, 1000);  // 1 second delay
    }); 
  }
});

/**
 * End of Office Event Listener
 */

/**
 * Features Tab Menu
 */

function showTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tab).classList.add('active');
}

document.getElementById('brainstorm-button').onclick = () => showTab("brainstorm")
document.getElementById('rephrase-button').onclick = () => showTab("rephrase")
document.getElementById('review-button').onclick = () => showTab("review")
document.getElementById('summarize-button').onclick = () => showTab("summarize")

/**
 * End of Features Tab Menu
 */

/**
 * Rephrase Feature
 */

export async function rephraseConfirmation() {
  return Word.run(async (context) => {
    const range = context.document.getSelection();
    range.load("text");
    await context.sync();

    if (range.text) {
      showTab("rephrase")
      const rephraseContainer = document.getElementById('rephrase-container');
      rephraseContainer.innerHTML = `
        <div>
          Rephrase text?
          <button id="rephrase-confirmation">Yes</button>
        </div>
      `;

      document.getElementById('rephrase-confirmation').onclick = () => sendRephraseRequest(range.text)
    }
  });
}

export async function sendRephraseRequest(text) {

  let response = new EventSource(process.env.BACKEND_URL + '/rephrase?text=' + text)

  const rephraseContainer = document.getElementById('rephrase-container');

  rephraseContainer.innerHTML = `<div id="rephrase-response"></div>`;

  response.onmessage = function(event) {
    document.getElementById('rephrase-response').textContent += event.data;
  };

  response.onerror = function(event) {
    console.error('EventSource failed:', event);
    response.close();
};
}

/**
 * End of Rephrase Feature
 */

// export async function getSuggestions() {
//   const text = document.getElementById('academicText').value;
//   const response = await fetch(process.env.BACKEND_URL + '/analyze', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text }),
//   });
//   const data = await response.json();
//   document.getElementById('suggestions').innerHTML = data.suggestions;
// }

// export async function scanDocument() {
//   return Word.run(async (context) => {
//     // Get the entire document's content
//     const body = context.document.body.paragraphs;
//     body.load('text');

//     await context.sync()
//     // const text = body.text;
//     body.items.forEach((item) => {
//       console.log(item.text)
//     })

//   });
// }

// export async function popUp() {
//   return Word.run(async (context) => {
//     Office.context.ui.displayDialogAsync( process.env.ADDIN_URL + '/hello.html', { width: 30, height: 30 }, function (asyncResult) {
//       const dialog = asyncResult.value;
//     });
//   })
// }
