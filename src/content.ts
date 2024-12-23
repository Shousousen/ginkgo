import { HandlerResponse } from "./types";
import { FetchData } from "./types";


/**
* Sends a message to the background script and handles the response.
*/
function sendMessageToBackground<T>(
  command: string,
  data: T
): Promise<HandlerResponse> {
  return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ command, data }, (response: HandlerResponse) => {
          if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
          } else {
              resolve(response);
          }
      });
  });
}

/**
* Test function to communicate with the background script.
*/
async function testFetchFromBackground() {
  const testFetchData: FetchData = {
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
  };

  try {
      const response = await sendMessageToBackground("fetch", testFetchData);
      if (response.status === "success") {
          console.log("Success:", response.data);
      } else {
          console.error("Error:", response.message);
      }
  } catch (error) {
      console.error("Communication Error:", error);
  }
}

// Execute the test function
testFetchFromBackground();