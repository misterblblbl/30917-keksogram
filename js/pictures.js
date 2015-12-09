'use strict';
/*global pictures: true';*/

// Находим контейнер для изображений
var pictureContainer = document.querySelector('.pictures');

// Прячем блок с фильтрами
var filtersContainer = document.querySelector('.filters');
filtersContainer.classList.add('hidden');

// Добавляем полученные из шаблона блоки с изображениями в контейнер
pictures.forEach(function(picture) {
  var element = getElementFromTemplate(picture);
  pictureContainer.appendChild(element);
});

// Показываем блок с фильтрами после того, как получили блоки с изображениями
filtersContainer.classList.remove('hidden');

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

  // Создаем изображение, заменяет им уже находящееся в шаблоне
  var photo = new Image(182, 182);
  image = element.querySelector('img');
  element.replaceChild(photo, image);

  var imageLoadTimeout = setTimeout(function() {
    element.classList.add('.picture-load-failure');
  }, 1000);
  
  // Обработчик загрузки: 
  photo.onload = function() {
    clearTimeout(imageLoadTimeout);
    element.querySelector('img').src = data.url;
  };
  // Обработчик ошибки:
  photo.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  photo.src = data.url;

  // Добавляем количество лайков и комментариев
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  return element;
}
