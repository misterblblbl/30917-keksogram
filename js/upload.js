/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return (resizeX.value + resizeSize.value <= currentResizer._image.naturalWidth &&
      resizeY.value + resizeSize.value <= currentResizer._image.naturalHeight);
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];
  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];
  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeSize = resizeForm['resize-size'];
  var resizeSubmit = resizeForm['resize-fwd'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */

  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });
  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  resizeForm.addEventListener('change', function() {
    var textField = document.querySelectorAll('.upload-resize-controls input');
    if (resizeFormIsValid()) {
      resizeSubmit.disabled = false;
      deleteErrorMessage();
      for (var i = 0; i < textField.length; i++) {
        textField[i].classList.remove('input-error');
      }
    } else {
      resizeSubmit.disabled = true;
      showError('Кадрирование не должно выходить за пределы исходного изображения');
      for (var j = 0; j < textField.length; j++) {
        textField[j].classList.add('input-error');
      }
    }
  });
  var showed = false;
  var errorSpan;

  function showError(message) {
    errorSpan = document.createElement('span');
    errorSpan.innerHTML = message;
    errorSpan.setAttribute('style', 'position: absolute; bottom: 60px; left: 10px; color: red');
    resizeForm.appendChild(errorSpan);
    showed = true;
  }

  function deleteErrorMessage() {
    if (showed) {
      resizeForm.removeChild(errorSpan);
      showed = false;
    }
  }

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */

  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  function getCookieExpirationDate() {
    var now = new Date();
    var thisYear = now.getFullYear();
    /* Дата рождения — 9 июня.
    */
    var birthDate = {
      day: 9,
      month: 5
    };
    var lastBirthday;
    if (now < new Date(thisYear, birthDate.month, birthDate.day)) {
      lastBirthday = new Date(thisYear - 1, birthDate.month, birthDate.day);
    } else {
      lastBirthday = new Date(thisYear, birthDate.month, birthDate.day);
    }
    return new Date(+now + +now - +lastBirthday);
  }

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
    docCookies.setItem('filter', filterImage.className.split(' ')[1], getCookieExpirationDate());
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }
    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  function getPreviousFilter() {
    var previousFilter = docCookies.getItem('filter');
    if (previousFilter) {
      filterImage.className = 'filter-image-preview ' + previousFilter;
      filterForm['upload-' + previousFilter].setAttribute('checked', 'checked');
    }
  }

  window.addEventListener('load', function() {
    getPreviousFilter();
  });

  //Обработчик события 'resizerchange',
  //который берет значения смещения и размера кадра из объекта resizer и добавляет их в форму
  window.addEventListener('resizerchange', function() {
    resizeForm.elements.x.value = currentResizer.getConstraint().x;
    resizeForm.elements.y.value = currentResizer.getConstraint().y;
    resizeForm.elements.size.value = currentResizer.getConstraint().side;
  });

  //обработчик изменения полей формы. При изменении значений в форме, обновляется объект resizer
  resizeForm.addEventListener('change', function() {
    var a = +resizeForm.elements.x.value;
    var b = +resizeForm.elements.y.value;
    var c = +resizeForm.elements.size.value;

    currentResizer.setConstraint(a, b, c);
  });

  cleanupResizer();
  updateBackground();
})();
