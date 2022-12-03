const express = require("express");
const app = express();
const mongo = require("mongoose");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = process.env.PORT || 8000;
const bcrypt = require("bcrypt");
const user = require("./userschema");
const books = require("./schema");
const auth = require("./auth");

mongo.connect("mongodb+srv://admin:admin@cluster0.jum4cnb.mongodb.net/?retryWrites=true&w=majority", (err, res) => {
    if (err) {
        console.log(err);
    }
    if (res) {
        console.log("connected to db");
    }
})
 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors()); 
 
app.post("/register", async (req, res) => {
    try{
    const email = req.body.email;
    const pass = req.body.pass;
    if (email && pass) {
        const hashedpass = bcrypt.hashSync(pass, 10);
        await user.create({ email: email, pass: hashedpass }).then((result) => {
            res.status(200).json({
                result:"registered success"
            })
        }).catch(reason => {
            res.status(404).json({ 
                reason
            })
        })
    }
}catch(err){
    console.log(err);
}
})

app.post("/", async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    if (email && pass) {
        user.findOne({ email: email }, undefined, undefined, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result) {
                bcrypt.compare(pass, result.pass).then(bool => {
                    if(bool){
                        const token = jwt.sign(result.email, "booklist")
                    res.status(200).json({
                        msg: "login Successfully",
                        token: token
                    })
                    }else{
                        res.status(200).json({
                            msg: "incorrect password"})
                    }
                    
                }).catch(error => {
                    res.json({
                        msg: "password incorrect"
                    })
                })
            }
        })
    } else {
        res.json({
            msg: "Provide email and password"
        })
    }
})

app.post("/addbook", auth, async (req, res) => {
    const data = req.body;
    await books.create({
        user: req.user,
        ISBN: data.ISBN,
        description: data.description,
        title: data.title,
        published_by: data.publish_by,
        publish_date: data.publish_date,
        author: data.author
    }).then(result => {
        res.status(200).json({
            result: "book added successfully"
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

app.patch("/update", auth, async (req, res) => {
    const data = req.body;
    await books.updateOne({_id:data._id},{
        user: req.user,
        ISBN: data.ISBN,
        description: data.description,
        title: data.title,
        published_by: data.publish_by,
        publish_date: data.publish_date,
        author: data.author
    }).then(result => {
        res.status(200).json({
            result: "updated successfully"
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

app.get("/getbooks", auth, async (req, res) => {
    await books.find({user:req.user}).then(result => {
        res.status(200).json({
            result: result
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

app.delete("/deletedata",auth,async(req, res) => {
    const data = req.body;
    await books.deleteOne({_id:data._id}).then(result => {
        res.status(200).json({
            result: "deleted Successfully"
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})
app.listen(port, console.log("server is up"))