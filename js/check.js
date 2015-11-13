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
	 else if(typeof a == 'object') {
	 	return 'Количество красных точек во всех строчках изображения: ' + arraySum(a);
	 }
	 else if (typeof b == 'object' && typeof a == 'object') {
	 	return 'Общая площадь артефактов сжатия: ' + arraySquare(a,b) + ' пикселей';
	 }
}

function arraySum(array) {
	var sum = 0;
	for (var i = 0; i <= array.length-1; i++) {
	 		sum += array[i]; 
	 	}
	 return sum;
}

function arraySquare(array1, array2) {
	var square = 0;
	for (var i = 0; i <= array1.length-1; i++) {
		square += array1[i]*array2[i];
	}
	return square;
}