const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        throw err;
    }
}

module.exports = connectDB;