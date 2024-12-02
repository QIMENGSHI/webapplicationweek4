import mongoose, { Schema, Document, Types } from 'mongoose';
interface ITodo {
    title: string;
    completed: boolean;
}

let TodoSchema: Schema = new Schema<ITodo>({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

interface IUser extends Document {
    name: string;
    todos: Types.DocumentArray<ITodo>;
}
let UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true },
    todos: { type: [TodoSchema], default: [] },
});