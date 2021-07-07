function infiniteScroll() {
  var win = $(window);
  win.scroll(function () {
    if (
      $(window).scrollTop() >=
      $(document).height() - $(window).height() - 10
    ) {
      let query = $(".js-form").find(".search-field").val();
      if (query.length > 0) {
        DATA.index += 20;
        getBooks({
          search: query,
        });
      }
    }
  });
}

function lightboxHandler() {
  $(".book-container").on("click", "img", function (event) {
    $("html").css("overflow", "hidden");
  });

  $(".book-container").on("click", ".fa-close", function (event) {
    $("html").css("overflow", "visible");
  });

  $(document).keyup(function (e) {
    if (location.hash !== "#_" && e.keyCode == 27) {
      location.hash = "#_";
      $("html").css("overflow", "visible");
    }
  });
}

export { infiniteScroll, lightboxHandler };
