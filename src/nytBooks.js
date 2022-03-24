"use strict";

const NYT_BOOKS_API_KEY = "ecb23c2aa6254b85b8623e1916c960f3";
const NYT_BOOKS_API_QUERY = "https://api.nytimes.com/svc/books/v3";

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
    console.log(book)
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

export { getNYTCategories };