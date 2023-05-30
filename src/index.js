import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { creatMarkupPictures } from './import/creatMarkup';
import { fetchPictures } from './import/fetchPictures';
import { lightbox } from './import/lightBox';

const HITS_PER_PAGE = 40;

const btnSubmit = document.querySelector('#search-form');
const searchQuery = document.querySelector('input');
const picturesList = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

btnSubmit.addEventListener('submit', onBtnSubmit);

let page = 1;
let inputQuery = '';

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handlerPagination, options);

function formDisabled(isDisabled) {
  btnSubmit[0].disabled = isDisabled;
  btnSubmit[1].disabled = isDisabled;
}

function clearQery() {
  page = 1;
  inputQuery = '';
  picturesList.innerHTML = '';
 // loadmore.hidden = true;
  }
function handlerError(err) {
  console.log(err.message);
  Notify.failure('there`s something wrong');
  clearQery();
}
function smoothScroll(element) {
  const { height: cardHeight } = element.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.0,
    behavior: 'smooth',
  });
}

async function onBtnSubmit(evt) {
  evt.preventDefault();
  clearQery();
  inputQuery = searchQuery.value.trim();
  if (inputQuery === '') {
    Notify.failure('the field cannot be empty!');
    return;
  }
  formDisabled(true);

  try {
    const { data } = await fetchPictures(inputQuery, page, HITS_PER_PAGE);
    if (!data.total) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      formDisabled(false);
      return;
    }

    Notify.success(`Hooray! We found ${data.total} images.`);
    picturesList.insertAdjacentHTML('beforeend', creatMarkupPictures(data));
    lightbox.refresh();
    formDisabled(false);
    if (page * HITS_PER_PAGE <= data.totalHits) {
      observer.observe(guard);
    } else {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    handlerError(err);
  }
}

function handlerPagination(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && picturesList.firstElementChild) {
      page++;
      fetchPictures(inputQuery, page, HITS_PER_PAGE)
        .then(({ data }) => {
          //console.log(data);
          picturesList.insertAdjacentHTML(
            'beforeend',
            creatMarkupPictures(data)
          );
          lightbox.refresh();
          smoothScroll(picturesList.firstElementChild);
          if (page * HITS_PER_PAGE >= data.totalHits) {
            Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            observer.unobserve(guard);
          }
        })
        .catch(err => console.log(err));
    };
  })
 
}

