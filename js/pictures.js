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
    var element = getElementFromTemplate(picture);
    fragment.appendChild(element);
  });
  pictureContainer.appendChild(fragment);

  if (filtersContainer.classList.contains('hidden')) {
    // Показываем блок с фильтрами после того, как получили блоки с изображениями
    filtersContainer.classList.remove('hidden');
  }
}

// Получаем шаблон
function getElementFromTemplate(data) {
  var template = document.getElementById('picture-template');
  var element;
  var image;

  // Проверяем, поддерживается ли браузером свойство content
  if ('content' in template) {
    element = template.content.children[0].cloneNode(true);
  } else {
    element = template.children[0].cloneNode(true);
  }

  // Создаем изображение, заменяем им уже находящееся в шаблоне
  var photo = new Image(182, 182);
  photo.src = data.url;
  image = element.querySelector('img');
  element.replaceChild(photo, image);

  var imageLoadTimeout = setTimeout(function() {
    element.classList.add('picture-load-failure');
  }, 1000);

  // Обработчик загрузки:
  photo.onload = function() {
    clearTimeout(imageLoadTimeout);
  };
  // Обработчик ошибки:
  photo.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  // Добавляем количество лайков и комментариев
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  return element;
}

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
