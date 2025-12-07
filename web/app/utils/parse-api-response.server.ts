type APIResponse<Expected> = {
  message: string;
  result: Expected;
};

export async function parseAPIResponse<Expected>(
  response: Response
): Promise<APIResponse<Expected>> {
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ error: "There was an error calling the API" }),
      {
        status: response.status,
        statusText: response.statusText,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return response.json().then((data) => {
    return data;
  });
}
