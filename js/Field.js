function Field(from, to, diameter, min_height, max_height) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];

    this.position_buffer_upper_land = [];
    this.normal_buffer_upper_land = [];
    this.color_buffer_upper_land = [];
    this.index_buffer_upper_land = [];

    this.position_buffer_lower_land = [];
    this.normal_buffer_lower_land = [];
    this.color_buffer_lower_land = [];
    this.index_buffer_lower_land = [];

    this.fillBuffers = function(normal_buf, position_buf, color_buf, x, y, z,r,g,b) {
        normal_buf.push(x);
        normal_buf.push(y);
        normal_buf.push(z);

        color_buf.push(r);
        color_buf.push(g);
        color_buf.push(b);
        
        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);
    }
    
    this.initBuffers = function() {
        var width = to - from;
        var center_y = width / 2.0 + from;
        var bodersize = (width - diameter) / 2.0;
        var radius = diameter / 2.0;
        
        //BEGGINNING UPPER LAND
        ///////////////////////////////////
        var r = 0.1;
        var g = 1.0;
        var b = 0.1;

        var delta = 200.0;
        // x deberia ir de -100 a 100

        var x = -100.0;
        var y = to;
        var z = max_height;
        this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
        this.index_buffer_upper_land.push(0);

        x += delta;
        this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
        this.index_buffer_upper_land.push(1);

        x -= delta;
        y = to - bodersize;
        this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
        this.index_buffer_upper_land.push(2);

        x += delta;
        this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
        this.index_buffer_upper_land.push(3);

        //END UPPER LAND
        ///////////////////////////////////




        // BEGINNING ARC OF THE FIELD
        //////////////////////////////

        r = 0.3;
        g = 0.15;
        b = 0.1;
        for (var angle = 180; angle < 362; angle++) {
            var theta = angle * Math.PI / 180.0;
            var height = max_height - min_height;

            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);

            var x = -100;
            var y = 0.0 - (radius * cosTheta);
            var z = max_height + (height * sinTheta);
                
            this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
            
            x += delta;
            this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
        }
        for (var i = 0; i < 363; i++) {
            this.index_buffer.push(i);
        }

        // END ARC OF THE FIELD
        ///////////////////////////



        // BEGGINING LOWER LAND
        ///////////////////////////////////

        r = 0.1;
        g = 1.0;
        b = 0.1;

        x = -100.0;
        y = from + bodersize;
        z = max_height;
        this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
        this.index_buffer_lower_land.push(0);


        x += delta;
        this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
        this.index_buffer_lower_land.push(1);

        x -= delta;
        y = from;
        this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
        this.index_buffer_lower_land.push(2);

        x += delta;
        this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
        this.index_buffer_lower_land.push(3);

        // END LOWER LAND
        ///////////////////////////////////
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function(){
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix){
        this.prepareDraw(modelMatrix, this.normal_buffer_upper_land, this.color_buffer_upper_land, this.position_buffer_upper_land, this.index_buffer_upper_land);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer_lower_land, this.color_buffer_lower_land, this.position_buffer_lower_land, this.index_buffer_lower_land);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}