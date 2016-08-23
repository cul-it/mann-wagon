import 'slick-carousel/slick/slick.css';

import 'slick-carousel';

$('.spotlights__images').slick({
  centerMode: true,
  centerPadding: '150px',
  prevArrow: $('.js-spotlights-prev'),
  nextArrow: $('.js-spotlights-next')
});
