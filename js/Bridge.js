function addJavascript(jsname, pos) {
    var th = document.getElementsByTagName(pos)[0];
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", jsname);
    th.appendChild(s);
}

addJavascript("Arc.js", "head");
addJavascript("Column.js", "head");
addJavascript("Cylinder.js", "head");
addJavascript("Road.js", "head");


const DELIMITER = INTERN_HIGH_BORDER - DELIMITER_DIFF - RADIUS_CYLINDER_ARC;
const CENTER_X_BORDER = HALF_WIDTH - RADIUS_CYLINDER_ARC;
const DISTANCE_FROM_BEGINNING_CURVED_ROAD = 25;
const DISTANCE_FROM_PH2 = 2;


function Bridge(ph1, ph2, ph3, th1, th2, th3, s1, center_x, number_of_columns, from, to) {
    var ph_sum = ph1 + ph2 + ph3;
    var th_sum = th1 + th2 + th3;
    if (ph_sum < th_sum) {
        var new_th = ph_sum / 3;
        th1 = new_th;
        th2 = new_th;
        th3 = new_th;
    }
    if (ph_sum > th_sum) {
        var new_ph = th_sum / 3;
        ph1 = new_ph;
        ph2 = new_ph;
        ph3 = new_ph;
    }
    
    var road = new Road(ph1, ph1 + ph2, center_x);
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
    var first_height_col = th1;
    var second_height_col = th1 + th2;
    var third_height_col = th1 + th2 + th3;
    var min_height_border_arc = ph1 + ph2 + MAX_HEIGHT_SEPARATION;
    var min_height_center_arc = min_height_border_arc + DISTANCE_FROM_PH2;
    var left_center_x = center_x + CENTER_X_BORDER;
    var right_center_x = center_x - CENTER_X_BORDER;
    
    
    var number_of_center_tensors = (distance_between_columns - (DELIMITER * 2) - (CYLINDER_RADIUS * 2)) / s1;
    var number_of_extreme_tensors = ((DISTANCE_FROM_BEGINNING_CURVED_ROAD - DELIMITER - (CYLINDER_RADIUS * 2)) / 2) / s1;
    
    //Cylinder(number_of_sides, center_x, center_y, floor, ceiling, radius)
    var min_height_tensor, max_height_tensor, tensor_position_y;
    
    this.findHeightFromPosition = function(position, heights) {
        for (var i = 0; i < heights.length; i++) {
            if (heights[i][0] >= position) {
                return heights[i][1];
            }
        }
    }
    
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
            //Arc(distance_to_floor, top_height, center_x, from, to, min_angle, max_angle);
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

    this.setupGroupShaders = function(group) {
        for (var i = 0; i < group.length; i++) {
            group[i].setupShaders();
        }
    }

    this.setupShaders = function() {
        road.setupShaders();
        this.setupGroupShaders(columns);
        this.setupGroupShaders(arcs);
        this.setupGroupShaders(tensors);
    }

    this.setupGroupLighting = function(group, lightPosition, ambientColor, diffuseColor) {
        for (var i = 0; i < group.length; i++) {
            group[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        road.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.setupGroupLighting(columns, lightPosition, ambientColor, diffuseColor);
        this.setupGroupLighting(arcs, lightPosition, ambientColor, diffuseColor);
        this.setupGroupLighting(tensors, lightPosition, ambientColor, diffuseColor);
    }

    this.drawGroup = function(group, modelMatrix) {
        for (var i = 0; i < group.length; i++) {
            group[i].draw(modelMatrix);
        }
    }

    this.draw = function(modelMatrix) { 
        road.draw(modelMatrix);
        this.drawGroup(columns, modelMatrix);
        this.drawGroup(arcs, modelMatrix);
        this.drawGroup(tensors, modelMatrix);
    }
}
