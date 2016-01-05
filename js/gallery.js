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
  Gallery.prototype.setPictures = function() {
    this.pictures = pictures;
  };

  /**
   * Mетод принимает на вход массив фотографий из json и сохраняет его в объекте
   * @param {number} index
   * @method
   */
   Gallery.prototype.setCurrentPicture = function(index) {
    var picture;
   }

  /**
   * Делаем конструктор доступным в глобальной области видимости.
   */
  window.Gallery = Gallery;
})();
