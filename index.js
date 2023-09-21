const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
//database
dbConnect();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// authentication 
app.use('/api/user',userRoute);

// error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
});