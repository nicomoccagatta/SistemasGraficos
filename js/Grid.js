function grid(latitud, longitud) {
    var index_buffer = [];

    var max = 0;
    for (var i = 0; i < latitud-1; i++) {
        var index;
        for (var j = 0; j < longitud; j++) {
            index = j + i * longitud;
            if (i != 0 && j == 0) index_buffer.push(index); //Repito el primero de cada fila, salvo la primera
            index_buffer.push(index);
            index_buffer.push(index + longitud);
            if (index + longitud > max) max = index + longitud;
        }
        if (i != latitud-2) index_buffer.push(index + longitud); //Repito el ultimo de cada fila, salvo la ultima
    }

    return index_buffer;
}
