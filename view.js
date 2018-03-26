function renderBooks(results) {
  $('h3').remove();
  $('ul').remove();
  if (!results.searchInfo) {
    results.searchInfo = {
      "textSnippet": "Not Available"
    }
  }
  return `
      <div class="results js-results">
        <img src=${results.volumeInfo.imageLinks.thumbnail} alt=${results.volumeInfo.title} book cover>       
        <p>TITLE: ${results.volumeInfo.title}</p>        
        <p>AUTHOR: ${results.volumeInfo.authors}</p>
        <p>DATE PUBLISHED: ${results.volumeInfo.publishedDate}</p>  
        <p>DESCRIPTION: ${results.searchInfo.textSnippet}</p>           
      </div>
      <div class="separator">
      </div>
    `;
}