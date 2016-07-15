$(function() {
   $(".nav-tabs>li").click(function() {
       var $this = $(this);
       $this.removeClass().addClass("active");
       $this.siblings().removeClass();
       $(".nav-panel").hide().eq($this.index()).show();
   }).eq(0).click();
});