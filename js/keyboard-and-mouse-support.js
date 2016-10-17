var currentlyPressedKeys = {};

//Los codigos de las teclas fueron sacados de esta página http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
//se llaman solo una vez y cuando se presiona una tecla
function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
	if (!currentlyPressedKeys[81] || !currentlyPressedKeys[69]){
		spinning = false;
	}
}
  
//Al estar adentro del tick, se llamaria siempre
function handleKeyPresses(){	
	// A o D //
	if ( (currentlyPressedKeys[65] || currentlyPressedKeys[68]) && cameraMode == 2){ //METER ACA QUE ES LA CAMARA DOS Y SE MUEVE EL PJ
		//Me voy a mover como con W/S pero roto como 90 grados, o sea como que cambio de Y a X y de X a Y
		var normalizedCamera= vec3.create();
		vec3.multiply(normalizedCamera, target, [1,1,0]);	//Obtengo la dirección X-Y
		vec3.normalize(normalizedCamera,normalizedCamera);
		vec3.cross(normalizedCamera, normalizedCamera, [0,0,1]);	//Le hago esa rotación mágica de la que hable arriba
		vec3.scale(normalizedCamera,normalizedCamera,0.3);	//Le modifico la velocidad
		//Tecla A
		if (currentlyPressedKeys[65]){
			vec3.sub(cameraPosition,cameraPosition, normalizedCamera);			
		}
		//Tecla D
		if (currentlyPressedKeys[68]) {
			vec3.add(cameraPosition,cameraPosition, normalizedCamera);			
		}
	}
	// W o S //
	if ( (currentlyPressedKeys[83] || currentlyPressedKeys[87]) && cameraMode == 2) {
		var normalizedCamera= vec3.create();
		vec3.multiply(normalizedCamera, target, [1,1,0]);	//Obtengo la dirección X-Y
		vec3.normalize(normalizedCamera,normalizedCamera);
		vec3.scale(normalizedCamera,normalizedCamera,0.3);	//Le modifico la velocidad
		//Tecla S
		if (currentlyPressedKeys[83] && thetaAngle >= degToRad(1)){
			vec3.sub(cameraPosition,cameraPosition, normalizedCamera);
		}
		//Tecla W
		if (currentlyPressedKeys[87] && thetaAngle <= degToRad(150)) {
			vec3.add(cameraPosition,cameraPosition, normalizedCamera);
		}	
		return;
	}
	
	//Si presiono el boton 1, vuelvo a la camara orbital
	if (currentlyPressedKeys[49] && cameraMode != 1) {
		cameraMode = 1;
		target = [0,0,0];
		var initPosToTranslate = vec3.create();
		vec3.set(initPosToTranslate,10.0,10.0,4.0);
		var radius = vec3.squaredLength(initPosToTranslate);
		thetaAngle = Math.acos(initPosToTranslate[2]/radius);	//para las rotaciones en zy e zx
		phiAngle = Math.atan(initPosToTranslate[1]/initPosToTranslate[0]);	//para las rotaciones en el plano xy
		cameraPosition = [radius*Math.cos(phiAngle)*Math.sin(thetaAngle),radius*Math.sin(phiAngle)*Math.sin(thetaAngle),radius*Math.cos(thetaAngle)];
		return;
	}
	
	//si presiono el boton 2, me cambio a otra cámara
	if (currentlyPressedKeys[50] && cameraMode != 2) {
		cameraMode = 2;
		var initPosToTranslate = vec3.create();
		vec3.set(initPosToTranslate,15.0,15.0,4.0);
		var radius = vec3.squaredLength(initPosToTranslate);
		thetaAngle = Math.acos(initPosToTranslate[2]/radius);	//para las rotaciones en zy e zx
		phiAngle = Math.atan(initPosToTranslate[1]/initPosToTranslate[0]);	//para las rotaciones en el plano xy
		vec3.set(cameraPosition,Math.cos(phiAngle)*Math.sin(thetaAngle),Math.sin(phiAngle)*Math.sin(thetaAngle),-Math.cos(thetaAngle));
		vec3.normalize(cameraPosition,cameraPosition);
		vec3.scale(target,cameraPosition,100);
		cameraPosition = [-20,-20,5];		
		return;
	}
}

//Testeo la ruedita del mouse
//Ayuda de http://www.sitepoint.com/html5-javascript-mouse-wheel/
function MouseWheelHandler(e) {
	if(cameraMode == 1){
		var e = window.event || e; // old IE support
		e = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		if ( e <= 0 && vec3.length(cameraPosition) < 20){
			vec3.scale(cameraPosition,cameraPosition,1.1)
		}
		if(e > 0 && vec3.length(cameraPosition) > 2){
				vec3.scale(cameraPosition,cameraPosition,0.9);
		}
	}
}

var clicking = 0;
function onMouseUp(event){
	clicking = 0;
}
var clickX=0;
var clickY=0;
function onMouseDown(event){
	clicking = 1;
	clickX = event.clientX;
	clickY = event.clientY;
}

var normalizedCamera= vec3.create();
function onMouseMove(event) {
	if (clicking){
		var x;
		var y;
		var testX;
		var testY;
		var testLimit = thetaAngle;
		if(event.clientX) {
			x = event.clientX;
			y = event.clientY;
		} else if(event.pageX) {
			x = event.pageX+window.pageXOffset-event.target.offsetLeft;
			y = event.pageY+window.pageYOffset-event.target.offsetTop;
		}
		testX = -(x - clickX)*150;
		testY = (y - clickY)*75;
		phiAngle += degToRad(testX)/widthOfCanvas;
		testLimit += degToRad(-testY)/heightOfCanvas;

		if (testLimit >= degToRad(25) && testLimit <= degToRad(88)){
			thetaAngle = testLimit;
		}
		clickX = x;
		clickY = y;
		if(cameraMode == 1){
			vec3.set(normalizedCamera,Math.cos(phiAngle)*Math.sin(thetaAngle),Math.sin(phiAngle)*Math.sin(thetaAngle),Math.cos(thetaAngle));
			vec3.normalize(normalizedCamera,normalizedCamera);
			vec3.scale(cameraPosition,normalizedCamera,vec3.len(cameraPosition));			
		}
		
		if (cameraMode == 2){
			vec3.set(normalizedCamera,Math.cos(phiAngle)*Math.sin(thetaAngle),Math.sin(phiAngle)*Math.sin(thetaAngle),-Math.cos(thetaAngle));
			vec3.normalize(normalizedCamera,normalizedCamera);
			vec3.scale(target,normalizedCamera,100);
		}
	}
}
