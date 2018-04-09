'use strict'





function getBestSellerImage(result) {
    let thumbnail = 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg';
    if (result.totalItems > 0 &&
        result.items[0].volumeInfo.imageLinks) {
        thumbnail = result.items[0].volumeInfo.imageLinks.thumbnail;
    }
    return thumbnail;
}

function getBestSellerISBN(isbns) {
    let index = 0;
    if (isbns.length === 2) {
        index = 1;
    }
    return isbns[index].isbn13;
}

function getBook(isbn) {
    googleAjaxData.maxResults = 2;
    googleAjaxData.startIndex = 0;
    googleAjaxData.q = "isbn:" + isbn;
    return getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData);
}



function normalizeBestSellerData(item) {
    let bestSellerBook = {
        isbn: '',
        thumbnail: 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg',
    }

    if (result.totalItems > 0 &&
        result.items[0].volumeInfo.imageLinks) {
        thumbnail = result.items[0].volumeInfo.imageLinks.thumbnail;
    }

}




function displayBestSellerData(name) {
    return function (data) {        
        var listName = data.results[0].list_name;
        Promise.all(
            data.results.map((item, index) => {

                var isbn = getBestSellerISBN(item.isbns);
                
                return getBook(isbn).then(result => {
                    let thumbnail = getBestSellerImage(result);                    

                    return renderBestSellers(item, thumbnail, isbn);
                });
            })
        ).then(results => {
            $(`section.${name} header`).html(renderListName(listName));
            $(`section.${name} .books`).html(results);
        });
    };
}


function showBestSeller() {
    renderEmptyForm();
    sections.forEach(name => {
        $('.book-container').append(`
        <section class=${name}>
          <header class="row bookListName">${name}</header>
          <div class="row books"></div>
        </section>
      `);
    });
    // DATA.view = 'loading';
    // then we can pass each container and header into displayBestSellerData
    sections.reduce((promise, name) => {
        return promise.then(() => {
            nyAjaxData.list = name;
            return getBooksFromAPI(NYT_API_URL, nyAjaxData, displayBestSellerData(nyAjaxData.list));
        });
    }, Promise.resolve()).then(() => {
        //   DATA.view = 'best-seller';
        //   emit('loaded');
    });
}