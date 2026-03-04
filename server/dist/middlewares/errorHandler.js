"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ message });
};
exports.errorHandler = errorHandler;
