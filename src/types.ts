export type HandlerResponse = {
    status: "success" | "error";
    data?: any;
    message?: string;
};

export type FetchData = {
    method?: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };