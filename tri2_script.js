/*
ORDER OF OPERATIONS:
1) Get rendering context for webGL
2) Initialize shaders
3) Set positions of vertices
4) Set the color for clearing canvas
5) Clear canvas
6) Draw
*/
var canvas = document.getElementById('webgl');
	var ANGLE = parseFloat($('#transform').val());
	var radian = Math.PI * ANGLE/180.0; // convert to rads
	var cosB = Math.cos(radian);
	var sinB = Math.sin(radian);
	var vertices;
  	var n;
  	var move = false;
  	var xformMatrix;
  	var Tx = 0.0, Ty =0.0, Tz = 0.0;
  	var Sx = cosB;
  	var Sy = sinB;
  	var Sz = 1.0;
  	  	var xformMatrix = new Float32Array([
		cosB, sinB, 0.0, 0.0,
		sinB, cosB, 0.0, 0.0,
		0.0,0.0, 1.0,0.0,
		Tx, Ty, Tz, Sz
	]);


// DEFINE SHADERS

	var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

	// Fragment shader program
	var FSHADER_SOURCE =
  	'void main() {\n' +
  	'  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  	'}\n';

  
	// event handlers
  	$('#scaleup').on('click', function(e){
  		e.preventDefault();
  		Sz-= 0.05;
  		if (Sz < 0.5){
  			Sz = 1.0;
  		}
  		radian = 0;
		
		xformMatrix = new Float32Array([
			cosB, sinB, 0.0, 0.0,
			sinB,cosB, 0.0, 0.0,
			0.0,0.0,Sz, 0.0,
			Tx, Ty, Tz, Sz
			]);


		render($('#shape').val(), ANGLE);
  	});

  	$('#scaledown').on('click', function(e){
  		e.preventDefault();
  		Sz+= 0.05;
  		

		xformMatrix = new Float32Array([
			cosB, sinB, 0.0, 0.0,
			sinB,cosB, 0.0, 0.0,
			0.0,0.0,Sz, 0.0,
			Tx, Ty, Tz, Sz
			]);
		render($('#shape').val(), ANGLE);
  	});

  	$('#transform').on('change', function(e){
  		e.preventDefault();
  		ANGLE = parseFloat($('#transform').val());
  		radian = Math.PI * ANGLE/180.0; // convert to rads
		cosB = Math.cos(radian);		
		sinB = Math.sin(radian);
		var Sx = cosB;
  		var Sy = sinB;

		xformMatrix = new Float32Array([
		cosB, sinB, 0.0, 0.0,
		sinB, cosB, 0.0, 0.0,
		0.0,0.0, Sz,0.0,
		Tx, Ty, Tz, Sz
		]);
	
		render($('#shape').val(), ANGLE);
		
	
  	});

  	$('#move').on('click', function(e){

  		e.preventDefault();
  		
  		Tx +=0.05;
  		Ty +=0.05;
  		move = true;
  		
  		xformMatrix = new Float32Array([
		cosB, sinB, 0.0, 0.0,
		sinB, cosB, 0.0, 0.0,
		0.0,0.0, Sz,0.0,
		Tx, Ty, Tz, Sz
		]);

  		render($('#shape').val(), ANGLE);

  	});

// main rendering function
	
