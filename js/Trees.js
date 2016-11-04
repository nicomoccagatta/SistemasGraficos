function Trees(field) {

	var puntos = [];
    puntos[0] = [0.0,1.0];
    puntos[1] = [3.0,2.0];
    puntos[2] = [1.0,3.0];
    puntos[3] = [3.0,4.0];
    puntos[4] = [0.0,5.0];
    this.tree1 = new Tree(puntos);
    this.tree1.initBuffers();

    this.setupShaders = function(){
    	this.tree1.setupShaders();
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
    	this.tree1.setupLighting(lightPosition,ambientColor,diffuseColor);
    }
    
    this.draw = function(){
        var model_matrix_tree = mat4.create();
        mat4.identity(model_matrix_tree);
        mat4.translate(model_matrix_tree,model_matrix_tree,[50,50,2]);
        mat4.scale(model_matrix_tree,model_matrix_tree,[5.0,5.0,5.0]);
        this.tree1.draw(model_matrix_tree);

        
    }

}