const CYLINDER_COLOR = 2.0;
const CYLINDER_RADIUS = 0.1;

function Cylinder(number_of_sides, center_x, center_y, floor, ceiling, radius) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    this.fillBuffers = function(normal_buf, position_buf, color_buf, x, y, z) {
        /*normal_buf.push(x);
        normal_buf.push(y);
        normal_buf.push(z);*/

        color_buf.push(CYLINDER_COLOR);
        color_buf.push(CYLINDER_COLOR);
        color_buf.push(CYLINDER_COLOR);
        
        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);
    }
    
    this.initBuffers = function() {
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];
        this.position_buffer_upper_lid = [];
        this.normal_buffer_upper_lid = [];
        this.color_buffer_upper_lid = [];
        this.index_buffer_upper_lid = [];
        this.position_buffer_lower_lid = [];
        this.normal_buffer_lower_lid = [];
        this.color_buffer_lower_lid = [];
        this.index_buffer_lower_lid = [];

        this.fillBuffers(this.normal_buffer_upper_lid, this.position_buffer_upper_lid, this.color_buffer_upper_lid, center_x, center_y, ceiling);
        this.fillBuffers(this.normal_buffer_lower_lid, this.position_buffer_lower_lid, this.color_buffer_lower_lid, center_x, center_y, floor);
        for (var i = 0; i <= number_of_sides; i++) {
            var theta = i * 2 *  Math.PI / number_of_sides;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var x = center_x + (radius * cosTheta);
            var y = center_y + (radius * sinTheta);
            
            var z = ceiling;
            this.fillBuffers(this.normal_buffer_upper_lid, this.position_buffer_upper_lid, this.color_buffer_upper_lid, x, y, z);
            this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z);
            
            z = floor;
            this.fillBuffers(this.normal_buffer_lower_lid, this.position_buffer_lower_lid, this.color_buffer_lower_lid, x, y, z);
            this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z);
        }
        
        for (var i = 0; i < number_of_sides * 2 + 2; i++) {
            this.index_buffer.push(i);
            if (i <= number_of_sides) {
                this.index_buffer_upper_lid.push(i);
                this.index_buffer_lower_lid.push(i);
            }
        }
        
        
        
        calcNormals(this.position_buffer, this.normal_buffer);
        calcNormals(this.position_buffer_lower_lid, this.normal_buffer_lower_lid);
        calcNormals(this.position_buffer_upper_lid, this.normal_buffer_upper_lid);
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

    this.setupShaders = function() {
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer) {
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

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer_upper_lid, this.color_buffer_upper_lid, this.position_buffer_upper_lid, this.index_buffer_upper_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer_lower_lid, this.color_buffer_lower_lid, this.position_buffer_lower_lid, this.index_buffer_lower_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}