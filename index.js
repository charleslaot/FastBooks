'use strict'

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const NYT_API_URL = "https://api.nytimes.com/svc/books/v3/lists.json?api-key=ecb23c2aa6254b85b8623e1916c960f3";

// ajax calls
function getBooksFromAPI(category, searchTerm, callback) {
    console.log("google api");
    console.log(category);
    console.log(searchTerm);
    const settings = {
        url: GOOGLE_BOOKS_API_URL,
        data: {
            maxResults: 10,
            printType: "books",
            q: category + ":" + searchTerm,
            key: 'AIzaSyA1fQ5txXio4GYzBgM9Rc2W5aT3fQbkrU8'
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    return $.ajax(settings);
}

function getBestSellerList(listName, callback) {
    console.log("NYT api");
    const settings = {
        url: NYT_API_URL,
        data: {
            list: listName
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

// Getting the ISBN from Google API
function getBook(isbn) {
    return getBooksFromAPI('isbn', isbn);
}

// Passing the results to HTML
function displaySearchData(data) {
    const results = data.items.map((item, index) => renderBooks(item));
    console.log(results);
    $('.js-results').html(results);
}

function displayBestSellerData(data) {
    Promise.all(data.results.map((item, index) => {
        const isbn = item.isbns[1].isbn10;
        return getBook(isbn).then(results => {
            let thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
            if (results.totalItems === 1) {
                thumbnail = results.items[0].volumeInfo.imageLinks.thumbnail;
            }
            return renderBestSellers(item, thumbnail);
        });
    })).then(results => {
        $('.js-results').html(results);
    });
}

// On submit
function watchSubmit() {
    $('.js-form').submit(event => {
        event.preventDefault();
        let category = $("option:checked").val();
        let query = $(event.currentTarget).find('.search-field').val();
        if (category === "bestSeller") {
            let subCategory = $(".bestSeller option:checked").val();
            getBestSellerList(subCategory, displayBestSellerData);
        } else {
            getBooksFromAPI(category, query, displaySearchData);
        }
    });
}

// Best Seller list toggle menu
function selectBestSellers() {
    $('.selectParam').change(function () {
        if ($(".selectParam option:selected").text() === "Best Seller") {
            $('form input').toggle();
            $('form .bestSeller').toggle();
            $('form .voice-search').toggle();
        } else {
            $('form input').show();
            $('form .voice-search').show();
            $('form .bestSeller').hide();
        }
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
            console.log("There's been an error in speech recognition");
        }

    }
}

// When page finish loading
$(watchSubmit());
$(speechRecognition());
$(selectBestSellers());