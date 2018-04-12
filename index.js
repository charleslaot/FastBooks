'use strict'

// GLOBALS

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const NYT_API_URL = "https://api.nytimes.com/svc/books/v3/lists.json?api-key=ecb23c2aa6254b85b8623e1916c960f3";

const sections = [
    "business-books",
    // "science",
    // "combined-print-and-e-book-fiction",
    // "combined-print-and-e-book-nonfiction",
    // "sports",
    // "childrens-middle-grade-hardcover",
    // "young-adult-hardcover"
]

var searchIndex = 0;
var query = '';

var googleAjaxData = {
    maxResults: 5,
    printType: "books",
    startIndex: searchIndex,
    q: query,
    key: 'AIzaSyB9Kgyrt5aB4bt_v2D75Q3jUuHn_8NRMCw'
}

// GOOGLE API

function getBooksFromAPI(api_url, ajaxData, callback) {
    const settings = {
        url: api_url,
        data: ajaxData,
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    return $.ajax(settings);
}

function checkForItemsReceived(item) {
    if (item.totalItems === 0 || (!(item.items))) {
        return false;
    } else {
        return true;
    }
}

function normalizeGoogleData(item) {
    let bookElement = {
        isbn: '',
        snippet: '',
        author: '',
        thumbnail: 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg'
    }

    if ((item.volumeInfo.industryIdentifiers) &&
        (item.volumeInfo.industryIdentifiers[0].type === "ISBN_10")) {
        bookElement.isbn = item.volumeInfo.industryIdentifiers.find(function (obj) {
            return obj.type === 'ISBN_10';
        }).identifier
    }

    if (item.volumeInfo.imageLinks) {
        bookElement.thumbnail = item.volumeInfo.imageLinks.thumbnail;
    }

    if (item.searchInfo) {
        bookElement.snippet = item.searchInfo.textSnippet;
    }

    if (item.volumeInfo.authors) {
        bookElement.author = item.volumeInfo.authors[0];
    }

    bookElement.id = item.id;
    bookElement.title = item.volumeInfo.title;

    return bookElement;
}

function displaySearchData(data) {
    if (checkForItemsReceived(data)) {
        const results = data.items.map((item, index) => {
            let book = normalizeGoogleData(item);
            return renderBooks(book);
        });
        $('.book-container').append(results);
    }
}



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
            query = e.results[0][0].transcript;
            recognition.stop();
            searchIndex = 0;
            $('.search-field').val(query);
            googleAjaxData.q = query;
            googleAjaxData.startIndex = searchIndex;
            renderEmptyForm();
            getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData)
        };
        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

function infiniteScroll() {
    var win = $(window);
    win.scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
            query = $('.js-form').find('.search-field').val();
            googleAjaxData.q = query;
            if (googleAjaxData.q !== '') {
                searchIndex += 40;
                googleAjaxData.startIndex = searchIndex;
                getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData);
            }
        }
    });
};

function lightboxHandler() {

    $('.book-container').on('click', 'img', function (event) {
        $('html').css('overflow', 'hidden');
    })

    $('.book-container').on('click', '.fa-close', function (event) {
        $('html').css('overflow', 'visible');
    })

    $(document).keyup(function (e) {
        if (location.hash !== "#_" && e.keyCode == 27) {
            location.hash = "#_";
            $('html').css('overflow', 'visible');
        }
    });
}

function isSearchFieldEmpty(search) {
    if (search === '') {
        return true;
    } else {
        return false;
    }
}

function initEventHandler() {
    $(".js-mainHeader").click(event => {
        $("form input").val('');
        renderEmptyForm();
        getBestSeller();
    });

    $('.js-searchSubmit').click(event => {
        $(".js-form").submit();
    })

    $('.js-form').submit(event => {
        event.preventDefault();
        query = $(event.currentTarget).find('.search-field').val();
        if (isSearchFieldEmpty(query)) {
            $('.search-field').removeClass("valid").addClass("invalid");
        } else {
            $('.search-field').removeClass("invalid").addClass("valid");
            renderEmptyForm();
            searchIndex = 0;
            googleAjaxData.q = query;
            googleAjaxData.startIndex = searchIndex;
            getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData);
        }
    });

    lightboxHandler();
    infiniteScroll()
}

