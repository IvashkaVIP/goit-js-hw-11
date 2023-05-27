import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchPictures } from './sass/fetchPictures';

//const DEBOUNCE_DELAY = 300;


const btnSubmit = document.querySelector('#search-form')


// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');

btnSubmit.addEventListener('submit', onBtnSubmit);

function onBtnSubmit(evt) {
    evt.preventDefault();
    const searchQuery = document.querySelector('input');
    console.log(searchQuery.value.trim());  
}

//searchQuery.addEventListener('input', debounce(inputCountries, DEBOUNCE_DELAY));
//console.log(searchQuery);