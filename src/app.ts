import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import mongoose, { Connection } from 'mongoose';
import { User } from './models/User';


const mongoDB: string = 'mongodb://127.0.0.1:27017/testdb';

console.log('Connecting to MongoDB...');

mongoose.connect(mongoDB)
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');

    mongoose.connection.db?.listCollections().toArray().then((names: any[]) => {
        console.log(names);
    }).catch((err: any) => {
        console.error('Error listing collections:', err);
    });
});

mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});
mongoose.Promise = Promise
const db: Connection = mongoose.connection
db.on("error", console.error.bind(console,"MongoDB connection error:"))
User.create({ name: "John", todos: [{ todo: "Buy milk", checked: false }] })
    .then(user => {
        console.log('User created:', user);
    })
    .catch(err => {
        console.error(err);
    });
console.log('Connected to MongoDB');
// Type Definitions
// type Todo = string;
// type TUser = { 
//     name: string; 
//     todos: Todo[] 

// };

// Initialize Express
const app: Application = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-Memory Users
// let users: TUser[] = [];

// File Operations
// const loadData = async (): Promise<void> => {
//     try {
//         const data = await fs.readFile('data.json', 'utf-8');
//         users = JSON.parse(data);
//     } catch {
//         users = [];
//     }
// };

// const saveData = async (): Promise<void> => {
//     await fs.writeFile('data.json', JSON.stringify(users, null, 2));
// };

// const initFile = async (): Promise<void> => {
//     try {
//         await fs.access('data.json');
//     } catch {
//         await fs.writeFile('data.json', '[]');
//     }
// };

// Routes
app.post('/add', async (req: Request, res: Response): Promise<void> => {
    const { name, todo }: { name: string; todo: string } = req.body;
    try {
        let user = await User.findOne({name})
        if (!user) {
            user = new User({name, todos: [{todo, checked: false}]});
        } else {
            user.todos.push({todo, checked: false});

        }
        await user.save();
        res.status(200).send(`Todo added successfully for user ${name}`);
    } catch (error) {
        res.status(500).send('Error adding todo');
    }
    // const { name, todo }: { name: string; todo: string } = req.body;
    // let user = users.find((u) => u.name === name);

    // if (user) {
    //     user.todos.push(todo);
    // } else {
    //     user = { name, todos: [todo] };
    //     users.push(user);
    // }

    // await saveData();
    // res.send(`Todo added successfully for user ${name}`);
});

app.get('/todos/:name', async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({name: req.params.name})
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.json(user);
        
    } catch (error) {
        res.status(500).send('Error fetching todos');
    }
    // const { id } = req.params;
    // const user = users.find((u) => u.name === id);

    // if (user) {
    //     res.json(user);
    // } else {
    //     res.status(404).send('User not found');
    // }
});

app.delete('/delete', async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    try {
        await User.deleteOne({ name });
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
    // const { name }: { name: string } = req.body;
    // const index = users.findIndex((u) => u.name === name);

    // if (index > -1) {
    //     users.splice(index, 1);
    //     await saveData();
    //     res.send('User deleted successfully');
    // } else {
    //     res.status(404).send('User not found');
    // }
});

app.delete('/update', async (req: Request, res: Response): Promise<void> => {
    const { name, todo } = req.body;

    try {
        const user = await User.findOne({ name });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

            // Remove the todo
            user.todos = user.todos.filter((t) => t.todo !== todo);
            await user.save();
            res.send('Todo deleted successfully');
            return;
        
    } catch (error) {
        res.status(500).send('Error updating or deleting todo');
    }
});

app.put('/updateTodo', async (req: Request, res: Response): Promise<void> => {
    const { name, todo, checked} = req.body;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

            // update the checked status
            user.todos = user.todos.map((todo1) => {
                if (todo1.todo === todo) {
                    todo1.checked = checked;
                }
                return todo1;
            });
            await user.save();
            res.status(200).send('Todo updated successfully');
            return; 
        
    } catch (error) {
        res.status(500).send('Error updating or deleting todo');
    }

})
    


    

// Initialize File and Load Data
// (async () => {
//     await initFile();
//     await loadData();
// })();

export default app;

