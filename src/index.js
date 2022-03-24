"use strict";

import { getNYTCategories } from './nytBooks.js';
import { clearResultsHTML, getQueryBooks, getVoiceBooks, infiniteScroll } from './queryBooks.js';


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
    }, false);
})();




