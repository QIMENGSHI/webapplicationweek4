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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promises_1 = __importDefault(require("fs/promises"));
// Initialize Express
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
// In-Memory Users
let users = [];
// File Operations
const loadData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile('data.json', 'utf-8');
        users = JSON.parse(data);
    }
    catch (_a) {
        users = [];
    }
});
const saveData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile('data.json', JSON.stringify(users, null, 2));
});
const initFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.access('data.json');
    }
    catch (_a) {
        yield promises_1.default.writeFile('data.json', '[]');
    }
});
// Routes
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo } = req.body;
    let user = users.find((u) => u.name === name);
    if (user) {
        user.todos.push(todo);
    }
    else {
        user = { name, todos: [todo] };
        users.push(user);
    }
    yield saveData();
    res.send(`Todo added successfully for user ${name}`);
}));
app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((u) => u.name === id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).send('User not found');
    }
});
app.delete('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const index = users.findIndex((u) => u.name === name);
    if (index > -1) {
        users.splice(index, 1);
        yield saveData();
        res.send('User deleted successfully');
    }
    else {
        res.status(404).send('User not found');
    }
}));
app.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo } = req.body;
    const user = users.find((u) => u.name === name);
    if (user) {
        user.todos = user.todos.filter((t) => t !== todo);
        yield saveData();
        res.send('Todo deleted successfully');
    }
    else {
        res.status(404).send('User not found');
    }
}));
// Initialize File and Load Data
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initFile();
    yield loadData();
}))();
exports.default = app;
