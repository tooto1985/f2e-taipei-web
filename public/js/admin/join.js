(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.7&appId=1734247563504571";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); //facebook api

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
    
    $(".delete").click(function() {
        if (confirm('確定要刪除?')) {
            var id = $(this).parent().parent().data("id");
            location.href="/admin/join/delete/" + id;
        }
    });
    
    $(".reject").click(function() {
        if (confirm('確定要拒絕?')) {
            var id = $(this).parent().parent().data("id");
            location.href="/admin/join/reject/" + id;
        }
    });
    
    $(".resolve").click(function() {
        if (confirm('確定要通過?')) {
            var id = $(this).parent().parent().data("id");
            location.href="/admin/join/resolve/" + id;
        }
    });    
    
    $(".reset").click(function() {
        if (confirm('確定要未審?')) {
            var id = $(this).parent().parent().data("id");
            location.href="/admin/join/reset/" + id;
        }
    });      
    
    $(".edit").click(function() {
        var id = $(this).parent().parent().data("id");
        location.href="/admin/join/edit/" + id;

    });        
    
    window.fbAsyncInit = function() {
        FB.getLoginStatus(function(response) {
            $("div[data-fbid]").each(getFBdata);   
        });
    }
    
});