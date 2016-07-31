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
        $(".btn-create").show();
        $("table").each(function() {
            var $this = $(this);
            var $btnlogin = $this.find(".btn-login");
            if ($this.find(".user div[data-fbid='" + id + "']").length) {
                $btnlogin.text("已參加").addClass("btn-success");
            } else {
                if ($btnlogin.data("over")) {
                    $btnlogin.text("額滿").addClass("btn-danger");
                }
            }
            if ($this.find(".host div[data-fbid='" + id + "']").length) {
                $btnlogin.text("主持人").addClass("btn-info");
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
                $.getJSON("/bookclub/join/" + date + "/leave", function() {
                    $this.parent().parent().prev().find("div[data-fbid='" + userdata.id + "']").remove();
                    $this.text("參加").removeClass("btn-success").removeClass("btn-info");
                });
            });
        } else if ($this.text() === "參加") {
            FB.api('/me', function(userdata) {
                $.getJSON("/bookclub/join/" + date + "/join", function(data) {
                    if (data) {
                        $this.parent().parent().prev().find("td").append("<div data-fbid=\"" + userdata.id + "\"></div>");
                        $this.parent().parent().prev().find("div[data-fbid]").each(getFBdata);
                        $this.text("已參加").addClass("btn-success").removeClass("btn-info");                    
                    } else {
                        alert("請重新整理頁面");
                    }
                });
            });
        }
    });

    $(".btn-create").click(function() {
       location.href="/bookclub/create";
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
        $(".btn-login").text("請先登入").removeClass("btn-success").removeClass("btn-info");
        $(".list").hide();
        $(".btn-create").hide();
    });
    
});


    
        

    
