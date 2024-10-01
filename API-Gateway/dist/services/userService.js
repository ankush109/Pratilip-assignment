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
const UserService = {
    // Fetch all users -> 
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get('http://user-service:5000/v1/user/users');
            return response.data.message;
        });
    },
    // Fetch user by ID ->
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`http://user-service:5000/v1/user/single-user/${id}`);
            return response.data.message;
        });
    },
    // Register a new user ->
    registerUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post('http://user-service:5000/v1/auth/register', input);
            return response.data.message;
        });
    },
    loginUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post('http://user-service:5000/v1/auth/login', input);
            return response.data.message;
        });
    }
};
exports.default = UserService;
