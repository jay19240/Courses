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
  matrix = Mat3.multiply(matrix, Mat3.projection(gl.canvas.width, gl.canvas.height));
  matrix = Mat3.multiply(matrix, Mat3.translation(300, 100));
  matrix = Mat3.multiply(matrix, Mat3.rotating(Math.PI/3));
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

  static multiply(a, b) {
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a10 = a[3];
    let a11 = a[4];
    let a12 = a[5];
    let a20 = a[6];
    let a21 = a[7];
    let a22 = a[8];
    let b00 = b[0];
    let b01 = b[1];
    let b02 = b[2];
    let b10 = b[3];
    let b11 = b[4];
    let b12 = b[5];
    let b20 = b[6];
    let b21 = b[7];
    let b22 = b[8];

    let c00 = b00 * a00 + b01 * a10 + b02 * a20;
    let c01 = b00 * a01 + b01 * a11 + b02 * a21;
    let c02 = b00 * a02 + b01 * a12 + b02 * a22;

    let c10 = b10 * a00 + b11 * a10 + b12 * a20;
    let c11 = b10 * a01 + b11 * a11 + b12 * a21;
    let c12 = b10 * a02 + b11 * a12 + b12 * a22;

    let c20 = b20 * a00 + b21 * a10 + b22 * a20;
    let c21 = b20 * a01 + b21 * a11 + b22 * a21;
    let c22 = b20 * a02 + b21 * a12 + b22 * a22;

    return [
      c00, c01, c02,
      c10, c11, c12,
      c20, c21, c22
    ];
  }
}

window.addEventListener('load', () => {
  main();
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