'use strict'

const NYT_API_URL = "https://api.nytimes.com/svc/books/v3/lists.json?api-key=ecb23c2aa6254b85b8623e1916c960f3";

function getBestSellerList(listName, callback) {
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

function getBook(isbn) {
    return getBooksFromAPI('isbn', isbn);
}


function getBestSellerISBN(isbns) {
    let index = 0;
    if (isbns.length === 2) {
        index = 1;
    }
    return isbns[index].isbn13;
}

function getBestSellerImage(result) {
    let thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (result.totalItems > 0 &&
        result.items[0].volumeInfo.imageLinks) {
        thumbnail = result.items[0].volumeInfo.imageLinks.thumbnail;
    }
    return thumbnail;
}

function displayBestSellerData(data) {
    var listName = data.results[0].list_name;
    Promise.all(data.results.map((item, index) => {
        var isbn = getBestSellerISBN(item.isbns);
        return getBook(isbn).then(result => {
            let thumbnail = getBestSellerImage(result);
            return renderBestSellers(item, thumbnail, isbn);
        });

    })).then(results => {
        $('.js-results-header').html(renderListName(listName));
        $('.js-results').html(results);
    })
}

// Best Seller list on load
function showBestSeller() {
    // let i = 0;
    renderEmptyForm();
    getBestSellerList("business-books", displayBestSellerData);
    // getBestSellerList("science", displayBestSellerData);        

    // bestSellerLists.forEach(listName => {        
    //     getBestSellerList("business-books", displayBestSellerData);        
    //     i++;
    //     console.log("best seller list", i);
    // })     
}

// $(showBestSeller());