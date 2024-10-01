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
// Define the ProductService object
const ProductService = {
    // Fetch all products
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://localhost:6000/v1/product/get-all-products');
            return response.data.message;
        });
    },
    // Fetch product by ID
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`http://localhost:6000/v1/product/get-product/${id}`);
            return response.data.message;
        });
    },
    // Create a new product
    createProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post('http://localhost:6000/v1/product/create-product', input);
            return response.data.message;
        });
    }
};
exports.default = ProductService;
