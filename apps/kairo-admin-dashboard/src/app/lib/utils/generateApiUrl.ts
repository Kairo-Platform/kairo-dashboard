import qs from "qs";

export const generateApiUrl = ({ baseUrl = "", path = "", query = {} }) => {
  let queryString = qs.stringify(query);
  queryString = queryString ? `?${queryString}` : "";
  return `${baseUrl}${path}${queryString}`;
};

export default generateApiUrl;
