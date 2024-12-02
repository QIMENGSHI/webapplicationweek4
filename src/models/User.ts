import mongoose, { Schema, Document, Types } from 'mongoose';

// Todo interface and schema
interface ITodo {
  todo: string;
  checked?: boolean;
}

const TodoSchema: Schema = new Schema<ITodo>({
  todo: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

// User interface and schema
interface IUser extends Document {
  name: string;
  todos: Types.DocumentArray<ITodo>;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  todos: { type: [TodoSchema], default: [] },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
