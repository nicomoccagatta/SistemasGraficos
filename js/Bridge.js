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


const DELIMITER = INTERN_HIGH_BORDER - DELIMITER_DIFF;
const CENTER_X_BORDER = HALF_WIDTH// - RADIUS_CYLINDER_ARC;


function Bridge(base_height, max_height, center_x, number_of_columns, from, to) {
    var road = new Road(0, 2, center_x);
    var columns = [];
    var arcs = [];
    var arc_bridge_length = (to - from) - 4;
    var position_first_column = from + 2;
    var position_last_column = from + arc_bridge_length + 2;
    var dintance_between_first_and_last_column = (position_last_column - position_first_column);
    var distance_between_columns = dintance_between_first_and_last_column / (number_of_columns - 1);
    var first_and_last_arc_length = dintance_between_first_and_last_column;
    var last_column = (number_of_columns - 1);
    
    for (var i = 0; i < number_of_columns; i++) {
        var this_step_center_y = position_first_column + i * distance_between_columns;
        var left_column = new Column(10, 20, 27, center_x + CENTER_X_BORDER, this_step_center_y, DELIMITER);
        var right_column = new Column(10, 20, 27, center_x - CENTER_X_BORDER, this_step_center_y, DELIMITER);
        columns.push(left_column);
        columns.push(right_column);
        
        if (i == 0) {
            var previous_step_center_y = position_first_column - dintance_between_first_and_last_column;
            var left_arc = new Arc(2, max_height, center_x + CENTER_X_BORDER, previous_step_center_y, this_step_center_y, 180, 270);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(2, max_height, center_x - CENTER_X_BORDER, previous_step_center_y, this_step_center_y, 180, 270);
            right_arc.initBuffers();
            arcs.push(right_arc);
        }
        
        if (i < last_column) {
            var next_step_center_y = position_first_column + (i + 1) * distance_between_columns;
            var left_arc = new Arc(2, max_height, center_x + CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(2, max_height, center_x - CENTER_X_BORDER, this_step_center_y, next_step_center_y, 180, 360);
            right_arc.initBuffers();
            //Arc(distance_to_floor, top_height, center_x, from, to, min_angle, max_angle);
            arcs.push(right_arc);
        }
        
        if (i == last_column) {
            var next_step_center_y = position_last_column + dintance_between_first_and_last_column;
            var left_arc = new Arc(2, max_height, center_x + CENTER_X_BORDER, this_step_center_y, next_step_center_y, 270, 360);
            left_arc.initBuffers();
            arcs.push(left_arc);
            var right_arc = new Arc(2, max_height, center_x - CENTER_X_BORDER, this_step_center_y, next_step_center_y, 270, 360);
            right_arc.initBuffers();
            arcs.push(right_arc);
        }
    }

    
    /*plain_road_one = new PlainRoad(base_height, center_x, FIRST_PLAIN_ROAD_BEGIN, FIRST_PLAIN_ROAD_END);//PlainRoad(height, center_x, from, to);
    plain_road_one.initBuffers();*/

    
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