function render(shape, degree){


	console.log("Angle: %s", ANGLE);
	console.log("Radian: %s", radian );
	console.log("cosB: %s", cosB );
	console.log("sinB: %s", sinB );
  	console.log("sx: %s", Sx);
  	console.log("sy: %s", Sy);
  	console.log("sz: %s", Sz);


// radian = Math.PI * ANGLE/180.0; // convert to rads
// 		cosB = Math.cos(radian);		
// 		sinB = Math.sin(radian);
// if (cosB<0.1 || cosB >2){
// 		cosB = 1.0;
// 	}
	
	console.log("Angle: %s", ANGLE);
	console.log("Radian: %s", radian );
	console.log("cosB: %s", cosB );
	console.log("sinB: %s", sinB );
  	console.log("sx: %s", Sx);
  	console.log("sy: %s", Sy);
  	console.log("sz: %s", Sz);
	
	if (shape == 'tri'){
			
		vertices = new Float32Array([
			// 4 bytes, 32-bit floating point number
			// empty typed array = var vertices = new Float32Array(4);  // specifies 4 slots
			-0.25, 0.0,	-0.5, 0.0, -0.5, -0.5,
			0.25, 0.0, 0.5, 0.5, 0.5, 0.0
		]);
		
		n = 6; // Num of vertices being drawn - draw 9 points

	} else if (shape =='trifan'){
		vertices = new Float32Array([
			// 4 bytes, 32-bit floating point number
			// empty typed array = var vertices = new Float32Array(4);  // specifies 4 slots
			0.0, -0.5,	-0.5, 0.0, -0.25, 0.5,

			0.0, -0.5,	-0.25, 0.5, 0.25, 0.5,

			0.0, -0.5,	0.25, 0.5, 0.5, 0.0
		]);
		
			n = 9; // Num of vertices being drawn - draw 9 points

	} else if (shape == 'tristrip'){
		console.log ('tristrip');
			vertices = new Float32Array([
			// 4 bytes, 32-bit floating point number
			// empty typed array = var vertices = new Float32Array(4);  // specifies 4 slots
				-0.5,0.5,
				-0.5,-0.5,
				0.5,0.5,		
				0.5,-0.5
			]);
		//triangles (v0, v1, v2) and (v2, v1, v3)

			n = 4;

	} else {
		vertices = new Float32Array([
			// 4 bytes, 32-bit floating point number
			// empty typed array = var vertices = new Float32Array(4);  // specifies 4 slots
			0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
			]);
		
		n = 3; // Num of vertices being drawn - draw 3 points

	}



	/* 1) Get rendering context for webGL */
	var gl = getWebGLContext(canvas);
	if (!gl) {
    	console.log('Failed to get rendering context for WebGL');
    	return;
  	}
	/*2) Initialize shaders*/
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	    console.log('Failed to intialize shaders.');
	    return;
	  }

	
	/*3) Set positions of vertices */
	var n = initVertexBuffers(gl);
	
			
	u_xformMatrix=gl.getUniformLocation(gl.program, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);


	if (n <0){
		console.log("Cannot set positions of vertices.");
		return;
	}

	/* 4) Set the color for clearing canvas */
	gl.clearColor(1.0, 1.0, 1.0, 1);


	/* 5) Clear canvas */
	gl.clear(gl.COLOR_BUFFER_BIT);


	/* 6) Draw */
	// (mode, first, count)
	// draw shapes based on mode parameter (type of shape)
	// gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN
	// first specifies number-th vertex is used to draw from
	// count n is set by initVertexBuffers()
	// draw triangle using n=3 vertices from buffer starting with first vertex coords
	var mode;

	switch (shape){
		case 'tri':
		mode = gl.TRIANGLES;
		break;

		case 'lines':
		mode = gl.LINES;
		break;

		case 'strip':
		mode = gl.LINE_STRIP;
		break;

		case 'loop':
		mode = gl.LINE_LOOP;
		break;

		case 'trifan':
		mode = gl.TRIANGLE_FAN;
		break;

		case 'tristrip'	:
		mode = gl.TRIANGLE_STRIP;
		break;
	}
	gl.drawArrays(mode, 0, n);


	// delete the buffer objected created by gl.createBuffer()
    // gl.deleteBuffer();


// Initialize the vertices and create buffer
// stores multiple vertices in buffer object then completes preparations
// for passing it to a vertex shader
// use buffer object to pass multiple vertices to vertex shader

// 5 steps for passing multiple data values to a vertex shader through a buffer object:
// 1) Create a buffer object - gl.createBuffer()
// 2) Bind buffer object to target - gl.bindBuffer()
// 3) Write data into the buffer object - gl.bufferData()
// 4) Assign buffer object to an attribute variable - gl.vertexAttribPointer()
// 5) Enable the assignment- gl.enableVertexAttribArray()

function initVertexBuffers(gl){



	// 1) Create a buff object - gl.createBuffer()
	var vertexBuffer = gl.createBuffer(); // memory allocated in the system to hold vertices we want to draw
	if (!vertexBuffer){
		console.log('Cannot create buffer object');
		return 1; // 
	}
	// 2) Bind buffer object to target - gl.bindBuffer()
	// (target, buffer)
	// ARRAY_BUFFER - specifies that buffer object contains vertex data
	// ELEMENT_ARRAY_BUFFER - specifies buffer object contains index values pointing to vertex data
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 

	// 3) Write data into the buffer object - gl.bufferData() 
	// (target, data, usage)
	// allocates storage and writes the data to the buffer
	// vertices gets written into gl.ARRAY_BUFFER (which is vertexBuffer) then changes internal state of webgl system
	// usage gl.STATIC_DRAW - buffer obj data will be specified once and used many times to draw shapes
	// usage gl.STREAM_DRAW - buffer obj data will be specified once and used a few times to draw shapes
	// usage gl.DYNAMIC_DRAW - buffer obj data will be specified repeatedly and used many times to draw shapes
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// 4) Assign buffer object to an attribute variable - gl.vertexAttribPointer()
	// a_Position is attribute variable
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0){
    	console.log('Failed to get the storage location of a_Position');
		return -1;
    }
    // a way to assign an array of vertices to attribute variable:
    // assign buffer object to attribute a_Position
    // (location, number of coordinates per vertex (x,y), type, normalized, stride, offset)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 5) Enable the assignment - gl.enableVertexAttribArray()
	// Makes it possible for us to access a buffer object in a vertex shader
	// gl.disableVertexAttribArray() to disable
    gl.enableVertexAttribArray(a_Position);

    return n; // returns number of vertices being drawn
	}
}

$('#shape').on('change', function(e){
	e.preventDefault();
	render($(this).val(), ANGLE);
})

render('loop', ANGLE);