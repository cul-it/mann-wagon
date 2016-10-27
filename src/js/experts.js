import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'components/meet-experts';

import 'slick-carousel';

$('.meet-experts__librarians').slick({
  dots: true,
  dotsClass: 'slick-dots spotlights__dots meet-experts__dots',
  mobileFirst: true,
  nextArrow: $('.js-meet-experts-next'),
  prevArrow: $('.js-meet-experts-prev'),
  responsive: [
    {
      breakpoint: 480,
      settings: {
        slidesToScroll: 3,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 720,
      settings: {
        slidesToScroll: 3,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 896,
      settings: {
        slidesToScroll: 3,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 1104,
      settings: {
        slidesToScroll: 4,
        slidesToShow: 4
      }
    }
  ],
  slidesToScroll: 2,
  slidesToShow: 2
});
