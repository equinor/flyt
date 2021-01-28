import getApiBaseUrl from "./getApiBaseUrl";

export async function postData(
  accessToken: string,
  url: string,
  body: unknown
): Promise<any> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  return fetch(getApiBaseUrl() + url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
