/* getMessage(a:*, b:*=):string; */

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
    else if (typeof b == 'object' && typeof a == 'object') {
        return 'Общая площадь артефактов сжатия: ' + arrayMultiple(a,b) + ' пикселей';
    }
    else if(typeof a == 'object') {
        return 'Количество красных точек во всех строчках изображения: ' + arraySum(a);
    }
}

function arraySum(array) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
            sum += array[i]; 
        }
    return sum;
}

function arrayMultiple(array1, array2) {
    var product = 0;
    for (var i = 0; i < array1.length; i++) {
        product += array1[i]*array2[i];
    }
    return product;
}