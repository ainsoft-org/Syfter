import axios, { AxiosResponse } from "axios";

class paramDto {
  key: string;
  value: string;
}

export async function alpha_api(func: string, ...params: paramDto[] | undefined) {
  let link = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_API_KEY}&function=${func}`;
  params.forEach(param => {
    link += `&${param.key}=${param.value}`;
  });
  console.log(link)

  const response: AxiosResponse = await axios.get(link);

  if(func === "LISTING_STATUS" && Object.keys(response.data).length === 0) {
    return {
      "Note": "Limit"
    };
  }

  if(response.data.Note) console.log("LIMIT");

  return response.data;
}