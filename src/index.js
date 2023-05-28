import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
//import debounce from 'lodash.debounce';
import { fetchPictures } from './sass/fetchPictures';

const HITS_PER_PAGE = 40;
//const DEBOUNCE_DELAY = 300;

const btnSubmit = document.querySelector('#search-form');
const searchQuery = document.querySelector('input');
const picturesList = document.querySelector('.gallery');
const loadmore = document.querySelector('.js-load-more');

loadmore.addEventListener('click', handlerPagination);
btnSubmit.addEventListener('submit', onBtnSubmit);

let page = 1;
let inputQuery = '';

function formDisabled(isDisabled) {
  btnSubmit[0].disabled = isDisabled;
  btnSubmit[1].disabled = isDisabled;
}

function creatMarkupPictures(data) {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>${likes}
              </p>
              <p class="info-item">
                <b>Views</b>${views}
              </p>
              <p class="info-item">
                <b>Comments</b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>${downloads}
              </p>
            </div>
          </div>`;
      }
    )
    .join('');
}

function clearQery() {
  page = 1;
  inputQuery = '';
  picturesList.innerHTML = '';
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

function handlerPagination() {
  
  page++;

  formDisabled(true);

  fetchPictures(inputQuery, page, HITS_PER_PAGE)
     .then(resp => {
       const respData = resp.data;
       if (!respData.total) {
         Notify.failure(
           'Sorry, there are no images matching your search query. Please try again.'
         );
         clearQery();
         return;
       }
       //Notify.success(`Hooray! We found ${respData.total} images.`);

       
       picturesList.insertAdjacentHTML(
         'beforeend',
         creatMarkupPictures(respData)
       );
       formDisabled(false);
       if (page < Math.ceil(respData.totalHits / HITS_PER_PAGE)) {
         loadmore.hidden = false;
       } else {
         loadmore.hidden = true;
         Notify.warning("We're sorry, but you've reached the end of search results.");
       }
     })
    .catch(err => {
      console.log(err);
      if (err.message === '404') {
        Notify.failure('Oops, there is no pictures whith that query');
      }
      //picturesList.innerHTML = '';
      clearQery();
    });
}


function onBtnSubmit(evt) {

  clearQery();
  evt.preventDefault();
  inputQuery = searchQuery.value.trim();
  if (inputQuery === '') {
    Notify.failure('the field cannot be empty!');
    loadmore.hidden = true;
    return;
  }
  
  formDisabled(true);
  //loadmore.hidden = true;
  
 fetchPictures(inputQuery, page, HITS_PER_PAGE)
     .then(resp => {
        // console.dir(data.data)
       const respData = resp.data;
         if (!respData.total) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
            );
           clearQery();
           formDisabled(false);
        return;
       }
       
       Notify.success(`Hooray! We found ${respData.total} images.`);

       
       picturesList.insertAdjacentHTML('beforeend', creatMarkupPictures(respData));
       formDisabled(false);
       if (page < Math.ceil(respData.totalHits / HITS_PER_PAGE)) {

         loadmore.hidden = false;
       };
       //console.log(loadmore.hidden);

      //  btnSubmit.disabled = false;
      //  searchQuery.disabled = false;

    })
    .catch(err => {
      console.log(err);
      if (err.message === '404') {
        Notify.failure('Oops, there is no pictures whith that query');
      }
      //picturesList.innerHTML = '';
      clearQery();
    });
}



//searchQuery.addEventListener('input', debounce(inputCountries, DEBOUNCE_DELAY));
//console.log(searchQuery);
