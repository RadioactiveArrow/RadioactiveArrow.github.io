$(window).on('load', function () {
  $(this).scrollTop(0);
  $('body').css('background-color', randRGBString())
});

function randRGBString() {
  var rand = Math.floor(Math.random()*7)
  if (rand == 0 || rand == 5) {
    return "rgb(50,50,70)";
  } else if (rand == 1) {
    return "rgb(120,180,120)"
  } else if (rand == 2 || rand == 6) {
    return "rgb(100,100,200)"
  } else if (rand  == 3) {
    return "rgb(200,100,100)"
  } else {
    return "rgb(30,30,40)"
  }
}