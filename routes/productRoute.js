const express = require('express');
const { createProduct, allProducts, detailProduct, updateProduct, deleteProduct } = require('../controllers/productControl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', allProducts);
router.post('/create',authMiddleware,isAdmin,createProduct);
router.put('/update/:id',authMiddleware,isAdmin,updateProduct);
router.get('/detail/:id', detailProduct);
router.get('/delete/:id',authMiddleware,isAdmin,deleteProduct);



module.exports = router;