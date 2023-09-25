const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// create products
exports.createProduct = asyncHandler( async(req,res) => {
    try {
        if (req.body.title) {
            // if we missed to put in our slug they replace it on what we title on our product
            req.body.slug = slugify(req.body.title);
        };
        if (req.body.title) {
            req.body.description = slugify(req.body.title);
        };
        const newProduct = await Product.create(req.body);
        res.json({newProduct});
    }catch(error){
        throw new Error(error);
    }
});

// return all products
exports.allProducts = asyncHandler(async(req,res) => {

    try {
         //filtering by search /localhost:5000/api/product/?price[gte]=300
        // getting all product that have 300 + 
        const queryObject = { ...req.query };
        const excludeFields = ['page','sort','limit','fields'];
        excludeFields.forEach((el) => delete queryObject[el]);
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //sorting by sample localhost:5000/api/product/?sort=category,brand
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join('');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        };
        // limiting the fields sample localhost:5000/api/product/?fields=title,description,category,price
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        };

        //pagination localhost:5000/api/product?page=3&limit=5
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This Page does not exist');
        };


        const product = await query;
        res.json(product);
    } catch(error){
        throw new Error(error);
    };
});

// update products 
exports.updateProduct = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        };
        const updateProduct = await Product.findOneAndUpdate({ _id: id },req.body,{
            new: true,
        });
        res.json(updateProduct);
        
    } catch(error){
        throw new Error(error);
    }
});


// get individual product
exports.detailProduct = asyncHandler(async(req,res) => {
    const { id } = req.params;
    try {
        const detailProduct = await Product.findById(id);
        res.json(detailProduct);
    } catch(error) {
        throw new Error(error);
    };
});

//product delete

exports.deleteProduct = asyncHandler(async(req,res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findOneAndDelete({ _id:id });
        res.json(`Product Delete ${deleteProduct.title}`);
    } catch(error){
        throw new Error(error);
    };
});

