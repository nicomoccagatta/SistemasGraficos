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


function Bridge(ph1, ph2, ph3, th1, th2, th3, s1, max_height, center_x, number_of_columns, from, to) {
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
    
    for (var i = 0; i < number_of_columns; i++) {
        var this_step_center_y = position_first_column + i * distance_between_columns;
        var left_column = new Column(first_height_col, second_height_col, third_height_col, center_x + CENTER_X_BORDER, this_step_center_y, DELIMITER);
        var right_column = new Column(first_height_col, second_height_col, third_height_col, center_x - CENTER_X_BORDER, this_step_center_y, DELIMITER);
        columns.push(left_column);
        columns.push(right_column);
        
        if (i == 0) {
            var previous_step_center_y = position_first_column - DISTANCE_FROM_BEGINNING_CURVED_ROAD;
            var left_arc = new Arc(min_height_border_arc, third_height_col, center_x + CENTER_X_BORDER, previous_step_center_y, this_step_center_y, 270, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(min_height_border_arc, third_height_col, center_x - CENTER_X_BORDER, previous_step_center_y, this_step_center_y, 270, 360);
            right_arc.initBuffers();
            arcs.push(right_arc);
        }
        
        if (i < last_column) {
            var next_step_center_y = position_first_column + (i + 1) * distance_between_columns;
            var left_arc = new Arc(min_height_center_arc, third_height_col, center_x + CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(min_height_center_arc, third_height_col, center_x - CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 360);
            right_arc.initBuffers();
            //Arc(distance_to_floor, top_height, center_x, from, to, min_angle, max_angle);
            arcs.push(right_arc);
        }
        
        if (i == last_column) {
            var next_step_center_y = position_last_column + DISTANCE_FROM_BEGINNING_CURVED_ROAD;
            var left_arc = new Arc(min_height_border_arc, third_height_col, center_x + CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 270);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(min_height_border_arc, third_height_col, center_x - CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 270);
            right_arc.initBuffers();
            arcs.push(right_arc);
        }
    }

    this.setupShaders = function(){
        road.setupShaders();
        for (var i = 0; i < columns.length; i++) {
            columns[i].setupShaders();
        }
        for (var i = 0; i < arcs.length; i++) {
            arcs[i].setupShaders();
        }
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        road.setupLighting(lightPosition, ambientColor, diffuseColor);
        for (var i = 0; i < columns.length; i++) {
            columns[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
        for (var i = 0; i < arcs.length; i++) {
            arcs[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    }

    this.draw = function(modelMatrix){ 
        road.draw(modelMatrix);
        for (var i = 0; i < columns.length; i++) {
            columns[i].draw(modelMatrix);
        }
        for (var i = 0; i < arcs.length; i++) {
            arcs[i].draw(modelMatrix);
        }
    }
}