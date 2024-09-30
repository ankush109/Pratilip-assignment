"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const withAuth_1 = __importDefault(require("./middlewares/withAuth"));
const resolvers = {
    Query: {
        users: (0, withAuth_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://localhost:5000/v1/user/users'); // User Service
            console.log(response, "response from API GATEWAY...");
            return response.data.message;
        })),
        user: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            try {
                const response = yield axios_1.default.get(`http://localhost:5000/v1/user/single-user/${id}`); // User Service
                console.log(response.data.message, "single-id");
                return response.data.message; // Return the user object instead of message
            }
            catch (error) {
                // Log only the message and any other useful information
                console.error("Error fetching user:", error);
            }
        }),
        products: () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://localhost:6000/v1/product/get-all-products'); // Product Service
            return response.data.message;
        }),
        product: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const response = yield axios_1.default.get(`http://localhost:6000/v1/product/get-product/${id}`); // Product Service
            return response.data.message;
        }),
        orders: () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://localhost:7000/v1/orders/get-all-orders'); // Order Service
            return response.data.message;
        }),
        order: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const response = yield axios_1.default.get(`http://localhost:7000/v1/orders/get-order/${id}`); // Order Service
            console.log(response.data.message, "order from gateway");
            return response.data.message[0];
        })
    },
    Mutation: {
        registerUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            const response = yield axios_1.default.post('http://localhost:5000/v1/auth/register', input); // User Servicec
            console.log(response.data.message, "register response");
            return response.data.message;
        }),
        createProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            const response = yield axios_1.default.post('http://localhost:6000/v1/product/create-product', input); // Product Service
            console.log(response.data.message, "o");
            return response.data.message;
        }),
        placeOrder: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            const response = yield axios_1.default.post('http://localhost:7000/v1/orders/create-order', input); // Order Service
            console.log(response.data.message, "order placed...");
            return {
                id: response.data.message.id,
                items: response.data.message.items,
            };
        })
    }
};
exports.default = resolvers;
