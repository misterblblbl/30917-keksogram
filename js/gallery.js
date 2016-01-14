/**
* @fileoverview
* @author Alexandra Godun
*/

'use strict';

(function() {
  /**
  * Функция-конструктор для галереи
  * @constructor
  */

  var Gallery = function() {
    /**
    * Элемент для галереи в разметке
    * @type {Element}
    */
    this.element = document.querySelector('.gallery-overlay');

    /**
    * Контейнер с фотографией
    * @type {Element}
    */
    this._photo = document.querySelector('.gallery-overlay-image');
    this._like = document.querySelector('.gallery-overlay-controls-like');
    this._comments = document.querySelector('.gallery-overlay-controls-comments');

    /**
     * Список фотографий из json
     * @type {Array}
     */
    this.pictures = [];

    /**
     * Текущая фотография
     * @type {Number}
     */
    this._currentImage = 0;

    /**
    * Кнопка закрытия галереи
    * @type {Element}
    */
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
  };

  /**
  * Показать галерею
  * @method
  */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    this._closeButton.addEventListener('click', function() {
      this.hide();
    }.bind(this));
  };

  /**
  * Спрятать галерею
  * @method
  */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
  };

  /**
   * Mетод принимает на вход массив фотографий из json и сохраняет его в объекте.
   * @param {Array.<Object>} pictures
   * @method
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  /**
   * Mетод принимает на вход массив фотографий из json и сохраняет его в объекте
   * @param {number} index
   * @method
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    var picture;

    if (typeof index === 'number') {
      if (index <= this.pictures.length - 1) {
        this._currentImage = index;
        picture = this.pictures[this._currentImage];
      } else {
        return -1;
      }
    } else if (typeof index === 'string') {
      for (var i = 0; i < this.pictures.length; i++) {
        if (index.search(this.pictures[i].url) !== -1) {
          this._currentImage = i;
          picture = this.pictures[i];
          break;
        }
      }
      if (!picture) {
        history.pushState('', document.title, window.location.pathname);
        return -1;
      }
    }

    this._photo.src = picture.url;
    this._like.querySelector('.likes-count').textContent = picture.likes;
    this._comments.querySelector('.comments-count').textContent = picture.comments;
  };

  /**
   * Делаем конструктор доступным в глобальной области видимости.
   */
  window.Gallery = Gallery;
})();
