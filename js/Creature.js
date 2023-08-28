//var canvasID = document.getElementById( 'canvas' );
//var canvas = canvasID.getContext( '2d' );

"use strict";

//---------------------------------
// body type
//---------------------------------
const BODY_TOPOLOGY_NULL 	= -1;
const BODY_TOPOLOGY_1_TET 	=  0;
const BODY_TOPOLOGY_2_TET 	=  1;
const BODY_TOPOLOGY_3_TET 	=  2;
const BODY_TOPOLOGY_4_TET 	=  3;
const BODY_TOPOLOGY_5_TET 	=  4;
const BODY_TOPOLOGY_6_TET 	=  5; // a bipedal creature with a big head
const BODY_TOPOLOGY_7_TET 	=  6; // with one arm
const BODY_TOPOLOGY_8_TET 	=  7; // with two arms
const BODY_TOPOLOGY_FOOT 	=  8; // lopsided bigfoot
const NUM_BODY_TOPOLOGYS	=  9;

//-------------------------------------
// walking type
//-------------------------------------
const WALKING_TYPE_NULL			= -1;
const WALKING_TYPE_UNIIPED		=  0;
const WALKING_TYPE_BIPED		=  1;
const WALKING_TYPE_TRIPED		=  2;
const WALKING_TYPE_QUADRUPED	=  3;
const WALKING_TYPE_ALLPED		=  4;
const NUM_WALKING_TYPES			=  5;	

const SENSOR_NULL 		= -1;
const SENSOR_TARGET		=  0;
const SENSOR_ZENITH0	=  1;
const SENSOR_ZENITH1	=  2;
const SENSOR_ZENITH2	=  3;
const NUM_SENSORS 		=  4;

