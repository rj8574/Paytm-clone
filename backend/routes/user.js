const express = require("express");
const router = express.Router();
const zod =require("zod");
const {User,Account} =require("../db");
const JWT_SECRET = require("../config");
const jwt=require("jsonwebtoken");
const {authMiddleware}=require("../middleware")


const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup" ,async (req,res)=>{
    const {success} =signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"Email already taken/Incorrect input"
        })
    }
    const existingUser= await User.findOne({
        username :req.body.username
    })
    if(existingUser)
    {
        return res.status(411).json({
            message:"Email already taken/incorrect inputs 1"

        })
    }

    const user=await User.create({
        username :req.body.username,
        password :req.body.password,
        firstName :req.body.firstName,
        lastName :req.body.lastName,

    })
    const userId=user._id;
   
    await Account.create({
        userId,
        balance: 1+Math.random()*10000
    })
    const token=jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody =zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post('/signin' ,(req,res)=>{
   
    const {success} =signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"Email already taken/Incorrect input"
        })
    }
    const user= User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(user)
    {
        const token=jwt.sign({
            userId :user._id,
        },JWT_SECRET)

        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        message:"Error while logging in"
    })
})
const updateUser =zod.object({
    password :zod.string(),
    firstName:zod.string(),
    lastName :zod.string()
})
router.put('/',authMiddleware, async(req,res)=>{
    const {success}=updateUser.safeParse(req.body)
    if(!success){
        return res.status(411).json(
            {
                message:"Error while updating information"
            }
        )
    }
    await User.updateOne(req.body,{
        _id:req.user_id
    })
    res.json({
        message:"update successfully"
    })
})


router.get('/bulk',async(req,res)=>{
    const filter=req.query.filter || "";

    const users=await User.find({
        $or:[{
            firstname:{
                "$regex":filter
            }
        },{
                lastName:{
                    "$regex":filter
                }   
        }]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports=router;