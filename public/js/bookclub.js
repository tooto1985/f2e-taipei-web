$(function() {
    $(".googlemap").click(function() {
        $(".googlemap iframe").css("pointer-events", "auto")
    }).mouseleave(function() {
        $(".googlemap iframe").css("pointer-events", "none")
    }).mouseleave();
    
    $(".gotoList").click(function() {
       location.href="/bookclub/list" ;
    });
    
    $(".gotoJoin").click(function() {
       location.href="/bookclub/join" ;
    });    
});