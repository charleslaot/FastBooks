'use strict'

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

function getBooksFromAPI(searchTerm, callback) {
    const settings = {
        url: GOOGLE_BOOKS_API_URL,
        data: {
            maxResults: 10,
            q: searchTerm
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

function displaySearchData(data) {
    const results = data.items.map((item, index) => renderBooks(item));
    $('.js-results').html(results);
}

function watchSubmit() {
    $('.js-form').submit(event => {
        event.preventDefault();
        let query = $(event.currentTarget).find('.search-field').val();
        getBooksFromAPI(query, displaySearchData);
    });
}

function speechRecognition() {
    $("form").on('click', '.voice-search', function (event) {
        event.preventDefault();
        startDictation();
    })
}

function startDictation() {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = function (e) {
            let results = e.results[0][0].transcript;
            $('.search-field').val(results);
            recognition.stop();
            getBooksFromAPI(results, displaySearchData)
        };

        recognition.onerror = function (e) {
            recognition.stop();
            console.log("There's been an error in speech recognition");
        }

    }
}

$(watchSubmit());
$(speechRecognition());