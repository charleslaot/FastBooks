"use strict";

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_QUERY = "https://www.googleapis.com/books/v1/volumes?q=";

const queryBooksOptions = {
    startIndex: 0,
    maxResults: 40,
    printType: "books"
}

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

function infiniteScroll() {
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            getQueryBooks(queryBooksOptions.maxResults);
        }
    });
}

export { clearResultsHTML, getQueryBooks, getVoiceBooks, infiniteScroll };