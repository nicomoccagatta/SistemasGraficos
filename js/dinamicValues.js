var app = {
    ph1: 5,
    ph2: 2.5,
    ph3: 12,
    s1: 5,
    cols: 2,
    pos: 0/*,
    reiniciar:function(){
        //alert("apreto reiniciar");
        console.log(this.alturaMaxima);
        new Bridge(this.alturaMaxima, 3, 9, 1.5, 0, 4, -70, 70);
    },
    detener:function(){
        alert("apreto detener");
    },
    modo:"random" */
};

function GUI () {
        var gui = new dat.GUI();

        /*var f1 = gui.addFolder('Comandos');     
        f1.add(app, 'reiniciar').name("Reiniciar");
        f1.add(app, 'detener').name("detener"); */        

        var f2 = gui.addFolder('Parametros generales');     
        f2.add(app, 'ph1', 1.0, 8.0).name("ph1").step(0.1);
        f2.add(app, 'ph2', 0.0, 5.0).name("ph2").step(0.1);
        f2.add(app, 'ph3', 5.0, 20.0).name("ph3").step(0.1);
        f2.add(app, 's1', 1.0, 10.0).name("s1").step(0.1);
        f2.add(app, 'cols', 2.0, 4.0).name("Cantidad columnas").step(1);
        f2.add(app, 'pos', -20.0, 20.0).name("Posici&oacuten del puente").step(0.1);

        //f2.add(app, 'modo',["random","secuencial"]).name("modo");

        //var f3 = gui.addFolder('Parametros Especiales ');               
        //f3.add(app,'umbral',0.0,1.0).name("umbral");
        
        //f1.open();
        f2.open();
};

var gui_global = GUI();
