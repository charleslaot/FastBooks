"use strict";

const NYT_BOOKS_API_KEY = process.env.NYT_BOOKS_API_KEY;
const NYT_BOOKS_API_QUERY = "https://api.nytimes.com/svc/books/v3";

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_QUERY = "https://www.googleapis.com/books/v1/volumes?q=";

const queryBooksOptions = { startIndex: 0, maxResults: 40, printType: "books" }

(function onPageLoad() {
    getNYTCategories();

    document.getElementById("search-form").addEventListener("submit", function (e) { e.preventDefault() }, false);

    document.getElementById("voice-search").addEventListener("click", function () {
        clearResultsHTML();
        getVoiceBooks();
        infiniteScroll();
    }, false);

    document.getElementById("query-search").addEventListener("click", function () {
        clearResultsHTML();
        getQueryBooks();
        infiniteScroll();
    }, false)
})();

// InfiniteScroll
function infiniteScroll() {
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            getQueryBooks(queryBooksOptions.maxResults);
        }
    });
}

// NYT
function getNYTCategories() {
    let urlQuery = new URL(NYT_BOOKS_API_QUERY + "/lists/names.json?api-key=" + NYT_BOOKS_API_KEY);
    fetch(urlQuery)
        .then((NYTCategories) => NYTCategories.json())
        .then((NYTCategories) => {
            renderNYTCategories(NYTCategories);
        });
}

function getNYTBooks(id) {
    let urlQuery = new URL(NYT_BOOKS_API_QUERY + "/lists/current/" + id + "?api-key=" + NYT_BOOKS_API_KEY);
    fetch(urlQuery)
        .then((NYTBooks) => NYTBooks.json())
        .then((NYTBooks) => {
            renderNYTBooks(NYTBooks);
        });
}

function renderNYTCategories(categories) {
    let catHTML = "";
    let catList = [];

    categories.results.forEach((cat) => {
        catHTML += `
        <button class="nyt-category-item" id=${cat.list_name_encoded}>
            ${cat.display_name}
        </button>
        `
        catList.push(cat.list_name_encoded);
    });
    document.getElementById("results").innerHTML = catHTML;

    catList.forEach((cat) => {
        document.getElementById(cat).addEventListener("click", function () { getNYTBooks(this.id) }, false);
    });
}

function normalizeNYTBook(book) {
    let bookElement = {
        title: "No Title Provided",
        book_image: "https://image.ibb.co/bYtXH7/no_cover_en_US.jpg",
        amazon_product_url: "https://amazon.com"
    };

    if (book.title) {
        bookElement.title = book.title.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }

    if (book.book_image) {
        bookElement.book_image = book.book_image;
    }

    if (book.amazon_product_url) {
        bookElement.amazon_product_url = book.amazon_product_url;
    }

    return bookElement;
}

function renderNYTBooks(books) {
    let booksHTML = "";
    let booksSubCategory = `${books.results.display_name}`;

    books.results.books.forEach((book) => {
        book = normalizeNYTBook(book);
        booksHTML += `
        <div class="book-item">
            <a href=${book.amazon_product_url} target=_blank>
                <img src=${book.book_image} />
                <span>${book.title}</span>
            </a>
        </div>`
    });
    document.getElementById("results").innerHTML = booksHTML;
    document.getElementById("subtitle").innerHTML = booksSubCategory;
}

// Query
function clearResultsHTML() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("sub-category").innerHTML = "";
}

function getQueryBooks(index = 0) {
    let searchQuery = document.getElementById("form-input").value;
    let urlQuery = new URL(GOOGLE_BOOKS_API_QUERY + searchQuery + "&key=" + GOOGLE_BOOKS_API_KEY);

    queryBooksOptions.startIndex += index;

    for (let option in queryBooksOptions) {
        urlQuery.searchParams.append(option, queryBooksOptions[option]);
    }

    fetch(urlQuery)
        .then((queryBooks) => queryBooks.json())
        .then((queryBooks) => {
            renderQueryBooks(queryBooks);
            document.getElementById("sub-category").innerHTML = `<h2 class="book-subtitle" id="subtitle">Search for "${searchQuery}"</h2>`;
        })
        .catch((error) => {
            console.log(error);
        })
};

function getVoiceBooks() {
    if (window.hasOwnProperty("webkitSpeechRecognition")) {
        let recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.start();
        recognition.onresult = function (e) {
            let query = e.results[0][0].transcript;
            recognition.stop();
            document.getElementById("form-input").value = query;
            getQueryBooks();
        };
        recognition.onerror = function (error) {
            recognition.stop();
            console.log(error)
        };
    }
}

function normalizeQueryBook(book) {
    let bookElement = {
        author: "",
        description: "",
        id: book.id,
        title: book.volumeInfo.title,
        infoLink: book.volumeInfo.infoLink,
        thumbnail: "https://image.ibb.co/bYtXH7/no_cover_en_US.jpg",
    };

    if (book.volumeInfo.imageLinks) {
        bookElement.thumbnail = book.volumeInfo.imageLinks.thumbnail;
    }

    if (book.searchInfo) {
        bookElement.description = book.searchInfo.textSnippet;
    }

    if (book.volumeInfo.authors) {
        bookElement.author = book.volumeInfo.authors[0];
    }

    return bookElement;
}

function renderQueryBooks(books) {
    let booksHTML = "";

    books.items.forEach((book) => {
        book = normalizeQueryBook(book);
        booksHTML += `
        <div class="book-item">
            <a href=${book.infoLink} target=_blank>
                <img src=${book.thumbnail} />
                <span>${book.title}</span>
             </a>
        </div>`
    });
    document.getElementById("results").innerHTML += booksHTML;
}