function renderBooks(results) {
  $('h3').remove();
  $('ul').remove();  
  if (!results.saleInfo.listPrice){
    results.saleInfo.listPrice.amount = "No E-book available";
  };
  
  return `
      <div class="results js-results">
        <img src=${results.volumeInfo.imageLinks.thumbnail} alt=${results.volumeInfo.title} book cover>
        <p>TITLE: ${results.volumeInfo.title}</p>        
        <p>AUTHOR: ${results.volumeInfo.authors}</p>
        <p>PRICE E-BOOK: ${results.saleInfo.listPrice} USD</p>                
        
      </div>
    `;

   
}


