/* global Photo: true, Gallery: true */
'use strict';

// Находим контейнер для изображений
var pictureContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var currentFilter = 'filter-all';
var firstFiltration = true;
var lastMonths = 6;
var currentPage = 0;
var PAGE_SIZE = 12;
var filteredPictures = [];
var scrollTimeout;
var gallery = new Gallery();

// Прячем блок с фильтрами
filtersContainer.classList.add('hidden');

function renderNewPages() {
  //получаем размер и координаты контейнера
  var containerCoordinates = pictureContainer.getBoundingClientRect();
    //высота вьюпорта
  var viewportSize = window.innerHeight;
  if (containerCoordinates.bottom <= viewportSize) {
    if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
      renderPictures(filteredPictures, ++currentPage);
    }
  }
}

window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(renderNewPages(), 100);
});

//Загружаем данные из файла и создаем блоки с фотографиями
getPicturesData();

var activeFilter = 'filter-popular';

filtersContainer.addEventListener('click', function(evt) {
  var clickedFilter = evt.target;
  if (clickedFilter.classList.contains('filters-radio')) {
    setActiveFilter(clickedFilter.id);
  }
});

//Загружаем данные из файла data/pictures.json с помощью XMLHttpRequest
function getPicturesData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/pictures.json');
  xhr.timeout = 10000;

  //отобразить прелоудер на время загрузки файлв
  pictureContainer.classList.add('pictures-loading');

  xhr.onload = function(evt) {
    var rawData = evt.target.response;
    var loadedData = JSON.parse(rawData);
    pictures = loadedData;
    setActiveFilter(currentFilter);
    //renderPictures(loadedData);
    //убрать прелоудер, когда файлы загрузятся
    pictureContainer.classList.remove('pictures-loading');
  };
  xhr.timeout = 10000;
  xhr.onerror = function() {
    if (pictureContainer.classList.contains('pictures-loading')) {
      pictureContainer.classList.remove('pictures-loading');
    }
    pictureContainer.classList.add('pictures-failure');
  };
  xhr.send();
}

// Добавляем полученные из шаблона блоки с изображениями в контейнер
function renderPictures(picturesToRender, pageNumber, replace) {
  if (replace) {
    pictureContainer.innerHTML = '';
  }
  var fragment = document.createDocumentFragment();
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var pagePictures = picturesToRender.slice(from, to);

  pagePictures.forEach(function(picture) {
    var pictureElement = new Photo(picture);
    pictureElement.render();
    fragment.appendChild(pictureElement.element);

    pictureElement.element.addEventListener('click', _onPhotoClick);
    window.addEventListener('keydown', _onDocumentKeyDown);
    console.log(gallery);
  });
  pictureContainer.appendChild(fragment);

  if (filtersContainer.classList.contains('hidden')) {
    // Показываем блок с фильтрами после того, как получили блоки с изображениями
    filtersContainer.classList.remove('hidden');
  }
}

/**
* @param {Event} evt
*/
function _onPhotoClick(evt) {
  evt.preventDefault();
  gallery.show();
}

/**
* @param {Event} evt
*/
function _onDocumentKeyDown(evt) {
  if (evt.keyCode === 27) {
    console.log('keydown!');
    gallery.hide();
  }
}

// Получаем шаблон

function setActiveFilter(id) {
  //Предотвращение повторной установки одного и того же фильтра
  if (firstFiltration) {
    if (activeFilter === id) {
      return;
    }
  }

  filteredPictures = pictures.slice(0);

  switch (id) {
    case 'filter-new':
      filteredPictures = filteredPictures.filter(function(image) {
        return isOlderThanMonths(image, lastMonths);
      });
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
    case 'filter-discussed':
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case 'filter-popular':
      filteredPictures = pictures;
      break;
  }
  currentPage = 0;
  renderPictures(filteredPictures, currentPage, true);
  renderNewPages();

  firstFiltration = false;
  activeFilter = id;
}
function isOlderThanMonths(img, monthCount) {
  var now = new Date();
  var milisecondsInMonths = monthCount * 30 * 24 * 60 * 60 * 1000;
  var dateSixMonthEarlier = new Date(now - milisecondsInMonths);
  var pictureDate = new Date(img.date);

  return dateSixMonthEarlier < pictureDate;
}
