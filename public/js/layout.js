(function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-80820226-1', 'auto');
    ga('send', 'pageview');    
})(); //google analytics

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.7&appId=1628843680680885";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); //facebook api


$(function() {
    var isLogin = false;

    function delete_cookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    function logout() {
        isLogin = false;
        $(".username>.caret,.userphoto,.usermenu").addClass("hide");
        $(".username>span").text("登入");
    }

    function login() {
        isLogin = true;
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].split("=")[0].indexOf("fblo_") != -1) {
                delete_cookie(cookies[i].split("=")[0]);
            }
        }
        $(".username>.caret,.userphoto,.usermenu").removeClass("hide");
        FB.api('/me', function(userdata) {
            FB.api("/" + userdata.id + "/picture", function(response) {
                if (response && !response.error) {
                    $(".username>span").text(userdata.name);
                    $(".userphoto").attr("src", response.data.url).show();
                    $(".myfb").attr("href", "https://www.facebook.com/" + userdata.id);
                }
            });
        });
    }

    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            login();
        } else {
            logout();
        }
    }

    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            checkAccessToken(response.authResponse);
            statusChangeCallback(response);
        });
    }
    
    function checkAccessToken(data) {
        if (data) {
            $.get("check",{accessToken:data.accessToken},function() {
                
            });
        }
        
    }

    window.fbAsyncInit = function() {
        checkLoginState();
    };


    $(".username").click(function(e) {
        if (!isLogin) {
            FB.login(function(response) {
                checkAccessToken(response.authResponse);
                statusChangeCallback(response);
            });
            e.stopPropagation();
        }
    });

    $(".logout").click(function() {
        FB.logout(function(response) {
            statusChangeCallback(response);
        });
    });


});