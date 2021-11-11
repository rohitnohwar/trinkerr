require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const cors=require("cors");
const fs=require("fs");
const bodyParser = require("body-parser");
const path=require("path");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

const app = express();
app.set('view engine','ejs');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.URI, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const userSchema=new mongoose.Schema({
    name: {type:String, required:true},
    number: {type:Number, required:true},
    index: {type:Number},
    posts:[]
});

const User = mongoose.model("User", userSchema);




app.post("/register", function(req, res){
    User.exists({number:req.body.number}, function (err, doc) {
        if (err){
            console.log(err)
        }else{
            if(!doc){

                    if(err){
                        console.log(err);
                    }
                    else {
                        const newUser= new User({
                            name:req.body.name,
                            number:req.body.number,
                            posts:[0, 1, 2, 3, 4],
                            index:0
                        });
                        newUser.save();
                        res.json({message:"User account created"});
                    }
                
            }
            else{
                res.json({message:"User account already exists"});
            }
        }
    });
});


app.post("/login", function(req, res){
    const number= req.body.number;

    User.findOne({number:number}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else if(!foundUser){
            res.json({auth:false, message:"User doesn't exists"});
        }
        
        else  if(foundUser){
            res.json({auth: true, name:foundUser.name, number:foundUser.number, message:"user exists"});
        }
    });
});


app.get("/posts", function(req, res){
    const number= req.query["number"];

    User.findOne({number:number}, function(err, foundUser){
        if(err){
            console.log(err);
        }        
        else {
            res.json({auth: true, posts:foundUser.posts, index:foundUser.index});
        }
    });
});

app.post("/delete", async function(req, res){
    const number= req.body.number;
    const posts= req.body.posts;


    const condition={
        number:number
    }

    let arr=[]
    for (let i=0; i<posts.length; i++){
        arr.push(posts[i].ind)
    }

    const update={
        posts:arr
    }
    await User.findOneAndUpdate(condition, update,function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
    })
    res.json({})
});

app.post("/next", async function(req, res){
    const number= req.body.number;
    const index= req.body.index;

    const condition={
        number:number
    }

    const update={
        index:index
    }
    await User.findOneAndUpdate(condition, update,function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
    })
    res.json({})
});


app.post("/reset", async function(req, res){
    const number= req.body.number;

    const condition={
        number:number
    }

    const update={
        posts:[0,1,2,3,4],
        index:0
    }
    await User.findOneAndUpdate(condition, update)
    res.json({})
});












const port = process.env.PORT || 3001;

if(process.env.NODE_ENV==="production"){
    app.use(express.static("project/build"));

    app.get("*", function(req, res){
        res.sendFile(path.resolve(__dirname, "project", "build", "index.html"));
    });
}

app.listen(port, () => {
    console.log("running at port 3001")
});