'use strict';
(function() {
  /**
  * @param {Object} data
  * @return {Object}
  * @consrtuctor
  */
  function Photo(data) {
    this._data = data;
  }

  Photo.prototype.render = function() {
    var template = document.getElementById('picture-template');
    var image;

    // Проверяем, поддерживается ли браузером свойство content
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Создаем изображение, заменяем им уже находящееся в шаблоне
    var photo = new Image(182, 182);
    photo.src = this._data.url;
    image = this.element.querySelector('img');
    this.element.replaceChild(photo, image);

    var imageLoadTimeout = setTimeout(function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this), 1000);

    // Обработчик загрузки:
    photo.onload = function() {
      clearTimeout(imageLoadTimeout);
    };
    // Обработчик ошибки:
    photo.onerror = function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this);

    // Добавляем количество лайков и комментариев
    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;
  };

  window.Photo = Photo;
})();
