const width_viewport = 250.0;
const height_viewport = 200.0;
const FIELD_HEIGHT = 0.0;
const FIELD_DIAMETER = 100.0;

function Field(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points) {
    this.diameter = diameter;
        
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

    this.mapped_points = [];
    this.points_aux = [];

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

    this.Base0 = function(u) {
        return 0.5*(1-u)*(1-u);
    }

    this.Base1 = function(u) {
        return -u*u+u+0.5;
    }
    
 
    this.Base2 = function(u) {
        return 0.5*u*u;
    }
    

    this.get_center_xy = function(num_section,u) {
        // repeat the first and last items

        var points_aux = [];
        points_aux[0] = this.mapped_points[0];
        for (var i=0; i<this.mapped_points.length; i++) {
            points_aux[i+1] = this.mapped_points[i];
        }
        points_aux[points_aux.length] = this.mapped_points[this.mapped_points.length-1];

        var aux = [];
        aux[0] =
        this.Base0(u) * points_aux[0+num_section][0] +      // b0x*p0x
        this.Base1(u) * points_aux[1+num_section][0] +      // b1x*p1x
        this.Base2(u) * points_aux[2+num_section][0];       // b2x*p2x
        aux[1] =
        this.Base0(u) * points_aux[0+num_section][1] +      // b0y*p0y
        this.Base1(u) * points_aux[1+num_section][1] +      // b1y*p1y
        this.Base2(u) * points_aux[2+num_section][1];       // b2y*p2y

        return aux;
    }

    this.initBuffers = function() {
        var long_x = to_x - from_x;
        var long_y = to_y - from_y;
        var radius = diameter / 2.0;
        
        var max_center_y = to_y - radius;
        var min_center_y = from_y + radius;
        var delta_y = max_center_y - min_center_y;

        var max_x = to_x;
        var min_x = from_x;
        var delta_x = max_x - min_x;

        var formatted_points = [];
        for (var i=0; i<points.length; i++) {
            formatted_points[i] = [points[i][1]/height_viewport , points[i][0]/width_viewport];
        }


        for (var i=0; i<formatted_points.length; i++) {
            this.mapped_points[i] = [min_x + formatted_points[i][0] * delta_x , min_center_y + formatted_points[i][1] * delta_y];
        }

        this.mapped_points.sort(function(a, b){return a[0]-b[0]});

        var quant_sections = points.length;
        var index_index_buffer = 0;
        var index_upper_land = 0;
        var index_lower_land = 0;


        for (var num_section = 0; num_section < quant_sections; num_section++) {
            for (var dif_u = 0.0; dif_u <= 0.8 ; dif_u += 0.2) {

                var aux_center_arc = this.get_center_xy(num_section, dif_u);
                var next_center_arc = this.get_center_xy(num_section, dif_u+0.20);

                var top_arc_y = aux_center_arc[1] + radius;
                var next_top_arc_y = next_center_arc[1] + radius;
                var bottom_arc_y = aux_center_arc[1] - radius;
                var next_bottom_arc_y = next_center_arc[1] - radius;


                //////////////////////////////
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

                    var x = aux_center_arc[0];
                    var y = aux_center_arc[1] - (radius * cosTheta);
                    var z = max_height + (height * sinTheta);
                        
                    this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
                    //PARTENUEVA
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                    ////////////
                    
                    x = next_center_arc[0];
                    y = next_center_arc[1] - (radius * cosTheta);
                    this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                }
                index_index_buffer--;
                this.index_buffer.push(index_index_buffer);
                this.index_buffer.push(index_index_buffer - 362);
                index_index_buffer++;

                ///////////////////////////
                // END ARC OF THE FIELD
                ///////////////////////////


                //////////////////////////////////
                //BEGGINNING UPPER LAND
                ///////////////////////////////////
                var r = 0.1;
                var g = 1.0;
                var b = 0.1;

                var x = aux_center_arc[0];
                var y = to_y;
                var z = max_height;
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(index_upper_land);
                index_upper_land++;

                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(index_upper_land);
                index_upper_land++;

                x = aux_center_arc[0];
                y = top_arc_y;
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(index_upper_land);
                index_upper_land++;

                x = next_center_arc[0];
                y = next_top_arc_y;
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(index_upper_land);
                this.index_buffer_upper_land.push(index_upper_land);
                this.index_buffer_upper_land.push(index_upper_land-2);
                index_upper_land++;

                ///////////////////////////////////
                //END UPPER LAND
                ///////////////////////////////////

                ///////////////////////////////////
                // BEGGINING LOWER LAND
                ///////////////////////////////////

                r = 0.1;
                g = 1.0;
                b = 0.1;

                x = aux_center_arc[0];
                y = bottom_arc_y;
                z = max_height;
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(index_lower_land);
                index_lower_land++;


                x = next_center_arc[0];
                y = next_bottom_arc_y;
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(index_lower_land);
                index_lower_land++;

                x = aux_center_arc[0];
                y = from_y;
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(index_lower_land);
                index_lower_land++;

                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(index_lower_land);
                this.index_buffer_lower_land.push(index_lower_land);
                this.index_buffer_lower_land.push(index_lower_land-2);
                index_lower_land++;

                ///////////////////////////////////
                // END LOWER LAND
                ///////////////////////////////////
            }
        }

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

    this.updateField = function(points) {
        delete this;
        field = new Field(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP, FIELD_DIAMETER, FIELD_HEIGHT, app.ph1, points); 
        field.initBuffers();
    }

    function arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    
    this.getYPositionFromX = function(points, center_x) {
        var min = [], max = [], y_pos = [];
        for (var num_section = 0; num_section < points.length; num_section++) {
            for (var i = 0.0; i < 1.0; i = i + 0.1) {
                min = this.get_center_xy(num_section, i);
                max = this.get_center_xy(num_section, i + 0.1);
                if ((min[0] <= center_x) && (max[0] >= center_x)) {
                    var center_aux = max[1] - this.diameter / 2;
                    y_pos[0] = center_aux;
                    y_pos[1] = center_aux + this.diameter;
                    return y_pos;
                }
            }
        }
    }
}