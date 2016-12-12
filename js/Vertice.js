function Vertice(posicion, color, normal, tangente, coordTextura) {
    this.posicion = posicion;
    this.color = color;
    this.binormal = [];

    this.normal = normal;
    vec3.normalize(this.normal,this.normal);

    this.tangente = tangente;
    vec3.normalize(this.tangente,this.tangente);

    vec3.cross(this.binormal, this.normal, this.tangente);
    vec3.normalize(this.binormal,this.binormal);

    this.coordTextura = coordTextura;
}