function main(){
  // 1. Retrieve canvas
  // 2. Get context
  // 3. Define and Init shaders
  // 4. Set color for clearing - Tool for converting hex to pd color - http://sherryumlah.com/git/pdcolors.htm
  // 5. Clear canvas
  // 6. Draw
  var vec1 = 0.0;
  var vec2 = 0.0;
  var vec3 = 0.0;
  var vec4 = 1.0;
  var R = 0.0;
  var G = 0.0;
  var B = 0.0;
  var A = 1.0;
  var ptSize = '10.0';
  var currentShape = 'point';
  var animate = false;
  var animation;
  var rotation = 90.0;

  // GET CANVAS
  var canvas = document.getElementById('webgl');

  // GET CONTEXT
  var gl = getWebGLContext(canvas);
  if (!gl){
    console.log('Failed to render context');
    return;
  }

  var FSHADER_SOURCE =
  'void main(){\n'+
  'gl_FragColor = vec4(' + R +',' + G + ',' + B + ',' + A + ');\n' +
  '}\n';

 var VSHADER_SOURCE =
 'void main(){\n' +
 'gl_Position=vec4(' + vec1 +',' + vec2 + ',' + vec3 + ',' + vec4 + ');\n' +
 'gl_PointSize = ' + ptSize +';\n' +
 '}\n';

  // Translation distance for x, y, z
  var Tx = 0.0, Ty = 0.0, Tz = 0.0;

  function set_FSHADER_SOURCE(R, G, B, A){
    FSHADER_SOURCE =
    'void main(){\n'+
    'gl_FragColor = vec4(' + R +',' + G + ',' + B + ',' + A + ');\n' +
    '}\n';
   }

  function set_VSHADER_SOURCE(vec1, vec2, vec3, vec4, ptSize){
    VSHADER_SOURCE =
    'void main(){\n' +
    'gl_Position=vec4(' + vec1 +',' + vec2 + ',' + vec3 + ',' + vec4 + ');\n' +
    'gl_PointSize = ' + ptSize +';\n' +
    '}\n';
  }

  function set_Tri_VSHADER_SOURCE(){
    VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +

    'uniform vec4 u_Translation;\n'+
    'void main() {\n' +

    'gl_Position = a_Position + u_Translation;\n' +
    '}\n';
  }

  function shaders(VSHADER_SOURCE, FSHADER_SOURCE){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  }

  function initVertexBuffers(gl){
    var p1x = $('#p1x').val();
    var p1y = $('#p1y').val();
    var p2x = $('#p2x').val();
    var p2y = $('#p2y').val();
    var p3x = $('#p3x').val();
    var p3y = $('#p3y').val();
    var vertices = new Float32Array([
     p1x, p1y, p2x, p2y, p3x, p3y
     ]);
    var n=3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

	  // Bind the buffer object to target
	  // target tells WebGL what type of data buffer contains
	  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	  // Write date into the buffer object
	  // allocates storage and writes data to buffer
	  // writes vertices data into gl.ARRAY_BUFFER
	  // gl.bufferData (target, data, usage)

	  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0){
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }

	  // Assign the buffer object to a_Position variable
	  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	  // Enable the assignment to a_Position variable
	  gl.enableVertexAttribArray(a_Position);

	  return n;
	}

  function clearCanvas(){
  // Specify the color for clearing <canvas>
    gl.clearColor(1.0, 1.0, 1.0, 1);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  }


  function createTriangle(R,G,B,A){
    set_FSHADER_SOURCE(R,G,B,A);
    set_Tri_VSHADER_SOURCE();

    // Initialize shaders
    shaders(VSHADER_SOURCE, FSHADER_SOURCE);

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    // Pass the translation distance to the vertex shader
    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    if (!u_Translation) {
      console.log('Failed to get the storage location of u_Translation');
      return;
    }

    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function drawTriangle(){}

  function createPoint(vec1, vec2, vec3, vec4, R, G, B, A, ptSize){
    /* DEFINE SHADERS */
    // vertex shader
    // gl_Position: type vec4 (vector of 4 floating point numbers, XYZW converted using vec4())
    // specifies position of a vertex.  1.0 as W makes 4D objects 3D by dividing all by 1 x/w, y/w, z/w
    // gl_PointSize: type float (0.0) specifies the size of a point (in pixels) defaults to 1.0

    // Fragment shader program
    set_FSHADER_SOURCE(R, G, B, A);
    set_VSHADER_SOURCE(vec1, vec2, vec3, vec4, ptSize);

    // Initialize shaders
    shaders(VSHADER_SOURCE, FSHADER_SOURCE);
    clearCanvas();
    // Draw - (mode, first, count)
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  function clearAndDraw(R, G, B, A, ptSize){
    if (R==''){var R='1.0'};
    if (G==''){var G='1.0'};
    if (B==''){var B='1.0'};
    if (A==''){var A='1.0'};
    createPoint(vec1, vec2, vec3, vec4, R, G, B, A, ptSize);
  }

   function stopAnimation(){
    animate = false;
    clearInterval(animation);
    $('.animateTri').text("Animate Triangle");
  }

  function drawPoint(R, G, B, A){
    if (R=='0'){
     R='0.0';
   }
   if (G=='0'){
     G='0.0';
   }
   if (B=='0'){
     B='0.0';
   }

   currentShape="point";
   ptSize = ($('#ptSize').val());
   ptSize = parseFloat(ptSize);
   ptSize = ptSize.toFixed(2);

   shaders(VSHADER_SOURCE, FSHADER_SOURCE);
   clearAndDraw(R, G, B, A, ptSize);
  }

  function animateTri(){
   var min = -0.25;
   var max = 0.25;
   var randomX = Math.random() * (max - min + 0.25) + min;
   var randomY = Math.random() * (max - min + 0.25) + min;
   Tx = randomX;
   Ty = randomY;
   $('.movex').val(Tx);
   $('.movey').val(Ty);
   currentShape="triangle";
   createTriangle(R,G,B,A);
  };

  // EVENT HANDLERS
  $('.tripoint').on("change", function(e){
  	e.preventDefault();
  	currentShape="triangle";
  	createTriangle(R,G,B,A);
  });

  $('.create').on("click", function(e){
    e.preventDefault();
    stopAnimation();
    currentShape="triangle";
    createTriangle(R,G,B,A);
  });

  $('.point').on("click", function(e){
  	e.preventDefault();
  	stopAnimation();
  	drawPoint(R, G, B, A);
  })

  /* CHANGE COLORS */
  $("#picked").on("change", function(e){
    R=($('#picked').val());
    G=($('#picked').val());
    B=($('#picked').val());
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7) : h}
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}

    R=hexToR(R)/255;
    G=hexToG(G)/255;
    B=hexToB(B)/255;

    $('#R').val(R);
    $('#G').val(G);
    $('#B').val(B);

    set_FSHADER_SOURCE(R, G, B, A);

    if (currentShape=="point"){
      shaders(VSHADER_SOURCE, FSHADER_SOURCE);
      clearAndDraw(R, G, B, A, ptSize);
    } else if (currentShape=="triangle"){
      set_Tri_VSHADER_SOURCE();
      shaders(VSHADER_SOURCE, FSHADER_SOURCE);
      createTriangle(R,G,B,A);
    }
  });

  $("#ptSize").on("change", function(e){
   e.preventDefault();
   drawPoint(R, G, B, A);
  });

  $(".animateTri").on("click", function(e){
    e.preventDefault();
    if (animate == false){
      animate = true;
      $('.animateTri').text("Stop Animation");
      animation = setInterval(function(){animateTri()}, 250);
    } else {
      stopAnimation();
    }
  });


  $(".move").on("change", function(){
    var moveX = $(".movex").val();
    var moveY = $(".movey").val();

    Ty = parseFloat(moveY);
    Tx = parseFloat(moveX);
    if (Ty < -0.5){
      Ty = -0.5;
      $(".movey").val(Ty);
    }

    if (Ty > 0.5){
      Ty = 0.5;
      $(".movey").val(Ty);
    }
    if (Tx < -0.5){
      Tx = -0.5;
      $(".movex").val(Tx);
    }
    if (Tx > 0.5){
      Tx = 0.5;
      $(".movex").val(Tx);
    }

    currentShape="triangle";
    createTriangle(R,G,B,A);
  });

  createTriangle('0.0','0.0','0.0','1.0');
}



