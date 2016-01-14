/**
* @fileoverview
* @author Alexandra Godun
*/

'use strict';

/**
 * Способ наследования через подмену конструктора на пустой конструктор.
 */

(function() {
  /**
  * Присвоение объекту Child свойств и методов объекта Parent.
  * @param  {Object} Child
  * @param  {Object} Parent
  */
  function inherit(Child, Parent) {
    var EmptyConstructor = function() {
    };
    EmptyConstructor.prototype = Parent.prototype;
    Child.prototype = new EmptyConstructor();
  }
  window.inherit = inherit;
});
