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

// Показываем блок с фильтрами после того, как получили блоки с изображениями
filtersContainer.classList.remove('hidden');

var filters = document.querySelector('.filters');
var activeFilter = 'filter-popular';

filters.addEventListener('click', function(evt) {
  var clickedFilter = evt.target;
  if (clickedFilter.classList.contains('filters-radio')) {
    setActiveFilter(clickedFilter.id);
  }
});

//Загружаем данные из файла data/pictures.json с помощью XMLHttpRequest
function getPicturesData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/pictures.json');
  pictureContainer.classList.add('pictures-loading');

  xhr.onload = function(evt) {
    pictureContainer.classList.remove('pictures-loading');
    var rawData = evt.target.response;
    var loadedData = JSON.parse(rawData);
    pictures = loadedData;
    renderPictures(loadedData);
  };
  xhr.timeout = 10000;
  xhr.onerror = function() {
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
      filteredPictures = filteredPictures.filter(selectLastThreeMonth);
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

function selectLastThreeMonth(img) {
  var now = new Date();
  var MILISECONDS_IN_THREE_MONTH = 3 * 30 * 24 * 60 * 60 * 1000;
  var dateThreeMonthEarlier = new Date(+now - MILISECONDS_IN_THREE_MONTH);
  var pictureDate = new Date(img.date);

  return +dateThreeMonthEarlier < +pictureDate;
}
