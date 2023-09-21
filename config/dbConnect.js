const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB',conn);
    }
    catch (err) {
        console.log(err)
    }
    
};

module.exports = dbConnect;