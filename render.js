function renderBooks(results) {

  return `
        <div class="results js-results">
        <img src=${results.volumeInfo.imageLinks.thumbnail} alt=${results.volumeInfo.title} book cover>       
        <p>DESCRIPTION: ${results.searchInfo.textSnippet}</p>                 
        <p>TITLE: ${results.volumeInfo.title}</p>        
        <p>AUTHOR: ${results.volumeInfo.authors}</p>
        <p>DATE PUBLISHED: ${results.volumeInfo.publishedDate}</p>  
        <p>PUBLISHER: ${results.volumeInfo.publisher}</p>    
        </div>
        <div class="separator">
        </div>
      `;
}

function renderBestSellers(results, thumbnail) {
  let coverISBN = results.isbns[0].isbn13;
  return `
      <div class="results js-results">
      <img src="${thumbnail}">   
        <p>TITLE: ${results.book_details[0].title}</p>            
        <p>AUTHOR: ${results.book_details[0].author}</p>
        <p>DATE PUBLISHED: ${results.published_date}</p>  
        <p>DATE BEST SELLER: ${results.bestsellers_date}</p>  
        <p>BEST SELLER RANK: ${results.rank}</p>  
        <p>PUBLISHER: ${results.book_details[0].publisher}</p>  
      </div>
      <div class="separator">
      </div>
    `;
}