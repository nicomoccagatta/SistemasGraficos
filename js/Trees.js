function Trees(from_x, to_x, from_y, to_y, min_height) {

	this.positions_1 = [];
	this.positions_2 = [];
	this.positions_3 = [];

    this.initBuffers = function() {
        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            this.positions_1[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            this.positions_1[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }

        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            this.positions_2[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            this.positions_2[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }

        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            this.positions_3[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            this.positions_3[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }
    }

    this.updateTrees = function(min_height,scale,scale2,scale3) {
		/////////// TREE 1 ////////////
		var puntos = [];
	    puntos[0] = [scale * 0.0 , min_height + 1.0 * scale];
	    puntos[1] = [scale * 3.0 , min_height + 2.0 * scale];
	    puntos[2] = [scale * 1.0 , min_height + 3.0 * scale];
	    puntos[3] = [scale * 3.0 , min_height + 4.0 * scale];
	    puntos[4] = [scale * 0.0 , min_height + 5.0 * scale];
		this.tree1 = new Tree(puntos,min_height,scale);
		this.tree1.initBuffers();

		/////////// TREE 2 ////////////
		var puntos2 = [];
	    puntos2[0] = [scale2 * 0.0 , min_height + 1.0 * scale2];
	    puntos2[1] = [scale2 * 3.0 , min_height + 1.5 * scale2];
	    puntos2[2] = [scale2 * 3.0 , min_height + 3.0 * scale2];
	    puntos2[3] = [scale2 * 3.0 , min_height + 4.5 * scale2];
	    puntos2[4] = [scale2 * 0.0 , min_height + 5.0 * scale2];
	    this.tree2 = new Tree(puntos2,min_height,scale2);
	    this.tree2.initBuffers();

		/////////// TREE 3 ////////////
		var puntos3 = [];
    	puntos3[0] = [scale3 * 3.0 , min_height + 1.0 * scale3];
    	puntos3[1] = [scale3 * 0.0 , min_height + 5.0 * scale3];	    
	    this.tree3 = new Tree(puntos3,min_height,scale3);
	    this.tree3.initBuffers();

        //////UPDATE POSITIONS//////////////////
        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            if(this.positions_1[i][1] < yLimits[1])
                this.positions_1[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            
            if(this.positions_1[10+i][1] > yLimits[0])
                this.positions_1[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }

        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            if(this.positions_2[i][1] < yLimits[1])
                this.positions_2[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            
            if(this.positions_2[10+i][1] > yLimits[0])
                this.positions_2[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }

        for(var i = 0; i < 10; i++) {
            var yLimits = field.getYPositionFromX(points,from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0);
            var yRandomTop = randomNum(yLimits[1],to_y);
            var yRandomBottom = randomNum(from_y,yLimits[0]);

            if(this.positions_3[i][1] < yLimits[1])
                this.positions_3[i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomTop,0];
            
            if(this.positions_3[10+i][1] > yLimits[0])
                this.positions_3[10+i] = [from_x + (to_x-from_x)/20.0 + i * (to_x-from_x)/10.0,yRandomBottom,0];
        }
        ////////////////////////////////////////
    }

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

	function randomNum(min, max) {
	  return Math.round(Math.random() * (max - min) + min);
	}

    this.draw = function(texture){
    	////////////////// TREE 1 //////////////////////
        var model_matrix_tree = mat4.create();
        mat4.identity(model_matrix_tree);

        for(var i = 0; i < 10; i++) {
    		mat4.translate(model_matrix_tree,model_matrix_tree, this.positions_1[i]);
        	this.tree1.draw(model_matrix_tree, texture);
    		mat4.translate(model_matrix_tree,model_matrix_tree, [-this.positions_1[i][0],-this.positions_1[i][1],-this.positions_1[i][2]]);

    		mat4.translate(model_matrix_tree,model_matrix_tree, this.positions_1[10+i]);
	        this.tree1.draw(model_matrix_tree, texture);
    		mat4.translate(model_matrix_tree,model_matrix_tree, [-this.positions_1[10+i][0],-this.positions_1[10+i][1],-this.positions_1[10+i][2]]);
    	}
    	////////////////// TREE 1 ///////////////////////////////


    	////////////////// TREE 2 ///////////////////////////////
        var model_matrix_tree2 = mat4.create();
        mat4.identity(model_matrix_tree2);

        for(var i = 0; i < 10; i++) {
    		mat4.translate(model_matrix_tree2,model_matrix_tree2, this.positions_2[i]);
        	this.tree2.draw(model_matrix_tree2, texture);
    		mat4.translate(model_matrix_tree2,model_matrix_tree2, [-this.positions_2[i][0],-this.positions_2[i][1],-this.positions_2[i][2]]);

    		mat4.translate(model_matrix_tree2,model_matrix_tree2, this.positions_2[10+i]);
	        this.tree2.draw(model_matrix_tree2, texture);
    		mat4.translate(model_matrix_tree2,model_matrix_tree2, [-this.positions_2[10+i][0],-this.positions_2[10+i][1],-this.positions_2[10+i][2]]);
    	}
    	////////////////// TREE 2 ///////////////////////////////


		////////////////// TREE 3 ///////////////////////////////
        var model_matrix_tree3 = mat4.create();
        mat4.identity(model_matrix_tree3);

        for(var i = 0; i < 10; i++) {
    		mat4.translate(model_matrix_tree3,model_matrix_tree3, this.positions_3[i]);
        	this.tree3.draw(model_matrix_tree3, texture);
    		mat4.translate(model_matrix_tree3,model_matrix_tree3, [-this.positions_3[i][0],-this.positions_3[i][1],-this.positions_3[i][2]]);

    		mat4.translate(model_matrix_tree3,model_matrix_tree3, this.positions_3[10+i]);
	        this.tree3.draw(model_matrix_tree3, texture);
    		mat4.translate(model_matrix_tree3,model_matrix_tree3, [-this.positions_3[10+i][0],-this.positions_3[10+i][1],-this.positions_3[10+i][2]]);
    	}
    	////////////////// TREE 3 ///////////////////////////////
    }
}