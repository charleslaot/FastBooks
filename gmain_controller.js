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
            key: 'AIzaSyClcxPMhuThAaXYb0Ju-Kxd-rEReEzH2gc'
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
        console.log("data total items", data.totalItems);
        console.log("data items", data.items);
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

function nothingFoundMsg() {
    alert("Nothing to show");
}

// Passing the results to HTML
function displaySearchData(data) {
    var isbn = '';
    console.log(data);
    var thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (checkForItemsReceived(data)) {
        const results = data.items.map((item, index) => {
            if (checkForISBNValidity(item)) {
                // console.log(item.volumeInfo.industryIdentifiers.find(function (obj) {return obj.type === 'ISBN_10';}));
                isbn = item.volumeInfo.industryIdentifiers.find(function (obj) {
                    return obj.type === 'ISBN_10';
                }).identifier
            }
            if (checkForThumbnail(item)) {
                thumbnail = item.volumeInfo.imageLinks.thumbnail;
            }
            return renderBooks(item, thumbnail, isbn);
        });
        $('.js-results').append(results);
    } else {
        nothingFoundMsg();
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
            searchIndex = 0;
            getBooksFromAPI("all", results, searchIndex, displaySearchData)
        };
        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

function animation() {
    $(".js-results book").hover(function () {
        console.log("test");
    })
}


function infiniteScroll() {
    var win = $(window);    
	win.scroll(function() {        
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {		            
            $('.loading-spinner').show();            
            let category = $('.js-form option:checked').val();
            let query = $('.js-form').find('.search-field').val();
            console.log("cat", category);
            console.log("query", query);
            console.log("index", searchIndex);
            getBooksFromAPI(category, query, searchIndex, displaySearchData);            
			$('.loading-spinner').hide();
		}
	});
};



// When page loads
$(watchSubmit());
$(speechRecognition());
$(animation());
$(infiniteScroll());
