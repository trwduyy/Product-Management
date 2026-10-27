module.exports = (objectPagination, query, countRecords) => {
  if (query.page) {
    const page = parseInt(query.page);
    if (!isNaN(page) && page > 0) {
      objectPagination.currentPage = page;
    }
  }

  if (query.limit) {
    const limit = parseInt(query.limit);
    if (!isNaN(limit) && limit > 0) {
      objectPagination.limitItems = limit;
    }
  }


  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;

  return objectPagination;
};

