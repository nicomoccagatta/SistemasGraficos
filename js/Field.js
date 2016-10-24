const width_viewport = 250.0;
const height_viewport = 200.0;

function Field(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points) {
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
    
 
    this.Base1 = function(u) {
        return -u*u+u+0.5;
    }
    

    this.get_center_xy = function(num_section,u) {
        // repeat the first and last items

        var points_aux = this.mapped_points[0];
        points_aux += this.mapped_points;
        points_aux += this.mapped_points[this.mapped_points.length-1];

        var aux =
        this.Base0(u) * points_aux[0+num_section] +      // b0*p0
        this.Base1(u) * points_aux[1+num_section] +      // b1*p1
        this.Base2(u) * points_aux[2+num_section];       // b2*p2

        return aux;
    }

    this.initBuffers = function() {
        var long_x = to_x - from_x;
        var long_y = to_y - from_y;
        var radius = diameter / 2.0;
        
        var max_center_y = to_y - radius;
        var min_center_y = from_y + radius;
        var delta_y = max_center_y - min_center_y;

        console.log("Y va de :"+min_center_y+", a: "+max_center_y+".");

        var max_x = to_x;
        var min_x = from_x;
        var delta_x = max_x - min_x;
        console.log("X va de :"+min_x+", a: "+max_x+".");

        for (var i=0; i < points.length; i++) {
            console.log("Points ["+i+"]: " + points[i][1] + "," + points[i][0]+"....");
        }

        var formatted_points = [];
        for (var i=0; i<points.length; i++) {
            formatted_points[i] = [1.0 - points[i][1]/height_viewport , 1.0 - points[i][0]/width_viewport];
            console.log("Formatted Points ["+i+"]: " + formatted_points[i][0] + "," + formatted_points[i][1]+"....");
        }


        for (var i=0; i<formatted_points.length; i++) {
            this.mapped_points[i] = [min_x + formatted_points[i][0] * delta_x , min_center_y + formatted_points[i][1] * delta_y];
            console.log("Mapped Points ["+i+"]: " + this.mapped_points[i][0] + "," + this.mapped_points[i][1]+"....");
        }

        this.mapped_points.sort(function(a, b){return a[0]-b[0]});
        for (var i=0; i<this.mapped_points.length; i++) {
            console.log("SORTED: Mapped Points ["+i+"]: " + this.mapped_points[i][0] + "," + this.mapped_points[i][1]+"....");
        }

        var quant_sections = points.length;

        var index_index_buffer = 0;
        for (var num_section = 0; i < quant_sections; i++) {
            for (var dif_u = 0.0; dif_u <= 0.8 ; dif_u += 0.20) {

                var aux_center_arc = this.get_center_xy(num_section, dif_u);
                var next_center_arc = this.get_center_xy(num_section, dif_u+0.20);

                var top_arc_y = aux_center_arc[1] + radius;
                var bottom_arc_y = aux_center_arc[1] - radius;


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
                    
                    x = next_center_arc[0];
                    this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
                }


                for (var i = 0; i < 363; i++) {
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                }

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
                this.index_buffer_upper_land.push(0);

                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(1);

                x = aux_center_arc[0];
                y = top_arc_y;
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(2);

                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_upper_land, this.position_buffer_upper_land, this.color_buffer_upper_land, x, y, z, r, g, b);
                this.index_buffer_upper_land.push(3);

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
                this.index_buffer_lower_land.push(0);


                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(1);

                x = aux_center_arc[0];
                y = from_y;
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(2);

                x = next_center_arc[0];
                this.fillBuffers(this.normal_buffer_lower_land, this.position_buffer_lower_land, this.color_buffer_lower_land, x, y, z, r, g, b);
                this.index_buffer_lower_land.push(3);

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
}