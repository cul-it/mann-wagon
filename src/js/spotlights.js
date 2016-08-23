import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'slick-carousel';

$('.spotlights__images').slick({
  centerMode: true,
  dots: true,
  dotsClass: 'slick-dots spotlights__dots',
  mobileFirst: true,
  nextArrow: $('.js-spotlights-next'),
  prevArrow: $('.js-spotlights-prev'),
  responsive: [
    {
      breakpoint: 480,
      settings: {
        centerPadding: '50px'
      }
    },
    {
      breakpoint: 720,
      settings: {
        centerPadding: '75px'
      }
    },
    {
      breakpoint: 896,
      settings: {
        centerPadding: '100px'
      }
    }
  ]
});
