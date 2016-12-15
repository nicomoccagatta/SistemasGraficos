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

function getBinormalBufferFromVectors(normal, tangente) {
    this.binormal = [];
    for (var i = 0; i < normal.length / 3; i++) {
        var binormal = [];
        var _normal = [normal[i*3], normal[i*3+1], normal[i*3+2]];
        var _tangente = [tangente[i*3], tangente[i*3+1], tangente[i*3+2]];
        vec3.cross(binormal, _normal, _tangente);
        vec3.normalize(binormal,binormal);
        this.binormal.push(binormal[0]);
        this.binormal.push(binormal[1]);
        this.binormal.push(binormal[2]);
    }
    return this.binormal;
}

function calcNormals(source, destination) {
    var subtract = function (a, b) {
        var vec3 = new Array(3);
        vec3[0] = a[0] - b[0],
        vec3[1] = a[1] - b[1],
        vec3[2] = a[2] - b[2];
        return vec3;
    }

    var crossProduct = function (a, b) {
        var vec3 = new Array(3);
        vec3[0] = a[1] * b[2] - a[2] * b[1];
        vec3[1] = a[2] * b[0] - a[0] * b[2];
        vec3[2] = a[0] * b[1] - a[1] * b[0];
        return vec3;
    }

    var normalize = function (a) {
        var vec3 = new Array(3);
        var len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        vec3[0] = a[0] / len;
        vec3[1] = a[1] / len;
        vec3[2] = a[2] / len;
        return vec3;
    }
    
    var v_normal = vec3.create();
    for (var i = 0; i < source.length - 6; i += 3) {
        var index = i;
        
        var v1 = [
         source[index],
         source[index + 1],
         source[index + 2]
        ];
        
        var v2 = [
          source[index + 3],
          source[index + 4],
          source[index + 5]
        ];
        
        var v3 = [
          source[index + 6],
          source[index + 7],
          source[index + 8]
        ];

        var u = vec3.create();
        u = subtract(v2, v1);
        var v = vec3.create();
        v = subtract(v3, v1);
        var v_final = vec3.create();
        vec3.cross(v_final, u, v);
        vec3.normalize(v_normal, v_final);
        
        if ((i % 2) != 0) {
            v_normal[0] = (-v_normal[0]);
            v_normal[1] = (-v_normal[1]);
            v_normal[2] = (-v_normal[2]);
        }
        destination.push(v_normal[0], v_normal[1], v_normal[2]);
    }
    destination.push(v_normal[0], v_normal[1], v_normal[2]);
    destination.push(v_normal[0], v_normal[1], v_normal[2]);
}
