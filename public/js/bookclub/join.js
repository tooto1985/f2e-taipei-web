$(function() {
    
    function getFBdata() {
        var $this = $(this);
        var id = $this.data("fbid");
        FB.api("/"+id, function(userdata) {
            FB.api("/" + userdata.id + "/picture", function(response) {
                if (response && !response.error) {
                    var html="";
                    html+="<a href=\"" + "https://www.facebook.com/" + userdata.id + "\" target=\"_blank\">";
                    html+="<img src=\"" + response.data.url + "\">";
                    html+="<span>" + userdata.name + "</span>";
                    html+="</a>";
                    $this.html(html);
                }
            });
        });
    }
    
    function checkJoin(id) {
        $("table").each(function() {
            if ($(this).find("div[data-fbid='" + id + "']").length) {
                $(this).find(".btn-login").text("已參加").addClass("btn-success");
            }
        });
    }
    
    
    
    $(".btn-login").click(function() {
        var $this = $(this);
        var date = $this.parent().parent().parent().parent().data("date");
        if ($this.text() === "請先登入") {
            $(".username").click();    
        } else if ($this.text() === "已參加") {
            FB.api('/me', function(userdata) {
                $.getJSON("/bookclub/join/" + date + "/" + userdata.id + "/leave", function() {
                    $this.parent().parent().prev().find("div[data-fbid='" + userdata.id + "']").remove();
                    $this.text("參加").removeClass("btn-success");
                });
            });
        } else if ($this.text() === "參加") {
            FB.api('/me', function(userdata) {
                
                $.getJSON("/bookclub/join/" + date + "/" + userdata.id + "/join", function() {
                    $this.parent().parent().prev().find("td").append("<div data-fbid=\"" + userdata.id + "\"></div>");
                    $this.parent().parent().prev().find("div[data-fbid]").each(getFBdata);
                    $this.text("已參加").addClass("btn-success");                    
                });
            });
        }
    });
    
    
    $(window).on("fblogin",function() {
        FB.api('/me', function(userdata) {
            $(".btn-login").text("參加");
            $("div[data-fbid]").each(getFBdata);
            $(".list").show();
            checkJoin(userdata.id);
        });  
    });
    
    
    
    $(window).on("fblogout",function() {
        $(".btn-login").text("請先登入");
        $(".list").hide();
    });
    
    
    
    

    
});


    
        

    
