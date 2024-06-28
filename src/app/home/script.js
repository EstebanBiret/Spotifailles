$(document).ready(function() {
    $(window).scroll(function() {
        // navbar appears on scroll
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // Button appears on scroll
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // Go to the top of the page on click
    $('.scroll-up-btn').click(function() {
        $('html').animate({ scrollTop: 0 });

        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function() {

        $('html').css("scrollBehavior", "smooth");
    });

    // Menu navigation responsive
    $('.menu-btn').click(function() {
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");

         // Check if the menu is active and change the image src accordingly
         if ($('.navbar .menu').hasClass("active")) {
            $('#menu-icon').attr("src", "../../assets/cross-svgrepo-com.svg");
        } else {
            $('#menu-icon').attr("src", "../../assets/bars-s-svgrepo-com.svg");
        }
    });
});