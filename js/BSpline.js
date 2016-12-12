function BSpline(points, min_x, delta_x, min_center_y, delta_y) {
    this.mapped_points = [];
    this.points_aux = [];

    var formatted_points = [];
    for (var i=0; i<points.length; i++) {
        formatted_points[i] = [points[i][1]/height_viewport , points[i][0]/width_viewport];
    }

    for (var i=0; i<formatted_points.length; i++) {
        this.mapped_points[i] = [min_x + formatted_points[i][0] * delta_x , min_center_y + formatted_points[i][1] * delta_y];
    }

    this.mapped_points.sort(function(a, b){return a[0]-b[0]});

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
}