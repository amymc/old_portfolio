
//initialize skrollr.js - parallax scrolling plugin
var s = skrollr.init();
//initiate skrollr-menu - plugin to allow hash navigation on mobile
skrollr.menu.init(s);

//Bootstrap scrollspy - highlights navbar targets based on scroll position
$('body').scrollspy({ target: '.navbar' });

//initialize lightbox plugin
$(document).ready(function(){
    $('.lightbox').nivoLightbox({
        effect: 'fadeScale'
    });

    $('.experience-info-front').on('touchstart', function(e) {
      e.preventDefault();
      $(this).addClass('hover_effect');
    });
});

//hide nav menu on clicking nav li item
$('.nav li a').on('click',function(){
    $('.navbar-collapse.in').collapse('hide');
});
