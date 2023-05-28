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
const guard = document.querySelector('.js-guard');

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handlerPagination, options);

btnSubmit.addEventListener('submit', onBtnSubmit);

let page = 1;
let inputQuery = '';
let maxHits = 0;

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
  loadmore.hidden = true;
  maxHits = 0;
}
function handlerError(err) {
  console.log(err.message);
  Notify.failure('there`s something wrong');
  clearQery();
}

async function onBtnSubmit(evt) {
  clearQery();
  evt.preventDefault();
  inputQuery = searchQuery.value.trim();
  if (inputQuery === '') {
    Notify.failure('the field cannot be empty!');
    return;
  }
  formDisabled(true);
  const { data } = await fetchPictures(inputQuery, page, HITS_PER_PAGE);
  try {
    if (!data.total) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      formDisabled(false);
      return;
    }
    Notify.success(`Hooray! We found ${data.total} images.`);
    picturesList.insertAdjacentHTML('beforeend', creatMarkupPictures(data));
    maxHits = data.totalHits;
    formDisabled(false);
    if (page * HITS_PER_PAGE <= data.totalHits) {
      observer.observe(guard);
    }  else {
       Notify.warning(
         "We're sorry, but you've reached the end of search results."
       );
     }
    
    
  } catch (err) {
    handlerError(err);
  }
}


function handlerPagination(entries) {
  entries.forEach((entry) => {
    //console.log(entry);

     if (entry.isIntersecting && (page*HITS_PER_PAGE < maxHits)) {
      page++;
      fetchPictures(inputQuery, page, HITS_PER_PAGE)
        .then(data => {
          picturesList.insertAdjacentHTML('beforeend', creatMarkupPictures(data.data));
          //console.log(data.data.totalHits,'  ',page)
          if ( (page* HITS_PER_PAGE) >= data.data.totalHits) {
            Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(err => console.log(err));
      };
  })
 
}






//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

//searchQuery.addEventListener('input', debounce(inputCountries, DEBOUNCE_DELAY));
//console.log(searchQuery);
