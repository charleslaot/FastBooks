'use strict'

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

// Google API ajax call
function getBooksFromAPI(category, searchTerm, callback) {
    const settings = {
        url: GOOGLE_BOOKS_API_URL,
        data: {
            maxResults: 10,
            printType: "books",
            q: category + ":" + searchTerm,
            key: 'AIzaSyBaEU7oEwRmOn762c570LWp2eo57_vfMJQ'
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    return $.ajax(settings);
}

function checkForItemsReceived(resultItems) {
    if (resultItems > 0) {
        return true;
    } else {
        return false;
    }
}

function checkForISBNValidity(item) {
    if (!(item.volumeInfo.industryIdentifiers) ||
        (item.volumeInfo.industryIdentifiers[0].type === "OTHER")) {
        return false;
    } else {
        return true;
    }
}

function checkForThumbnail(item) {
    if (!item.volumeInfo.imageLinks) {
        return false;
    } else {
        return true;
    }
}

function nothingFoundMsg() {
    alert("Nothing to show");
}

// Passing the results to HTML
function displaySearchData(data) {
    var isbn = '';
    var thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (checkForItemsReceived(data.totalItems)) {
        console.log(data);
        const results = data.items.map((item, index) => {
            if (checkForISBNValidity(item)) {
                isbn = item.volumeInfo.industryIdentifiers.find(function (obj) {
                    return obj.type === 'ISBN_10';
                }).identifier
            }
            if (checkForThumbnail(item)) {
                thumbnail = item.volumeInfo.imageLinks.thumbnail;
            }
            return renderBooks(item, thumbnail, isbn);
        });
        $('.js-results').html(results);
    } else {
        nothingFoundMsg();
    }
}

// On submit
function watchSubmit() {
    if ($(".js-mainHeader").click(event => {
            showBestSeller();
        }));

    $('.js-form').submit(event => {
        event.preventDefault();
        let category = $("option:checked").val();
        let query = $(event.currentTarget).find('.search-field').val();
        getBooksFromAPI(category, query, displaySearchData);
    });
}

// Speech Functionality
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
        }
    }
}

// When page loads
$(watchSubmit());
$(speechRecognition());