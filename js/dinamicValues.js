const LIMIT_LEFT_POSITION = LEFT_BORDER_MAP + CENTER_X_BORDER + (2 * DELIMITER_DIFF) + DELIMITER + RADIUS_CYLINDER_ARC;
const LIMIT_RIGHT_POSITION = RIGHT_BORDER_MAP - CENTER_X_BORDER - (2 * DELIMITER_DIFF) - DELIMITER - RADIUS_CYLINDER_ARC;

var app = {
    ph1: 5,
    ph2: 2.5,
    ph3: 12,
    s1: 5,
    cols: 2,
    pos: 0
};

function GUI () {
        var gui = new dat.GUI();        

        var f1 = gui.addFolder('Parametros generales');     
        f1.add(app, 'ph1', 3.0, 10.0).name("ph1").step(0.1);
        f1.add(app, 'ph2', 0.0, 6.0).name("ph2").step(0.1);
        f1.add(app, 'ph3', 5.0, 20.0).name("ph3").step(0.1);
        f1.add(app, 's1', 1.0, 10.0).name("s1").step(0.1);
        f1.add(app, 'cols', 2.0, 4.0).name("Cantidad columnas").step(1);
        f1.add(app, 'pos', LIMIT_LEFT_POSITION, LIMIT_RIGHT_POSITION).name("Posici&oacuten puente").step(0.1);
        f1.open();
};

GUI();