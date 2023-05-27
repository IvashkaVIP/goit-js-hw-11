import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchPictures } from './sass/fetchPictures';

//const DEBOUNCE_DELAY = 300;

const btnSubmit = document.querySelector('#search-form');
const searchQuery = document.querySelector('input');
const picturesList = document.querySelector('.gallery');
//console.log(picturesList);

// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');

btnSubmit.addEventListener('submit', onBtnSubmit);

function onBtnSubmit(evt) {
  evt.preventDefault();

  const inputQuery = searchQuery.value.trim();

  if (inputQuery === '') {
    Notify.failure('the field cannot be empty!');
    return;
  }

  fetchPictures(inputQuery)
    .then(data => {
      if (data === []) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      picturesList.innerHTML = creatMarkupPictures(data);
    })
    .catch(err => {
      console.log(err);
      if (err.message === '404') {
        Notify.failure('Oops, there is no pictures whith that query');
      }
      picturesList.innerHTML = '';
    });
}

function creatMarkupPictures(data) {
 return data.hits.map(
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
                <b>${likes}</b>
              </p>
              <p class="info-item">
                <b>${views}</b>
              </p>
              <p class="info-item">
                <b>${comments}</b>
              </p>
              <p class="info-item">
                <b>${downloads}</b>
              </p>
            </div>
          </div>`;
    }
  ).join('');

  // webformatURL - ссылка на маленькое изображение для списка карточек.
  // largeImageURL - ссылка на большое изображение.
  // tags - строка с описанием изображения. Подойдет для атрибута alt.
  // likes - количество лайков.
  // views - количество просмотров.
  // comments - количество комментариев.
  // downloads - количество загрузок.

  // data.map(({ total }) => console.log(total));
  //data.map(item => console.log(item));

  //console.log({ hits: { webformatHeight } });

  //     return `<div class="photo-card">
  //   <img src="" alt="" loading="lazy" />
  //   <div class="info">
  //     <p class="info-item">
  //       <b>Likes</b>
  //     </p>
  //     <p class="info-item">
  //       <b>Views</b>
  //     </p>
  //     <p class="info-item">
  //       <b>Comments</b>
  //     </p>
  //     <p class="info-item">
  //       <b>Downloads</b>
  //     </p>
  //   </div>
  // </div>`;
}

//searchQuery.addEventListener('input', debounce(inputCountries, DEBOUNCE_DELAY));
//console.log(searchQuery);
