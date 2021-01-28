import getApiBaseUrl from "./getApiBaseUrl";

export async function fetchData(
  accessToken: string,
  url: string
): Promise<any> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  headers.append("Access-Control-Allow-Origin", "*");

  return fetch(getApiBaseUrl() + url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
