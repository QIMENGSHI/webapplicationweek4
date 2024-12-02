import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import mongoose, { Connection } from 'mongoose';


const mongoDB: string = 'mongodb://127.0.0.1:27017/my_database';

mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection


// Type Definitions
type Todo = string;
type TUser = { 
    name: string; 
    todos: Todo[] 

};

// Initialize Express
const app: Application = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-Memory Users
let users: TUser[] = [];

// File Operations
const loadData = async (): Promise<void> => {
    try {
        const data = await fs.readFile('data.json', 'utf-8');
        users = JSON.parse(data);
    } catch {
        users = [];
    }
};

const saveData = async (): Promise<void> => {
    await fs.writeFile('data.json', JSON.stringify(users, null, 2));
};

const initFile = async (): Promise<void> => {
    try {
        await fs.access('data.json');
    } catch {
        await fs.writeFile('data.json', '[]');
    }
};

// Routes
app.post('/add', async (req: Request, res: Response): Promise<void> => {
    const { name, todo }: { name: string; todo: string } = req.body;
    let user = users.find((u) => u.name === name);

    if (user) {
        user.todos.push(todo);
    } else {
        user = { name, todos: [todo] };
        users.push(user);
    }

    await saveData();
    res.send(`Todo added successfully for user ${name}`);
});

app.get('/todos/:id', (req: Request, res: Response): void => {
    const { id } = req.params;
    const user = users.find((u) => u.name === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/delete', async (req: Request, res: Response): Promise<void> => {
    const { name }: { name: string } = req.body;
    const index = users.findIndex((u) => u.name === name);

    if (index > -1) {
        users.splice(index, 1);
        await saveData();
        res.send('User deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
});

app.put('/update', async (req: Request, res: Response): Promise<void> => {
    const { name, todo }: { name: string; todo: string } = req.body;
    const user = users.find((u) => u.name === name);

    if (user) {
        user.todos = user.todos.filter((t) => t !== todo);
        await saveData();
        res.send('Todo deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
});

// Initialize File and Load Data
(async () => {
    await initFile();
    await loadData();
})();

export default app;

