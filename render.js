'use strict'
           
function renderBestSellers(results, thumbnail, ISBN) {
  return `    
    <div class="book col">
      <div class="bookItem w3-animate-opacity">        
        <i class="test fa fa-eye fa-lg"></i>        
        <i class="fa fa-heart fa-lg"></i>   
        <div class='star-rating'>
          <i class="fa fa-star"></i>   
          <i class="fa fa-star"></i>   
          <i class="fa fa-star"></i>   
          <i class="fa fa-star"></i>   
          <i class="fa fa-star-half-full"></i>   
          <span>4.5/5</span>         
        </div>
        <a href='#${results.book_details[0].primary_isbn13}'>
          <img src="${thumbnail}">  
        </a>  
        <p class="title">${results.book_details[0].title.toLowerCase()}</p>
      </div>

      <div class="lightbox" id="${results.book_details[0].primary_isbn13}">
        <div class="lightbox-content">
          <a href="#_" class="fa fa-close fa-2x"></a>
          <img src="${thumbnail}">
          <h3 class="best-seller-lightbox-title">${results.book_details[0].title.toLowerCase()} <h6>by</h6> <h5>${results.book_details[0].author}</h5></h3>
          <p class="book-description">${results.book_details[0].description}</p>
        </div>
      </div>  
    </div>     
  `;
}


function renderListName(name) {
  return `
  <div class="book col w3-animate-opacity listName">      
  <h5>${name}</h5>                  
  </div>
  `;
}


function renderEmptyForm() {
  $('.book-container').empty();  
}