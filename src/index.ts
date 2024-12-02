import app from './app';
import mongoose, { Connection } from 'mongoose';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
