import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'slick-carousel';

$('.spotlights__images').slick({
  centerMode: true,
  centerPadding: '150px',
  dots: true,
  dotsClass: 'slick-dots spotlights__dots',
  prevArrow: $('.js-spotlights-prev'),
  nextArrow: $('.js-spotlights-next')
});
