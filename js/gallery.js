'use strict';

(function() {
  /**
  * @constructor
  */

  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
  };

  /**
  * Показать галерею
  */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', function() {
      this.hide();
    }.bind(this));
  };

  /**
  * Спрятать галерею
  */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
  };

  window.Gallery = Gallery;
})();
