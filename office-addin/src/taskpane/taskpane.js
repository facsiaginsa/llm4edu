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
      popupTimeout = setTimeout(rephraseConfirmation, 500);  // 1 second delay
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
  const tabsButton = document.querySelectorAll('.tabs-button');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  tabsButton.forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(tab).classList.add('active');
  document.getElementById(tab + "-button").classList.add('active');
}

document.getElementById('brainstorm-button').onclick = () => showTab("brainstorm")
document.getElementById('rephrase-button').onclick = () => showTab("rephrase")
document.getElementById('review-button').onclick = () => showTab("review")

/**
 * End of Features Tab Menu
 */


/**
 * Submission Review Feature
 */

async function submissionReview() {

  let publisher = document.getElementById('review-input').value;
  loadingReviewAnimation()

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

    const {docId} = response1.data.data

    let response2 = new EventSource(process.env.BACKEND_URL + "/submission/review/" + docId + "?publisher=" + publisher)

    const reviewContainer = document.getElementById('review-container');

    let eventStart = 0
    let stringData = ""
    let regex = /<li class='review-response'>([\s\S]*?)<\/li>/g
    let reviewList = 0

    response2.onmessage = function(event) {
      if (eventStart == 0) {
        reviewContainer.innerHTML = `<div><ol id="review-response" class="review-response-ol"></ol></div>`;
        eventStart++
      }

      if (event.data == "end_turn") {
        eventStart = 0
        reviewList = 0
        console.log("end_turn", event.data)
        return response2.close();
      }

      stringData += event.data

      let found = stringData.match(regex)

      if (found && found.length != reviewList) {
        document.getElementById('review-response').innerHTML += found[reviewList];
        reviewList = found.length
      }
    };
  
    response2.onerror = function(event) {
      console.error('EventSource failed:', event);
      eventStart = 0
      reviewList = 0
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

async function loadingReviewAnimation() {
  const reviewContainer = document.getElementById('review-container');
  reviewContainer.innerHTML = `
    <div class="review-response">
      <div class="loader"></div>
    </div>
  `
}

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
        <div class="rephase-confirmation-box">
          <p>${range.text}</p>
          <span id="rephrase-confirmation">Rephrase this text!</span>
        </div>
      `
      document.getElementById('rephrase-confirmation').onclick = () => {
        loadingRephraseAnimation()
        sendRephraseRequest(range.text)
      }
    }
  });
}

async function sendRephraseRequest(text) {

  let encodedText = encodeURIComponent(text)
  let response = new EventSource(process.env.BACKEND_URL + '/rephrase?text=' + encodedText)

  const rephraseContainer = document.getElementById('rephrase-container');

  let eventStart = 0
  response.onmessage = function(event) {

    if (eventStart == 0) {
      rephraseContainer.innerHTML = `
        <div id="rephrase-response" class="rephrase-response-box">
          <p id="rephrase-response-text"></p>
          <span onClick="copyTextToClipboard()" id="rephrase-response-copy">Copy Text!</span>
        </div>`;
      eventStart++
    }

    if (event.data == "end_turn") {
      eventStart = 0
      return response.close();
    }
  
    document.getElementById('rephrase-response-text').textContent += event.data;
  };

  response.onerror = function(event) {
    response.close();
    eventStart = 0
  };
}

async function copyTextToClipboard() {
  let text = document.getElementById('rephrase-response-text').textContent;

  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('rephrase-response-copy').textContent = "Text copied to clipboard!"
  })

  setTimeout(() => { 
    document.getElementById('rephrase-response-copy').textContent = "Copy Text!"; 
  }, 4000);
}

async function loadingRephraseAnimation() {
  const rephraseContainer = document.getElementById('rephrase-container');
  rephraseContainer.innerHTML = `
    <div class="rephase-confirmation-box">
      <div class="loader"></div>
    </div>
  `
}

/**
 * End of Rephrase Feature
 */


/**
 * Brainstorm Feature
 */

async function submitBrainstorm() {
  const input = document.getElementById('brainstorm-input').value;
  loadingBrainstormAnimation()

  try {
    const response = await axios.post(process.env.BACKEND_URL + "/brainstorm", {
      prompt: input,
    });

    displayBrainstormSuggestions(response.data); 
  } catch (error) {
    console.error("Error fetching brainstorm suggestions:", error);
  }
}

function displayBrainstormSuggestions(brainstormIdea) {
  try {
      let regex = /```html(.*)```/gs

      if (brainstormIdea.match(regex)) {
        let array = [...brainstormIdea.matchAll(regex)]
        brainstormIdea = array[0][1]
      }

      let suggestions = Array.isArray(brainstormIdea)
          ? brainstormIdea
          : brainstormIdea.split('<br/>').filter(item => item.trim() !== '');

      const suggestionElements = suggestions
          .map((suggestion, index) => `
              <div id="brainstorm-response-${index}" class="brainstorm-response">
                  ${suggestion}
                  <span id="brainstorm-response-copy-${index}" onClick="copyIdeaToClipboard(${index})">Copy this idea!</span>
              </div>
          `)
          .join('');
      
      const suggestionsElement = document.getElementById('brainstorm-suggestions');
      if (suggestionsElement) {
          suggestionsElement.innerHTML = suggestionElements;
      } else {
          console.error('Element with id "brainstorm-suggestions" not found.');
      }
  } catch (error) {
      console.error('Error fetching brainstorm suggestions:', error);
  }
}

async function copyIdeaToClipboard(index) {
  let responseDiv = document.getElementById("brainstorm-response-" + index)
  let paragraphs = responseDiv.getElementsByTagName("p");

  let copyText = paragraphs[0].innerText + "\n\n" + paragraphs[1].innerText + "\n" + paragraphs[2].innerText

  navigator.clipboard.writeText(copyText).then(() => {
    document.getElementById('brainstorm-response-copy-' + index).textContent = "Text copied to clipboard!"
  })

  setTimeout(() => { 
    document.getElementById('brainstorm-response-copy-' + index).textContent = "Copy Text!"; 
  }, 4000);
}

async function loadingBrainstormAnimation() {
  const reviewContainer = document.getElementById('brainstorm-suggestions');
  reviewContainer.innerHTML = `
    <div class="brainstorm-response">
      <div class="loader"></div>
    </div>
  `
}

document.getElementById('brainstorm-input-button').onclick = () => submitBrainstorm()

/**
 * End of Brainstorm Feature
 */