import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'components/carousels'

import 'slick-carousel'

$('.spotlights__images').slick({
  centerMode: true,
  dots: true,
  dotsClass: 'slick-dots carousel__dots',
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
})

$('.meet-experts__librarians').slick({
  dots: true,
  dotsClass: 'slick-dots carousel__dots meet-experts__dots',
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
})