//-----------------------
function Creature()
{
	const MAX_BALLS   	 = 10;
	const MAX_SPRINGS 	 = 30;
	const MAX_FACES      = 30
	const MAX_FOOTPRINTS = 1000
	
    //-------------------------------------------------------------------------------------
    // motor control
    //-------------------------------------------------------------------------------------
	const NUM_MOTOR_CHUNKS		 =  9;      // how many possible values for amp and phase
	const MIN_FREQ		  		 =  0.002; 
	const MAX_FREQ		  		 =  0.007;//0.005;
	const MAX_WALK_AMP			 =  0.4;//0.48;//0.8;//0.7;
	const MAX_TURN_AMP	  		 =  0.4;//0.3;
	const MAX_UP_AMP	  		 =  0.4;//0.3;
	const MIN_WALK_PHASE		 =  0.0;    // normalized to frequency
	const MAX_WALK_PHASE		 =  2.0;    // normalized to frequency
	const MIN_TURN_PHASE  		 =  0.0;	// normalized to frequency
	const MAX_TURN_PHASE  		 =  0.1;	// normalized to frequency
	const MIN_UP_PHASE  		 =  0.0;	// normalized to frequency
	const MAX_UP_PHASE  		 =  2.0;	// normalized to frequency
	const MIN_SPRING_TENSION	 =  0.005;	// kinda important
	const MAX_SPRING_TENSION	 =  0.015;
	
	const FREEZE_CORE = false;


    //--------------------------------
    // body metrics
    //--------------------------------
	const MIN_CORE_WIDTH	=  0.8;
	const MAX_CORE_WIDTH	=  1.2;
	
	const MIN_CORE_HEIGHT 	=  0.6;
	const MAX_CORE_HEIGHT  	=  0.8;
	
	const MIN_CORE_DEPTH  	=  0.8;
	const MAX_CORE_DEPTH   	=  1.2;
	
	const MIN_LEG_LENGTH	=  1.6;		
	const MAX_LEG_LENGTH	=  2.2;
	
	const MIN_HEAD_HEIGHT  	=  0.2;
	const MAX_HEAD_HEIGHT   =  1.0;
	
	const MIN_HEAD_FORWARD  =  0.6;
	const MAX_HEAD_FORWARD  =  2.0;
	
	const MIN_TAIL_HEIGHT  	=  0.2;
	const MAX_TAIL_HEIGHT   =  1.0;
	
	const MIN_TAIL_FORWARD  =  0.6;
	const MAX_TAIL_FORWARD  =  2.0;
	
	const MIN_LEG_SPLAY		= -0.2;
	const MAX_LEG_SPLAY   	=  0.2;


/*
    //--------------------------------
    // body metrics
    //--------------------------------
	const MIN_CORE_WIDTH	=  1.0;
	const MAX_CORE_WIDTH	=  1.0;
	
	const MIN_CORE_HEIGHT 	=  0.7;
	const MAX_CORE_HEIGHT  	=  0.7;
	
	const MIN_CORE_DEPTH  	=  1.0;
	const MAX_CORE_DEPTH   	=  1.0;
	
	const MIN_LEG_LENGTH	=  1.9;	
	const MAX_LEG_LENGTH	=  1.9;
	
	const MIN_HEAD_HEIGHT  	=  0.6;
	const MAX_HEAD_HEIGHT   =  0.6;
	
	const MIN_HEAD_FORWARD  =  1.3;
	const MAX_HEAD_FORWARD  =  1.3;
	
	const MIN_TAIL_HEIGHT  	=  0.6;
	const MAX_TAIL_HEIGHT   =  0.6;
	
	const MIN_TAIL_FORWARD  =  1.3;
	const MAX_TAIL_FORWARD  =  1.3;
	
	const MIN_LEG_SPLAY		= 0;
	const MAX_LEG_SPLAY   	= 0;
	*/
	
	
	
    //--------------------------------------------
    // ambient physical forces, constants, etc.
    //--------------------------------------------
	const GRAVITY 				 = 0.0001;
	const JITTER				 = 0.0001; 
	const AMBIENT_DRAG 			 = 0.01;  // normalized (0-1)
	const VERT_GROUND_DRAG	 	 = 0.2;   // normalized (0-1)
	const HORIZ_GROUND_DRAG	 	 = 0.2;   // normalized (0-1)
	const HORIZ_GROUND_FRICTION	 = 0.004;
		
    //-------------------------------
    // timing
    //-------------------------------
    const RAMPUP_START_TIME	= 100;
    const RAMPUP_DURATION 	= 100;

    //---------------------------
    // metrics
    //---------------------------
	const BALL_RADIUS = 0.01;//0.04;
    
    //------------------------------------------
    // graphics
    //------------------------------------------
    const RENDER_CENTROID			= false;
    const RENDER_SURFACE_NORMALS 	= false;
    const RENDER_SPRING_INDICES 	= false;
    const RENDER_POINT_INDECES		= false;
    const RENDER_TARGET_LINE		= false;
    const RENDER_SENSORS			= false;//true;
    const RENDER_SENSOR_VALUE		= false;
    const RENDER_SHADOW				= true;
    const RENDER_FEET				= false;
    const RENDER_FOOTPRINTS			= false;
    const SPRING_WIDTH				= 4;
    const FACE_OPACITY       		= 0.5;
	const SPRING_LENGTH_ARRAY_SIZE	= 100;
	const BALL_COLOR    			= "rgb( 0, 0, 0 )";
	
	
    //--------------------
    function Footprint()
    {
        this.index = NULL_INDEX;
        this.position = new Vector3D();
    }
	
    //---------------
    function Ball()
    {
        this.radius	  	= ZERO;
        this.velocity 	= new Vector3D();
        this.position	= new Vector3D();
        this.defaultPos = new Vector3D();
        this.isAFoot  	= false;
        
		//--------------------------
		this.update = function()
		{	          
            //------------------------------------------------       
            // overall continual drag on velocity           
            //------------------------------------------------  
			this.velocity.scale( ONE - AMBIENT_DRAG );

            //-----------------------------------     
            // jitter           
            //-----------------------------------
			this.velocity.addXYZ
			( 
				-JITTER * ONE_HALF + Math.random() * JITTER,
				-JITTER * ONE_HALF + Math.random() * JITTER,
				-JITTER * ONE_HALF + Math.random() * JITTER
			);
			
            //------------------------------------
            // gravity           
            //------------------------------------
			this.velocity.addY( -GRAVITY );

		    //------------------------------------------------------
		    // apply accelerations and update position by velocity
	    	//------------------------------------------------------
            this.position.add( this.velocity );  
	    }
    }
    
    //-----------------
    function Spring()
    {
        this.active			= false;
        this.ball0   		= NULL_INDEX;
        this.ball1   		= NULL_INDEX;
		this.direction		= new Vector3D();
        this.idealLength	= ZERO;
        this.walkAmp     	= ZERO;
        this.walkPhase   	= ZERO;
        this.turnAmp    	= ZERO;
        this.turnPhase  	= ZERO;
        this.up0Amp    		= ZERO;
        this.up0Phase  		= ZERO;
        this.up1Amp    		= ZERO;
        this.up1Phase  		= ZERO;
        this.restLengths	= new Array( SPRING_LENGTH_ARRAY_SIZE )
        this.trueLengths	= new Array( SPRING_LENGTH_ARRAY_SIZE )
    }

    //------------------
    function Sensor()
    {
    	this.active = false;
        this.springID = NULL_INDEX;
        this.sensedPosition = new Vector3D();
        this.value = ZERO;
        this.smoothing = ZERO;
    }
    
    //------------------
    function Phenotype()
    {
		this.coreWidth		= ZERO; 
		this.coreHeight 	= ZERO;
		this.coreDepth  	= ZERO;
		this.legLength		= ZERO;
		this.headHeight  	= ZERO;
		this.headForward  	= ZERO;
		this.tailHeight  	= ZERO;
		this.tailForward  	= ZERO;
		this.legSplay		= ZERO;
		this.frequency		= ZERO;
		this.springTension	= ZERO;
    }
    
 
    //---------------
    function Face()
    {
		this.v0				= NULL_INDEX; 
		this.v1				= NULL_INDEX; 
		this.v2				= NULL_INDEX; 
		this.renderOrder	= NULL_INDEX;
		this.viewDistance 	= ZERO;
		this.centroid 		= new Vector3D();
		this.normal 		= new Vector3D();
    }
    
    //---------------
    function Grab()
    {
		this.active			= false; 
		this.visible		= false; 
		this.ballID			= NULL_INDEX;
		this.stableForce	= ZERO;
		this.stable			= false;
		this.mousePos 		= new Vector3D();
    }
    
    //-----------------------------
    // local variables
    //-----------------------------
    let _clock		   		= 0;
    let _timer				= ZERO;
    let _timerDelta			= ZERO;
    let _height 			= ZERO;
    let _moving				= false;
    let _drawRad       		= ZERO;
    let _phenotype			= new Phenotype();
    let _grab				= new Grab();
    let _audioStarted    	= false;
    let _rampup 	   		= ZERO;
    let _accumSpringForce 	= ZERO;
    let _walkingType		= WALKING_TYPE_NULL;
    let _durationUpright	= 0;
    let _numGenesUsed		= 0;
    let _fell				= false;
    let _bodyTopology		= BODY_TOPOLOGY_NULL;
    let _sensors			= new Array();
	let _balls         		= new Array();
	let _springs       		= new Array();
	let _faces				= new Array();
	let _footprints			= new Array();
	let _numBalls			= 0;
	let _numSprings			= 0;
	let _numFaces			= 0;
	let _numFootprints		= 0;
	let _springLengthIndex	= 0;
	let _centroid      		= new Vector3D();
    let _drawPos       		= new Vector2D();
    let _vectorUtility 		= new Vector3D();
	let _lightPosition   	= new Vector3D();
	let _directionToTarget 	= new Vector3D();
	let _shadowExpand 		= new Vector3D();
	
	for (let b=0; b<MAX_BALLS; b++)
	{
	    _balls[b] = new Ball();
	}
	
	for (let s=0; s<NUM_SENSORS; s++ )
	{
		_sensors[s] = new Sensor();
	}
	
	for (let f=0; f<MAX_FACES; f++ )
	{
		_faces[f] = new Face();
	}

	for (let f=0; f<MAX_FOOTPRINTS; f++)
	{
		_footprints[f] = new Footprint();
	}
	
	for (let s=0; s<MAX_SPRINGS; s++)
	{
	    _springs[s] = new Spring();

		for (let l=0; l<SPRING_LENGTH_ARRAY_SIZE; l++)
		{
	        _springs[s].restLengths[l] = ZERO;
	        _springs[s].trueLengths[l] = ZERO;
	    }
	}
    
	//--------------------------
	this.initialize = function()
    {	  
    	_lightPosition.setXYZ( 60.0, 100.0, 0.0 );
    	
    	_durationUpright = 0;
    	_fell = false;
    	
    	// hardcoded
		_sensors[ SENSOR_TARGET  ].springID = 0;
		_sensors[ SENSOR_ZENITH0 ].springID = 5;
		_sensors[ SENSOR_ZENITH1 ].springID = 0;

		_sensors[ SENSOR_TARGET  ].smoothing = 0.7;
		_sensors[ SENSOR_ZENITH0 ].smoothing = 0.5;
		_sensors[ SENSOR_ZENITH1 ].smoothing = 0.5;

        //--------------------------------
        // set ball radius
        //--------------------------------	
		for (let b=0; b<MAX_BALLS; b++)
		{
			_balls[b].radius = BALL_RADIUS;
		}

        //----------------------------------------
        // set initial position
        //----------------------------------------
        let initialPosition = new Vector3D();
        _vectorUtility.setXYZ( ZERO, ZERO, ONE ); //heading
		this.setPositionAndHeading( initialPosition, _vectorUtility );		
		
        //----------------------------------------
        // determine the height of the creature
        //----------------------------------------		
		_height = -100;

		for (let b=0; b<_numBalls; b++)
		{
			if ( _balls[b].position.y > _height ) 
			{ 	
				_height = _balls[b].position.y; 
			}
		}
    }

	//--------------------------------
	this.setWalkingType = function(w)
    {	  
    	_walkingType = w;
    }
    
	//---------------------------------
	this.setGrabbed = function(g)
    {	  
		//---------------------------------
		// grabbing
		//---------------------------------
		if ( ( ! _grab.active ) && ( g ) )
    	{
    		_moving = false;
    		_grab.stable = false;
			_grab.stableForce = ZERO;
    	}
    	
		//---------------------------------
		// un-grabbing
		//---------------------------------
		if ( ( _grab.active ) && ( !g ) )
    	{
    		_moving = true;
    		
    		// if the creature is stable, then reset clock so the physics ramps up. 
    		if ( _grab.stable )
    		{
				_clock = 0;    	
    		}
  
			for (let b=0; b<MAX_BALLS; b++)
			{			
				_balls[b].velocity.clear();
			}
    	}
    	
    	_grab.active = g;
    }

	//---------------------------------
	this.getGrabbed = function()
    {	  
    	return _grab.active;
    }
    
	//---------------------------------
	this.showGrabHandle = function(s)
    {	  
    	_grab.visible = s;
    }


	//---------------------------------
	this.setGrabPosition = function(p)
    {	  
    	//----------------------------------
    	// store the 3D mouse grab position
    	//----------------------------------
		_grab.mousePos.copyFrom(p);
    		
    	//----------------------------------------------
    	// force the grab ball towards grab position
    	//----------------------------------------------
		_vectorUtility.setToDifference( _grab.mousePos, _balls[ _grab.ballID ].position );
		
		_balls[ _grab.ballID ].velocity.scale( 0.9 );  
		_balls[ _grab.ballID ].velocity.addScaled( _vectorUtility, 0.002 );  
		_balls[ _grab.ballID ].position.addScaled( _vectorUtility, 0.001 );  
		
		
    	//-------------------------------------------------------
    	// if grab ball is within the a certain height range... 
    	//-------------------------------------------------------
		if (( _grab.mousePos.y > _height - 0.3 )
		&&  ( _grab.mousePos.y < _height + 0.3 ))
		{
			//console.log( "within range" );
			_grab.stable = true;
			_grab.stableForce += 0.0001;
			if ( _grab.stableForce > 1 ) { _grab.stableForce = 1; }
		}	
		else
		{
			//console.log( "---" );
			_grab.stable = false;
			_grab.stableForce -= 0.0001;
			if ( _grab.stableForce < 0 ) { _grab.stableForce = 0; }
		}

    	//-------------------------------------------------------
    	// forcr the create to the default pose
    	//-------------------------------------------------------
		for (let b=0; b<MAX_BALLS; b++)
		{			
			_vectorUtility.copyFrom(p);
			_vectorUtility.y = 0;

			_vectorUtility.add( _balls[b].defaultPos );
			_vectorUtility.subtract( _balls[b].position );

			_balls[b].position.addScaled( _vectorUtility, _grab.stableForce );
		}
    }    

	//------------------------
	this.getGrabHandle = function()
    {
    	return _balls[ _grab.ballID ].position;
    }
    
	//------------------------------
	this.setBodyTopolgy = function(b)
    {	  
    	_bodyTopology = b;
    	
		if ( _bodyTopology === BODY_TOPOLOGY_1_TET )
		{        
			_numBalls  = 4;
			_numSprings = 6;

			_springs[0].ball0 = 0; _springs[0].ball1 = 1;    
			_springs[1].ball0 = 0; _springs[1].ball1 = 2;   
			_springs[2].ball0 = 0; _springs[2].ball1 = 3;   
			_springs[3].ball0 = 1; _springs[3].ball1 = 2;   
			_springs[4].ball0 = 3; _springs[4].ball1 = 1;    
			_springs[5].ball0 = 3; _springs[5].ball1 = 2;  
			
			let f = 0;
			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 2; 			
			f ++;

			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 1; 			
			f ++;

			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 3; 			
			f ++;

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 2; 			
			f ++;

			_numFaces = f;			
			
			//console.log( "in setBodyTopolgy: _numFaces = " + _numFaces );			
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_2_TET )
		{
			_numBalls  = 5;
			_numSprings = 9;

			_springs[0].ball0 = 0; _springs[0].ball1 = 1;    
			_springs[1].ball0 = 1; _springs[1].ball1 = 2;   
			_springs[2].ball0 = 2; _springs[2].ball1 = 0; 
			  
			_springs[3].ball0 = 0; _springs[3].ball1 = 3;   
			_springs[4].ball0 = 1; _springs[4].ball1 = 3;    
			_springs[5].ball0 = 2; _springs[5].ball1 = 3;  

			_springs[6].ball0 = 0; _springs[6].ball1 = 4;  
			_springs[7].ball0 = 1; _springs[7].ball1 = 4;  
			_springs[8].ball0 = 2; _springs[8].ball1 = 4; 
			
			let f = 0;			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 3; 	
			f ++;		

			_faces[f].v0 = 2; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 3; 	
			f ++;		

			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 3; 	
			f ++;		

			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 4; 	
			f ++;		

			_faces[f].v0 = 2; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 4; 	
			f ++;		

			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 4; 	
			f ++;		

			_numFaces = f;
			
			 
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_3_TET )
		{
			_numBalls  = 6;
			_numSprings = 12;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;    
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    // left femur
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    // right femur
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 
			
			
			let f = 0;
			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 2; 
			f ++;		

			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 1; 			
			f ++;			
			
			//inside faces
			//_faces[f].v0 = 0; 
			//_faces[f].v1 = 2; 
			//_faces[f].v2 = 3; 			
			//f ++;			

			//_faces[f].v0 = 1; 
			//_faces[f].v1 = 2; 
			//_faces[f].v2 = 3; 	
			//f ++;			

			_faces[f].v0 = 2; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 3; 
			f ++;	

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 5; 
			f ++;			

			_faces[f].v0 = 1; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 2; 
			f ++;			
		
			_faces[f].v0 = 2; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 4; 
			f ++;			
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 3; 
			f ++;			

			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 4; 
			f ++;
			
						
			_numFaces = f;
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_4_TET )
		{
			_numBalls  = 7;
			_numSprings = 15;

			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;   // core 
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   // core 
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   // core 
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   // core 
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;   // core 
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;   // core 
			
			/*
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;   // left femur
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;   // right femur
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;   //
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;   //
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;   //
			_springs[11].ball0 = 3; _springs[11].ball1 = 5;   //
			*/

			let s = 0;
			s =  6; _springs[s].ball0 = 0; _springs[s].ball1 = 4;   // left femur
			s =  7; _springs[s].ball0 = 2; _springs[s].ball1 = 4;   // left
			s =  8; _springs[s].ball0 = 3; _springs[s].ball1 = 4;   // left

			s =  9; _springs[s].ball0 = 1; _springs[s].ball1 = 5;   // right femur
			s = 10; _springs[s].ball0 = 2; _springs[s].ball1 = 5;   // right
			s = 11; _springs[s].ball0 = 3; _springs[s].ball1 = 5;   // right
			
			
			_springs[12].ball0 = 0; _springs[12].ball1 = 6; // head
			_springs[13].ball0 = 1; _springs[13].ball1 = 6; // head
			_springs[14].ball0 = 3; _springs[14].ball1 = 6; // head
			


			let f = 0;
				
			// right leg
			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 4; 
			f ++;	
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 2; 			
			f ++;			
			
			_faces[f].v0 = 2; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 3; 
			f ++;	
			
			// left leg
			_faces[f].v0 = 2; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 5; 			
			f ++;			
			
			_faces[f].v0 = 1; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 3; 	
			f ++;			

			_faces[f].v0 = 2; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 1; 
			f ++;		

			// head	
			_faces[f].v0 = 0; 
			_faces[f].v1 = 6; 
			_faces[f].v2 = 3; 
			f ++;			

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 6; 
			f ++;			

			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 6; 
			f ++;			


			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 1; 
			f ++;			

			
			/*
			//tail
			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 7; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 1; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 0; 
			f ++;
			*/

			_numFaces = f;		
			
			
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_5_TET )
		{
			_numBalls  = 8;
			_numSprings = 18;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;    
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    // left femur
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    // right femur
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 

			_springs[12].ball0 = 0; _springs[12].ball1 = 6; 
			_springs[13].ball0 = 1; _springs[13].ball1 = 6; 
			_springs[14].ball0 = 3; _springs[14].ball1 = 6; 

			_springs[15].ball0 = 0; _springs[15].ball1 = 7; 
			_springs[16].ball0 = 1; _springs[16].ball1 = 7; 
			_springs[17].ball0 = 2; _springs[17].ball1 = 7; 
			

			let f = 0;
				
			// right leg
			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 4; 
			f ++;	
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 2; 			
			f ++;			
			
			_faces[f].v0 = 2; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 3; 
			f ++;	
			
			// left leg
			_faces[f].v0 = 2; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 5; 			
			f ++;			
			
			_faces[f].v0 = 1; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 3; 	
			f ++;			

			_faces[f].v0 = 2; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 1; 
			f ++;		

			// head	
			_faces[f].v0 = 0; 
			_faces[f].v1 = 6; 
			_faces[f].v2 = 3; 
			f ++;			

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 6; 
			f ++;			

			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 6; 
			f ++;			
			
			//tail
			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 7; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 1; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 0; 
			f ++;

			_numFaces = f;			
						
			
			
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_6_TET )
		{
			_numBalls  = 8;
			_numSprings = 19;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;    
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 

			_springs[12].ball0 = 0; _springs[12].ball1 = 6; 
			_springs[13].ball0 = 1; _springs[13].ball1 = 6; 
			_springs[14].ball0 = 3; _springs[14].ball1 = 6; 

			_springs[15].ball0 = 0; _springs[15].ball1 = 7; 
			_springs[16].ball0 = 1; _springs[16].ball1 = 7; 
			_springs[17].ball0 = 2; _springs[17].ball1 = 7; 

			_springs[18].ball0 = 6; _springs[18].ball1 = 7; 
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_7_TET )
		{
			_numBalls  = 9;
			_numSprings = 22;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;    
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 

			_springs[12].ball0 = 0; _springs[12].ball1 = 6; 
			_springs[13].ball0 = 1; _springs[13].ball1 = 6; 
			_springs[14].ball0 = 3; _springs[14].ball1 = 6; 

			_springs[15].ball0 = 0; _springs[15].ball1 = 7; 
			_springs[16].ball0 = 1; _springs[16].ball1 = 7; 
			_springs[17].ball0 = 2; _springs[17].ball1 = 7; 

			_springs[18].ball0 = 6; _springs[18].ball1 = 7; 
			
			_springs[19].ball0 = 6; _springs[19].ball1 = 8; 
			_springs[20].ball0 = 7; _springs[20].ball1 = 8; 
			_springs[21].ball0 = 0; _springs[21].ball1 = 8; 
			
		}		
		else if ( _bodyTopology === BODY_TOPOLOGY_8_TET )
		{
			_numBalls  = 10;
			_numSprings = 25;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;    
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 

			_springs[12].ball0 = 0; _springs[12].ball1 = 6; 
			_springs[13].ball0 = 1; _springs[13].ball1 = 6; 
			_springs[14].ball0 = 3; _springs[14].ball1 = 6; 

			_springs[15].ball0 = 0; _springs[15].ball1 = 7; 
			_springs[16].ball0 = 1; _springs[16].ball1 = 7; 
			_springs[17].ball0 = 2; _springs[17].ball1 = 7; 

			_springs[18].ball0 = 6; _springs[18].ball1 = 7; 
			
			_springs[19].ball0 = 6; _springs[19].ball1 = 8; 
			_springs[20].ball0 = 7; _springs[20].ball1 = 8; 
			_springs[21].ball0 = 0; _springs[21].ball1 = 8; 

			_springs[22].ball0 = 6; _springs[22].ball1 = 9; 
			_springs[23].ball0 = 7; _springs[23].ball1 = 9; 
			_springs[24].ball0 = 1; _springs[24].ball1 = 9; 
			

			let f = 0;
				
			// right leg
			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 4; 
			f ++;	
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 2; 			
			f ++;			
			
			_faces[f].v0 = 2; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 3; 
			f ++;	
			
			// left leg
			_faces[f].v0 = 2; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 5; 			
			f ++;			
			
			_faces[f].v0 = 1; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 3; 	
			f ++;			

			_faces[f].v0 = 2; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 1; 
			f ++;		

			// head	
			_faces[f].v0 = 0; 
			_faces[f].v1 = 6; 
			_faces[f].v2 = 3; 
			f ++;			

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 6; 
			f ++;			

			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 6; 
			f ++;			
			
			//tail
			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 7; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 1; 
			f ++;

			_faces[f].v0 = 7; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 0; 
			f ++;
			
			// left arm
			_faces[f].v0 = 0; 
			_faces[f].v1 = 7; 
			_faces[f].v2 = 8; 
			f ++;
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 6; 
			_faces[f].v2 = 8; 
			f ++;
			
			_faces[f].v0 = 6; 
			_faces[f].v1 = 7; 
			_faces[f].v2 = 8; 
			f ++;
			
			// right arm
			_faces[f].v0 = 1; 
			_faces[f].v1 = 7; 
			_faces[f].v2 = 9; 
			f ++;
			
			_faces[f].v0 = 1; 
			_faces[f].v1 = 6; 
			_faces[f].v2 = 9; 
			f ++;
			
			_faces[f].v0 = 6; 
			_faces[f].v1 = 7; 
			_faces[f].v2 = 9; 
			f ++;
			

			_numFaces = f;			
									
			
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_FOOT )
		{
			_numBalls  = 9;
			_numSprings = 21;
			
			_springs[ 0].ball0 = 0; _springs[ 0].ball1 = 1;    
			_springs[ 1].ball0 = 0; _springs[ 1].ball1 = 2;   
			_springs[ 2].ball0 = 0; _springs[ 2].ball1 = 3;   
			_springs[ 3].ball0 = 1; _springs[ 3].ball1 = 2;   
			_springs[ 4].ball0 = 3; _springs[ 4].ball1 = 1;    
			_springs[ 5].ball0 = 3; _springs[ 5].ball1 = 2;   
			 
			_springs[ 6].ball0 = 0; _springs[ 6].ball1 = 4;    // left femur
			_springs[ 7].ball0 = 1; _springs[ 7].ball1 = 5;    // right femur
			_springs[ 8].ball0 = 2; _springs[ 8].ball1 = 4;    
			
			_springs[ 9].ball0 = 2; _springs[ 9].ball1 = 5;    
			_springs[10].ball0 = 3; _springs[10].ball1 = 4;    
			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 

			_springs[11].ball0 = 3; _springs[11].ball1 = 5; 
			_springs[12].ball0 = 3; _springs[12].ball1 = 5; 
			_springs[13].ball0 = 3; _springs[13].ball1 = 5; 

			_springs[14].ball0 = 3; _springs[14].ball1 = 5; 
			_springs[15].ball0 = 3; _springs[15].ball1 = 5; 
			_springs[16].ball0 = 3; _springs[16].ball1 = 5; 

			_springs[17].ball0 = 3; _springs[17].ball1 = 5; 
			_springs[18].ball0 = 3; _springs[18].ball1 = 5; 
			_springs[19].ball0 = 3; _springs[19].ball1 = 5; 
			_springs[20].ball0 = 3; _springs[20].ball1 = 5; 
			
			
			let f = 0;
			_faces[f].v0 = 0; 
			_faces[f].v1 = 1; 
			_faces[f].v2 = 2; 
			f ++;		

			_faces[f].v0 = 0; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 1; 			
			f ++;			

			_faces[f].v0 = 2; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 3; 
			f ++;	

			_faces[f].v0 = 1; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 5; 
			f ++;			

			_faces[f].v0 = 1; 
			_faces[f].v1 = 5; 
			_faces[f].v2 = 2; 
			f ++;			
		
			_faces[f].v0 = 2; 
			_faces[f].v1 = 3; 
			_faces[f].v2 = 4; 
			f ++;			
			
			_faces[f].v0 = 0; 
			_faces[f].v1 = 4; 
			_faces[f].v2 = 3; 
			f ++;			

			_faces[f].v0 = 0; 
			_faces[f].v1 = 2; 
			_faces[f].v2 = 4; 
			f ++;
			
			_numFaces = f;
		}
    }
        
	//-------------------------------------------
	this.generatePhenotype = function( genes )
	{
		let g = 0;

		_phenotype.frequency 		= MIN_FREQ 				+ genes[g] * ( MAX_FREQ 			- MIN_FREQ   			); g++;   
		_phenotype.springTension 	= MIN_SPRING_TENSION	+ genes[g] * ( MAX_SPRING_TENSION 	- MIN_SPRING_TENSION 	); g++;  
		_phenotype.coreWidth		= MIN_CORE_WIDTH		+ genes[g] * ( MAX_CORE_WIDTH		- MIN_CORE_WIDTH 		); g++; 
		_phenotype.coreHeight		= MIN_CORE_HEIGHT		+ genes[g] * ( MAX_CORE_HEIGHT 		- MIN_CORE_HEIGHT 		); g++; 
		_phenotype.coreDepth  		= MIN_CORE_DEPTH		+ genes[g] * ( MAX_CORE_DEPTH		- MIN_CORE_DEPTH		); g++; 
		_phenotype.legLength 		= MIN_LEG_LENGTH		+ genes[g] * ( MAX_LEG_LENGTH 		- MIN_LEG_LENGTH 		); g++; 
		_phenotype.headHeight  		= MIN_HEAD_HEIGHT		+ genes[g] * ( MAX_HEAD_HEIGHT		- MIN_HEAD_HEIGHT		); g++; 
		_phenotype.headForward		= MIN_HEAD_FORWARD		+ genes[g] * ( MAX_HEAD_FORWARD		- MIN_HEAD_FORWARD		); g++; 
		_phenotype.tailHeight  		= MIN_TAIL_HEIGHT		+ genes[g] * ( MAX_TAIL_HEIGHT		- MIN_TAIL_HEIGHT		); g++; 
		_phenotype.tailForward		= MIN_TAIL_FORWARD		+ genes[g] * ( MAX_TAIL_FORWARD		- MIN_TAIL_FORWARD		); g++; 
		_phenotype.legSplay		 	= MIN_LEG_SPLAY			+ genes[g] * ( MAX_LEG_SPLAY 		- MIN_LEG_SPLAY			); g++; 
                
                
		//console.log( "_numSprings = " + _numSprings );
                
                
        for (let s=0; s<_numSprings; s++)
        {
			let walkAmp		= genes[g]; g++;  
			let walkPhase	= genes[g]; g++;  
			let turnAmp   	= genes[g]; g++;  
			let turnPhase 	= genes[g]; g++;  
			let up0Amp   	= genes[g]; g++;  
			let up0Phase  	= genes[g]; g++;  
			let up1Amp   	= genes[g]; g++;  
			let up1Phase  	= genes[g]; g++;  

// verify that this is working as expected.
// chunkify 
//amp 	= Math.floor( amp   * NUM_MOTOR_CHUNKS ) / ( NUM_MOTOR_CHUNKS - 1 );  
//phase	= Math.floor( phase * NUM_MOTOR_CHUNKS ) / ( NUM_MOTOR_CHUNKS - 1 ); 

/*
			let walkAmpRange   	= MAX_WALK_AMP 		- MIN_WALK_AMP;
			let walkPhaseRange 	= MAX_WALK_PHASE	- MIN_WALK_PHASE;

			let turnAmpRange   	= MAX_TURN_AMP 		- MIN_TURN_AMP;
			let turnPhaseRange 	= MAX_TURN_PHASE	- MIN_TURN_PHASE;

			let upAmpRange   	= MAX_UP_AMP 		- MIN_UP_AMP;
			let upPhaseRange 	= MAX_UP_PHASE		- MIN_UP_PHASE;


			_springs[s].walkAmp		= MIN_WALK_AMP	 + walkAmp	 	* walkAmpRange;
			_springs[s].walkPhase	= MIN_WALK_PHASE + walkPhase 	* walkPhaseRange;
			
	        _springs[s].turnAmp   	= MIN_TURN_AMP   + turnAmp   	* turnAmpRange;
    	    _springs[s].turnPhase 	= MIN_TURN_PHASE + turnPhase	* turnPhaseRange;

	        _springs[s].up0Amp     	= MIN_UP_AMP     + up0Amp   	* upAmpRange;
    	    _springs[s].up0Phase   	= MIN_UP_PHASE   + up0Phase 	* upPhaseRange;

	        _springs[s].up1Amp     	= MIN_UP_AMP     + up1Amp   	* upAmpRange;
    	    _springs[s].up1Phase   	= MIN_UP_PHASE   + up1Phase 	* upPhaseRange;
*/
			_springs[s].walkAmp		= -MAX_WALK_AMP		* ONE_HALF + walkAmp	* MAX_WALK_AMP;
			_springs[s].walkPhase	= -MAX_WALK_PHASE	* ONE_HALF + walkPhase	* MAX_WALK_PHASE;
			
	        _springs[s].turnAmp   	= -MAX_TURN_AMP   	* ONE_HALF + turnAmp   	* MAX_TURN_AMP;
    	    _springs[s].turnPhase 	= -MAX_TURN_PHASE 	* ONE_HALF + turnPhase 	* MAX_TURN_PHASE;

	        _springs[s].up0Amp     	= -MAX_UP_AMP     	* ONE_HALF + up0Amp   	* MAX_UP_AMP;
    	    _springs[s].up0Phase   	= -MAX_UP_PHASE   	* ONE_HALF + up0Phase 	* MAX_UP_PHASE;
    	    
	        _springs[s].up1Amp     	= -MAX_UP_AMP     	* ONE_HALF + up1Amp   	* MAX_UP_AMP;
    	    _springs[s].up1Phase   	= -MAX_UP_PHASE   	* ONE_HALF + up1Phase 	* MAX_UP_PHASE;
    	    

/*
//testing to see what happens if I use a switch to turn on/off a spring's motor control. 
if ( genes[g] < ONE_HALF ) 
{
	_springs[s].active = false;
}
else
{
	_springs[s].active = true;
}

g++; ////important! 
*/
        }
	
		_numGenesUsed = g;
		//console.log( "_numGenesUsed = " + _numGenesUsed );
	}


	//--------------------------------
	this.stopAllMotion = function()
	{
		_moving = false;        
	}


	//---------------------------
	this.getHeight = function()
	{        
		return _height;
	}
	
	//----------------------------------------------------------
	this.setPositionAndHeading = function( position, heading )
	{        
		//------------------------------
		// these should go elsewhere
		//------------------------------
		_moving = true;
		_clock = 0;	
		_timer = ZERO;
		_timerDelta = ZERO;
		_durationUpright = 0;
		_fell = false;
		_numFootprints = 0;
		
		_springLengthIndex = 0;
		
		//-----------------------------------------------------------------
		// arrange the balls of the body and determine spring lengths...
		//-----------------------------------------------------------------
	    this.buildBody( position, heading );
	    
		//--------------------------------------------------------------------------------
		// We need to calculate the highest point of the creature as the grab handle...
		//--------------------------------------------------------------------------------
	    this.calculateGrabBall();
	    
		//------------------------------------------------------
		// We need to calculate the default pose of the creature...
		//------------------------------------------------------
	    this.calculateDefaultPose();
	
		//----------------------------------
		// clear velocities
		//----------------------------------
	    for (let b=0; b<_numBalls; b++)
        {
        	_balls[b].velocity.clear();
		}
		
		//----------------------------------
		// clear accumulated sproing force
		//----------------------------------
		_accumSpringForce = ZERO;
	}    
	
	
	//----------------------------------
	this.calculateDefaultPose = function()
	{        
		for (let b=0; b<_numBalls; b++)
		{
			_balls[b].defaultPos.copyFrom( _balls[b].position );
		}
	}
	


	//----------------------------------
	this.calculateGrabBall = function()
	{        
		let highestY = -100;

		for (let b=0; b<_numBalls; b++)
		{
			if ( _balls[b].position.y > highestY ) 
			{ 	
				highestY = _balls[b].position.y; 
				_grab.ballID = b;
			}
		}
	}
		
	//----------------------------------
	this.buildBody = function( p, front )
	{        
		for (let b=0; b<_numBalls; b++)
		{
			_balls[b].isAFoot = false;
			_balls[b].position.copyFrom(p);
			
			/*
			//----------------------------------------
			// Start with all balls on the ground... 
			//----------------------------------------
			if ( ( _balls[b].position.y - _balls[b].radius ) < world.getHeightAtPosition( _balls[b].position ) )
			{
				_balls[b].position.y = world.getHeightAtPosition( _balls[b].position )  + _balls[b].radius;
			}
			*/			
		}
		
		//----------------------------------------
		// Start with all springs active... 
		//----------------------------------------
		for (let s=0; s<_numSprings; s++)
		{
			_springs[s].active = true;
		}

		//-------------------------------------
		// ONE TET
		//-------------------------------------
		if ( _bodyTopology === BODY_TOPOLOGY_1_TET )
		{        
			if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				let width  = ONE;
				let height = ( 4 / Math.sqrt(6) ) * ONE_HALF;
				let depth  = _phenotype.coreDepth;
				
				/*
				_balls[0].position.x -= width * ONE_HALF;
				_balls[1].position.x += width * ONE_HALF;

				_balls[0].position.z -= depth * ONE_HALF;
				_balls[1].position.z -= depth * ONE_HALF;
		
				_balls[2].position.z += depth * ONE_HALF;
				_balls[3].position.y += height;
				*/
				
						
				let frontX =  front.x * ONE_HALF * depth;
				let frontZ =  front.z * ONE_HALF * depth;
				
				let rightX =  front.z * ONE_HALF * width;
				let rightZ = -front.x * ONE_HALF * width;


				_balls[0].position.x -= rightX;
				_balls[0].position.z -= rightZ;
				
				_balls[1].position.x += rightX;
				_balls[1].position.z += rightZ;


				_balls[0].position.x -= frontX;
				_balls[0].position.z -= frontZ;
				
				_balls[1].position.x -= frontX;
				_balls[1].position.z -= frontZ;

				_balls[2].position.x += frontX;
				_balls[2].position.z += frontZ;

				_balls[3].position.y += height;		

				_balls[0].isAFoot = true;
				_balls[1].isAFoot = true;
				_balls[2].isAFoot = true;
			}
			else if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF;
				_balls[1].position.x += ONE_HALF;

				_balls[2].position.z -= ONE_HALF;
				_balls[3].position.z += ONE_HALF;

				_balls[2].position.y += Math.sqrt(2) * ONE_HALF;
				_balls[3].position.y += Math.sqrt(2) * ONE_HALF;
				
				_balls[0].isAFoot = true;
				_balls[1].isAFoot = true;
				
				
/*			
// UNIPED!!!!
// ?????
let bodyDepth = Math.sqrt(3) * ONE_HALF;

_balls[0].position.x -= ONE_HALF;
_balls[1].position.x += ONE_HALF;

_balls[0].position.z -= _phenotype.coreDepth * ONE_HALF;
_balls[1].position.z -= _phenotype.coreDepth * ONE_HALF;

_balls[2].position.z += _phenotype.coreDepth * ONE_HALF;

_balls[0].position.y += ( 4 / Math.sqrt(6) )  * ONE_HALF;
_balls[1].position.y += ( 4 / Math.sqrt(6) )  * ONE_HALF;
_balls[2].position.y += ( 4 / Math.sqrt(6) )  * ONE_HALF;

_balls[3].isAFoot = true;
*/
			}       
		}
		//-------------------------------------
		// TWO TET
		//-------------------------------------
		else if ( _bodyTopology === BODY_TOPOLOGY_2_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[3].position.z += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[4].position.z -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	
				
				_balls[3].isAFoot = true;
				_balls[4].isAFoot = true;
				
				/*
				_springs[0].active = false;
				_springs[1].active = false;
				_springs[2].active = false;
				*/
				
				_sensors[ SENSOR_ZENITH0 ].springID = 0;
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{		
			/*
				_balls[1].position.x -= _phenotype.coreWidth * ONE_HALF;
				_balls[2].position.x += _phenotype.coreWidth * ONE_HALF;
		
				_balls[3].position.z += _phenotype.coreDepth * 0.7;
				
				_balls[4].position.y += _phenotype.coreHeight;
				_balls[4].position.z += _phenotype.coreDepth * 0.7;

				_balls[0].position.y += _phenotype.coreHeight;
				_balls[0].position.z += _phenotype.coreHeight;

				_balls[1].isAFoot = true;
				_balls[2].isAFoot = true;
				_balls[3].isAFoot = true;
				*/
				
				_balls[1].position.x -= ONE_HALF * _phenotype.coreWidth;
				_balls[2].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[3].position.z += _phenotype.coreDepth * 0.7;
				
				_balls[0].position.y += _phenotype.coreHeight;
				_balls[4].position.y += _phenotype.coreHeight;

				_balls[0].position.z += _phenotype.coreDepth;
				_balls[4].position.z -= _phenotype.coreDepth * 0.3;
				
				_balls[1].isAFoot = true;
				_balls[2].isAFoot = true;
				_balls[3].isAFoot = true;
				
				_sensors[ SENSOR_TARGET ].springID = 1;
				

/*
				_balls[2].position.z += _phenotype.coreDepth;

				_balls[3].position.z += _phenotype.legLength;
				_balls[4].position.z -= _phenotype.legLength;

				_balls[0].isAFoot = true;
				_balls[1].isAFoot = true;
				//_balls[2].isAFoot = true;
				_balls[3].isAFoot = true;
				_balls[4].isAFoot = true;
				*/
				
				//_springs[0].active = false;
				//_springs[1].active = false;
				//_springs[2].active = false;
				
				
			}
		}
		//-------------------------------------
		// THREE TET
		//-------------------------------------
		else if ( _bodyTopology === BODY_TOPOLOGY_3_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;
				
				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				//let bodyDepth = Math.sqrt(3) * ONE_HALF;
		
				_balls[0].position.x -= ONE_HALF;
				_balls[1].position.x += ONE_HALF;

				_balls[0].position.z -= _phenotype.coreDepth * ONE_HALF;
				_balls[1].position.z -= _phenotype.coreDepth * ONE_HALF;
		
				_balls[2].position.z += _phenotype.coreDepth * ONE_HALF;
				_balls[3].position.y += ( 4 / Math.sqrt(6) ) * ONE_HALF;
				
				_balls[4].position.x -= _phenotype.coreWidth;	
				_balls[5].position.x += _phenotype.coreWidth;	

				_balls[4].position.y += 1;		
				_balls[5].position.y += 1;		

				_balls[0].isAFoot = true;
				_balls[1].isAFoot = true;
				_balls[2].isAFoot = true;

				/*
				_balls[0].position.x -= ONE_HALF;		
				_balls[1].position.x += ONE_HALF;

				_balls[0].position.y += ONE_HALF;
				_balls[1].position.y += ONE_HALF;
				
				_balls[2].position.z += _phenotype.coreHeight;
				_balls[3].position.z += _phenotype.coreHeight;

				_balls[3].position.y += ONE;

				_balls[4].position.x -= _phenotype.legLength;	
				_balls[5].position.x += _phenotype.legLength;	

				//_balls[4].position.y += ONE_HALF;		
				//_balls[5].position.y += ONE_HALF;		

				_balls[4].position.z -= _phenotype.coreHeight;		
				_balls[5].position.z -= _phenotype.coreHeight;
				
				_balls[0].isAFoot = true;
				_balls[1].isAFoot = true;
				_balls[2].isAFoot = true;
				//_balls[3].isAFoot = true;
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;
				*/
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_4_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
/*			
				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[1].position.z += ONE_HALF * _phenotype.coreDepth;
				_balls[2].position.z -= ONE_HALF * _phenotype.coreDepth;

				_balls[3].position.x -= ONE_HALF * _phenotype.coreWidth;
				_balls[4].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[4].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[5].position.x -= ONE_HALF * _phenotype.coreWidth;	
				_balls[6].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[5].isAFoot = true;
				_balls[6].isAFoot = true;
*/

				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	

				_balls[6].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[6].position.z -= _phenotype.headForward;	

				//_balls[7].position.y += _phenotype.legLength + _phenotype.tailHeight;	
				//_balls[7].position.z += _phenotype.tailForward;	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;

				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;
				_balls[3].position.y += _phenotype.legLength;

				let r = 0.8;
				_balls[0].position.x += r * Math.sin(   0 * PI_OVER_180 );		
				_balls[1].position.x += r * Math.sin( 120 * PI_OVER_180 );
				_balls[3].position.x += r * Math.sin( 240 * PI_OVER_180 );

				_balls[0].position.z += r * Math.cos(   0 * PI_OVER_180 );		
				_balls[1].position.z += r * Math.cos( 120 * PI_OVER_180 );
				_balls[3].position.z += r * Math.cos( 240 * PI_OVER_180 );

				// head
				//_balls[6].position.y += _phenotype.legLength + 1;
			
				// crotch
				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
			
				// feet
				r = 1.2;
				_balls[6].position.x += r * Math.sin(  60 * PI_OVER_180 );		
				_balls[5].position.x += r * Math.sin( 180 * PI_OVER_180 );
				_balls[4].position.x += r * Math.sin( 300 * PI_OVER_180 );

				_balls[6].position.z += r * Math.cos(  60 * PI_OVER_180 );		
				_balls[5].position.z += r * Math.cos( 180 * PI_OVER_180 );
				_balls[4].position.z += r * Math.cos( 300 * PI_OVER_180 );
				
				_balls[6].isAFoot = true;
				_balls[5].isAFoot = true;
				_balls[4].isAFoot = true;
				
				/*
				_springs[0].active = false;
				_springs[1].active = false;
				_springs[2].active = false;
				_springs[3].active = false;
				_springs[4].active = false;
				_springs[5].active = false;
				*/
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_5_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	

				_balls[6].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[6].position.z -= _phenotype.headForward;	

				_balls[7].position.y += _phenotype.legLength + _phenotype.tailHeight;	
				_balls[7].position.z += _phenotype.tailForward;	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;

				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}

