const baseURL = "https://ipfs.io/ipfs/";

export const fetchFromIpfs = async (hash: string): Promise<string> => {
  const res = await fetch(baseURL + hash, {
    method: "GET",
  });

  if (!res.body) {
    return "";
  }

  const jsonText = await res.text();
  const json = JSON.parse(jsonText);

  const imageHash = json.image as string;

  return baseURL + imageHash.substring(7);
};
