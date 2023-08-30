"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const __1 = require("..");
const paginate = (items, currentPage, limit, patch) => {
    let hasNextPage;
    let hasPreviousPage;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const results = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / limit);
    const totalItems = items.length;
    hasNextPage = endIndex < items.length;
    hasPreviousPage = startIndex > 0;
    if (hasNextPage) {
        hasNextPage = __1.URL + `/${patch}/` + '?page=' + ((currentPage) + 1);
    }
    else {
        hasNextPage = null;
    }
    if (hasPreviousPage) {
        hasPreviousPage = __1.URL + `/${patch}/` + '?page=' + ((currentPage) - 1);
    }
    else {
        hasPreviousPage = null;
    }
    return {
        results,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        totalItems
    };
};
exports.paginate = paginate;
