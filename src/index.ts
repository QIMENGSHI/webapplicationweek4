import app from './app';
import mongoose, { Connection } from 'mongoose';

const PORT = 3000;
const mongoDB: string = 'mongodb://localhost:27017/my_database';

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
