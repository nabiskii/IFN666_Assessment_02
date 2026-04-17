const generatePaginationLinks = (originalUrl, currentPage, totalPages, limit) => {
    const baseUrl = originalUrl.split('?')[0];
    const links = {};

    links.first = `${baseUrl}?page=1&limit=${limit}`;
    links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;

    if (currentPage > 1) {
        links.previous = `${baseUrl}?page=${currentPage - 1}&limit=${limit}`;
    }

    if (currentPage < totalPages) {
        links.next = `${baseUrl}?page=${currentPage + 1}&limit=${limit}`;
    }

    return links;
};

module.exports = generatePaginationLinks;
