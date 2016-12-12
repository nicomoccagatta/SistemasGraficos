function getCantidadVertices(vertexBuffer){
    return vertexBuffer.length;
}

function getPositionBuffer(vertexBuffer){
    var position_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.posicion.length; j++){
            position_buffer.push(verticeActual.posicion[j]);
        }
    }
    return position_buffer;
}

function getColorBuffer(vertexBuffer){
    var color_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.color.length; j++){
            color_buffer.push(verticeActual.color[j]);
        }    
    }
    return color_buffer;
}

function getNormalBuffer(vertexBuffer){
    var normal_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.normal.length; j++){
            normal_buffer.push(verticeActual.normal[j]);
        }
    }
    return normal_buffer;    
}

function getTangentBuffer(vertexBuffer){
    var tangent_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.tangente.length; j++){
            tangent_buffer.push(verticeActual.tangente[j]);
        }
    }
    return tangent_buffer;
}

function getTextureBuffer(vertexBuffer){
    var texture_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.coordTextura.length; j++){
            texture_buffer.push(verticeActual.coordTextura[j]);
        }
    }
    return texture_buffer;    
}

function getBinormalBuffer(vertexBuffer){
    var binormal_buffer = [];
    var verticeActual;
    for (var i = 0; i < vertexBuffer.length; i++){
        verticeActual = vertexBuffer[i];
        for (var j = 0; j < verticeActual.binormal.length; j++){
            binormal_buffer.push(verticeActual.binormal[j]);
        }
    }
    return binormal_buffer;    
}