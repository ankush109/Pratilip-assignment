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
const OrderService = {
    // Fetch all orders ->
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://localhost:7000/v1/orders/get-all-orders');
            return response.data.message;
        });
    },
    // Fetch order by ID ->
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`http://localhost:7000/v1/orders/get-order/${id}`);
            return response.data.message[0];
        });
    },
    // Place a new order ->
    placeOrder(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(input, "ionput from order creation..");
            const response = yield axios_1.default.post('http://localhost:7000/v1/orders/create-order', input);
            return {
                id: response.data.message.id,
                items: response.data.message.items,
            };
        });
    }
};
exports.default = OrderService;
