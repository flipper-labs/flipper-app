export const shortenAddress = (address: string | undefined) => {
  return address?.slice(0, 5) + "..." + address?.slice(-4);
};
