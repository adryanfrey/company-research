import { parseAPIResponse } from "./parse-api-response.server";

type FetchAPIParams = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data: any;
  headers?: Record<string, string>;
};

export async function fetchFromAPI<Expected>({
  url,
  method,
  data,
  headers = {
    "Content-Type": "application/json",
  },
}: FetchAPIParams) {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL is not set");
  }

  const fullUrl = `${apiBaseUrl}${url}`;

  const response = await fetch(fullUrl, {
    method,
    body: JSON.stringify(data),
    headers,
    keepalive: true,
  });

  return await parseAPIResponse<Expected>(response);
}
