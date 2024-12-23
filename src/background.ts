import { HandlerResponse } from "./types";
import { FetchData } from "./types";


const handlers = {
    handleFetch: async (data: FetchData): Promise<HandlerResponse> => {
        const method = data.method?.toUpperCase() || "GET";
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(data.headers || {}),
            },
        };

        if (method === "POST" && data.body) {
            options.body = JSON.stringify(data.body);
        }

        try {
            const response = await fetch(data.url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return { status: "success", data: json };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },
};

type CommandHandlers = {
    [command: string]: (data: any) => Promise<HandlerResponse> | HandlerResponse;
};

const commandHandlers: CommandHandlers = {
    fetch: handlers.handleFetch,
};

chrome.runtime.onMessage.addListener(
    (message: { command: string; data: any }, _sender, sendResponse) => {
        const { command, data } = message;

        if (commandHandlers[command]) {
            const handler = commandHandlers[command];
            try {
                const result = handler(data);
                if (result instanceof Promise) {
                    result
                        .then(sendResponse)
                        .catch((err: any) =>
                            sendResponse({ status: "error", message: err.message })
                        );
                    return true; // Indicate asynchronous response
                } else {
                    sendResponse(result);
                }
            } catch (error: any) {
                sendResponse({ status: "error", message: error.message });
            }
        } else {
            sendResponse({ status: "error", message: "Unknown command" });
        }

        return true; // Indicate asynchronous response
    }
);