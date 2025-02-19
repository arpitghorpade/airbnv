const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

//Signup

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req ,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email, username});
        const registeredUser =  await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) =>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//Login User

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});


router.post("/login", saveRedirectUrl , passport.authenticate("local" , {failureRedirect : "/login", failureFlash : true}) ,async(req ,res)=>{
    //console.log("welcome");
   req.flash("success" , "Welcome to Wanderlust! You are Succesfully Logged in");
   let redirectUrl = res.locals.redirectUrl || "/listings"; 
   res.redirect(redirectUrl);
});


//Logout User
 
router.get("/logout" , (req, res) =>{
    req.logout((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success" , "User Logged Out!");
        res.redirect("/listings");
    })
})

module.exports =router;