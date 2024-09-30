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
exports.validateToken = void 0;
const axios_1 = __importDefault(require("axios"));
const validateToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Validating token");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization token required');
    }
    const token = authHeader;
    console.log(token, "GraphQL token");
    try {
        const response = yield axios_1.default.post('http://localhost:5000/v1/user/validate-token', { token });
        req.user = response.data.user;
    }
    catch (error) {
        console.error('Token validation error:', error);
        throw new Error('Invalid or expired token');
    }
});
exports.validateToken = validateToken;
