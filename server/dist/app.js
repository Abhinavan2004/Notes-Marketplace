"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const notes_routes_1 = __importDefault(require("./routes/notes.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const reviews_routes_1 = __importDefault(require("./routes/reviews.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const coupons_routes_1 = __importDefault(require("./routes/coupons.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, morgan_1.default)('dev'));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/notes', notes_routes_1.default);
app.use('/api/orders', orders_routes_1.default);
app.use('/api/reviews', reviews_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
app.use('/api/coupons', coupons_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