/*
// UNIPED!!
_balls[0].position.y += 1.5;//_phenotype.legLength;
_balls[1].position.y += 1.5;//_phenotype.legLength;
_balls[3].position.y += 1.5;//_phenotype.legLength;

let r = 0.6;
_balls[0].position.x += r * Math.sin(   0 * PI_OVER_180 );		
_balls[1].position.x += r * Math.sin( 120 * PI_OVER_180 );
_balls[3].position.x += r * Math.sin( 240 * PI_OVER_180 );

_balls[0].position.z += r * Math.cos(   0 * PI_OVER_180 );		
_balls[1].position.z += r * Math.cos( 120 * PI_OVER_180 );
_balls[3].position.z += r * Math.cos( 240 * PI_OVER_180 );

// head
//_balls[6].position.y += _phenotype.legLength + 1;

// crotch
_balls[2].position.y += 2;//_phenotype.legLength - _phenotype.coreHeight;

r = 1.2;
_balls[7].position.x += r * Math.sin(  60 * PI_OVER_180 );		
_balls[5].position.x += r * Math.sin( 180 * PI_OVER_180 );
_balls[4].position.x += r * Math.sin( 300 * PI_OVER_180 );

_balls[7].position.z += r * Math.cos(  60 * PI_OVER_180 );		
_balls[5].position.z += r * Math.cos( 180 * PI_OVER_180 );
_balls[4].position.z += r * Math.cos( 300 * PI_OVER_180 );

_balls[7].position.y += 2.5;		
_balls[5].position.y += 2.5;
_balls[4].position.y += 2.5;

_balls[6].isAFoot = true;
*/			
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;
				_balls[3].position.y += _phenotype.legLength;

				let r = 0.8;
				_balls[0].position.x += r * Math.sin(   0 * PI_OVER_180 );		
				_balls[1].position.x += r * Math.sin( 120 * PI_OVER_180 );
				_balls[3].position.x += r * Math.sin( 240 * PI_OVER_180 );

				_balls[0].position.z += r * Math.cos(   0 * PI_OVER_180 );		
				_balls[1].position.z += r * Math.cos( 120 * PI_OVER_180 );
				_balls[3].position.z += r * Math.cos( 240 * PI_OVER_180 );

				// head
				_balls[6].position.y += _phenotype.legLength + 1;
			
				// crotch
				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
			
				// feet
				r = 1.2;
				_balls[7].position.x += r * Math.sin(  60 * PI_OVER_180 );		
				_balls[5].position.x += r * Math.sin( 180 * PI_OVER_180 );
				_balls[4].position.x += r * Math.sin( 300 * PI_OVER_180 );

				_balls[7].position.z += r * Math.cos(  60 * PI_OVER_180 );		
				_balls[5].position.z += r * Math.cos( 180 * PI_OVER_180 );
				_balls[4].position.z += r * Math.cos( 300 * PI_OVER_180 );
				
				_balls[7].isAFoot = true;
				_balls[5].isAFoot = true;
				_balls[4].isAFoot = true;
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_6_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	

				_balls[6].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[6].position.z -= ONE_HALF * _phenotype.coreWidth;	

				_balls[7].position.y += _phenotype.legLength + _phenotype.tailHeight;	
				_balls[7].position.z += ONE_HALF * _phenotype.coreWidth;	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;

				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				alert( "there is no body type for 'six tets' as a triped" );
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_7_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	

				_balls[6].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[6].position.z -= ONE_HALF * _phenotype.coreDepth;	

				_balls[7].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[7].position.z += ONE_HALF * _phenotype.coreDepth;	

				_balls[8].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[8].position.x -= _phenotype.legLength;	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;

				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				alert( "there is no body type for 'seven tets' as a triped" );
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_8_TET )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	

				_balls[6].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[6].position.z -= ONE_HALF * _phenotype.coreDepth;	

				_balls[7].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[7].position.z += ONE_HALF * _phenotype.coreDepth;	

				_balls[8].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[8].position.x -= _phenotype.coreWidth * 1.4;	
				
				_balls[9].position.y += _phenotype.legLength + _phenotype.headHeight;	
				_balls[9].position.x += _phenotype.coreWidth * 1.4;	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;

				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
		}
		else if ( _bodyTopology === BODY_TOPOLOGY_FOOT )
		{        
			if ( _walkingType === WALKING_TYPE_BIPED )
			{
				_balls[0].position.x -= ONE_HALF * _phenotype.coreWidth;		
				_balls[1].position.x += ONE_HALF * _phenotype.coreWidth;

				_balls[0].position.y += _phenotype.legLength;
				_balls[1].position.y += _phenotype.legLength;

				_balls[2].position.y += _phenotype.legLength - _phenotype.coreHeight;
				_balls[3].position.y += _phenotype.legLength - _phenotype.coreHeight;

				_balls[2].position.z +=  ONE_HALF * _phenotype.coreDepth;
				_balls[3].position.z += -ONE_HALF * _phenotype.coreDepth;

				_balls[4].position.x -= ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );		
				_balls[5].position.x += ( ONE_HALF * _phenotype.coreWidth + _phenotype.legSplay );	
				
				_balls[4].isAFoot = true;
				_balls[5].isAFoot = true;
				
				if ( FREEZE_CORE )
				{
					_springs[0].active = false;
					_springs[1].active = false;
					_springs[2].active = false;
					_springs[3].active = false;
					_springs[4].active = false;
					_springs[5].active = false;
				}
			}
			else if ( _walkingType === WALKING_TYPE_TRIPED )
			{
				alert( "there is no body type for 'foot' as a triped" );
			}
		}
				
		//----------------------------------
		// set the spring lengths
		//----------------------------------
        for (let s=0; s<_numSprings; s++)
        {
			_springs[s].idealLength = _balls[ _springs[s].ball0 ].position.getDistanceTo( _balls[ _springs[s].ball1 ].position );
        }
	}

	//----------------------------------------------------
	this.setSensedPosition = function( sensorID, p )
	{
		_sensors[ sensorID ].sensedPosition.copyFrom(p);
	}

	//--------------------------------------------------
	this.setSensorActive = function( sensorID, active )
	{
		_sensors[ sensorID ].active = active;
	}
	
	//------------------------------------------
	this.getSensorIsActive = function( sensorID )
	{
		return _sensors[ sensorID ].active;
	}
	
	/*
	//-------------------------------------
	this.setSensingTarget = function(s)
	{
		_sensors[ SENSOR_TARGET ].active = s;
	}
	*/
	
	/*
	//-------------------------------------
	this.setSensingUp = function(s)
	{
		_sensors[ SENSOR_ZENITH ].active = s;
	}
	*/
	
	//------------------------
	this.update = function()
	{	    
	    _clock ++;
	    
	    //------------------------
	    // handle timerDelta
	    //------------------------
		if ( _moving )
		{
			_timerDelta += 0.002;

			if ( _timerDelta > ONE )
			{
				_timerDelta = ONE;
			}
		}
		else
		{
			_timerDelta -= 0.002;

			if ( _timerDelta < ZERO )
			{
				_timerDelta = ZERO;
			}
		}
			
		_timer += _timerDelta;	

	    //-------------------------------------------------------------
	    // this is an initial dampening of spring dynamics and forces,
	    // meant to ease the birthing of the creature in the world.
	    //-------------------------------------------------------------
		_rampup = ZERO;
		
		if ( _clock > RAMPUP_START_TIME )
		{
			if ( _clock < ( RAMPUP_START_TIME + RAMPUP_DURATION ) )
			{
				_rampup = ( _clock - RAMPUP_START_TIME ) / RAMPUP_DURATION;
			}
			else 
			{
				_rampup = ONE;
			}
		}
		
	    //------------------------------------
		// calculate sensor stuff...
	    //------------------------------------
	    /*
		if ( _sensors[ SENSOR_TARGET ].active )
		{
			let directionToTarget = new Vector3D();
		
			directionToTarget.setToDifference( _sensors[ SENSOR_TARGET ].sensedPosition, _centroid );
			directionToTarget.normalize();

			let dot = directionToTarget.dotWith( _springs[ _sensors[ SENSOR_TARGET ].springID ].direction );
		
			_sensors[ SENSOR_TARGET ].value = _sensors[ SENSOR_TARGET ].value * _sensors[ SENSOR_TARGET ].smoothing + dot * ( ONE - _sensors[ SENSOR_TARGET ].smoothing );	
		}
		else
		{
			_sensors[ SENSOR_TARGET ].value = ZERO;
		}
	
		if ( _sensors[ SENSOR_ZENITH0 ].active )
		{
			let directionToTarget = new Vector3D();
		
			directionToTarget.setToDifference( _sensors[ SENSOR_ZENITH0 ].sensedPosition, _centroid );
			directionToTarget.normalize();

			let dot = directionToTarget.dotWith( _springs[ _sensors[ SENSOR_ZENITH0 ].springID ].direction );		
			_sensors[ SENSOR_ZENITH0 ].value = _sensors[ SENSOR_ZENITH0 ].value * _sensors[ SENSOR_ZENITH0 ].smoothing + dot * ( ONE - _sensors[ SENSOR_ZENITH0 ].smoothing );	
		}
		else
		{
			_sensors[ SENSOR_ZENITH0 ].value = ZERO;
		}	
		*/
		
		for (let s=0; s<NUM_SENSORS; s++ )
		{
			if ( _sensors[s].active )
			{
			
//console.log( "sensor " + s );			
			
				//let directionToTarget = new Vector3D();
		
				_directionToTarget.setToDifference( _sensors[s].sensedPosition, _centroid );
				_directionToTarget.normalize();

				let dot = _directionToTarget.dotWith( _springs[ _sensors[s].springID ].direction );
		
				_sensors[s].value = _sensors[s].value * _sensors[s].smoothing + dot * ( ONE - _sensors[s].smoothing );	
			}
			else
			{
				_sensors[s].value = ZERO;
			}
		}	
		
	    //------------------------------------
	    // update spring forces
	    //------------------------------------
		this.updateSpringForces();        
        
	    //-------------------------------
	    // update balls
	    //-------------------------------
	    for (let b=0; b<_numBalls; b++)
        {
        	_balls[b].update();
			
            //-----------------------------------     
            // apply initial rampup           
            //-----------------------------------
			_balls[b].velocity.scale( _rampup );

            //------------------------------
            // ground collisions           
            //------------------------------    
			this.updateGroundCollisions(b); 
		}	
		
		//-------------------------
		// calculate centroid
		//-------------------------
		this.calculateCentroid();
    }
    
	//----------------------------------------
	this.updateGroundCollisions = function(b)
	{	    
		if ( ( _balls[b].position.y - _balls[b].radius ) < world.getHeightAtPosition( _balls[b].position )  )
		{	
			//------------------------------------------------------------------
			// apply vertical collision bounce reflection and vertical drag...
			//------------------------------------------------------------------
			let penetration = world.getHeightAtPosition( _balls[b].position )  - ( _balls[b].position.y - _balls[b].radius );
			_balls[b].velocity.y += penetration;
			_balls[b].velocity.y *= ( ONE - VERT_GROUND_DRAG  );
			
			//-----------------------------------------------------
			// apply ground drag
			//-----------------------------------------------------		
			//_balls[b].velocity.x *= ( ONE - HORIZ_GROUND_DRAG );
			//_balls[b].velocity.z *= ( ONE - HORIZ_GROUND_DRAG );

			//-----------------------------------------------------
			// apply ground friction (allows static friction)
			//-----------------------------------------------------		
			let horizSpeed = Math.sqrt( _balls[b].velocity.x * _balls[b].velocity.x + _balls[b].velocity.z * _balls[b].velocity.z );

			if ( horizSpeed < HORIZ_GROUND_FRICTION )
			{
				_balls[b].velocity.x = ZERO;
				_balls[b].velocity.z = ZERO;
			}
			else
			{
				_balls[b].velocity.x -= _balls[b].velocity.x * HORIZ_GROUND_FRICTION;
				_balls[b].velocity.z -= _balls[b].velocity.z * HORIZ_GROUND_FRICTION;
			}
			
			
			if ( _balls[b].isAFoot )
			{
				if ( _numFootprints < MAX_FOOTPRINTS - 1 )
				{
					//----------------------------------------------------------------
					// store the foot position and foot index in an array..
					//----------------------------------------------------------------

					// store the new footfall position...
					_vectorUtility.copyFrom( _balls[b].position );
					
					//------------------------------------------------------------------------------
					// check to see if no existing footprint is too close to this new position....
					//------------------------------------------------------------------------------
					let thereIsRoomForANewFootprint = true;
					
					for (let f=0; f<_numFootprints; f++)
					{
						let distanceSquared = _vectorUtility.getDistanceSquaredTo( _footprints[f].position );
						if ( distanceSquared < 0.02 )
						{
							thereIsRoomForANewFootprint = false;
							break;
						}
					}
					
					//--------------------------------------------------------------------------------------
					// If there is room, go ahead and create a new footprint and add it to the array...
					//--------------------------------------------------------------------------------------
					if ( thereIsRoomForANewFootprint )
					{					
						_footprints[ _numFootprints ].position.copyFrom( _balls[b].position );
						_footprints[ _numFootprints ].position.y = world.getHeightAtPosition( _balls[b].position );
						_footprints[ _numFootprints ].index = b;

						_numFootprints ++;
					}
				}
			}
			else
			{
				//----------------------------------------------------------------
				// if a "non-foot" collides with the ground, set
				// _durationUpright to _clock and note that the creature fell.
				//----------------------------------------------------------------
				_fell = true;
				_durationUpright = _clock;
this.stopAllMotion();
			}
		}
	}    
	
	//----------------------
	this.fell = function()
	{
		return _fell;
	}

	//------------------------------------
	// calculate centroid
	//------------------------------------
	this.calculateCentroid = function()
	{
	    _centroid.clear();
	    
	    for (let b=0; b<_numBalls; b++)
        {
			_centroid.add( _balls[b].position );
		}
	
		_centroid.scale( ONE / _numBalls );
	}   
	
	//-------------------------------------
	this.updateSpringForces = function()
	{	    	
        for (let s=0; s<_numSprings; s++)
        {
            //--------------------------------------------------------------- 
            // get the current length and direction of the spring
            //---------------------------------------------------------------
            _springs[s].direction.setToDifference( _balls[ _springs[s].ball0 ].position, _balls[ _springs[s].ball1 ].position );            
            let currentLength = _springs[s].direction.getMagnitude();
            _springs[s].direction.scale( ONE / currentLength );

            //-------------------------------------------------------------------------------- 
            // adjust spring currentLength with motor control oscillations
            //--------------------------------------------------------------------------------  
			let adjustedIdealLength = _springs[s].idealLength;
			
            if ( _springs[s].active )
            {       
				//let amp   = _springs[s].walkAmp 	+ _springs[s].turnAmp   * _sensors[ SENSOR_TARGET ].value + _springs[s].up0Amp   * _sensors[ SENSOR_ZENITH0 ].value;
				//let phase = _springs[s].walkPhase	+ _springs[s].turnPhase * _sensors[ SENSOR_TARGET ].value + _springs[s].up0Phase * _sensors[ SENSOR_ZENITH0 ].value;		
				
				let amp   = _springs[s].walkAmp;
				let phase = _springs[s].walkPhase;

 				amp   += _springs[s].turnAmp   * _sensors[ SENSOR_TARGET ].value;
				phase += _springs[s].turnPhase * _sensors[ SENSOR_TARGET ].value;	
 				
 				amp   += _springs[s].up0Amp   * _sensors[ SENSOR_ZENITH0 ].value;
 				phase += _springs[s].up0Phase * _sensors[ SENSOR_ZENITH0 ].value;		
 				
				amp   += _springs[s].up1Amp   * _sensors[ SENSOR_ZENITH1 ].value;
				phase += _springs[s].up1Phase * _sensors[ SENSOR_ZENITH1 ].value;		 
		
				let radian = ( ( _timer * _phenotype.frequency ) + phase ) * Math.PI * 2;
				adjustedIdealLength += ( amp * _springs[s].idealLength ) * Math.sin( radian ) * _rampup;
			}

            //------------------------------------------------------------------
            // update the array of spring lengths for the motor control graph 
            //------------------------------------------------------------------
			if ( _clock % 10 === 0 )
            {
				for (let l=1; l<SPRING_LENGTH_ARRAY_SIZE; l++)
				{
					_springs[s].restLengths[ l - 1 ] = _springs[s].restLengths[ l ];
					_springs[s].trueLengths[ l - 1 ] = _springs[s].trueLengths[ l ];
				}

				_springs[s].restLengths[ SPRING_LENGTH_ARRAY_SIZE - 1 ] = adjustedIdealLength - _springs[s].idealLength;
				_springs[s].trueLengths[ SPRING_LENGTH_ARRAY_SIZE - 1 ] = 
				_balls[ _springs[s].ball0 ].position.getDistanceTo(  _balls[ _springs[s].ball1 ].position ) - _springs[s].idealLength;
			}
			
			_springLengthIndex ++;				
			if ( _springLengthIndex > SPRING_LENGTH_ARRAY_SIZE - 1 )
			{
				_springLengthIndex = SPRING_LENGTH_ARRAY_SIZE - 1;
			}

            //------------------------------------------------------------------------------------------
            // gather spring force
            //------------------------------------------------------------------------------------------
			let accelerationForce = ( currentLength - adjustedIdealLength ) * _phenotype.springTension;
            				
            //--------------------------------------------------------------- 
            // accumulate force (to be used in fitness function)
            //---------------------------------------------------------------
			_accumSpringForce += Math.abs( accelerationForce );
            
            _balls[ _springs[s].ball0 ].velocity.addScaled( _springs[s].direction, -accelerationForce );
            _balls[ _springs[s].ball1 ].velocity.addScaled( _springs[s].direction,  accelerationForce );
	    }
	}
    
	//--------------------------------
	this.getPosition = function()
	{
		return _centroid;
	}    
	
	//--------------------------------------------
	this.getAccumulatedSpringForce = function()
	{
		return _accumSpringForce;
	}    
	
	//----------------------------------
	this.getDurationUpright = function()
	{
		//--------------------------------------------
		// If the creature has not fallen, then 
		// set _durationUpright to the curent time.
		//--------------------------------------------
		if ( !_fell )
		{
			_durationUpright = _clock;
		}
	
		return _durationUpright;
	}    
	
	//-------------------------------------------------
	this.calculateFaceCentroidAndNormal = function(f)
	{	
		//-----------------------------
		// calculate centroid
		//-----------------------------
		
		//console.log( "calculateFaceCentroidAndNormal: " + _balls[ _faces[f].v0 ].position.x + ", " + _balls[ _faces[f].v0 ].position.y + ", " + _balls[ _faces[f].v0 ].position.z );
		
		
		_faces[f].centroid.clear();
		_faces[f].centroid.add( _balls[ _faces[f].v0 ].position );
		_faces[f].centroid.add( _balls[ _faces[f].v1 ].position );
		_faces[f].centroid.add( _balls[ _faces[f].v2 ].position );
		_faces[f].centroid.scale( 0.33333 );
		
//console.log( "calculateFaceCentroidAndNormal: " + _faces[f].centroid.x + ", " + _faces[f].centroid.y + ", " + _faces[f].centroid.z );

		//-----------------------------
		// calculate surface normal
		//-----------------------------
		let v1x = _balls[ _faces[f].v1 ].position.x - _balls[ _faces[f].v0 ].position.x;
		let v1y = _balls[ _faces[f].v1 ].position.y - _balls[ _faces[f].v0 ].position.y;
		let v1z = _balls[ _faces[f].v1 ].position.z - _balls[ _faces[f].v0 ].position.z;

		let v2x = _balls[ _faces[f].v2 ].position.x - _balls[ _faces[f].v0 ].position.x;
		let v2y = _balls[ _faces[f].v2 ].position.y - _balls[ _faces[f].v0 ].position.y;
		let v2z = _balls[ _faces[f].v2 ].position.z - _balls[ _faces[f].v0 ].position.z;

		_faces[f].normal.x = v1y * v2z - v1z * v2y;
		_faces[f].normal.y = v1z * v2x - v1x * v2z;
		_faces[f].normal.z = v1x * v2y - v1y * v2x;
		
		let length = _faces[f].normal.getMagnitude(); 
		
		if ( length > ZERO )
		{
			_faces[f].normal.scale( ONE / length );
		}
		else
		{
			_faces[f].normal.setXYZ( ONE, ZERO, ZERO );
		}
	}
	

	//---------------------------
	this.render = function()
	{
		//----------------------
		// render the shadow
		//----------------------
		if ( RENDER_SHADOW )
		{
			let res   =  10;
			let start = -1.0
			let end   =  0.8;
			let opacity = 0.02;
			for (let s=0; s<res; s++)
			{
				this.renderShadow( start + s/res * ( end - start ), opacity );
			}
		}
		
	    //---------------------------------
	    // render footprints
	    //---------------------------------
	    if ( RENDER_FOOTPRINTS )
	    {
			this.renderFootprints();		
		}
					
	    //---------------------------------
	    // render the springs
	    //---------------------------------
        for (let s=0; s<_numSprings; s++)
        {
			this.renderSpring(s);
        }
        
	    //----------------------
	    // render the centroid
	    //----------------------
	    if ( RENDER_CENTROID )
	    {
			this.renderCentroid();
    	}
    	    
	    //------------------------------
	    // render the balls
	    //------------------------------
        for (let b=0; b<_numBalls; b++)
        {       
            this.renderBall(b);
        }

	    //------------------------------
	    // render the grab handle
	    //------------------------------
	    if ( _grab.visible )
	    {
			if ( !_grab.active )
    		{
    	        this.renderGrabHandle();
    		}
    	}
    	
    	if ( _grab.active )
    	{
			canvas.beginPath();

        	_drawPos = camera.project  ( _balls[ _grab.ballID ].position );
			_drawRad = camera.getRadius( _balls[ _grab.ballID ].position, GRAB_RADIUS * 0.3 );            
			canvas.moveTo( _drawPos.x, _drawPos.y );

        	_drawPos = camera.project  ( _grab.mousePos );
			canvas.lineTo( _drawPos.x, _drawPos.y );
			canvas.stroke();
			canvas.closePath();    	
			
			canvas.lineWidth = 2;
			canvas.strokeStyle = "rgb( 100, 0, 0 )";
		
			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
			canvas.stroke();
			canvas.closePath();				
    	}
    	    
	    //---------------------------------
	    // sort faces for render order
	    //---------------------------------
	    this.sortFacesByViewDistance();
		
	    //---------------------------------
	    // render the faces
	    //---------------------------------
	    for (let f=0; f<_numFaces; f++)
	    {
			this.calculateFaceCentroidAndNormal(f);
		    this.renderFace(f);
		}
	}
	
	//-----------------------------------------
	this.sortFacesByViewDistance = function()
	{
		//1. get all view distances
		//2. sort them and recalculate "renderOrder"
		//3. When displaying the faces, use renderOrder for the loop
		
		/*
		// not working yet!	
	 	for (let f=0; f<_numFaces; f++)
	 	{
			// Last f elements are already in place 
			for (let j=0; j<( _numFaces - f - 1 ); j++ )
			{      
				// Checking if the item at present iteration
				// is greater than the next iteration
				if ( _faces[j].viewDistance > _faces[j+1].viewDistance )
				{
					// If the condition is true then swap them
					let temp = _faces[j].viewDistance;
					_faces[j].viewDistance = _faces[j+1].viewDistance;
					_faces[j+1].viewDistance = temp;
     			}
   			}
		}
		*/
		
	}
	

	//----------------------------------
	this.renderFootprints = function()
	{
		for (let f=0; f<_numFootprints; f++)
		{
			_drawPos = camera.project( _footprints[f].position );

			let mod = 3;
			let alpha = 0.5;
				 if ( _footprints[f].index % mod === 0 ) { canvas.fillStyle = "rgba( 100,   0,   0, " + alpha + " )"; }
			else if ( _footprints[f].index % mod === 1 ) { canvas.fillStyle = "rgba(   0, 100,   0, " + alpha + " )"; }
			else 										 { canvas.fillStyle = "rgba(   0,   0, 100, " + alpha + " )"; }

			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, 4, 0, Math.PI*2, false );
			canvas.fill();
			canvas.closePath();	
		}
	}
	
	//------------------------------
	this.renderFace = function(f)
	{
		_vectorUtility.copyFrom( _faces[f].centroid );
		_vectorUtility.subtract( camera.getPosition() );
		
		let dot = _vectorUtility.dotWith( _faces[f].normal );
//if ( dot < 0.1 )
		{
			// use light source for shading...
			_vectorUtility.setToDifference( _lightPosition, _faces[f].centroid );
			_vectorUtility.normalize();
			
			let lightDot = _vectorUtility.dotWith( _faces[f].normal );
			let d = ONE_HALF + lightDot * ONE_HALF;
			//d = Math.sqrt(d);			
			
			let red   =  0 + Math.floor( d * 255 );
			let green =  0 + Math.floor( d * 225 );
			let blue  = 30 + Math.floor( d * 170 );
			canvas.fillStyle = "rgba( " + red + ", " + green + ", " + blue + ", " + FACE_OPACITY + " )";

/*
if ( f === 0 ) { canvas.fillStyle = "rgb( 200,   0,   0 )"; }
if ( f === 1 ) { canvas.fillStyle = "rgb(   0, 200,   0 )"; }
if ( f === 2 ) { canvas.fillStyle = "rgb(   0,   0, 200 )"; }
if ( f === 3 ) { canvas.fillStyle = "rgb( 200,   0,   0 )"; }
*/
			
	    	
			canvas.beginPath();

			_drawPos = camera.project( _balls[ _faces[f].v0 ].position );
			canvas.moveTo( _drawPos.x, _drawPos.y );

			_drawPos = camera.project( _balls[ _faces[f].v1 ].position );
			canvas.lineTo( _drawPos.x, _drawPos.y );
		
			_drawPos = camera.project( _balls[ _faces[f].v2 ].position );
			canvas.lineTo( _drawPos.x, _drawPos.y );

			canvas.closePath();
			canvas.fill();	
		}   
		
		//-----------------------------------------------------
		// render the surfaceNormal on the face's centroid
		//-----------------------------------------------------
		if ( RENDER_SURFACE_NORMALS )
		{
			// "norm end"
			//let normEnd = new Vector3D();
			_vectorUtility.copyFrom( _faces[f].centroid );
			_vectorUtility.addScaled( _faces[f].normal, 0.4 );

			canvas.lineWidth = 1;
			canvas.strokeStyle = "rgb( 0, 0, 0 )";

			canvas.beginPath();

			_drawPos = camera.project( _faces[f].centroid );
			canvas.moveTo( _drawPos.x, _drawPos.y );

			_drawPos = camera.project( _vectorUtility );
			canvas.lineTo( _drawPos.x, _drawPos.y );

			canvas.closePath();
			canvas.stroke(); 
			
			canvas.fillStyle = "rgb( 100, 0, 150 )";		
			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, 3, 0, Math.PI*2, false );
			canvas.fill();
			canvas.closePath();	
		}
	}

	//-------------------------------
	this.renderCentroid = function()
	{
        _drawPos = camera.project  ( _centroid );
        _drawRad = camera.getRadius( _centroid, 0.07 );            
              
		if ( _fell )
		{
			canvas.fillStyle   = "rgb( 0, 0, 0 )";
			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
			canvas.fill();
			canvas.closePath();	

	        canvas.lineWidth = 3;
			let xSize = _drawRad * ONE_HALF;
			canvas.strokeStyle   = "rgb( 255, 255, 255 )";
			
	        canvas.beginPath();
			canvas.moveTo( _drawPos.x - xSize, _drawPos.y - xSize );
			canvas.lineTo( _drawPos.x + xSize, _drawPos.y + xSize );
			canvas.stroke();
	        canvas.closePath();
	        	
	        canvas.beginPath();
			canvas.moveTo( _drawPos.x - xSize, _drawPos.y + xSize );
			canvas.lineTo( _drawPos.x + xSize, _drawPos.y - xSize );
			canvas.stroke();
			canvas.stroke();
	        canvas.closePath();
		}
		else
		{
			canvas.fillStyle   = "rgba( 100, 0, 0, 0.5 )";
			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
			canvas.fill();
			canvas.closePath();	
		}
	}
	
	//------------------------------------------------------
	this.renderShadow = function( expandAmount, opacity )
	{
        canvas.fillStyle = "rgba( 0, 0, 0, " + opacity + " )";

		//-------------------------------
		// draw shadow of faces 0,1,2
		//-------------------------------
		canvas.beginPath();

		_vectorUtility.copyFrom( _balls[0].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[0].position ) ;
		if ( _balls[0].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[0].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.moveTo( _drawPos.x, _drawPos.y );

		
		_vectorUtility.copyFrom( _balls[1].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[1].position ) ;
		if ( _balls[1].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[1].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[2].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[2].position ) ;
		if ( _balls[2].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[2].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );
		
		canvas.closePath();
		canvas.fill();	

		
		//-------------------------------
		// draw shadow of face 1,2,3
		//-------------------------------
		canvas.beginPath();

		_vectorUtility.copyFrom( _balls[1].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[1].position ) ;
		if ( _balls[1].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[1].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.moveTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[2].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[2].position ) ;
		if ( _balls[2].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[2].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[3].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[3].position ) ;
		if ( _balls[3].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[3].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );
		
		canvas.closePath();
		canvas.fill();	
	

	
		//-------------------------------
		// draw shadow of face 2,3,0
		//-------------------------------
		canvas.beginPath();

		_vectorUtility.copyFrom( _balls[2].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[2].position ) ;
		if ( _balls[2].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[2].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.moveTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[3].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[3].position ) ;
		if ( _balls[3].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[3].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[0].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[0].position ) ;
		if ( _balls[0].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[0].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );
		
		canvas.closePath();
		canvas.fill();	
		
		
		//-------------------------------
		// draw shadow of face 1,3,0
		//-------------------------------
		canvas.beginPath();

		_vectorUtility.copyFrom( _balls[1].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[1].position ) ;
		if ( _balls[1].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[1].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.moveTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[3].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[3].position ) ;
		if ( _balls[3].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[3].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		_vectorUtility.copyFrom( _balls[0].position );
		_shadowExpand.setToDifference( _vectorUtility, _centroid );
		_vectorUtility.addScaled( _shadowExpand, expandAmount );
		_vectorUtility.y = world.getHeightAtPosition( _balls[0].position ) ;
		if ( _balls[0].position.y < _vectorUtility.y ) { _vectorUtility.y = _balls[0].position.y; }
        _drawPos = camera.project( _vectorUtility );
		canvas.lineTo( _drawPos.x, _drawPos.y );
		
		canvas.closePath();
		canvas.fill();	
	}

	//--------------------------------
	this.renderSpring = function(s)
	{
        let b0 = _springs[s].ball0;
        let b1 = _springs[s].ball1;
        
		//-----------------------------------
		// show spring...
		//-----------------------------------
        canvas.beginPath();
        canvas.lineWidth   = 2;
        canvas.strokeStyle = "rgb( 80, 80, 80 )";
        
        if ( !_springs[s].active )
        {
			canvas.lineWidth   = 2;
			canvas.strokeStyle = "rgb( 100, 120, 255 )";
        }
        
        _drawPos = camera.project( _balls[ b0 ].position );
        canvas.moveTo( _drawPos.x, _drawPos.y );
        
        let xx = _drawPos.x;
        let yy = _drawPos.y;

        _drawPos = camera.project( _balls[ b1 ].position );
        canvas.lineTo( _drawPos.x, _drawPos.y );
        canvas.closePath();
        canvas.stroke(); 
        
        let xMid = xx + ( _drawPos.x - xx ) * ONE_HALF;
        let yMid = yy + ( _drawPos.y - yy ) * ONE_HALF;
        
		//-----------------------------------
		// show sensor info...
		//-----------------------------------
if ( RENDER_SENSORS )
{		
		
		if (( _sensors[ SENSOR_TARGET ].active )
		&&  ( s === _sensors[ SENSOR_TARGET ].springID ))
		{
			canvas.beginPath();
			canvas.lineWidth = SPRING_WIDTH * 3;
			canvas.strokeStyle = "rgba( 200, 0, 0, 0.5 )";
			_drawPos = camera.project( _balls[ b0 ].position );
			canvas.moveTo( _drawPos.x, _drawPos.y );
		
			let xx = _drawPos.x;
			let yy = _drawPos.y;

			_drawPos = camera.project( _balls[ b1 ].position );
			canvas.lineTo( _drawPos.x, _drawPos.y );
			canvas.closePath();
			canvas.stroke(); 
			
			//-----------------------------------
			// show target sensor value...
			//-----------------------------------
	        if ( RENDER_SENSOR_VALUE )
    	    {	
				canvas.lineWidth = 4;
				canvas.strokeStyle   = "rgb( 255, 255, 100 )";
				canvas.beginPath();
				canvas.moveTo( xMid, yMid );
				canvas.lineTo( xMid, yMid + _sensors[ SENSOR_TARGET ].value * 40 );
				canvas.stroke();
				canvas.closePath();
			}
						
			if ( RENDER_TARGET_LINE )
			{
				canvas.strokeStyle = "rgba( 100, 150, 200, 0.4 )";
				canvas.beginPath();

				_drawPos = camera.project( _centroid );
				canvas.moveTo( _drawPos.x, _drawPos.y );
			
				_drawPos = camera.project( _sensors[ SENSOR_TARGET ].sensedPosition );
				canvas.lineTo( _drawPos.x, _drawPos.y );
				canvas.stroke(); 
				canvas.closePath();				
			}
		}		

		if (( _sensors[ SENSOR_ZENITH0 ].active )
		&&  ( s === _sensors[ SENSOR_ZENITH0 ].springID ))
		{
			canvas.beginPath();
			canvas.lineWidth = SPRING_WIDTH * 3;
			canvas.strokeStyle = "rgba( 0, 255, 0, 0.5 )";
			_drawPos = camera.project( _balls[ b0 ].position );
			canvas.moveTo( _drawPos.x, _drawPos.y );
		
			let xx = _drawPos.x;
			let yy = _drawPos.y;

			_drawPos = camera.project( _balls[ b1 ].position );
			canvas.lineTo( _drawPos.x, _drawPos.y );
			canvas.closePath();
			canvas.stroke(); 
			
			//-----------------------------------
			// show upright sensor value...
			//-----------------------------------
	        if ( RENDER_SENSOR_VALUE )
    	    {	
				canvas.lineWidth = 4;
				canvas.strokeStyle   = "rgb( 100, 100, 255 )";
				canvas.beginPath();
				canvas.moveTo( xMid, yMid );
				canvas.lineTo( xMid, yMid + _sensors[ SENSOR_ZENITH0 ].value * 40 );
				canvas.stroke();
				canvas.closePath();
			}
		}		

		if (( _sensors[ SENSOR_ZENITH1 ].active )
		&&  ( s === _sensors[ SENSOR_ZENITH1 ].springID ))
		{
			canvas.beginPath();
			canvas.lineWidth = SPRING_WIDTH * 3;
			canvas.strokeStyle = "rgba( 0, 100, 255, 0.5 )";
			_drawPos = camera.project( _balls[ b0 ].position );
			canvas.moveTo( _drawPos.x, _drawPos.y );
		
			let xx = _drawPos.x;
			let yy = _drawPos.y;

			_drawPos = camera.project( _balls[ b1 ].position );
			canvas.lineTo( _drawPos.x, _drawPos.y );
			canvas.closePath();
			canvas.stroke(); 
			
			//-----------------------------------
			// show upright sensor value...
			//-----------------------------------
	        if ( RENDER_SENSOR_VALUE )
    	    {	
				canvas.lineWidth = 4;
				canvas.strokeStyle   = "rgb( 100, 0, 255 )";
				canvas.beginPath();
				canvas.moveTo( xMid, yMid );
				canvas.lineTo( xMid, yMid + _sensors[ SENSOR_ZENITH1 ].value * 40 );
				canvas.stroke();
				canvas.closePath();
			}		
		}
}		
		        
        if ( RENDER_SPRING_INDICES )
        {
			canvas.fillStyle = "rgb( 0, 0, 0 )";
			canvas.fillText( s, xMid, yMid );			
		}	
	}

	//-----------------------------
	this.renderBall = function(b)
	{
        _drawPos = camera.project  ( _balls[b].position );
        _drawRad = camera.getRadius( _balls[b].position, _balls[b].radius );            
        
    	canvas.lineWidth = 2;
        canvas.strokeStyle = "rgba( 0, 0, 0, 0.4 )";
        canvas.fillStyle   = BALL_COLOR;
        
        canvas.beginPath();
        canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
        canvas.fill();
        //canvas.stroke();
        canvas.closePath();	
                
        if ( RENDER_POINT_INDECES )
        {
			canvas.fillStyle = "rgb( 0, 0, 0 )";
			canvas.fillText( b, _drawPos.x, _drawPos.y );	
		}
				
		if ( RENDER_FEET )
        {
			if ( _balls[b].isAFoot )
			{
				canvas.strokeStyle = "rgb( 255, 0, 0 )";		
				canvas.beginPath();
				canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
				canvas.stroke();
				canvas.closePath();	
			}			
		}
	}
		
	//----------------------------------
	this.renderGrabHandle = function()
	{
        _drawPos = camera.project  ( _balls[ _grab.ballID ].position );
        
        if ( _grab.active )
        {
	        _drawRad = camera.getRadius( _balls[ _grab.ballID ].position, GRAB_RADIUS * 0.3 );            
    	}
        else
        {
	        _drawRad = camera.getRadius( _balls[ _grab.ballID ].position, GRAB_RADIUS );            
    	}
    	    
    	canvas.lineWidth = 2;
        canvas.strokeStyle = "rgb( 100, 0, 0 )";
        
        canvas.beginPath();
        canvas.arc( _drawPos.x, _drawPos.y, _drawRad, 0, Math.PI*2, false );
        canvas.stroke();
        canvas.closePath();	
	}
	
	//-----------------------------------------------------------------
	this.renderMotorControlData = function( left, top, width, height )
	{
		let waveScale = 50;
		
		canvas.fillStyle = "rgb( 250, 245, 240 )";
		canvas.fillRect( left, top, width, height );
		canvas.lineWidth = 1;
		canvas.strokeStyle = "rgb( 0, 0, 0 )";
		canvas.strokeRect( left, top, width, height );

		for (let s=0; s<_numSprings; s++)
		{
			canvas.strokeStyle = "rgb( 0, 0, 0 )";
			canvas.lineWidth = 2;
			
			
if ( ( s > 5 ) && ( s < 9 ) )
{
	canvas.strokeStyle   = "rgba( 0, 50, 200, 0.6 )";
	canvas.lineWidth = 4;
}
else if ( ( s > 8 ) && ( s < 12 ) )
{
	canvas.strokeStyle   = "rgba( 10, 150, 0, 0.6 )";
	canvas.lineWidth = 4;
}

			
			canvas.beginPath();
			canvas.moveTo( left, top );

			for (let l=0; l<SPRING_LENGTH_ARRAY_SIZE; l++)
			{
				let ylevel = ( ( s + 1 ) / ( _numSprings + 1 ) ) * height;

				let x = left + l / ( SPRING_LENGTH_ARRAY_SIZE - 1 ) * width;
				let y = top + ylevel + _springs[s].restLengths[l] * waveScale;
				canvas.lineTo( x, y );
	    	}
				
			canvas.stroke();
			canvas.closePath();
		}		
		
		
		
		for (let s=0; s<_numSprings; s++)
		{
			canvas.strokeStyle   = "rgba( 150, 30, 0, 0.8 )";
			canvas.beginPath();
			canvas.moveTo( left, top );

			for (let l=0; l<SPRING_LENGTH_ARRAY_SIZE; l++)
			{
				let ylevel = ( ( s + 1 ) / ( _numSprings + 1 ) ) * height;

				let x = left + l / ( SPRING_LENGTH_ARRAY_SIZE - 1 ) * width;
				let y = top + ylevel + _springs[s].trueLengths[l] * waveScale;
				canvas.lineTo( x, y );
	    	}
				
			canvas.stroke();
			canvas.closePath();
		}	
	}		
}

