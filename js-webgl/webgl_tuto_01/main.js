let VERTEX_SHADER = `
  uniform mat3 u_matrix;
  attribute vec2 a_position;
  attribute vec4 a_color;
  varying vec4 v_color;

  void main() {
    vec3 position = u_matrix * vec3(a_position.xy, 1);
    gl_Position = vec4(position.x, position.y, 0, 1);
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

  let matrix = Mat3.identity();
  matrix = Mat3.multiply(matrix, Mat3.rotating(Math.PI/3));
  matrix = Mat3.multiply(matrix, Mat3.translation(100, 100));
  matrix = Mat3.multiply(matrix, Mat3.projection(gl.canvas.width, gl.canvas.height));
  gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, 'u_matrix'), false, matrix);

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
// MATH
//

class Vec2 {
  static create(x = 0, y = 0) {
    return [x, y];
  }

  static length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }

  static normalize(v) {
    let len = Vec2.length(v);
    if (len > 0) {
      let x = v[0] / len;
      let y = v[1] / len;
      return [x, y];
    }

    return v;
  }

  static dot(lv, rv) {
    return lv[0] * rv[0] + lv[1] * rv[1];
  }

  static add(lv, rv) {
    let x = lv[0] + rv[0];
    let y = lv[1] + rv[1];
    return [x, y];
  }

  static substract(lv, rv) {
    let x = lv[0] - rv[0];
    let y = lv[1] - rv[1];
    return [x, y];
  }

  static multiply(lv, rv) {
    let x = lv[0] * rv[0];
    let y = lv[1] * rv[1];
    return [x, y];
  }
}

class Vec3 {
  static create(x = 0, y = 0, z = 0) {
    return [x, y, z];
  }

  static length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  static normalize(v) {
    let len = Vec3.length(v);
    if (len > 0) {
      let x = v[0] / len;
      let y = v[1] / len;
      let z = v[2] / len;
      return [x, y, z];
    }

    return v;
  }

  static dot(lv, rv) {
    return lv[0] * rv[0] + lv[1] * rv[1] + lv[2] * rv[2];
  }

  static add(lv, rv) {
    let x = lv[0] + rv[0];
    let y = lv[1] + rv[1];
    let z = lv[2] + rv[2];
    return [x, y, z];
  }

  static substract(lv, rv) {
    let x = lv[0] - rv[0];
    let y = lv[1] - rv[1];
    let z = lv[2] - rv[2];
    return [x, y, z];
  }

  static multiply(lv, rv) {
    let x = lv[0] * rv[0];
    let y = lv[1] * rv[1];
    let z = lv[2] * rv[2];
    return [x, y, z];
  }
}

class Mat3 {
  static identity() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }

  static scaling(s) {
    return [
      s, 0, 0,
      0, s, 0,
      0, 0, 1
    ];
  }

  static rotating(angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    return [
       c, s, 0,
      -s, c, 0,
       0, 0, 1
    ];
  }

  static translation(x, y) {
    return [
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]
  }

  static projection(w, h) {
    return [
      2/w, 0, 0,
      0, 2/h, 0,
      -1, -1, 1
    ];
  }

  static multiply(lm, rm) {
    let lm00 = lm[0];
    let lm01 = lm[1];
    let lm02 = lm[2];
    let lm10 = lm[3];
    let lm11 = lm[4];
    let lm12 = lm[5];
    let lm20 = lm[6];
    let lm21 = lm[7];
    let lm22 = lm[8];
    let rm00 = rm[0];
    let rm01 = rm[1];
    let rm02 = rm[2];
    let rm10 = rm[3];
    let rm11 = rm[4];
    let rm12 = rm[5];
    let rm20 = rm[6];
    let rm21 = rm[7];
    let rm22 = rm[8];

    let c00 = lm00 * rm00 + lm01 * rm10 + lm02 * rm20;
    let c01 = lm00 * rm01 + lm01 * rm11 + lm02 * rm21;
    let c02 = lm00 * rm02 + lm01 * rm12 + lm02 * rm22;

    let c10 = lm10 * rm00 + lm11 * rm10 + lm12 * rm20;
    let c11 = lm10 * rm01 + lm11 * rm11 + lm12 * rm21;
    let c12 = lm10 * rm02 + lm11 * rm12 + lm12 * rm22;

    let c20 = lm20 * rm00 + lm21 * rm10 + lm22 * rm20;
    let c21 = lm20 * rm01 + lm21 * rm11 + lm22 * rm21;
    let c22 = lm20 * rm02 + lm21 * rm12 + lm22 * rm22;

    return [
      c00, c01, c02,
      c10, c11, c12,
      c20, c21, c22
    ];
  }
}


window.addEventListener('load', () => {
  main();

  let l = [1, 0, 1, 1, 1, 0, 0, 1, 1];
  let r = [0, 1, 1, 0, 1, 0, 1, 1, 1];

  console.log(Mat3.multiply(l, r));
});

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