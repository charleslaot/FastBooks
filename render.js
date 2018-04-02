function renderBooks(results, thumbnail) {  
  return `
        <div class="results js-results">
          <img src="${thumbnail}" alt=${results.volumeInfo.title} book cover>                 
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