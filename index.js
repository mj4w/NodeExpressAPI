const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const productRoute = require('./routes/productRoute');
const morgan = require('morgan');
//database
dbConnect();

// morgan use to check what CRUD we send
app.use(morgan("dev"));
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// url for users 
app.use('/api/user',userRoute);
// url for product
app.use('/api/product',productRoute);

// error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
});