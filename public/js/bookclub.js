$(function() {
    $(".googlemap").click(function() {
        $(".googlemap iframe").css("pointer-events", "auto")
    }).mouseleave(function() {
        $(".googlemap iframe").css("pointer-events", "none")
    }).mouseleave();
});