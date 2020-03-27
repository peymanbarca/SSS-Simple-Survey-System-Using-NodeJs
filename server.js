var express = require('express');
var bp = require('body-parser');
var app=express();
var session = require('express-session');
var mong=require('mongoose');

// ----------------------- connect to mongo db with url ----------
mong.connect("mongodb://localhost/test1")
var db_state=mong.connection


//for userss -------------------------------------------
var human_schema=new mong.Schema({
	username:String,
    password:String
})

var human_model= mong.model("human",human_schema)

var user1= new human_model({
    username:"user1",
    password:"123"
})


//for comments -------------------------------------------
var comment_schema=new mong.Schema({
    username:String,
    comment:String,
    like:Number
})

var comment_model= mong.model("comment",comment_schema)

// console.log(user1)
// console.log(user1.username)

//for save in dB
// user1.save(function(err,user1){
//     if (err) { throw err}
//     console.log('user1 saved to dB!')
// })

db_state.on('error',function()
{
    console.log('vasl nashodi!!!')
})
db_state.once('connected',function ()
{
    console.log('Connected to mongoDB  !!')
    // human_model.findOne({username:"user1"} , function(err,user){
    //     if(err) { throw err}
    //     console.log(user.username , 'found!')
    // })

})


app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}));
app.use(express.static(__dirname + "/static"));
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));

// ------------- sample import data ------
//
// var users={user1 : "123" , user2 : "1234" , user3 : "12345"};  //replace of db for users
// var comments={
//     "user1" : ["man user 1 hastam ----(--"],
//     "user2" : ["man user 2 hastam ---(--"]
// }; 		//replace of db for comments





// ---------------------------------------------------------- Main BackEnd REST APIs ----------------------------------------------

// ---------------------- retrieve home page ---------
app.get("/" , function(req,resp,next)
{
    console.log("GET");
    resp.sendFile(__dirname + "/static/home.html");
});


/*
*   ,--. ,--.                            ,---.                              ,--.
|  | |  |  ,---.   ,---.  ,--.--.   '   .-'   ,---.  ,--.--. ,--.  ,--. `--'  ,---.  ,---.
|  | |  | (  .-'  | .-. : |  .--'   `.  `-.  | .-. : |  .--'  \  `'  /  ,--. | .--' | .-. :
'  '-'  ' .-'  `) \   --. |  |      .-'    | \   --. |  |      \    /   |  | \ `--. \   --.
 `-----'  `----'   `----' `--'      `-----'   `----' `--'       `--'    `--'  `---'  `----'
*
* */
// ----------------------------------------------------- User service (v0) ---------
// ----------------- get session info ---------------
app.post("/getinfo" , function(req,resp,next)
{
    resp.json(req.session);
});

// ---------------------------- login ---------
app.post("/login" , function(req,resp,next)
{
    if (req.session.auth != undefined)
    {
        resp.json({status : "false" , msg : "you are logged in now !!!"});
    }
    else
    {
        var formdata = req.body
        //console.log("yek request baraye login oomad!");
        //console.log(req.body);
        human_model.findOne({username: formdata.username}, function (err, user) {
            if (err) {
                throw err
            }
            if (user != undefined) {
                if (user.password == formdata.password) {
                    req.session.auth = {username: req.body['username']};
                    resp.json({status: "true", msg: "Login sucssesful!"});
                    

                }
                else {
                    resp.json({status: "false", msg: "wrong password !!!"});
                }
            }
            else {
                resp.json({status: "false", msg: "user not found !!!"});
            }
        })
    }
})


// ------------------- logout ----------------
app.post("/logout" , function(req,resp,next)
{
    req.session.auth =undefined; //namade log out shodan
    resp.json({status : "true" , msg : "Logged out!"});

})


// ----------------- sign-up -------------------
app.post("/signup" , function(req,resp,next)
{
    //with DB
    var formdata=req.body
    if (formdata.username.length && formdata.password.length)
    {
        if(formdata.password.length >=3)
        {
            human_model.find({username:formdata.username},function (err,users) {
                if(err) {throw err}
                else if(users.length)
                {
                    resp.json({status : "false" , msg : "user tekrari! , Registering Not Succsessful!"});
                }
                else
                {
                    var newUser = new human_model({
                        username:formdata.username,
                        password:formdata.password
                    })
                    newUser.save()
                    resp.json({status : "true" , msg : "Registered sucssesfully! hello   " + newUser.username});
                }
                
            })
        }
        else
        {
            resp.json({status : "false" , msg : "Bad password! , Registering Not Succsessful!"});
        }
    }
    else
    {
        resp.json({status : "false" , msg :"Info not complete! Registering Not Succsessful!"});
    }
});


// --------------------- todo : user service v1 : to use JWT for sign-up & login and not use server session -------



/*
* ,-----.                                                  ,--.      ,---.                              ,--.
'  .--./  ,---.  ,--,--,--. ,--,--,--.  ,---.  ,--,--,  ,-'  '-.   '   .-'   ,---.  ,--.--. ,--.  ,--. `--'  ,---.  ,---.
|  |     | .-. | |        | |        | | .-. : |      \ '-.  .-'   `.  `-.  | .-. : |  .--'  \  `'  /  ,--. | .--' | .-. :
'  '--'\ ' '-' ' |  |  |  | |  |  |  | \   --. |  ||  |   |  |     .-'    | \   --. |  |      \    /   |  | \ `--. \   --.
 `-----'  `---'  `--`--`--' `--`--`--'  `----' `--''--'   `--'     `-----'   `----' `--'       `--'    `--'  `---'  `----'

* */
// ------------------------ Commenting (v0) ------------------------

// --------------- submit comment ---------
app.post("/submitComment" , function(req,resp,next)
{
    if(req.session.auth.username != undefined)
    {
        comment_model.create({
            username:req.session.auth.username,
            comment:req.body.msg,like:0}, function (err,comment)
        {

            if (err) {throw err}
            resp.json({status : true , msg : "Your comment has been saved !"});

        })
    }
    else
    {
        resp.json({status : false , msg : "You are Not Login!"});
    }

});

// --------------- get all comments ----------
app.post("/getComment" , function(req,resp,next)
{
    comment_model.find({},function (err,comments)
    {
        if(err) {throw err}
        else
        {
            resp.json(comments)
        }

    })

});

// -------------- todo : comment service to check current login user via JWT token, add more functionalities such as lick,dislike,reply,...


// ------------ deploy ------------

PORT = 8000
app.listen(PORT,'0.0.0.0');
console.log("app is running on port "+PORT);
console.log('http://'+'0.0.0.0'+':'+PORT)
