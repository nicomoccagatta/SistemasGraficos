var treeTexture;
var tierraTexture;
var tierraNormalTexture;
var skyTexture;
var rutaTexture;
var rutaNormalTexture;
var veredaTexture;
var columnaTexture;
var columnaNormalTexture;
var cablesTexture;
var cablesNormalTexture;
var pastoTexture;
var aguaTexture;
var aguaNormalTexture;
var aguaReflexionTexture;

function initTexture() {
	// SKY TEXTURE
	skyTexture = gl.createTexture();
	skyTexture.image = new Image();
	skyTexture.image.onload = function() {		
		handleLoadedTexture(skyTexture);
	}
	skyTexture.image.src = "maps/sky_lightblue2.jpg";

	// TREE TEXTURE
	treeTexture = gl.createTexture();
	treeTexture.image = new Image();
	treeTexture.image.onload = function() {		
		handleLoadedTextureMosaic(treeTexture);
	}
	treeTexture.image.src = "maps/hojas.jpg";

	// AGUA TEXTURE
	aguaTexture = gl.createTexture();
	aguaTexture.image = new Image();
	aguaTexture.image.onload = function() {		
		handleLoadedTextureMosaic(aguaTexture);
	}
	aguaTexture.image.src = "maps/aguaDeMar.jpg";

	// AGUA NORMAL TEXTURE
	aguaNormalTexture = gl.createTexture();
	aguaNormalTexture.image = new Image();
	aguaNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(aguaNormalTexture);
	}
	aguaNormalTexture.image.src = "maps/agua_normal_map.png";

	// AGUA REFLEXION TEXTURE
	aguaReflexionTexture = gl.createTexture();
	aguaReflexionTexture.image = new Image();
	aguaReflexionTexture.image.onload = function() {		
		handleLoadedTexture(aguaReflexionTexture);
	}
	aguaReflexionTexture.image.src = "maps/sky_lightblue2.jpg";

	// TIERRA TEXTURE
	tierraTexture = gl.createTexture();
	tierraTexture.image = new Image();
	tierraTexture.image.onload = function() {		
		handleLoadedTextureMosaic(tierraTexture);
	}
	tierraTexture.image.src = "maps/tierra1.jpg";

	// TIERRA TEXTURE
	tierraNormalTexture = gl.createTexture();
	tierraNormalTexture.image = new Image();
	tierraNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(tierraNormalTexture);
	}
	tierraNormalTexture.image.src = "maps/fieldNormalTexture.jpg";

	// TIERRA TEXTURE
	pastoTexture = gl.createTexture();
	pastoTexture.image = new Image();
	pastoTexture.image.onload = function() {		
		handleLoadedTextureMosaic(pastoTexture);
	}
	pastoTexture.image.src = "maps/pasto1.jpg";
	
	// RUTA TEXTURE
	rutaTexture = gl.createTexture();
	rutaTexture.image = new Image();
	rutaTexture.image.onload = function() {		
		handleLoadedTextureMosaic(rutaTexture);
	}
	rutaTexture.image.src = "maps/ruta.jpg";
	
	// RUTA NORMAL MAP TEXTURE
	rutaNormalTexture = gl.createTexture();
	rutaNormalTexture.image = new Image();
	rutaNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(rutaNormalTexture);
	}
	rutaNormalTexture.image.src = "maps/ruta-normal-map2.jpg";

	// VEREDA TEXTURE
	veredaTexture = gl.createTexture();
	veredaTexture.image = new Image();
	veredaTexture.image.onload = function() {		
		handleLoadedTextureMosaic(veredaTexture);
	}
	veredaTexture.image.src = "maps/vereda.jpg";

	// VEREDA NORMAL TEXTURE
	veredaNormalTexture = gl.createTexture();
	veredaNormalTexture.image = new Image();
	veredaNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(veredaNormalTexture);
	}
	veredaNormalTexture.image.src = "maps/vereda-normalmap.jpg";

	// COLUMNA TEXTURE
	columnaTexture = gl.createTexture();
	columnaTexture.image = new Image();
	columnaTexture.image.onload = function() {		
		handleLoadedTextureMosaic(columnaTexture);
	}
	columnaTexture.image.src = "maps/oxido.jpg";

	// COLUMNA NORMAL TEXTURE
	columnaNormalTexture = gl.createTexture();
	columnaNormalTexture.image = new Image();
	columnaNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(columnaNormalTexture);
	}
	columnaNormalTexture.image.src = "maps/oxido-normalmap.jpg";

	// CABLES TEXTURE
	cablesTexture = gl.createTexture();
	cablesTexture.image = new Image();
	cablesTexture.image.onload = function() {		
		handleLoadedTextureMosaic(cablesTexture);
	}
	cablesTexture.image.src = "maps/alambres.jpg";

	// CABLES NORMAL MAP TEXTURE
	cablesNormalTexture = gl.createTexture();
	cablesNormalTexture.image = new Image();
	cablesNormalTexture.image.onload = function() {		
		handleLoadedTextureMosaic(cablesNormalTexture);
	}
	cablesNormalTexture.image.src = "maps/alambres-mormalmap.jpg";
}

function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
/*  
function handleLoadedTexture(texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	//esta forma para evitar utilizar texturas que tengan dimensiones de dos a la algo
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
	gl.bindTexture(gl.TEXTURE_2D, null);
}
*/
function handleLoadedTextureMosaic(texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	//esta forma para evitar utilizar texturas que tengan dimensiones de dos a la algo
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
	//Aca hacemos que se repita
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); 
	gl.bindTexture(gl.TEXTURE_2D, null);
}