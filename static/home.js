$(document).ready(function()
{

    $.post("/getinfo", function(data)
    {
               $("#auth_status").html("<p>" + JSON.stringify(data) + "</p>")
               if(data.auth)
                {
                    $("#user").html(data['auth']['username'])
                    isAuth = true
                    $("#logout").show();
                }
    })

    var isAuth = false;

    $.post("/getinfo", function(data)
    {
        $("#auth").html(JSON.stringify(data))
        if(data.auth)
        {
            $("#user").html(data['auth']['username'])
            isAuth = true
            $("#logout").show();
            //window.location.href = 'http://www.google.com';
            $("#special").show();
        }
    })

    $("#login").click(function ()
    {
        console.log('Login request!')
        $.post("/login" , {username:$("#username").val() , password : $("#password").val()} , function(data)
        {
            $("#Authinfo").html("<p>" +  data['status'] + "-->" + data['msg'] + "</p>" )
            $.post("/getinfo", function(data)
            {
                $("#auth").html(JSON.stringify(data))
                if(data.auth)
                {
                    $("#user").html(data['auth']['username'])
                    isAuth = true
                    $("#logout").show();
                    //window.location.href = 'http://www.google.com';
                    $("#special").show();
                }
            })
        })

    })

    $("#SignUp").click(function ()
    {
        $.post("/signup" , {username:$("#suUser").val() , password : $("#suPass").val()} , function(data)
        {
            $("#Authinfo").html("<p>" +  data['status'] + "--->" + data['msg'] + "</p>" )



        })

    })


    $("#logout").click(function ()
    {
        $.post("/logout" , {} , function(data){
            $("#Authinfo").html("<p>" +  data['status'] + "-->" + data['msg'] + "</p>" )
            $("#logout").delay(500).fadeOut();
            $("#special").delay(500).fadeOut();
            isAuth=false
        })

    })



    $.post("/getinfo", function(data)
        {
            $("#auth").html(JSON.stringify(data))
            if(data.auth)
            {
                $("#user").html(data['auth']['username'])
                isAuth = true
                $("#seeComment").show();
            }
        })

    $("#submitComment").click(function ()
    {
        if(isAuth) {
            $.post("/submitComment", {msg:$("#msg").val()}, function (data) {
                $("#info").append("<p>" +  data['status'] + "--->" + data['msg'] + "</p>" )


            })

        }
        else {
            alert('You are not logged in!!')
        }

    })

    var getcomment =function ()
    {
        $("#commentBox").html("")

        $.post("/getComment",{} ,function(data)
        {

            data.forEach(function(cm,index)
            {
                console.log(cm)
                $("#commentBox").append("<p>" +cm.username + " : " + cm.comment.toString() + "   , " +
                    "<img src='like.png'>" +
                    " : " + cm.like + "</p>")
            })



        })


    }


    $("#seeComment").click(function ()
    {
      getcomment()
    })






})
