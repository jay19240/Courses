let VERTEX_SHADER = `
  uniform vec2 u_scale;
  uniform vec2 u_rotation;
  uniform vec2 u_translation;
  uniform vec2 u_resolution;
  attribute vec4 a_position;
  attribute vec4 a_color;
  varying vec4 v_color;

  void main() {
    // scale
    vec2 scaled;
    scaled.x = a_position.x * u_scale.x;
    scaled.y = a_position.y * u_scale.y;

    // rotation
    vec2 rotated;
    rotated.x = scaled.x * u_rotation.x + scaled.y * u_rotation.y;
    rotated.y = scaled.y * u_rotation.x - scaled.x * u_rotation.y;

    // translation
    vec2 translated;
    translated.x = rotated.x + u_translation.x;
    translated.y = rotated.y + u_translation.y;

    // pixel position to clipspace (-1,+1)
    vec2 projected;
    projected.x = translated.x / u_resolution.x;
    projected.y = translated.y / u_resolution.y;
    projected = projected * 2.0;
    projected = projected - 1.0;

    gl_Position = vec4(projected.x, projected.y, 0, 1);
    v_color = a_color;
  }
`;

let PIXEL_SHADER = `
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;

window.addEventListener('load', () => {
  main();
});

function main() {
  let canvas = document.querySelector("#glCanvas");
  let gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Impossible d'initialiser WebGL. Votre navigateur ou votre machine peut ne pas le supporter.");
    return;
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  let shaderProgram = initShaderProgram(gl, VERTEX_SHADER, PIXEL_SHADER);
  let object = createObject(gl);

  draw(gl, shaderProgram, object);
}

function draw(gl, shaderProgram, object) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(shaderProgram);

  let scale = [1.0, 1.0];
  gl.uniform2fv(gl.getUniformLocation(shaderProgram, 'u_scale'), scale);

  let angle = 20.0 * Math.PI/180.0;
  let rotation = [Math.cos(angle), Math.sin(angle)];
  gl.uniform2fv(gl.getUniformLocation(shaderProgram, 'u_rotation'), rotation);

  let translation = [300.0, 100.0];
  gl.uniform2fv(gl.getUniformLocation(shaderProgram, 'u_translation'), translation);

  let resolution = [gl.canvas.width, gl.canvas.height];
  gl.uniform2fv(gl.getUniformLocation(shaderProgram, 'u_resolution'), resolution);

  gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
  gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, 'a_position'), object.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, 'a_position'));

  gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
  gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, 'a_color'), object.colorSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, 'a_color'));

  gl.drawArrays(object.primitiveType, 0, object.nbVertex);
}

function createObject(gl) {
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      // left side
      10.0, 100.0,
       0.0, 100.0,
       0.0, 0.0,
       0.0, 0.0,
      10.0, 0.0,
      10.0, 100.0,
      // top-bar
      10.0, 100.0,
      10.0, 90.0,
      60.0, 100.0,
      60.0, 100.0,
      60.0, 90.0,
      10.0, 90.0,
      // middle-bar
      10.0, 60.0,
      10.0, 50.0,
      40.0, 60.0,
      40.0, 60.0,
      40.0, 50.0,
      10.0, 50.0
    ]), gl.STATIC_DRAW);

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1,
      1.0, 0.0, 0.0, 1
    ]), gl.STATIC_DRAW);

  return {
    primitiveType: gl.TRIANGLES,
    vertexBuffer: vertexBuffer,
    vertexSize: 2,
    nbVertex: 18,
    colorBuffer: colorBuffer,
    colorSize: 4
  }
}

//
// UTILS
//

function initShaderProgram(gl, vsSource, fsSource) {
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Impossible d\'initialiser le programme shader : ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}