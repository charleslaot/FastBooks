'use strict'

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
var searchIndex = 0;

// Google API ajax call
function getBooksFromAPI(category, searchTerm, index, callback) {
    const settings = {
        url: GOOGLE_BOOKS_API_URL,
        data: {
            maxResults: 40,
            printType: "books",
            startIndex: index,
            q: category + ":" + searchTerm,
            key: 'AIzaSyCt15UNcdqQLDxthNo7sjlr0JEipnG-v2s'
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    searchIndex += 40;    
    return $.ajax(settings);
}

function checkForItemsReceived(data) {
    if (data.totalItems === 0 || (!(data.items))) {
        return false;
    } else {
        return true;
    }
}

function checkForISBNValidity(item) {
    if (!(item.volumeInfo.industryIdentifiers) ||
        (item.volumeInfo.industryIdentifiers[0].type !== "ISBN_10") ||
        (item.volumeInfo.industryIdentifiers[0].type !== "ISBN_13")) {
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



// Passing the results to HTML
function displaySearchData(data) {
    var isbn = '';
    var thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (checkForItemsReceived(data)) {
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
        $('.book-container').append(results);
    } else {
        // nothingFoundMsg();
    }
}

// On submit
function watchSubmit() {
    $(".js-mainHeader").click(event => {
        $("form input").val('');
        renderEmptyForm();
        showBestSeller();
    });

    $('.js-searchSubmit').click(event => {       
        $(".js-form").submit();
    })

    $('.js-form').submit(event => {                
        event.preventDefault();
        let category = $("option:checked").val();
        let query = $(event.currentTarget).find('.search-field').val();      
        renderEmptyForm();
        searchIndex = 0;
        getBooksFromAPI(category, query, searchIndex, displaySearchData);
    });
}

// speech functionality
function speechRecognition() {
    $("form").on('click', '.js-voice-search', function (event) {
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
            searchIndex = 0;
            getBooksFromAPI("all", results, searchIndex, displaySearchData)
        };
        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

// jquery animations
function animation() {
    $(".js-results book").hover(function () {
        console.log("test");
    })
}

// infinite scroll 
function infiniteScroll() {
    var win = $(window);
    win.scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {            
            let category = $('.js-form option:checked').val();
            let query = $('.js-form').find('.search-field').val();
            getBooksFromAPI(category, query, searchIndex, displaySearchData);            
        }
    });
};



// When page loads
$(watchSubmit());
$(speechRecognition());
$(animation());
$(infiniteScroll());