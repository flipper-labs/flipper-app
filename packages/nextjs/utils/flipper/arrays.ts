export const mapAsyncParallel = async (arr: any[], fn: any) => {
  return await Promise.all(arr.map(fn));
};
