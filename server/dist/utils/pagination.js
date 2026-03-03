"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = ({ page = 1, limit = 12 }) => {
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 || limit > 100 ? 12 : limit;
    const skip = (safePage - 1) * safeLimit;
    return { page: safePage, limit: safeLimit, skip };
};
exports.getPagination = getPagination;
