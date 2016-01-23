/**
* @fileoverview
* @author Alexandra Godun
*/
'use strict';

define([], function() {
  /**
  * Выводит сообщение в зависимости от типа файла и его характеристик
  * @param {number}
  * @param {number}
  * @return {string}
  */
  function getMessage(a, b) {
    if (typeof a == 'boolean') {
      if (a) {
        return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
      } else {
        return 'Переданное GIF-изображение не анимировано';
      }
    }
    else if (typeof a == 'number') {
      return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' аттрибутов';
    }
    else if (typeof a == 'object') {
      if (typeof b == 'object') {
        return 'Общая площадь артефактов сжатия: ' + arrayMultiple(a,b) + ' пикселей';
    } else {
      return 'Количество красных точек во всех строчках изображения: ' + arraySum(a);
      }
    }
  };

  /**
  * Суммирует значения внутри массива
  * @param {array}
  * @return {number}
  */
  function arraySum(array) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      sum += array[i]; 
    }
    return sum;
  };

  /**
  * Перемножает между собой значения внутри массива1 и массива2
  * @param {array} array1
  * @param {array} array2
  * @return {number}
  */
  function arrayMultiple(array1, array2) {
    var product = 0;
    for (var i = 0; i < array1.length; i++) {
      product += array1[i] * array2[i];
    }
    return product;
  };
});