/**
* @fileoverview
* @author Alexandra Godun
*/

/* global Photo: true, Gallery: true */
'use strict';

/**
* Контейнер для картинок
* @type {Element}
*/
var pictureContainer = document.querySelector('.pictures');

/**
* Блок с фильтрами
* @type {Element}
*/
var filtersContainer = document.querySelector('.filters');

/**
* @type {Array}
*/
var pictures = [];

/**
* @type {string}
*/
var currentFilter = 'filter-all';

/**
* @type {boolean}
*/
var firstFiltration = true;

/**
* @type {number}
*/
var lastMonths = 6;

/**
* @type {number}
*/
var currentPage = 0;

/**
* @const {number}
*/
var PAGE_SIZE = 12;

/**
* @type {Array}
*/
var filteredPictures = [];

/**
*@type {Array}
*/
var renderedElements = [];

/**
* Таймаут тротлинга в обработчике скролла.
* @type {number}
*/
var scrollTimeout;

/**
* Создание галереи
* @type {Gallery}
*/
var gallery = new Gallery();

// Прячем блок с фильтрами
filtersContainer.classList.add('hidden');

/**
* Показывает фотографии на текущей странице
*/
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
// Подгрузить фото при скроле
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(renderNewPages(), 100);
});

//Загружаем данные из файла и создаем блоки с фотографиями
getPicturesData();

/**
* @type {string}
*/
var activeFilter = 'filter-popular';

filtersContainer.addEventListener('click', function(evt) {
  var clickedFilter = evt.target;
  if (clickedFilter.classList.contains('filters-radio')) {
    setActiveFilter(clickedFilter.id);
  }
});

/**
* Загружаем данные из файла data/pictures.json с помощью XMLHttpRequest
* @param {Function} callback Обработчик асинхронного получения фотографий
* @callback callback(Array)
*/
function getPicturesData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/pictures.json');
  xhr.timeout = 10000;

  //отобразить прелоудер на время загрузки файлв
  pictureContainer.classList.add('pictures-loading');

  /**
  * @param {Event}
  */
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

/**
* Добавляем полученные из шаблона блоки с изображениями в контейнер
* @param {Array}
* @param {number}
*/
function renderPictures(picturesToRender, pageNumber, replace) {
  if (replace) {
    var el;
    while ((el = renderedElements.shift())) {
      pictureContainer.removeChild(el.element);
      el.onClick = null;
      el.hide();
    }
  }
  var fragment = document.createDocumentFragment();
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var pagePictures = picturesToRender.slice(from, to);

  renderedElements = renderedElements.concat(pagePictures.map(function(picture, index) {
    var pictureElement = new Photo(picture);
    pictureElement.render();
    fragment.appendChild(pictureElement.element);

    pictureElement.onClick = function() {
      gallery.data = pictureElement._data;
      gallery.setCurrentPicture(index + PAGE_SIZE * pageNumber);
      gallery.show();
    };
    window.addEventListener('keydown', _onDocumentKeyDown);
    return pictureElement;
  }));
  pictureContainer.appendChild(fragment);

  if (filtersContainer.classList.contains('hidden')) {
    // Показываем блок с фильтрами после того, как получили блоки с изображениями
    filtersContainer.classList.remove('hidden');
  }
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
/**
* @param {string} filterId
* @returns {Array}
*/
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
  gallery.setPictures(filteredPictures);
  renderPictures(filteredPictures, currentPage, true);
  renderNewPages();

  firstFiltration = false;
  activeFilter = id;
}

/**
* Проверяем, что изображение создано не более 3-x месяцев назад.
* @param {img}
* @returns {boolean}
*/
function isOlderThanMonths(img, monthCount) {
  var now = new Date();
  var milisecondsInMonths = monthCount * 30 * 24 * 60 * 60 * 1000;
  var dateSixMonthEarlier = new Date(now - milisecondsInMonths);
  var pictureDate = new Date(img.date);

  return dateSixMonthEarlier < pictureDate;
}
