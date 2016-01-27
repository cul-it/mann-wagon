$(document).ready(function() {
  // click counter
  var weeks = 0;
  // next
  $( "input:radio[value=next-week]" ).click(function(){
    weeks++;
    // display next, hide previously visible table
    $(".hours-weekly").eq(weeks-1).hide();
    $(".hours-weekly").eq(weeks).show();
    // enable/disable input
    $("input:radio[value=prev-week]").prop("disabled", false);
    // 52 weeks/51 using zero based index
    if (weeks == 51) {
      $("input:radio[value=next-week]").prop("disabled", true)
    }
  });
  // previous
  $( "input:radio[value=prev-week]" ).click(function(){
    weeks--;
    // display prev, hide previously visible table
    $(".hours-weekly").eq(weeks+1).hide();
    $(".hours-weekly").eq(weeks).show();
    // enable/disable input
    if (weeks == 0) {
      $("input:radio[value=prev-week]").prop("disabled", true);
    }
    if (weeks == 50) {
      $("input:radio[value=next-week]").prop("disabled", false);
    }
  });
});
