'use strict'




// Globals
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
var searchIndex = 0;










// Google API ajax call
function getBooksFromAPI(searchTerm, index, callback) {
    const settings = {
        url: GOOGLE_BOOKS_API_URL,
        data: {
            maxResults: 5,
            printType: "books",
            startIndex: index,
            q: searchTerm,
            key: 'AIzaSyBReLAn1kK-DrwyWi72Ja3wXlJe7r8-R9U'
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    
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

function checkForSnippet(item){
    if (item.searchInfo){
        return true;
    } else {
        return false;
    }
}

function checkForAuthor(item){
    if (!item.volumeInfo.authors){
        return false;
    } else {
        return true
    }
}
























// Passing the results to HTML
function displaySearchData(data) {    
    var isbn = '';
    var snippet = '';
    var author = '';
    var thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (checkForItemsReceived(data)) {
        const results = data.items.map((item, index) => {
            console.log(item);
            if (checkForISBNValidity(item)) {
                isbn = item.volumeInfo.industryIdentifiers.find(function (obj) {
                    return obj.type === 'ISBN_10';
                }).identifier
            }
            if (checkForThumbnail(item)) {
                thumbnail = item.volumeInfo.imageLinks.thumbnail;
            }
            if (checkForSnippet(item)){
                snippet = item.searchInfo.textSnippet;
            }
            if (checkForAuthor(item)){
                author = item.volumeInfo.authors[0];
            }
            return renderBooks(item, thumbnail, isbn, snippet, author);
        });
        $('.book-container').append(results);
    } else {
        // $('.book-container').append(`<h5>No more books to show</h5>`);
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
        getBooksFromAPI(query, searchIndex, displaySearchData);
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
            getBooksFromAPI(results, searchIndex, displaySearchData)
        };
        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

// infinite scroll 
function infiniteScroll() {
    var win = $(window);
    win.scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {                        
            let query = $('.js-form').find('.search-field').val();            
            if (query !== ''){
                getBooksFromAPI(query, searchIndex, displaySearchData); 
                searchIndex += 40;               
            }
        }
    });
};

















function onLoadTrigger() {
    $(watchSubmit());
    $(speechRecognition());
    $(infiniteScroll());
    // $(showBestSeller())
}

$(onLoadTrigger());