// NYT API

function getBookData(isbn) {
    googleAjaxData.startIndex = 0;
    googleAjaxData.q = "isbn:" + isbn;
    return getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData);
}

function normalizeNYTData(item) {    
    var bestSellerBook = {
        isbn: item.book_details[0].primary_isbn10,
        isbn13: item.book_details[0].primary_isbn13,
        title: item.book_details[0].title,
        author: item.book_details[0].author,
        description: item.book_details[0].description,
        thumbnail: 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg'        
    }
     
    return getBookData(bestSellerBook.isbn).then(result => {              
        if ((result.totalItems > 0) &&
            (result.items[0].volumeInfo.imageLinks)) {
            bestSellerBook.thumbnail = result.items[0].volumeInfo.imageLinks.thumbnail;
        }        
        return renderBestSellers(bestSellerBook);
    })    
}

function displayBestSellerData(name) {
    return function (data) {
        var listName = data.results[0].list_name;
        Promise.all(
            data.results.map((item, index) => {                                
                normalizeNYTData(item);              
            }).then(results => {
            $(`section.${name} header`).html(renderListName(listName));
            $(`section.${name} .books`).html(results);
        }));
    };
}

function getBestSeller() {
    renderEmptyForm();
    renderBaseHTML();    
    sections.reduce((promise, name) => {                
        return promise.then(() => {            
            return getBooksFromAPI(NYT_API_URL, {list: name}, displayBestSellerData(name));
        });
    }, Promise.resolve()).then(() => {});
}

function renderBaseHTML() {
    sections.forEach(name => {
        $('.book-container').append(`
            <section class=${name}>
                <header class="row bookListName">${name}</header>
                <div class="row books"></div>
            </section>
        `);
    });
}


// RENDER

function renderBooks(book) {
    return `
    <div class="book col">
        <div class="bookItem w3-animate-opacity">
                <i class="test fa fa-eye fa-lg"></i>        
                <i class="fa fa-heart fa-lg"></i>   
                <div class='star-rating'>
                    <i class="fa fa-star"></i>   
                    <i class="fa fa-star"></i>   
                    <i class="fa fa-star"></i>   
                    <i class="fa fa-star"></i>   
                    <i class="fa fa-star-half-full"></i>   
                <span>4.5/5</span>         
            </div>            
            <a href='#${book.id}'>
                <img src="${book.thumbnail}" alt=${book.title}>                 
            </a>
            <p class="title">${book.title}</p>  
            
            <div class="lightbox" id="${book.id}">
                <div class="lightbox-content">
                    <a href="#_" class="fa fa-close fa-2x"></a>
                        <img src="${book.thumbnail}">
                    <h4>${book.title} <h6>by</h6> <h5>${book.author}</h5></h4>
                    <p class="book-description">${book.snippet}</p>
                </div>
            </div>        
        </div>      
    </div>        
    `;
}

function renderBestSellers(book) {
    return `    
    <div class="book col">
    <div class="bookItem w3-animate-opacity">        
        <i class="test fa fa-eye fa-lg"></i>        
        <i class="fa fa-heart fa-lg"></i>   
        <div class='star-rating'>
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star-half-full"></i>   
            <span>4.5/5</span>         
        </div>
        <a href='#${book.isbn}'>
            <img src="${book.thumbnail}">  
        </a>  
        <p class="title">${book.title.toLowerCase()}</p>
    </div>

    <div class="lightbox" id="${book.isbn}">
        <div class="lightbox-content">
            <a href="#_" class="fa fa-close fa-2x"></a>
            <img src="${book.thumbnail}">
            <h3 class="best-seller-lightbox-title">${book.title.toLowerCase()}</h3>
            <h6>by</h6> 
            <h5>${book.author}</h5>
            <p class="book-description">${book.description}</p>
        </div>
    </div>  
</div>     
    `;
}

function renderListName(name) {
    return `
    <div class="book col w3-animate-opacity listName">      
        <h5>${name}</h5>                  
    </div>
    `;
}

function renderEmptyForm() {
    $('.book-container').empty();
}

// ON PAGE LOAD

function onLoadTrigger() {
    initEventHandler();
    speechRecognition();
    // getBestSeller();
}

$(onLoadTrigger());