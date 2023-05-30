// 36802166-6c141fd6d6e9c8442c873b534
// https://pixabay.com/api/

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.

import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '36802166-6c141fd6d6e9c8442c873b534';

//const axios = requeri ('axios').default;
//const axios = require('axios/dist/browser/axios.cjs'); // browser

export async function fetchPictures(searchQuery='', currentPage=1, hitsPerPage) {
    
return await axios(BASE_URL, {
  params: {
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: hitsPerPage,
  },
});
}
  
