const width_viewport = 250.0;
const height_viewport = 200.0;
const FIELD_HEIGHT = 0.0;
const FIELD_DIAMETER = 100.0;

function Field(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points) {
    this.diameter = diameter;
    
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];

    this.position_buffer_lower_land = [];
    this.normal_buffer_lower_land = [];
    this.color_buffer_lower_land = [];
    this.index_buffer_lower_land = [];
    
    this.upperLand = null;
    this.arcField = null;
    this.lowerLand = null;

    this.initBuffers = function() {
        this.upperLand = new UpperField(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points);
        this.upperLand.initTexture(pastoTexture);
        this.upperLand.initBuffers();

        this.arcField = new ArcField(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points);
        this.arcField.initTexture(tierraTexture);
        this.arcField.initBuffers();

        this.lowerLand = new LowerField(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points);
        this.lowerLand.initTexture(pastoTexture);
        this.lowerLand.initBuffers();
    }

    this.draw = function(modelMatrix, shaderProgram) {
        this.upperLand.draw(modelMatrix,shaderProgram);

        this.arcField.draw(modelMatrix,shaderProgram);

        this.lowerLand.draw(modelMatrix,shaderProgram);
    }

    this.updateField = function(points) {
        delete field;
        field = new Field(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP, FIELD_DIAMETER, FIELD_HEIGHT, app.ph1, points); 
        field.initBuffers();
    }
    
    this.getYPositionFromX = function(points, center_x) {
        var min = [], max = [], y_pos = [];
        for (var num_section = 0; num_section < points.length; num_section++) {
            for (var i = 0.0; i < 1.0; i = i + 0.1) {
                var min_center_y = from_y + diameter / 2.0;
                var max_center_y = to_y - diameter / 2.0;
                var delta_y = max_center_y - min_center_y;
                var max_x = to_x;
                var min_x = from_x;
                var delta_x = max_x - min_x;

                var curve = new BSpline(points, min_x, delta_x, min_center_y, delta_y);
                min = curve.get_center_xy(num_section, i);
                max = curve.get_center_xy(num_section, i + 0.1);
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