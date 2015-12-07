'use strict';
/*global pictures: true';*/

var filtersContainer = document.querySelector('.filters');
var pictureContainer = document.querySelector('.pictures');

filtersContainer.classList.add('hidden');

pictures.forEach(function(picture) {
  var element = getElementFromTemplate(picture);
  pictureContainer.appendChild(element);
});

filtersContainer.classList.remove('hidden');

function getElementFromTemplate(data) {
  var template = document.getElementById('picture-template');
  var element;
  var image;

  if ('content' in template) {
    element = template.content.children[0].cloneNode(true);
  } else {
    element = template.children[0].cloneNode(true);
  }
  var photo = new Image(182, 182);
  image = element.querySelector('img');
  element.replaceChild(photo, image);

  var imageLoadTimeout = setTimeout(function() {
    element.classList.add('.picture-load-failure');
  }, 1000);

  photo.onload = function() {
    clearTimeout(imageLoadTimeout);
    element.querySelector('img').src = data.url;
  };
  photo.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  photo.src = data.url;

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  return element;
}
