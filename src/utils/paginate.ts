const paginate = (array: any[], page: string | 1, limit: string | 10) => {
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = Number(page) * Number(limit);

  return array.slice(startIndex, endIndex);
};

export default paginate;
