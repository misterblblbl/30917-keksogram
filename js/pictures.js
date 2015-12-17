'use strict';

// Находим контейнер для изображений
var pictureContainer = document.querySelector('.pictures');

// Прячем блок с фильтрами
var filtersContainer = document.querySelector('.filters');
filtersContainer.classList.add('hidden');
var pictures = [];
var firstFiltration = true;

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
    renderPictures(loadedData);
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
function renderPictures(picturesToRender) {
  pictureContainer.innerHTML = '';
  var fragment = document.createDocumentFragment();
  picturesToRender.forEach(function(picture) {
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

  var filteredPictures = pictures.slice(0);

  switch (id) {
    case 'filter-new':
      filteredPictures = filteredPictures.filter(isOlderThanMonths);
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
  firstFiltration = false;
  activeFilter = id;
  renderPictures(filteredPictures);

}

function isOlderThanMonths(img) {
  var now = new Date();
  var MILISECONDS_IN_SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000;
  var dateSixMonthEarlier = new Date(now - MILISECONDS_IN_SIX_MONTHS);
  var pictureDate = new Date(img.date);

  return dateSixMonthEarlier < pictureDate;
}
