// DOMs
const resultsNav        = document.getElementById('resultsNav');
const favoritesNav      = document.getElementById('favoritesNav');
const imagesContainer   = document.querySelector('.images-container');
const saveConfirmed     = document.querySelector('.save-confirmed');
const dateInput         = document.getElementById("dinput");
const dateDIV           = document.getElementById("get-date");
const gotof             = document.getElementById("gotof");
const gotor             = document.getElementById("gotor");
const getData           = document.getElementById("getWholeData");

// NASA API
const final_date = "";
const apiKey = "5dIbMbuH7IAAp19JeBF3lXNchHbWKQd9pqY5HZdK";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=`;

let resultsArray = [];
let favorites = {};


function updateDOM(page) {
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }

  imagesContainer.textContent = '';

  createDOMNodes(page);

  showContent(page);
}


function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' })

  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
    dateDIV.style.display = 'block';
  } else {
     resultsNav.classList.add('hidden');
     favoritesNav.classList.remove('hidden');
     dateDIV.style.display = 'none';
  }

}



function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

  console.log(currentArray);

  currentArray.forEach(result => {
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;

    let saveText = null, saveFunc = null;
    if (page === 'results') {
      saveText = 'Add to Favorites';
      saveFunc = `saveFavorite('${result.url}')`;
    } else {
      saveText = 'Remove Favorite';
      saveFunc = `removeFavorite('${result.url}')`;
    }

    const html = `
      <div class="card">
        <a href="${result.hdurl}" title="View Full Image" target="_blank"><img src="${result.url}" alt="NASA Picture of the Day" loading="lazy" class="card-img-top"></a>
        
        <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="clickable" onclick="${saveFunc}">${saveText}</p>

          <p>${result.explanation}</p>
          
          <small class="text-muted">
            <strong>${result.date}</strong><span> ${copyrightResult}</span>
          </small>
        </div>
      </div>
    `;

    // Adding nodes to the images container
    imagesContainer.insertAdjacentHTML('beforeend', html);
  });
}


async function getNasaPictures() {

  let inserted_date = dateInput.value;

  let date_array    = inserted_date.split("-");

  let now_year      = new Date().getFullYear();
  let now_month     = new Date().getMonth() + 1;
  let now_day       = new Date().getDate();

  console.log(Number(date_array[0]) + "," + Number(date_array[1]) + "," + Number(date_array[2]));

  if(Number(date_array[0]) > now_year)
  {
    alert("Invalid Date");

    return;
  }
  else if(Number(date_array[0]) == now_year && Number(date_array[1]) > now_month)
  {
    alert("Invalid Date");

    return;
  }
  else if(Number(date_array[0]) == now_year && Number(date_array[1]) == now_month && Number(date_array[2]) > now_day)
  {
    alert("Invalid Date");

    return;
  }
  else
  {
    let final_date = String(date_array[0]) + "-" + String(date_array[1]) + "-" + String(date_array[2]);

    let newAPI = apiUrl;

    newAPI += final_date;

    try 
    {
      const response = await fetch(newAPI);
      resultsArray = [await response.json()];
      
      updateDOM('results');
    } 
    catch (error) 
    {
      console.log(error);
    }
  }

  
}


function saveFavorite(itemUrl) {
  
  resultsArray.forEach(item => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000)

      
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  })
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];

   
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));

    updateDOM('favorites');
  }
}


gotof.addEventListener('click', function(e){
  updateDOM('favorites');
});

gotor.addEventListener('click', function(e){
  updateDOM('results');
});

getData.addEventListener('click', function(e){
  getNasaPictures();
});