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
        f1.add(app, 'ph1', 1.0, 8.0).name("ph1").step(0.1);
        f1.add(app, 'ph2', 0.0, 5.0).name("ph2").step(0.1);
        f1.add(app, 'ph3', 5.0, 20.0).name("ph3").step(0.1);
        f1.add(app, 's1', 1.0, 10.0).name("s1").step(0.1);
        f1.add(app, 'cols', 2.0, 4.0).name("Cantidad columnas").step(1);
        f1.add(app, 'pos', -20.0, 20.0).name("Posici&oacuten del puente").step(0.1);
        f1.open();
};

GUI();