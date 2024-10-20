/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */
let typingTimer;
const typingDelay = process.env.TYPING_DELAY; // in miliseconds

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    // Get Data from text area
    document.getElementById('getSuggestions').onclick = getSuggestions;

    // Trigger pop up
    document.getElementById('displayPopUp').onclick = popUp;

    // Scan document everytime user stop typing for 3 second <- configured by typingDelay parameter
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(scanDocument, typingDelay);
    });
  }
});

export async function getSuggestions() {
  const text = document.getElementById('academicText').value;
  const response = await fetch(process.env.BACKEND_URL + '/analyze', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
  });
  const data = await response.json();
  document.getElementById('suggestions').innerHTML = data.suggestions;
}

export async function scanDocument() {
  return Word.run(async (context) => {
    // Get the entire document's content
    const body = context.document.body.paragraphs;
    body.load('text');

    await context.sync()
    // const text = body.text;
    body.items.forEach((item) => {
      console.log(item.text)
    })

  });
}

export async function popUp() {
  return Word.run(async (context) => {
    Office.context.ui.displayDialogAsync( process.env.ADDIN_URL + '/hello.html', { width: 30, height: 30 }, function (asyncResult) {
      const dialog = asyncResult.value;
    });
  })
}
