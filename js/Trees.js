function Trees(from_x, to_x, from_y, to_y, field, min_height) {

	/////////// TREE 1 ////////////
	var puntos = [];
    var scale = 1;
    puntos[0] = [scale * 0.0 , min_height + 1.0 * scale];
    puntos[1] = [scale * 3.0 , min_height + 2.0 * scale];
    puntos[2] = [scale * 1.0 , min_height + 3.0 * scale];
    puntos[3] = [scale * 3.0 , min_height + 4.0 * scale];
    puntos[4] = [scale * 0.0 , min_height + 5.0 * scale];
    this.tree1 = new Tree(puntos,min_height,scale);
    this.tree1.initBuffers();
    ///////////////////////////////

	/////////// TREE 2 ////////////
	var puntos2 = [];
	var scale2 = 1;
    puntos2[0] = [scale2 * 0.0 , min_height + 1.0 * scale2];
    puntos2[1] = [scale2 * 3.0 , min_height + 1.5 * scale2];
    puntos2[2] = [scale2 * 3.0 , min_height + 3.0 * scale2];
    puntos2[3] = [scale2 * 3.0 , min_height + 4.5 * scale2];
    puntos2[4] = [scale2 * 0.0 , min_height + 5.0 * scale2];
    this.tree2 = new Tree(puntos2,min_height,scale2);
    this.tree2.initBuffers();
    ///////////////////////////////

	/////////// TREE 3 ////////////
	var puntos3 = [];
	var scale3 = 1;
    puntos3[0] = [scale3 * 3.0 , min_height + 1.0 * scale3];
    puntos3[1] = [scale3 * 0.0 , min_height + 5.0 * scale3];
    this.tree3 = new Tree(puntos3,min_height,scale3);
    this.tree3.initBuffers();
    ///////////////////////////////


    this.setupShaders = function(){
    	this.tree1.setupShaders();
    	this.tree2.setupShaders();
    	this.tree3.setupShaders();
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
    	this.tree1.setupLighting(lightPosition,ambientColor,diffuseColor);
    	this.tree2.setupLighting(lightPosition,ambientColor,diffuseColor);
    	this.tree3.setupLighting(lightPosition,ambientColor,diffuseColor);
    }
    
	function numeroAleatorio(min, max) {
	  return Math.round(Math.random() * (max - min) + min);
	}

    this.draw = function(){
    	////////////////// TREE 1 //////////////////////
        var model_matrix_tree = mat4.create();
        mat4.identity(model_matrix_tree);

    	mat4.translate(model_matrix_tree,model_matrix_tree,[from_x + (to_x-from_x)/20.0 ,0,0]);
        for(var i = 0; i < 10; i++) {
        	var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);

        	var yRandomTop = numeroAleatorio(yLimits[1],to_y);
    		mat4.translate(model_matrix_tree,model_matrix_tree,[i * (to_x-from_x)/10.0,yRandomTop,0]);
        	this.tree1.draw(model_matrix_tree);
        	mat4.translate(model_matrix_tree,model_matrix_tree,[0, -yRandomTop,0]);

	        yRandomBottom = numeroAleatorio(from_y,yLimits[0]);
	    	mat4.translate(model_matrix_tree,model_matrix_tree,[0, yRandomBottom,0]);
	        this.tree1.draw(model_matrix_tree);
	        mat4.translate(model_matrix_tree,model_matrix_tree,[-i * (to_x-from_x)/10.0, -yRandomBottom,0]);
    	}
    	////////////////// TREE 1 ///////////////////////////////


    	////////////////// TREE 2 ///////////////////////////////
        var model_matrix_tree2 = mat4.create();
        mat4.identity(model_matrix_tree2);


    	mat4.translate(model_matrix_tree2,model_matrix_tree2,[from_x + (to_x-from_x)/20.0,110,0]);
        this.tree2.draw(model_matrix_tree2);
        for(var i = 0; i < 9; i++) {
    		mat4.translate(model_matrix_tree2,model_matrix_tree2,[(to_x-from_x)/10.0,0,0]);
        	this.tree2.draw(model_matrix_tree2);
    	}
    	////////////////// TREE 2 ///////////////////////////////


		////////////////// TREE 3 ///////////////////////////////
        var model_matrix_tree3 = mat4.create();
        mat4.identity(model_matrix_tree3);


    	mat4.translate(model_matrix_tree3,model_matrix_tree3,[from_x + (to_x-from_x)/20.0,130,0]);
        this.tree3.draw(model_matrix_tree3);
        for(var i = 0; i < 9; i++) {
    		mat4.translate(model_matrix_tree3,model_matrix_tree3,[(to_x-from_x)/10.0,0,0]);
        	this.tree3.draw(model_matrix_tree3);
    	}
    	////////////////// TREE 3 ///////////////////////////////
    }


    this.updateTrees = function(min_height) {
        delete this;
        trees = new Trees(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP,field,app.ph1);
    }
}