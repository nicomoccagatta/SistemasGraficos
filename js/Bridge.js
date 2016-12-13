const DELIMITER = INTERN_HIGH_BORDER - DELIMITER_DIFF - RADIUS_CYLINDER_ARC;
const CENTER_X_BORDER = HALF_WIDTH - RADIUS_CYLINDER_ARC;
const DISTANCE_FROM_BEGINNING_CURVED_ROAD = 25;
const DISTANCE_FROM_PH2 = 3;

function Bridge(ph1, ph2, ph3, s1, center_x, number_of_columns, from, to) {
    this.findHeightFromPosition = function(position, heights) {
        for (var i = 0; i < heights.length; i++) {
            if (heights[i][0] >= position) {
                return heights[i][1];
            }
        }
    }
    
    this.params = [];
    this.app_aux = [];
    this.params[0] = ph1;
    this.params[1] = ph2;
    this.params[2] = ph3;
    this.params[3] = s1;
    this.params[4] = center_x;
    this.params[5] = number_of_columns;
    this.params[6] = from_and_to[0];
    this.params[7] = from_and_to[1];
    
    var river = new River();
    river.initBuffers();
    var road = new Road(ph1, ph1 + ph2, center_x, from, to);
    var columns = [];
    var arcs = [];
    var tensors = [];
    var heights_along_road = road.getHeightsAlongRoad();
    var heights_along_arcs = [[]];
    var arc_bridge_length = (to - from) - (2 * DISTANCE_FROM_BEGINNING_CURVED_ROAD);
    var position_first_column = from + DISTANCE_FROM_BEGINNING_CURVED_ROAD;
    var position_last_column = from + arc_bridge_length + DISTANCE_FROM_BEGINNING_CURVED_ROAD;
    var dintance_between_first_and_last_column = (position_last_column - position_first_column);
    var distance_between_columns = dintance_between_first_and_last_column / (number_of_columns - 1);
    var first_and_last_arc_length = dintance_between_first_and_last_column;
    var last_column = (number_of_columns - 1);
    var th1 = this.findHeightFromPosition(position_first_column, heights_along_road);
    var th2 = (ph1 + ph2 + ph3 - th1) / 2;
    var first_height_col = th1;
    var second_height_col = first_height_col + th2;
    var third_height_col = second_height_col + th2;
    var min_height_border_arc = this.findHeightFromPosition(position_first_column - (DISTANCE_FROM_BEGINNING_CURVED_ROAD / 2), heights_along_road) + MAX_HEIGHT_SEPARATION + CYLINDER_RADIUS;
    var min_height_center_arc = ph1 + ph2 + DISTANCE_FROM_PH2;
    var left_center_x = center_x + CENTER_X_BORDER;
    var right_center_x = center_x - CENTER_X_BORDER;
    var number_of_center_tensors = (distance_between_columns - (DELIMITER * 2) - (CYLINDER_RADIUS * 2)) / s1;
    var number_of_extreme_tensors = ((DISTANCE_FROM_BEGINNING_CURVED_ROAD - DELIMITER - (CYLINDER_RADIUS * 2)) / 2) / s1;
    var min_height_tensor, max_height_tensor, tensor_position_y;
    
    for (var i = 0; i < number_of_columns; i++) {
        var this_step_center_y = position_first_column + i * distance_between_columns;
        var left_column = new Column(first_height_col, second_height_col, third_height_col, left_center_x, this_step_center_y, DELIMITER);
        var right_column = new Column(first_height_col, second_height_col, third_height_col, right_center_x, this_step_center_y, DELIMITER);
        columns.push(left_column);
        columns.push(right_column);
        
        if (i == 0) {
            var previous_step_center_y = position_first_column - DISTANCE_FROM_BEGINNING_CURVED_ROAD;
            var left_arc = new Arc(min_height_border_arc, third_height_col, left_center_x, previous_step_center_y, this_step_center_y, 270, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            heights_along_arcs = left_arc.getHeightsAlongArc();
            var right_arc = new Arc(min_height_border_arc, third_height_col, right_center_x, previous_step_center_y, this_step_center_y, 270, 360);
            right_arc.initBuffers();
            arcs.push(right_arc);
            
            for (var j = 1; j < number_of_extreme_tensors; j++) {
                tensor_position_y = this_step_center_y - (j * s1);
                min_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_road);
                max_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_arcs);
                var left_tensor = new Cylinder(NUMBER_OF_SIDES, left_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                left_tensor.initBuffers();
                tensors.push(left_tensor);
                var right_tensor = new Cylinder(NUMBER_OF_SIDES, right_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                right_tensor.initBuffers();
                tensors.push(right_tensor);
            }
        }
        
        if (i < last_column) {
            var next_step_center_y = position_first_column + (i + 1) * distance_between_columns;
            var left_arc = new Arc(min_height_center_arc, third_height_col, left_center_x, this_step_center_y, next_step_center_y, 180, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            heights_along_arcs = left_arc.getHeightsAlongArc();
            var right_arc = new Arc(min_height_center_arc, third_height_col, right_center_x, this_step_center_y, next_step_center_y, 180, 360);
            right_arc.initBuffers();
            arcs.push(right_arc);
            for (var j = 1; j < number_of_center_tensors; j++) {
                tensor_position_y = this_step_center_y + (j * s1);
                min_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_road);
                max_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_arcs);
                var left_tensor = new Cylinder(NUMBER_OF_SIDES, left_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                left_tensor.initBuffers();
                tensors.push(left_tensor);
                var right_tensor = new Cylinder(NUMBER_OF_SIDES, right_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                right_tensor.initBuffers();
                tensors.push(right_tensor);
            }
        }
        
        if (i == last_column) {
            var next_step_center_y = position_last_column + DISTANCE_FROM_BEGINNING_CURVED_ROAD;
            var left_arc = new Arc(min_height_border_arc, third_height_col, left_center_x, this_step_center_y, next_step_center_y, 180, 270);
            left_arc.initBuffers();
            arcs.push(left_arc);
            heights_along_arcs = left_arc.getHeightsAlongArc();
            var right_arc = new Arc(min_height_border_arc, third_height_col, right_center_x, this_step_center_y, next_step_center_y, 180, 270);
            right_arc.initBuffers();
            arcs.push(right_arc);
            
            for (var j = 1; j < number_of_extreme_tensors; j++) {
                tensor_position_y = position_last_column + (j * s1);
                min_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_road);
                max_height_tensor = this.findHeightFromPosition(tensor_position_y, heights_along_arcs);
                var left_tensor = new Cylinder(NUMBER_OF_SIDES, left_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                left_tensor.initBuffers();
                tensors.push(left_tensor);
                var right_tensor = new Cylinder(NUMBER_OF_SIDES, right_center_x, tensor_position_y, min_height_tensor, max_height_tensor, CYLINDER_RADIUS);
                right_tensor.initBuffers();
                tensors.push(right_tensor);
            }
        }
    }

    this.drawGroup = function(group, modelMatrix, shaderProgram) {
        for (var i = 0; i < group.length; i++) {
            group[i].draw(modelMatrix, shaderProgram);
        }
    }

    this.draw = function(modelMatrix, shaderProgram) {
        river.draw(modelMatrix, shaderProgram);
        road.draw(modelMatrix, shaderProgram);
        this.drawGroup(columns, modelMatrix, shaderProgram);

        this.drawGroup(arcs, modelMatrix, shaderProgram);
/*
        this.setupGroupShaders(tensors);
        this.setupGroupLighting(tensors, this.lightPosition, this.ambientColor, this.diffuseColor);
        this.drawGroup(tensors, modelMatrix);
*/
    }
    
    this.updateBridge = function(app, from_and_to) {
        if (this.hasChanged(app,from_and_to)) {
            delete this;
            this.updateParameters(app,from_and_to);
            return new Bridge(app.ph1, app.ph2, app.ph3, app.s1, app.pos, app.cols, from_and_to[0], from_and_to[1]);
        }
        return this;
    }
    
    this.updateParameters = function(app,from_and_to) {
        this.params[0] = app.ph1;
        this.params[1] = app.ph2;
        this.params[2] = app.ph3;
        this.params[3] = app.s1;
        this.params[4] = app.pos;
        this.params[5] = app.cols;
        this.params[6] = from_and_to[0];
        this.params[7] = from_and_to[1];
    }
    
    this.toArray = function(app,from_and_to) {
        this.app_aux[0] = app.ph1;
        this.app_aux[1] = app.ph2;
        this.app_aux[2] = app.ph3;
        this.app_aux[3] = app.s1;
        this.app_aux[4] = app.pos;
        this.app_aux[5] = app.cols;
        this.app_aux[6] = from_and_to[0];
        this.app_aux[7] = from_and_to[1];
    }
    
    this.hasChanged = function(app,from_and_to) {
        this.toArray(app,from_and_to);
        for (var i = 0; i < this.params.length; i ++) {
            if (this.params[i] != this.app_aux[i]) {
                return true;
            }
        }
        return false;
    }
}