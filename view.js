function renderBooks(result) {
    $('h3').remove();
    $('ul').remove();
    return `
      <div class="results js-results">
        <a>${result.volumeInfo.title}</a>        
      </div>
    `;
}