function normalizeGoogleBook(item) {
  let bookElement = {
    author: "",
    description: "",
    id: item.id,
    title: item.volumeInfo.title,
    thumbnail: "https://image.ibb.co/bYtXH7/no_cover_en_US.jpg",
  };

  if (item.volumeInfo.imageLinks) {
    bookElement.thumbnail = item.volumeInfo.imageLinks.thumbnail;
  }

  if (item.searchInfo) {
    bookElement.description = item.searchInfo.textSnippet;
  }

  if (item.volumeInfo.authors) {
    bookElement.author = item.volumeInfo.authors[0];
  }

  return bookElement;
}

function speechRecognition() {
  $("form").on("click", ".js-voice-search", function (event) {
    event.preventDefault();
    if (window.hasOwnProperty("webkitSpeechRecognition")) {
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.start();
      recognition.onresult = function (e) {
        let query = e.results[0][0].transcript;
        recognition.stop();
        $(".search-field").val(query);
        emit("new-search");
        getBooks({
          search: query,
        });
      };
      recognition.onerror = function (e) {
        recognition.stop();
      };
    }
  });
}

export { normalizeGoogleBook, speechRecognition };
