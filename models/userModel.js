//  use !mdbgum for instance to create mongoose db
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type:String,
        default:"user",
    },
    // for ecommerce
    isBlocked: {
        type:Boolean,
        default:false,
    },
    cart: {
        type:Array,
        default: [],
    },
    address: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
    }],
    wishlist: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }],
    refreshToken: {
        type:String,
    },

    
}, 
{
    timestamps:true
});

// encrypt password to hash
userSchema.pre('save',async function(next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
});
// match the password
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compareSync(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);