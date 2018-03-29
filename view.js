function renderBooks(results) {
  // <img src=${results.volumeInfo.imageLinks.thumbnail} alt=${results.volumeInfo.title} book cover>       
  // <p>DESCRIPTION: ${results.searchInfo.textSnippet}</p>           

  return `
      <div class="results js-results">
        <p>TITLE: ${results.volumeInfo.title}</p>        
        <p>AUTHOR: ${results.volumeInfo.authors}</p>
        <p>DATE PUBLISHED: ${results.volumeInfo.publishedDate}</p>  
        <p>PUBLISHER: ${results.volumeInfo.publisher}</p>  

      </div>
      <div class="separator">
      </div>
    `;
}

function renderBestSellers(results) {
  let coverISBN = results.isbns[0].isbn13;
  console.log(coverISBN);
  return `
      <div class="results js-results">
      <img src="http://covers.librarything.com/devkey/43f9b2a89c6fe33e0dd5a79b3777ee86/medium/isbn/${coverISBN}">   
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