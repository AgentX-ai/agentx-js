export function getHeaders(apiKey?: string): Record<string, string> {
  return {
    accept: "*/*",
    "x-api-key": apiKey || process.env.AGENTX_API_KEY || "",
  };
}
