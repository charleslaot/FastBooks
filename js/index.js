"use strict";

import { infiniteScroll, lightboxHandler } from "./visuals.js";
import { speechRecognition, normalizeGoogleBook } from "./helpers.js";

const DATA = {
  index: 0,
  categories: [],
  results: [],
  page: null,
};

function emit(eventName, payload) {
  switch (eventName) {
    case "category-search-start":
      clearSearchResults();
      DATA.searchingCategories = true;
      break;
    case "success-search":
      if (!DATA.searchingCategories) {
        storeResults(payload.data);
        render();
      }
      break;
    case "success-category":
      DATA.page = "category";
      storeCategory(payload.data, payload.category).then(() => {
        render();
        DATA.searchingCategories = false;
      });
      break;
    case "new-search":
      clearSearchResults();
      DATA.index = 0;
      DATA.page = "search";
      break;
  }
}

const googleAjaxData = {
  url: "https://www.googleapis.com/books/v1/volumes",
  data: {
    maxResults: 40,
    printType: "books",
    startIndex: 0,
    key: process.env.GOOGLE_API_KEY_1,
  },
};

const NYTAjaxData = {
  url:
    "https://api.nytimes.com/svc/books/v3/lists.json?api-key=" +
    process.env.NYT_API_KEY_1,
  data: {
    list: "",
  },
};

const NYTSections = [
  "business-books",
  "science",
  "combined-print-and-e-book-fiction",
  "combined-print-and-e-book-nonfiction",
  "sports",
  "childrens-middle-grade-hardcover",
  "young-adult-hardcover",
];

function getBooks(options) {
  let custom;
  let apiOptions;
  let name;
  if (options.category) {
    name = "category";
    apiOptions = NYTAjaxData;
    custom = {
      list: options.category,
    };
  } else if (options.search) {
    name = "search";
    apiOptions = googleAjaxData;
    custom = {
      q: options.search,
      startIndex: DATA.index,
    };
  }

  return $.ajax(
    Object.assign(
      {
        dataType: "json",
        success: (data) => {
          if (data.totalItems === 0) {
            $(".no-books-header").css("display", "block");
          }
          emit("success-" + name, {
            category: custom.list,
            data: data,
          });
        },
      },
      apiOptions,
      {
        data: Object.assign(apiOptions.data, custom),
      }
    )
  );
}

function clearSearchResults() {
  DATA.categories = [];
  DATA.results = [];
}

function storeResults(data) {
  for (let e in data) {
    if (data["totalItems"] === 0) {
      data["items"] = [];
    }
  }
  DATA.results = DATA.results.concat(normalizeGoogleResults(data));
}

function normalizeGoogleResults(data) {
  const results = data.items.map((item) => {
    let book = normalizeGoogleBook(item);
    return book;
  });
  return results;
}

function isSearchFieldEmpty(search) {
  if (search === "") {
    return true;
  } else {
    return false;
  }
}

function initEventHandler() {
  getBestSeller();

  $(".js-mainHeader").click((event) => {
    event.preventDefault();
    $("form input").val("");
    getBestSeller();
  });

  $(".js-searchSubmit").click((event) => {
    event.preventDefault();
    $(".js-form").submit();
  });

  $(".js-form").submit((event) => {
    event.preventDefault();
    let query = $(event.currentTarget).find(".search-field").val();
    if (isSearchFieldEmpty(query)) {
      $(".search-field").removeClass("valid").addClass("invalid");
    } else {
      $(".search-field").removeClass("invalid").addClass("valid");
      emit("new-search");
      getBooks({
        search: query,
      });
    }
  });

  lightboxHandler();
  infiniteScroll();
}

function storeCategory(data, category) {
  return normalizeNYTResults(data).then((results) => {
    DATA.categories = DATA.categories.concat([
      {
        name: category.replace(/-/g, " "),
        results: results,
      },
    ]);
  });
}

function normalizeNYTResults(data) {
  DATA.index = 0;
  return Promise.all(
    data.results.map((item, index) => {
      let isbnSearch = item.book_details[0].primary_isbn10;
      return getBooks({
        search: `isbn:${isbnSearch}`,
      }).then((result) => {
        return normalizeNYTBook(item, result);
      });
    })
  );
}

function normalizeNYTBook(NYTItem, googleItem) {
  var bestSellerBook = {
    isbn: NYTItem.book_details[0].primary_isbn10,
    title: NYTItem.book_details[0].title,
    author: NYTItem.book_details[0].author,
    description: NYTItem.book_details[0].description,
    thumbnail: "https://image.ibb.co/bYtXH7/no_cover_en_US.jpg",
  };

  if (googleItem.totalItems > 0 && googleItem.items[0].volumeInfo.imageLinks) {
    bestSellerBook.thumbnail =
      googleItem.items[0].volumeInfo.imageLinks.thumbnail;
  }

  return bestSellerBook;
}

function getBestSeller() {
  emit("category-search-start");
  NYTSections.forEach((section) => {
    getBooks({
      category: section,
    });
  });
}

function renderSearchBook(book) {
  return `
    <div class="book col">
        <div class="bookItem w3-animate-opacity">                
            <a href='#${book.id || book.isbn}'>
                <img src="${book.thumbnail}" alt=${book.title}>                 
            </a>
            <p class="title">${book.title.toLowerCase()}</p>              
            <div class="lightbox" id="${book.id || book.isbn}">
                <div class="lightbox-content">
                    <a href="#_" class="fa fa-close fa-2x"></a>
                        <img src="${book.thumbnail}">
                    <h4>${book.title} <h6>by</h6> <h5>${book.author}</h5></h4>
                    <p class="book-description">${book.description}</p>
                </div>
            </div>        
        </div>       
    </div>        
    `;
}

function renderCategoryBooks(category) {
  const books = category.results.map(renderSearchBook).join("");
  return `
      <section role="region" class=${category.name}>
		  <header class="row bookListName">${category.name}</header>		  
          <div class="row books">${books}</div>
      </section>
    `;
}

function render() {
  if (DATA.page === "search") {
    const results = DATA.results;
    $(".book-container").html(results.map(renderSearchBook));
  } else if (DATA.page === "category") {
    const results = DATA.categories;
    $(".book-container").html(results.map(renderCategoryBooks));
  }
}

function onLoadTrigger() {
  initEventHandler();
  speechRecognition();
}

$(onLoadTrigger);
