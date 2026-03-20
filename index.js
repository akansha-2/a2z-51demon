var express = require("express");
var bodyparser = require("body-parser");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
var dotenv =require("dotenv");
dotenv.config();

var exe = require("./conn");

var key = "123";

var app = express();

app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

/* LOGIN PAGE */

app.get("/",function(req,res){
    res.render("login.ejs");
});

/* REGISTER PAGE */

app.get("/register",function(req,res){
    res.render("register.ejs");
});

/* SAVE USER */

app.post("/save_user",async function(req,res){

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var sql = `INSERT INTO users (username,useremail,password)
               VALUES (?,?,?)`;

    await exe(sql,[name,email,password]);

    res.redirect("/");
});

/* LOGIN */

app.post("/do_login", async function(req,res){

    var email = req.body.email;
    var password = req.body.password;

    var sql = "SELECT * FROM users WHERE useremail=? AND password=?";

    var data = await exe(sql,[email,password]);

    if(data.length > 0){

        var token = jwt.sign({id:data[0].user_id},key);

        res.cookie("token",token);

        res.redirect("/home");

    }else{

        res.send("Invalid Email or Password");

    }

});


/* TOKEN VERIFY */

function verify(req,res,next){

    var token = req.cookies.token;

    if(!token){
        return res.redirect("/");
    }

    try{
        jwt.verify(token,key);
        next();
    }
    catch(err){
        return res.redirect("/");
    }

}

/* HOME PAGE */

app.get("/home",verify,function(req,res){

    res.render("home.ejs");

});

/* LOGOUT */

app.get("/logout",function(req,res){

    res.clearCookie("token");

    res.redirect("/");

});

app.listen(process.env.PORT || 1000);