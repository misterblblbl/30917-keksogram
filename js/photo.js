/**
* @fileoverview
* @author Alexandra Godun
*/

'use strict';
(function() {
  /**
  * Конструктор для объекта фотографии
  * @param {Object} data
  * @return {Object}
  * @consrtuctor
  */
  function Photo(data) {
    this._data = data;
    this._onPhotoClick = this._onPhotoClick.bind(this);
  }
  /**
  * Отрисовка элемента фотографии в списке. Для каждого элемента создаем DOM-элемент на основе шаблона.
  * @method
  * @return {HTMLElement}
  */
  Photo.prototype.render = function() {
    var template = document.getElementById('picture-template');
    var image;

    // Проверяем, поддерживается ли браузером свойство content
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Добавляем количество лайков и комментариев
    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;

    /**
    *
    * @const
    * @type {number}
    */
    var IMAGE_TIMEOUT = 10000;

    // Создаем изображение, заменяем им уже находящееся в шаблоне
    /**
    * @type {Image}
    */
    var photo = new Image(182, 182);
    photo.src = this._data.url;
    image = this.element.querySelector('img');
    this.element.replaceChild(photo, image);

    var imageLoadTimeout = setTimeout(function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);

    // Обработчик загрузки:
    photo.onload = function() {
      clearTimeout(imageLoadTimeout);
    };
    // Обработчик ошибки:
    photo.onerror = function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this);

    this.element.addEventListener('click', this._onPhotoClick);
  };

  /**
  * @param {Event} evt
  * @private
  */
  Photo.prototype._onPhotoClick = function(evt) {
    evt.preventDefault();
    if (this.element.classList.contains('picture') &&
      !this.element.classList.contains('picture-load-failure')) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };
  /**
  * Удаление обработчика клика по фотографии
  * @override
  */
  Photo.prototype.hide = function() {
    this.element.removeEventListener('click', this._onPhotoClick);
  };

  /**
  * @type {?Function}
  */
  Photo.prototype.onClick = null;

  /**
   * Делаем констуктор доступным в глобальной области видимости.
   */
  window.Photo = Photo;
})();
