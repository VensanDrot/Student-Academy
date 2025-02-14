export const GetCorrectedLink = (path: string) => {
  if (!path) return "";
  return `${process.env.REACT_APP_BACKEND_URL}/download?key=${path}`;
};
export const GetCorrectedLinkImg = (path: string) => {
  if (!path) return "";
  return `https://jowi-academy-staging-storage.ams3.digitaloceanspaces.com/${path}`;
};
