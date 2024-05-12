const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cloudinary=require('cloudinary')
// import {v2 as cloudinary} from 'cloudinary';
// import fs from 'fs'

app.use(express.json());
app.use(cors({
    origin: '*' 
}));
//connetion of cloudinary
         
          
cloudinary.config({ 
  cloud_name: 'dpjlxo41h', 
  api_key: '831857416125862', 
  api_secret: 'pGOKTKM4uxuTK1Zi4Q3MwHBiAbI' 
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        
        console.log('Upload success', response.secure_url);
        return response.secure_url;
    } catch (error) {
        console.error('Upload error:', error.message);
        return null;
    }
};

// Database connection with MongoDB
mongoose.connect('mongodb+srv://mc180406267:twH7p5hcE9nWpefd@cluster0.trbmmqp.mongodb.net/Ecommerce')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// API Creation
app.get('/', (req, res) => {
    res.send('Express app is running');
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));
app.post('/upload',upload.single('product'), async (req,res)=>{
    const imageUrl = await uploadCloudinary(req.file.path);
        if (imageUrl) {
            res.json({
                success: 1,
                image_url: imageUrl
            });
        }
})

// Schema for Creating Products
const { Schema } = mongoose;
const productSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', productSchema);

app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let new_id;

        if (products.length > 0) {
            let last_product = products[products.length - 1];
            new_id = last_product.id + 1;
        } else {
            new_id = 1;
        }

        const product = new Product({
            id: new_id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        console.log('Product:', product);

        await product.save();

        console.log('Saved on MongoDB');

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//Creating API for delete product

app.post('/remove',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log('removed');
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API for getting all Products

app.get('/allproducts',async (req,res)=>{
    let products =await Product.find({})
    console.log('all Products Fetched');
    res.send(products)
})


//Shema creating for user model
const Users= mongoose.model('Users',{
    name:{type:String,},
    email:{type:String,unique:true,},
    password:{type:String,},
    cartData:{type:Object},
    date:{type:Date,default:Date.now}
})

// creating api for singUp
app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:'existing user have same email'})
    }
    let cart={}
    for (let i=0;i<300;i++){cart[i]=0}
    const user= new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })
    await user.save()

     const data={user:{id:user.id}}
     const token = jwt.sign(data,'secret_ecom')
     res.json({seccess:true,token})
})
//creating endpoint for login
app.post('/login',async(req,res)=>{
    console.log('start');
    let user =await Users.findOne({email:req.body.email})
    if(user){
        const passCompare= req.body.password === user.password
        if(passCompare){
            const data={
                user:{id:user.id}
            }
            const token = jwt.sign(data,'secret_ecom')
           res.json({seccess:true,token})
        }else{
            res.json({seccess:false,errors:'Wrong Pawword'}) 
        }
         
    }else{
        res.json({seccess:false,errors:'Wrong Emial ID'}) 
    }
})

//meddelware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token'); 
    if (!token) {
        res.status(401).send({ errors: "Please authenticate valid" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using valid" });
        }
    }
};
//Creating endpoint for adding products in cartdata 
app.post('/addtocart',fetchUser,async(req,res)=>{
    let userData =await Users.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send('Added')
})
//remove cart data
app.post('/removecart',fetchUser,async(req,res)=>{
    let userData =await Users.findOne({_id:req.user.id})
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send('Removed') 
})
//get cart data

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log('getCart');
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})
app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});
