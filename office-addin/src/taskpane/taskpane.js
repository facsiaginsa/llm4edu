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
    })
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
 * Submission Feature
 */

async function submissionReview() {

  let publisher = document.getElementById('review-input').value;

  return Word.run(async (context) => {

    const file = await getFile()

    const slices = file.sliceCount;
    let byteArrays = [];

    for (let i = 0; i < slices; i++) {
        const slice = await getSlice(file, i)
        byteArrays.push(new Uint8Array(slice.data));
    }

    file.closeAsync();

    const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const formData = new FormData();
    formData.append('file', blob, 'document.docx');

    const response1 = await axios.post(process.env.BACKEND_URL + "/submission", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log(response1)

    const {docId} = response1.data.data

    let response2 = new EventSource(process.env.BACKEND_URL + "/submission/review/" + docId + "?publisher=" + publisher)

    const reviewContainer = document.getElementById('review-container');

    reviewContainer.innerHTML = `<div id="review-response"></div>`;
  
    response2.onmessage = function(event) {
      document.getElementById('review-response').textContent += event.data;
    };
  
    response2.onerror = function(event) {
      console.error('EventSource failed:', event);
      response2.close();
    };
  })
}

async function getFile() {
  return new Promise((resolve, reject) => {
    Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 65536 }, function (result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(result.value);
        } else {
            reject(result.error);
        }
    });
  });
}

async function getSlice(file, i) {
  return await new Promise((resolve, reject) => {
    file.getSliceAsync(i, function (result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(result.value);
        } else {
            reject(result.error);
        }
    });
  });
}

document.getElementById('review-submit-button').onclick = () => submissionReview()

/**
 * End of Submission Feature
 */

/**
 * Rephrase Feature
 */

async function rephraseConfirmation() {
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

async function sendRephraseRequest(text) {

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


/**
 * Brainstorm Feature
 */

async function submitBrainstorm() {
  const input = document.getElementById('brainstorm-input').value;
  console.log("Input text:", input);  // Log input to check if it's capturing correctly

  try {
    const response = await axios.post(`http://localhost:3001/brainstorm`, {
      prompt: input,
    });
    console.log("API Response:", response);  // Log entire response

    console.log("API suggestions:", response.data.brainstormIdea);
    displayBrainstormSuggestions(response.data.brainstormIdea);  // Call the display function
  } catch (error) {
    console.error("Error fetching brainstorm suggestions:", error);
  }
}

function displayBrainstormSuggestions(data) {
  try {
      console.log("brainstorm data:", data);
      const brainstormIdea = JSON.parse(data);
      const suggestions = Object.values(brainstormIdea);
      
      const suggestionElements = suggestions.map(suggestion => {
          return `<li>${suggestion}</li>`;
      }).join('');
      
      const suggestionsElement = document.getElementById('brainstorm-suggestions');
      if (suggestionsElement) {
          suggestionsElement.innerHTML = `<ul>${suggestionElements}</ul>`;
      } else {
          console.error('Element with id "suggestions" not found.');
      }
  } catch (error) {
      console.error('Error fetching brainstorm suggestions:', error);
  }
}


window.submitBrainstorm = submitBrainstorm;
document.getElementById('brainstorm-button').addEventListener('click', submitBrainstorm);


/**
 * End of Brainstorm Feature
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
