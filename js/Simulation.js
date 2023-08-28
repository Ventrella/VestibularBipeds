"use strict";

//----------------------------
// global things
//----------------------------
const MAIN_PANEL_WIDTH  = 370;
const GRAB_RADIUS		= 0.5;

var camera = new Camera();
var world  = new World();

//----------------------
function Vestibular()
{
    //----------------------------------
    // test modes
    //----------------------------------
	const TEST_MODE_NULL	  	= -1;
	const TEST_MODE_DISTANCE	=  0;
	const TEST_MODE_TARGET		=  1;
	const NUM_TEST_MODES		=  2;

    //----------------------------------
    // run modes
    //----------------------------------
	const RUN_MODE_NULL	  	= -1;
	const RUN_MODE_EVOLVE	=  0;
	const RUN_MODE_MOST_FIT	=  1;
	const RUN_MODE_PRESET	=  2;
	const NUM_RUN_MODES		=  3;

    //-----------------------------------------
    // important parameters
    //-----------------------------------------
	const USING_ZENITH_SENSOR_0		= true;
	const USING_ZENITH_SENSOR_1		= false;
	const USING_ZENITH_SENSOR_2		= false;
	const USING_TARGET_SENSOR		= true;
    const NUM_GA_ITERATIONS			= 20000;
    const NUM_CREATURES 			= 100;
	const MAX_GENES 				= 400;		
    const SIMULATION_DURATION		= 20000;
    const MUTATION_RATE 			= 0.05;
    const CROSSOVER_RATE 			= 0.1;
	const FITNESS_DECREASE 			= -0.0001;
	const TOURNAMENT_NUMBER  		= 5;
    const MAX_FITNESS_DISTANCE		= 50; //arbitrary fudge to kinda normalize the distance measure 
	const SPRING_FORCE_PENALTY		= 1;//0.1;//0.0005;
    
    //-------------------------------------
    // graphics and animation
    //-------------------------------------
	const MIN_TIME_STEP_MULT	  	= 4;
	const MAX_TIME_STEP_MULT	  	= 2000;
	const MILLISECONDS_PER_UPDATE 	= 1;
	const CAMERA_TARGET_DISTANCE  	= 20;
	const CAMERA_TARGET_HEIGHT    	= 2;
	const CAMERA_BIRDS_EYE_VIEW		= false;
    const REVOLVE_CAMERA		  	= false;
    const SHOW_FITNESS_GRAPH 	  	= true;
    const SHOW_SIM_DEETS 	  		= true;
    const SHOW_MOTOR_CONTROL 	  	= false;
    const SHOW_FITNESS_BARS 	  	= false;
    const SHOW_GENE_PLOT 	  		= false;
	const EXTRA_TIME_BUFFER			= 1000;
	const FITNESS_GRAPH_RES			= 200;
    const CONTROL_WIDTH 			= 370;
    const BACKGROUND_COLOR 		  	= "rgb( 255, 255, 255 )";
    const DIST_FITNESS_COLOR		= "rgba(   0,  20, 200, 0.7 )";
    const UP_FITNESS_COLOR			= "rgba(  10, 150,   0, 0.7 )";
    const ENERGY_FITNESS_COLOR		= "rgba( 200,  50,  50, 0.7 )";
    const TOTAL_FITNESS_COLOR		= "rgba(   0,   0,   0, 0.7 )";
    const HIGH_FITNESS_COLOR		= "rgba( 130, 130, 130, 0.7 )";
    
    const BUTTON_BORDER_COLOR_NORMAL = '#000000';   
    const BUTTON_BORDER_COLOR_ACTIVE = '#3399ff';   

    //------------------------------------
    // local variables
    //------------------------------------
	function CreatureFitness()
	{
		this.distance	= ZERO;
		this.upright 	= ZERO;
		this.energy		= ZERO;
		this.total 		= ZERO;
	}    

    let _runningSimulation		= false;
    let _savedGenes				= false;
    let _renderScene			= false;
	let _audioStarted			= false;    
	let _averageDistFitness		= ZERO;
	let _averageUpFitness		= ZERO;
	let _averageEnergyFitness	= ZERO;
	let _averageTotalFitness    = ZERO;
	let _highestFitness    		= ZERO;
	let _accumDistToTarget  	= ZERO;
	let _grabDistance			= ZERO;
	let _currentCreature		= 0;
	let _clock					= 0;
	let _currentGAIteration		= 0;
	let _timeStepMultiplier 	= 0;
	let _simulationEndTime  	= 0;
	let _extraTimeBufferClock 	= 0;
	let _runMode				= RUN_MODE_NULL;
	let _testMode				= TEST_MODE_NULL;
	let _walkingType			= WALKING_TYPE_NULL;
	let _bodyTopology			= BODY_TOPOLOGY_NULL;
	let _creatures       		= new Array( NUM_CREATURES );
	let _creatureFitness       	= new Array( NUM_CREATURES );
	let _aveDistFitnessArray 	= new Array();
	let _aveUpFitnessArray 		= new Array();
	let _aveEnergyFitnessArray	= new Array();
	let _aveTotalFitnessArray  	= new Array();
	let _highFitnessArray   	= new Array();
	let _target			 		= new Target();
	let _vectorUtility 			= new Vector3D();
	let _initialPosition 		= new Vector3D();
	let _startPosition 			= new Vector3D();
	let _cameraPosition 		= new Vector3D();
	let _mouse3DPosition 		= new Vector3D();
    let _drawPos       			= new Vector2D();
	let _cameraOrientation 		= new Orientation();
	let _GA             		= new GA();
    let _synth           		= new Synthesizer();
    let _mouseX 				= 0;
    let _mouseY 				= 0;

	for (let c=0; c<NUM_CREATURES; c++)
	{
		_creatures[c] = new Creature();
		_creatureFitness[c] = new CreatureFitness();
	}

	//----------------------------
	this.initialize = function()
	{
		console.log( "initialize" );
		
		_timeStepMultiplier = MIN_TIME_STEP_MULT;

        //-----------------------
        // init world
        //-----------------------
        world.initialize();
        
        //-----------------------
        // init target
        //-----------------------
        _target.initialize();
        
        //------------------------------------------------------
        // default test mode, body type, and walking type...
        //------------------------------------------------------
		_testMode		= TEST_MODE_TARGET;
        _bodyTopology 	= BODY_TOPOLOGY_4_TET;	
		_walkingType 	= WALKING_TYPE_BIPED;
		
        //-------------------------------------
        // init creatures
        //-------------------------------------
        _initialPosition.y = 0;
		for (let c=0; c<NUM_CREATURES; c++)
		{
			this.initCreature(c);
    	}   

        //-------------------------------------
        // target mode
        //-------------------------------------
        if ( _testMode === TEST_MODE_TARGET )
        {
        	if ( USING_TARGET_SENSOR )
        	{
				for (let c=0; c<NUM_CREATURES; c++)
				{
					_creatures[c].setSensorActive( SENSOR_TARGET, true )
				}   
        	}
		}
		
        //----------------------------------------------------------
        // init GA
        //----------------------------------------------------------
        _GA.initialize				( NUM_CREATURES, MAX_GENES );
		_GA.setMutationRate			( MUTATION_RATE );
    	_GA.setCrossoverRate		( CROSSOVER_RATE );
		_GA.setFitnessOfPopulation	( ZERO );  
		
        //-------------------------------------------------------------
        // randomize population genes and create their phenotypes...
        //-------------------------------------------------------------
        _GA.randomizePopulationGenes();
		for (let c=0; c<NUM_CREATURES; c++)
		{
	        _creatures[c].generatePhenotype( _GA.getGenes(c) );
    	}
    	
    	_savedGenes = false;
    	
    	_renderScene = true;
    	
        //-----------------------
        // start simulation
        //-----------------------
		//this.startSimulation();    	    		
		
		this.resize();
		
		/*
		//-----------------------------------------------------		
		// set inputs and slider values to middle values...
		//-----------------------------------------------------	
		let normalizedSliderValue = ONE_HALF;
		
		this.setSliderNormalizedValue( "slider1", normalizedSliderValue );
		document.getElementById( "input1" ).value = normalizedSliderValue;

		this.setSliderNormalizedValue( "slider2", normalizedSliderValue );
		document.getElementById( "input2" ).value = normalizedSliderValue;

		this.setSliderNormalizedValue( "slider3", normalizedSliderValue );
		document.getElementById( "input3" ).value = normalizedSliderValue;
        
        //console.log( "slider1 changed: value = " + normalizedSliderValue );  
		*/
		
		this.loadPreset();

		this.updateButtonDisplay();		
		
//this.startEvolving();		
		
		//-----------------------------------------		
		// start animation thread...		
		//-----------------------------------------		
	    setTimeout( "vestibular.update()", 1 );
	 }
	
	//------------------------
	this.resize = function()
    {
        //console.log( "resize" );    
        
		canvasID.width  = window.innerWidth  - 10;
		canvasID.height = window.innerHeight - 10;
		
		camera.resizeViewport();
    }


	//----------------------------------
	this.startEvolving = function()
    {	      
		console.log( "start evolving" );

		//-----------------------
		// init world
		//-----------------------
		//world.initialize();

		//-----------------------
		// init target
		//-----------------------
		_target.initialize();

		//------------------------------------------------------
		// default test mode, body type, and walking type...
		//------------------------------------------------------
		_testMode = TEST_MODE_TARGET;
		//_bodyTopology 	= BODY_TOPOLOGY_3_TET;//BODY_TOPOLOGY_3_TET;		
		//_walkingType 	= WALKING_TYPE_TRIPED;//WALKING_TYPE_BIPED;

		//-------------------------------------
		// init creatures
		//-------------------------------------
		_initialPosition.y = 0;
		for (let c=0; c<NUM_CREATURES; c++)
		{
			this.initCreature(c);
		}   

		//-------------------------------------
		// target mode
		//-------------------------------------
		if ( _testMode === TEST_MODE_TARGET )
		{
			if ( USING_TARGET_SENSOR )
			{
				for (let c=0; c<NUM_CREATURES; c++)
				{
					_creatures[c].setSensorActive( SENSOR_TARGET, true )
				}   
			}
		}

		_GA.setFitnessOfPopulation	( ZERO );  

        _GA.randomizePopulationGenes();
        
		for (let c=0; c<NUM_CREATURES; c++)
		{
	        _creatures[c].generatePhenotype( _GA.getGenes(c) );
		}

		//-------------------------------------------------------------
		// randomize population genes and create their phenotypes...
		//-------------------------------------------------------------
		_GA.randomizePopulationGenes();
		for (let c=0; c<NUM_CREATURES; c++)
		{
			_creatures[c].generatePhenotype( _GA.getGenes(c) );
		}

		_savedGenes = false;

		_renderScene = true;		

		this.resize();

		this.loadPreset();

		this.updateButtonDisplay();		

		_runMode = RUN_MODE_EVOLVE;	

		_timeStepMultiplier = MAX_TIME_STEP_MULT;



// original...
    	/*
    	_runMode = RUN_MODE_EVOLVE;
    	
		_GA.setFitnessOfPopulation	( ZERO );  
		
        //-------------------------------------------------------------
        // randomize population genes and create their phenotypes...
        //-------------------------------------------------------------
        _GA.randomizePopulationGenes();
        
		for (let c=0; c<NUM_CREATURES; c++)
		{
	        _creatures[c].generatePhenotype( _GA.getGenes(c) );
    	}
    	
		_timeStepMultiplier = MAX_TIME_STEP_MULT;
    
    	_savedGenes = false;    
    	*/
    }



	//----------------------------------
	this.stopEvolving = function()
    {	     
		//console.log( "stopEvolving" );

		_currentCreature = _GA.getHighestFitIndividual();

		_timeStepMultiplier = MIN_TIME_STEP_MULT;
	
		if ( !_savedGenes )
		{
			_GA.printGenes( _currentCreature );	
			_savedGenes = true;	
		}
		
		console.log( "RUN_MODE_MOST_FIT" );

		_runMode = RUN_MODE_MOST_FIT;					

		//-----------------------------------------
		// start running the simulation
		//-----------------------------------------
		this.startSimulation();				
    } 




	//----------------------------------
	this.startSimulation = function()
    {	  
		//console.log( "start simulation" );

		_runningSimulation = true;
		_simulationEndTime = SIMULATION_DURATION;
		_extraTimeBufferClock = 0;
		_clock = 0;
		
		_startPosition.copyFrom( _creatures[ _currentCreature ].getPosition() );	
		
		_accumDistToTarget = ZERO;
	    
_vectorUtility.setXYZ( 0, 0, 1 );

// I think this is where I need to gather the heading as determined by the current body frame
		_creatures[ _currentCreature ].setPositionAndHeading( _initialPosition, _vectorUtility );

		if ( _testMode === TEST_MODE_TARGET )
		{
			_target.initialize();
		}
				
        //-----------------------
        // init camera
        //-----------------------
        camera.initialize();      
        
		_cameraPosition.setXYZ( ZERO, CAMERA_TARGET_HEIGHT, CAMERA_TARGET_DISTANCE );
        camera.setPosition( _cameraPosition );
        
		//console.log( "camera.setViewToTarget" );

		camera.setViewToTarget( _initialPosition, world.getUpDirection() );
    }    

	//------------------------
	this.update = function()
    {
    	//---------------------------------------------------------------------------------------------------
    	// determine whether to show the grab handle
    	//---------------------------------------------------------------------------------------------------
    	if ( _mouse3DPosition.getDistanceTo( _creatures[ _currentCreature ].getGrabHandle() ) < GRAB_RADIUS )
    	{
			_creatures[ _currentCreature ].showGrabHandle( true );
    	}
    	else
    	{
			_creatures[ _currentCreature ].showGrabHandle( false );
    	}

    	//--------------------------------------------------
    	// calculate 3D mouse position...
    	//--------------------------------------------------
		_mouse3DPosition = camera.projectPixelTo3DCoordinate( _mouseX, _mouseY, _grabDistance );
    	
		for (let i=0; i<_timeStepMultiplier; i++)
		{
			_clock ++;
			
			
if ( _clock % 200 === 0 )
{      	
	if ( _audioStarted )
	{
		_synth.playSound( 5, 70, 0.2, 0.02 )
	}    	
}
    	
			

			//-----------------------------------------
			// update creature
			//-----------------------------------------
			_creatures[ _currentCreature ].update();	
			
			//------------------------------------------------------------------------------
			// if creature is being grabbed, then constrain it with the grab position
			//------------------------------------------------------------------------------
			if ( _creatures[ _currentCreature ].getGrabbed() )
			{
				_creatures[ _currentCreature ].setGrabPosition( _mouse3DPosition );
			}
			else
			{
				_grabDistance = _creatures[ _currentCreature ].getGrabHandle().getDistanceTo( camera.getPosition() );
			}
					

			//----------------------
			// update camera...
			//----------------------
			if ( ! _creatures[ _currentCreature ].getGrabbed() )
			{
				this.updateCamera();	
			}
			
			_creatures[ _currentCreature ].setSensedPosition( SENSOR_ZENITH0, world.getZenith() );
			_creatures[ _currentCreature ].setSensedPosition( SENSOR_ZENITH1, world.getZenith() );	

			//-----------------------------------------
			// target test mode
			//---------------------------------------
			if ( _testMode === TEST_MODE_TARGET )
			{	
				this.updateTargetTestMode();			
			}

			if ( _runningSimulation )
			{
				if ( _runMode === RUN_MODE_EVOLVE )
				{
					this.updateEvolveRunMode();
				}
				else if ( _runMode === RUN_MODE_PRESET )
				{
					this.updatePresetRunMode();		
				}
				else if ( _runMode === RUN_MODE_MOST_FIT )
				{
					//console.log( "_runMode = RUN_MODE_MOST_FIT" );
				}
			}
		}
								    	
        this.render();
        
	    setTimeout( "vestibular.update()", MILLISECONDS_PER_UPDATE );
    }


    
	//------------------------------------
	this.updatePresetRunMode = function()
	{							
		//console.log( "_runMode = RUN_MODE_PRESET" );

		//-----------------------------------------------
		// Do we need to stop the simulation?
		//-----------------------------------------------
//if ( _runningSimulation )
		{
			//-----------------------------------------------
			// The simulation for this creature is done.
			//-----------------------------------------------
			if ( _clock > SIMULATION_DURATION )
			{
				_simulationEndTime = _clock;				
				_runningSimulation = false;
			}
			else
			{
				//-------------------------------------------------------
				// if the creature has fallen, then stop the simulation.  
				//-------------------------------------------------------
				if ( _creatures[ _currentCreature ].fell() )
				{
					if ( _extraTimeBufferClock === 1 )
					{
						document.getElementById( "restartButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
						document.getElementById( "restartButton" ).style.borderWidth = "4px";   
					}
					
					_extraTimeBufferClock ++;
				}

				if ( _extraTimeBufferClock > EXTRA_TIME_BUFFER )
				{
					_simulationEndTime = _clock;				
					_runningSimulation = false;
					
					console.log( "_runningSimulation = false" );
				}
			}
		}
    }
    
	//------------------------------------
	this.updateEvolveRunMode = function()
	{							
		//-----------------------------------------------
		// Do we need to stop the simulation?
		//-----------------------------------------------
//if ( _runningSimulation )
		{
			//-----------------------------------------------
			// The simulation for this creature is done.
			//-----------------------------------------------
			if ( _clock > SIMULATION_DURATION )
			{
				_simulationEndTime = _clock;				
				_runningSimulation = false;
			}
			else
			{
				//-------------------------------------------------------
				// if the creature has fallen, then stop the simulation.  
				//-------------------------------------------------------
				if ( _creatures[ _currentCreature ].fell() )
				{
					/*
					if ( _extraTimeBufferClock === 1 )
					{
						document.getElementById( "restartButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
						document.getElementById( "restartButton" ).style.borderWidth = "4px";   
					}
					*/
					
					_extraTimeBufferClock ++;
				}

				if ( _extraTimeBufferClock > EXTRA_TIME_BUFFER )
				{
					_simulationEndTime = _clock;				
					_runningSimulation = false;
				}
			}
		}
	
		//---------------------------------------------------------------------------
		// the simulation has stopped - time to prepare for the next simulation...
		//---------------------------------------------------------------------------
		if ( !_runningSimulation )
		{
			//-----------------------------------
			// advance GA iteration number... 
			//-----------------------------------
			_currentGAIteration ++;
		
			//-------------------------------------------------------
			// Done with all the GA iterations. Time to save the 
			// genes of the highest fit and watch it do its thing!
			//-------------------------------------------------------
			if ( _currentGAIteration > NUM_GA_ITERATIONS ) 
			{
				this.stopEvolving();
				
				/*
				_currentCreature = _GA.getHighestFitIndividual();

				_timeStepMultiplier = MIN_TIME_STEP_MULT;
			
				if ( !_savedGenes )
				{
					_GA.printGenes( _currentCreature );	
					_savedGenes = true;	
				}
				
				console.log( "RUN_MODE_MOST_FIT" );

				_runMode = RUN_MODE_MOST_FIT;	
				*/				
			}
			else
			{
				//-------------------------------------
				// do the next the next GA iteration
				//-------------------------------------
				this.updateGA();
			}
		
			//-----------------------------------------
			// start running the simulation
			//-----------------------------------------
			this.startSimulation();				
		}   			
	}
    
	//----------------------------------
	this.initCreature = function(c)
	{				
		_creatures[c].initialize();	 
		_creatures[c].setWalkingType( _walkingType );
		_creatures[c].setBodyTopolgy( _bodyTopology );

		//----------------------------------------------
		// bipedal walking requires a sense of up
		//----------------------------------------------
		if ( _walkingType === WALKING_TYPE_BIPED )
		{
			if ( USING_ZENITH_SENSOR_0 ) { _creatures[c].setSensorActive( SENSOR_ZENITH0, true ); }
			if ( USING_ZENITH_SENSOR_1 ) { _creatures[c].setSensorActive( SENSOR_ZENITH1, true ); }
			if ( USING_ZENITH_SENSOR_2 ) { _creatures[c].setSensorActive( SENSOR_ZENITH2, true ); }
		}			
		else
		{
			if ( USING_ZENITH_SENSOR_0 ) { _creatures[c].setSensorActive( SENSOR_ZENITH0, false ); }
			if ( USING_ZENITH_SENSOR_1 ) { _creatures[c].setSensorActive( SENSOR_ZENITH1, false ); }
			if ( USING_ZENITH_SENSOR_2 ) { _creatures[c].setSensorActive( SENSOR_ZENITH2, false ); }
		}	
	}    
    
	//----------------------------------
	this.updateTargetTestMode = function()
	{				
		//-------------------------------------------------------------------------
		// tell target where creature is
		//-------------------------------------------------------------------------
		_target.setPursuantPosition( _creatures[ _currentCreature ].getPosition() );

		//console.log( _creatures[ _currentCreature ].getPosition().x + ", " + _creatures[ _currentCreature ].getPosition().y + ", " + _creatures[ _currentCreature ].getPosition().z );
		
		//------------------
		// update target 
		//------------------
		_target.update();
		
		//-------------------------------------------------------------------------
		// tell creature where target is
		//-------------------------------------------------------------------------
		_creatures[ _currentCreature ].setSensedPosition( SENSOR_TARGET, _target.getPosition() );

		//-------------------------------------------------------------------------
		// calculate average distance to target
		//-------------------------------------------------------------------------
		_accumDistToTarget += _creatures[ _currentCreature ].getPosition().getDistanceTo( _target.getPosition() );	
	}
    

	//-----------------------------
	this.loadPreset = function()
	{
		console.log( "load preset" );
		
		_runMode = RUN_MODE_PRESET;

		//--------------------------------------------------
		// determine the preset to load...
		// (this could be done better, but ok for now)
		//--------------------------------------------------
		let preset = PRESET_1_TET_TRIPED;
		if ( _walkingType === WALKING_TYPE_BIPED )
		{			
				 if ( _bodyTopology === BODY_TOPOLOGY_1_TET ) { preset = PRESET_1_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_2_TET ) { preset = PRESET_2_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_3_TET ) { preset = PRESET_3_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_4_TET ) { preset = PRESET_4_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_5_TET ) { preset = PRESET_5_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_6_TET ) { preset = PRESET_6_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_7_TET ) { preset = PRESET_7_TET_BIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_8_TET ) { preset = PRESET_8_TET_BIPED; }
		}
		else if ( _walkingType === WALKING_TYPE_TRIPED )
		{			
				 if ( _bodyTopology === BODY_TOPOLOGY_1_TET ) { preset = PRESET_1_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_2_TET ) { preset = PRESET_2_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_3_TET ) { preset = PRESET_3_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_4_TET ) { preset = PRESET_4_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_5_TET ) { preset = PRESET_5_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_6_TET ) { preset = PRESET_6_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_7_TET ) { preset = PRESET_7_TET_TRIPED; }
			else if ( _bodyTopology === BODY_TOPOLOGY_8_TET ) { preset = PRESET_8_TET_TRIPED; }
		}

        _initialPosition.y = 0;
		_currentCreature = 0;
		
		this.initCreature( _currentCreature );
		
		_GA.loadPresetGenes( _currentCreature, preset );	
		_creatures[ _currentCreature ].generatePhenotype( _GA.getGenes( _currentCreature ) );
		
		_timeStepMultiplier = MIN_TIME_STEP_MULT;
		
		this.startSimulation();				
	}
	
	
	//--------------------------
	this.updateGA = function()
	{					
		//-----------------------------------------------------
		// Measure fitness of current individual
		//-----------------------------------------------------
		this.calculateFitnessOfIndividual( _currentCreature );
		
		//--------------------------------------
		// calculate average fitness values...
		//--------------------------------------
		_averageDistFitness		= ZERO;
		_averageUpFitness		= ZERO;
		_averageEnergyFitness	= ZERO;
		_averageTotalFitness	= ZERO;
		_highestFitness    		= _GA.getHighestFitness();

		for (let i=0; i<NUM_CREATURES; i++)
		{
			_averageDistFitness 	+= _creatureFitness[i].distance;
			_averageUpFitness		+= _creatureFitness[i].upright;
			_averageEnergyFitness	+= _creatureFitness[i].energy;
			_averageTotalFitness	+= _creatureFitness[i].total;
		}

		_averageDistFitness 	/= NUM_CREATURES; 
		_averageUpFitness		/= NUM_CREATURES;
		_averageEnergyFitness	/= NUM_CREATURES;
		_averageTotalFitness	/= NUM_CREATURES;
		
		let fitnessArrayCounter = Math.floor( ( _currentGAIteration / NUM_GA_ITERATIONS ) * FITNESS_GRAPH_RES );
				
		_aveDistFitnessArray	[ fitnessArrayCounter ] = _averageDistFitness;
		_aveUpFitnessArray		[ fitnessArrayCounter ] = _averageUpFitness;
		_aveEnergyFitnessArray	[ fitnessArrayCounter ] = _averageEnergyFitness;
		_aveTotalFitnessArray	[ fitnessArrayCounter ] = _averageTotalFitness;
		_highFitnessArray		[ fitnessArrayCounter ] = _highestFitness;
		
		//-----------------------------------------------
		// get lowest-fit and replace it with the 
		// offspring of two relatively-fit individuals...
		//-----------------------------------------------
		_currentCreature = _GA.getLowestFitIndividual();
	
		let parent1 = _GA.getRelativelyFitIndividualByTourament( TOURNAMENT_NUMBER );
		let parent2 = _GA.getRelativelyFitIndividualByTourament( TOURNAMENT_NUMBER );

		//console.log( "mate parents " + parent1 + " and " + parent2 + " and produce offspring " + _currentCreature );
		_GA.setAsChildOfParents( _currentCreature, parent1, parent2 );
		
//console.log( "mate _currentCreature = " + _currentCreature );
				
		_creatures[ _currentCreature ].generatePhenotype( _GA.getGenes( _currentCreature ) );
		
		//--------------------------------------------------------------
		// Decay all fitness values to keep things fresh over time...
		//--------------------------------------------------------------
		_GA.addToAllFitnessValues( FITNESS_DECREASE );		
	}
						
	//----------------------------------------------
	this.calculateFitnessOfIndividual = function(i)
	{
		if ( _testMode === TEST_MODE_TARGET )
		{
			//--------------------------------------
			// use average distance to target
			//--------------------------------------
			let averageDistToTarget = _accumDistToTarget / _simulationEndTime;
			_creatureFitness[i].distance = ( TARGET_START_DISTANCE - averageDistToTarget ) / TARGET_START_DISTANCE;
		}
		else if ( _testMode === TEST_MODE_DISTANCE )
		{
			//--------------------------------------------------
			// use distance traveled from the start position...
			//--------------------------------------------------
			_creatureFitness[i].distance = _creatures[i].getPosition().getDistanceTo( _startPosition ) / MAX_FITNESS_DISTANCE;

//testing ability to stand in place!!!!
//fitness = ONE - fitness;
		}
		
		//--------------------------------------------------------------------------------------------------
		// punishment for too much spring force (this is a negative fitness component)
		//--------------------------------------------------------------------------------------------------
//_creatureFitness[i].energy = -_creatures[i].getAccumulatedSpringForce() * SPRING_FORCE_PENALTY;					
// this is a test! 
//Trying to normalize energy expended to duration of 
_creatureFitness[i].energy = -( _creatures[i].getAccumulatedSpringForce() / _simulationEndTime ) * SPRING_FORCE_PENALTY;					

		
		//-------------------------------------------------------------------------
		// If the creature is bipedal then reward it according to how long it
		// stayed upright before falling, and then combine with distance fitness.
		//-------------------------------------------------------------------------
		if ( _walkingType === WALKING_TYPE_BIPED )
		{			
			_creatureFitness[i].upright = _simulationEndTime / SIMULATION_DURATION;

			// now these are two halves of a whole...
			_creatureFitness[i].distance *= ONE_HALF;	
			_creatureFitness[i].upright  *= ONE_HALF;
		}	
		
		//----------------------------------------------------------------------
		// combine these into the multi-objective function:
		//----------------------------------------------------------------------
		_creatureFitness[i].total = _creatureFitness[i].distance + _creatureFitness[i].upright + _creatureFitness[i].energy;
	
		//-----------------------------------------
		// set this fitness value in the GA...
		//-----------------------------------------
		_GA.setFitnessOfIndividual( i, _creatureFitness[i].total );
	}
	
	//----------------------------------
	// update camera...
	//----------------------------------
	this.updateCamera = function()
	{
		if ( CAMERA_BIRDS_EYE_VIEW )
		{
			//bird's eye view...		
			_cameraPosition.copyFrom( _creatures[ _currentCreature ].getPosition() );
			_cameraPosition.y = 70;
			_cameraPosition.x = _creatures[ _currentCreature ].getPosition().x;

			_cameraOrientation.setToIdentity();
			_cameraOrientation.pitch( 90 );
			camera.setPosition   ( _cameraPosition );
			camera.setOrientation( _cameraOrientation );
		}
		else
		{
			camera.pushViewToTarget( _creatures[ _currentCreature ].getPosition(), world.getUpDirection() );
			camera.pushToDistanceAndHeight( _creatures[ _currentCreature ].getPosition(), CAMERA_TARGET_DISTANCE, CAMERA_TARGET_HEIGHT );
		
			//---------------------------
			// revolve camera...
			//---------------------------
			if ( REVOLVE_CAMERA )
			{
				_cameraOrientation.setToIdentity();
	let angle = _clock * 0.02;		
	//	let angle = 90 + _clock * 0.2;		
			
	//angle = 30;				
				_cameraOrientation.yaw( angle );
	//_cameraOrientation.pitch( 5 );
	//_cameraOrientation.pitch( 30 );
				//let dist = 30;
				let rad = -angle * Math.PI / 180.0;
				_cameraPosition.x = _creatures[ _currentCreature ].getPosition().x + Math.sin( rad ) *  CAMERA_TARGET_DISTANCE;
				_cameraPosition.z = _creatures[ _currentCreature ].getPosition().z + Math.cos( rad ) * -CAMERA_TARGET_DISTANCE;
				_cameraPosition.y = CAMERA_TARGET_HEIGHT;
				camera.setPosition   ( _cameraPosition );
				camera.setOrientation( _cameraOrientation );
			}		
		}
	}

    //-----------------------------------------------
    this.getAverageFitnessOfPopulation = function()
    {
    	let averageFitness = ZERO;
    	
        for (let i=0; i<NUM_CREATURES; i++)
	    {
	        averageFitness += _GA.getFitnessOfIndividual(i);
	    }
	    
	    averageFitness /= NUM_CREATURES;

        return averageFitness;
    }	
	    
     

	//---------------------------------
	this.toggleRendering = function()
    {
    	if ( _renderScene )
    	{
    		_renderScene = false;
		}
    	else
    	{
    		_renderScene = true;
		}
    }

	//------------------------
	this.render = function()
    {
    	/*
		canvas.fillStyle = "rgb( 10, 14, 20 )";     
		canvas.fillRect( 0, 0, canvasID.width, canvasID.height );		
			
		canvas.fillStyle = "rgba( 200, 255, 200, 0.3 )";     		
		canvas.beginPath();
		canvas.arc( x, 300, 10, 0, Math.PI*2, false );
		canvas.fill();	  
		*/

		//---------------------------------------------
		// clear background
		//---------------------------------------------
		canvas.fillStyle = BACKGROUND_COLOR;
        canvas.fillRect( 0, 0, canvasID.width, canvasID.height );	

		if ( _renderScene )
		{
// for video

//----------------
// render world
//----------------
world.render();

//--------------------------
// render target
//--------------------------
if ( _testMode === TEST_MODE_TARGET )
{
	_target.render();
}

//--------------------------
// render creature
//--------------------------
_creatures[ _currentCreature ].render();

			
			
			/*
			//----------------------------------
			// render projected mouse cursor
			//----------------------------------
			
			//console.log( _mouse3DPosition.x );
			//console.log( _mouse3DPosition.x + ", " + _mouse3DPosition.y + ", " + _mouse3DPosition.z );

			_drawPos = camera.project( _mouse3DPosition );

			canvas.fillStyle = "rgb( 200, 0, 0 )";
			canvas.beginPath();
			canvas.arc( _drawPos.x, _drawPos.y, 6, 0, Math.PI*2, false );
			canvas.fill();
			canvas.closePath();	
			*/
		}
		
		//--------------------------
		// show info displays...
		//--------------------------
    	if ( _runMode === RUN_MODE_EVOLVE )
		{
// for video		
//_GA.renderFitnessBars( 200,  10, 600, 200 );
//_GA.renderGenePlot   ( 200, 220, 600, 250 );


if ( SHOW_FITNESS_GRAPH )
{
	this.renderFitnessGraph( 10, 10, 400, 100 );		
}	
if ( SHOW_SIM_DEETS )
{
	this.renderSimulationInfo( 10, 200 );	
}		
if ( SHOW_FITNESS_BARS )
{
	_GA.renderFitnessBars( 500,  10, 400, 100 );
}
if ( SHOW_GENE_PLOT )
{
	_GA.renderGenePlot   ( 500, 120, 400, 150 );
}		

		}


		if ( SHOW_MOTOR_CONTROL )
		{
			_creatures[ _currentCreature ].renderMotorControlData( 10, 500, 200, 300 );
		}
	}
	
		
	//-------------------------------------------------
	this.renderSimulationInfo = function( left, top )
	{
		//let iterationString = _currentGAIteration.toString() + " of " + NUM_GA_ITERATIONS.toString();
		//let fitnessString = _averageFitness.toFixed(3).toString();
		let s = 21;
		
		let testTypeString 		= "distance";
		let bodyTopologyString 	= "-";
		let walkingTypeString 	= "tripedal";
		let iterationsString 	= NUM_GA_ITERATIONS.toString();
		let testNumString 		= _currentGAIteration.toString();
		let zenithSensor0String	= "false";
		let zenithSensor1String	= "false";
		let zenithSensor2String	= "false";
		let targetSensorString	= "false";
		
		if ( _testMode === TEST_MODE_TARGET ) { testTypeString = "target"; }
				
			 if ( _bodyTopology === BODY_TOPOLOGY_1_TET ) { bodyTopologyString = "one tet";		}
		else if ( _bodyTopology === BODY_TOPOLOGY_2_TET ) { bodyTopologyString = "two tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_3_TET ) { bodyTopologyString = "three tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_4_TET ) { bodyTopologyString = "four tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_5_TET ) { bodyTopologyString = "five tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_6_TET ) { bodyTopologyString = "six tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_7_TET ) { bodyTopologyString = "seven tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_8_TET ) { bodyTopologyString = "eight tets";	}
		else if ( _bodyTopology === BODY_TOPOLOGY_FOOT  ) { bodyTopologyString = "big foot";	}
		
		if ( _walkingType === WALKING_TYPE_BIPED ) { walkingTypeString = "bipedal"; }

		/*
		if ( USING_ZENITH_SENSOR_0 ) { zenithSensor0String = "true"; }
		if ( USING_ZENITH_SENSOR_1 ) { zenithSensor1String = "true"; }
		if ( USING_ZENITH_SENSOR_2 ) { zenithSensor2String = "true"; }
		if ( USING_TARGET_SENSOR   ) { targetSensorString  = "true"; }		
		*/
		
		canvas.fillStyle = 'rgb( 70, 70, 70 )';
		canvas.font = "15px Arial";
		
		canvas.fillText( "population size: " + NUM_CREATURES, 	 	left, top + s *  0 ); 		
		canvas.fillText( "body type: " 		 + bodyTopologyString, 	left, top + s *  1 );			
		canvas.fillText( "walking type: " 	 + walkingTypeString, 	left, top + s *  2 );			
		//canvas.fillText( "test type: " 	 	 + testTypeString,		left, top + s *  3 );		
		canvas.fillText( "num tests: " 	   	 + iterationsString,	left, top + s *  3 );				
		canvas.fillText( "running test #" 	 + testNumString,		left, top + s *  4 );				
		canvas.fillText( "testing creature " + _currentCreature, 	left, top + s *  5 );			
		canvas.fillText( "test duration: " 	 + SIMULATION_DURATION,	left, top + s *  6 );
		canvas.fillText( "test clock: " 	 + _clock, 				left, top + s *  7 );	
		//canvas.fillText( "zenith sensor: "   + zenithSensor0String, left, top + s *  9 );	
		//canvas.fillText( "zenith sensor 1: " + zenithSensor1String, left, top + s * 10 );	
		//canvas.fillText( "zenith sensor 2: " + zenithSensor2String, left, top + s * 11 );	
		//canvas.fillText( "target sensor: "   + targetSensorString,  left, top + s * 12 );	
	}
	
	//--------------------------------------------------------------
	this.renderFitnessGraph = function( left, top, width, height )
	{
		let xInc = width / NUM_GA_ITERATIONS;
		
		//------------------------------------------------------------------------
		// draw the time-series graph showing average fitness and highest fitness
		//------------------------------------------------------------------------
		if ( _currentGAIteration > 1 )
		{
			canvas.lineWidth = 2;
			
			let yScale = height;
			
			for (let f=0; f<_currentGAIteration; f++)
			{
				let arrayIndex0 = Math.floor( ( (f-1) / NUM_GA_ITERATIONS ) * FITNESS_GRAPH_RES );
				let arrayIndex1 = Math.floor( ( f     / NUM_GA_ITERATIONS ) * FITNESS_GRAPH_RES );

				let scaleFactor = 1; 
				if ( _walkingType === WALKING_TYPE_BIPED )
				{
					scaleFactor = 2; 
				}
		
				let y0 = top + height - _aveDistFitnessArray[ arrayIndex0 ] * yScale * scaleFactor;
				let y1 = top + height - _aveDistFitnessArray[ arrayIndex1 ] * yScale * scaleFactor;

				canvas.strokeStyle = DIST_FITNESS_COLOR;
				canvas.beginPath();
				canvas.moveTo( left + (f-1) * xInc, y0 );
				canvas.lineTo( left + f     * xInc, y1 );
				canvas.stroke(); 
				canvas.closePath();

				y0 = top + height - _aveUpFitnessArray[ arrayIndex0 ] * yScale * scaleFactor;
				y1 = top + height - _aveUpFitnessArray[ arrayIndex1 ] * yScale * scaleFactor;

				canvas.strokeStyle = UP_FITNESS_COLOR;
				canvas.beginPath();
				canvas.moveTo( left + (f-1) * xInc, y0 );
				canvas.lineTo( left + f     * xInc, y1 );
				canvas.stroke(); 
				canvas.closePath();

let energyScale = height * 0.5;

				y0 = top - _aveEnergyFitnessArray[ arrayIndex0 ] * yScale * energyScale;
				y1 = top - _aveEnergyFitnessArray[ arrayIndex1 ] * yScale * energyScale;

				canvas.strokeStyle = ENERGY_FITNESS_COLOR;
				canvas.beginPath();
				canvas.moveTo( left + (f-1) * xInc, y0 );
				canvas.lineTo( left + f     * xInc, y1 );
				canvas.stroke(); 
				canvas.closePath();
				
				/*
				let y0 = top + height - _aveTotalFitnessArray[ arrayIndex0 ] * yScale;
				let y1 = top + height - _aveTotalFitnessArray[ arrayIndex1 ] * yScale;
			
				canvas.strokeStyle = TOTAL_FITNESS_COLOR;
				canvas.beginPath();
				canvas.moveTo( left + (f-1) * xInc, y0 );
				canvas.lineTo( left + f     * xInc, y1 );
				canvas.stroke(); 
				canvas.closePath();

				y0 = top + height - _highFitnessArray[ arrayIndex0 ] * yScale;
				y1 = top + height - _highFitnessArray[ arrayIndex1 ] * yScale;

				canvas.strokeStyle = HIGH_FITNESS_COLOR;
				canvas.beginPath();
				canvas.moveTo( left + (f-1) * xInc, y0 );
				canvas.lineTo( left + f     * xInc, y1 );
				canvas.stroke(); 
				canvas.closePath();		
				*/		
			}
		}

		//------------------------------
		// frame
		//------------------------------
		canvas.lineWidth = 1;
		canvas.strokeStyle = "rgb( 3, 30, 30 )";
		canvas.strokeRect( left, top, width, height );
		
		//----------------------------------------------------------------------
		// print data beneath
		//----------------------------------------------------------------------
		let aveTotFitString	= _averageTotalFitness.toFixed	(5).toString();
		let highFitString 	= _highestFitness.toFixed		(5).toString();
		let distFitString 	= _averageDistFitness.toFixed	(5).toString();
		let upFitString   	= _averageUpFitness.toFixed		(5).toString();
		let energyFitString	= _averageEnergyFitness.toFixed	(5).toString();
	
		//canvas.fillStyle = 'rgb( 70, 70, 70 )';
		canvas.font = "15px Arial";	

		let s = 21;		
		canvas.fillStyle = DIST_FITNESS_COLOR;  	canvas.fillText( "average target fitness:     " + distFitString,  	left, top + height +  20 );	
		canvas.fillStyle = UP_FITNESS_COLOR;    	canvas.fillText( "average upright fitness: 	  " + upFitString,  	left, top + height +  40 );	
		canvas.fillStyle = ENERGY_FITNESS_COLOR;    canvas.fillText( "average efficiency fitness: " + energyFitString,	left, top + height +  60 );	
		//canvas.fillStyle = TOTAL_FITNESS_COLOR; 	canvas.fillText( "average total fitness: 	  " + aveTotFitString,	left, top + height +  80 );	
		//canvas.fillStyle = HIGH_FITNESS_COLOR;  	canvas.fillText( "highest total fitness: 	  " + highFitString,	left, top + height + 100 );		
	}    
    
    
    
    
	//-------------------------------------
	this.onSliderChanged = function( id )
    {        
    	let min = document.getElementById( id ).min;
    	let max = document.getElementById( id ).max;
    	let val = document.getElementById( id ).value;
    	
        let sliderValue = ( val - min ) / ( max - min );
        
        console.log( "slider '" + id + "' changed: value = " + sliderValue );  
        
		if ( id === "slider1" ) { document.getElementById( "input1" ).value = sliderValue; }     
		if ( id === "slider2" ) { document.getElementById( "input2" ).value = sliderValue; }     
		if ( id === "slider3" ) { document.getElementById( "input3" ).value = sliderValue; }     
    }
    
	//---------------------------------------------
	this.addToInputString = function( id, event )
    {
        //console.log( "addToInputString '" + id + "', event = " + event );
        
        //-------------------------------------------------
        // characters accumulate as the user types keys...
        //-------------------------------------------------
        let inputString = event.currentTarget.value;
        
        if ( event.key === 'Enter' )
        {	    
            let floatValue = parseFloat( inputString );
            //console.log( "ok: " + floatValue );
            
            //-------------------------------------
            // set the associated slider value...
            //-------------------------------------
            //let sliderFraction = ZERO;

            if ( id === "input1" ) { this.setSliderNormalizedValue( "slider1", floatValue ); }
            if ( id === "input2" ) { this.setSliderNormalizedValue( "slider2", floatValue ); }
            if ( id === "input3" ) { this.setSliderNormalizedValue( "slider3", floatValue ); }
        }
    }

/*
	//----------------------------------------------------------------------
	this.setSliderNormalizedValue = function( sliderID, normalizedValue )
    {            	
		let min = document.getElementById( sliderID ).min;
		let max = document.getElementById( sliderID ).max;
		
		let sliderValue = Math.floor( min + normalizedValue * ( max - min ) );

		//console.log( "sliderValue = " + sliderValue );

		document.getElementById( sliderID ).value = sliderValue;
    }
    */
    
    

	//-----------------------------------
	this.onButtonSelected = function(b)
    {
		//--------------------------------------------------------------------
		// creature buttons
		//--------------------------------------------------------------------
    	if ( b === "tet1BipedButton"  ) { _bodyTopology = BODY_TOPOLOGY_1_TET; _walkingType	= WALKING_TYPE_BIPED;  this.loadPreset(); }
    	if ( b === "tet2BipedButton"  ) { _bodyTopology = BODY_TOPOLOGY_2_TET; _walkingType	= WALKING_TYPE_BIPED;  this.loadPreset(); }
    	if ( b === "tet3BipedButton"  ) { _bodyTopology = BODY_TOPOLOGY_3_TET; _walkingType	= WALKING_TYPE_BIPED;  this.loadPreset(); }
    	if ( b === "tet4BipedButton"  ) { _bodyTopology = BODY_TOPOLOGY_4_TET; _walkingType	= WALKING_TYPE_BIPED;  this.loadPreset(); }
    	if ( b === "tet5BipedButton"  ) { _bodyTopology = BODY_TOPOLOGY_5_TET; _walkingType	= WALKING_TYPE_BIPED;  this.loadPreset(); }
    	if ( b === "tet1TripedButton" ) { _bodyTopology = BODY_TOPOLOGY_1_TET; _walkingType	= WALKING_TYPE_TRIPED; this.loadPreset(); }
    	if ( b === "tet2TripedButton" ) { _bodyTopology = BODY_TOPOLOGY_2_TET; _walkingType	= WALKING_TYPE_TRIPED; this.loadPreset(); }
    	if ( b === "tet3TripedButton" ) { _bodyTopology = BODY_TOPOLOGY_3_TET; _walkingType	= WALKING_TYPE_TRIPED; this.loadPreset(); }
    	if ( b === "tet4TripedButton" ) { _bodyTopology = BODY_TOPOLOGY_4_TET; _walkingType	= WALKING_TYPE_TRIPED; this.loadPreset(); }
    	if ( b === "tet5TripedButton" ) { _bodyTopology = BODY_TOPOLOGY_5_TET; _walkingType	= WALKING_TYPE_TRIPED; this.loadPreset(); }
    
		//--------------------------------------------------------------------
		// tet buttons
		//--------------------------------------------------------------------
    	if ( b === "tet1button" ) { _bodyTopology = BODY_TOPOLOGY_1_TET; }
    	if ( b === "tet2button" ) { _bodyTopology = BODY_TOPOLOGY_2_TET; }
    	if ( b === "tet3button" ) { _bodyTopology = BODY_TOPOLOGY_3_TET; }
    	if ( b === "tet4button" ) { _bodyTopology = BODY_TOPOLOGY_4_TET; }
    	if ( b === "tet5button" ) { _bodyTopology = BODY_TOPOLOGY_5_TET; }

		//--------------------------------------------------------------------
		// walking type buttons
		//--------------------------------------------------------------------
    	if ( b === "bipedButton"  ) { _walkingType	= WALKING_TYPE_BIPED;	}
    	if ( b === "tripedButton" ) { _walkingType	= WALKING_TYPE_TRIPED; 	}
		
		this.initCreature( _currentCreature );
    	
		//---------------------------------------------------------	
		// other buttons
		//---------------------------------------------------------   	
    	if ( b === "restartButton" 	) { this.loadPreset(); 	 	}
    	if ( b === "evolveButton"  	) { this.startEvolving(); 	}
    	if ( b === "stopButton" 	) { this.stopEvolving(); 	}
    	
		//---------------------------	
		// refresh button visuals
		//---------------------------	
		this.updateButtonDisplay();
    }

	//------------------------------------
	this.updateButtonDisplay = function()
    {    
		//-----------------------------------------------------------------------------------------
		// handle tet buttons
		//-----------------------------------------------------------------------------------------
		document.getElementById( "tet1BipedButton"  ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet2BipedButton"  ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet3BipedButton"  ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet4BipedButton"  ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet5BipedButton"  ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet1TripedButton" ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet2TripedButton" ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet3TripedButton" ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet4TripedButton" ).style.backgroundColor = "#ffffff";
		document.getElementById( "tet5TripedButton" ).style.backgroundColor = "#ffffff";
		document.getElementById( "evolveButton" 	).style.backgroundColor = "#ffffff";
		document.getElementById( "restartButton" 	).style.backgroundColor = "#ffffff";
		document.getElementById( "stopButton" 		).style.backgroundColor = "#ffffff";
		
		document.getElementById( "tet1BipedButton"  ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet2BipedButton"  ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet3BipedButton"  ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet4BipedButton"  ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet5BipedButton"  ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet1TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet2TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet3TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet4TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tet5TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "restartButton" 	).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "evolveButton" 	).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "stopButton" 		).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		//document.getElementById( "renderButton" 	).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;

		document.getElementById( "tet1BipedButton"  ).style.borderWidth = "1px";   
		document.getElementById( "tet2BipedButton"  ).style.borderWidth = "1px";   
		document.getElementById( "tet3BipedButton"  ).style.borderWidth = "1px";   
		document.getElementById( "tet4BipedButton"  ).style.borderWidth = "1px";   
		document.getElementById( "tet5BipedButton"  ).style.borderWidth = "1px";   
		document.getElementById( "tet1TripedButton" ).style.borderWidth = "1px";   
		document.getElementById( "tet2TripedButton" ).style.borderWidth = "1px";   
		document.getElementById( "tet3TripedButton" ).style.borderWidth = "1px";   
		document.getElementById( "tet4TripedButton" ).style.borderWidth = "1px";   
		document.getElementById( "tet5TripedButton" ).style.borderWidth = "1px";   
		document.getElementById( "restartButton" 	).style.borderWidth = "1px";   
		document.getElementById( "evolveButton" 	).style.borderWidth = "1px"; 
		document.getElementById( "stopButton" 		).style.borderWidth = "1px"; 
		//document.getElementById( "renderButton" 	).style.borderWidth = "1px"; 

    	if ( _walkingType === WALKING_TYPE_BIPED ) 
    	{ 
			if ( _bodyTopology === BODY_TOPOLOGY_1_TET ) 
			{ 
				document.getElementById( "tet1BipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet1BipedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_2_TET ) 
			{ 
				document.getElementById( "tet2BipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet2BipedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_3_TET ) 
			{ 
				document.getElementById( "tet3BipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet3BipedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_4_TET ) 
			{ 
				document.getElementById( "tet4BipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet4BipedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_5_TET ) 
			{ 
				document.getElementById( "tet5BipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet5BipedButton" ).style.borderWidth = "4px";   
			}
		}
		else if ( _walkingType === WALKING_TYPE_TRIPED ) 
    	{ 
			if ( _bodyTopology === BODY_TOPOLOGY_1_TET ) 
			{ 
				document.getElementById( "tet1TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet1TripedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_2_TET ) 
			{ 
				document.getElementById( "tet2TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet2TripedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_3_TET ) 
			{ 
				document.getElementById( "tet3TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet3TripedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_4_TET ) 
			{ 
				document.getElementById( "tet4TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet4TripedButton" ).style.borderWidth = "4px";   
			}
			if ( _bodyTopology === BODY_TOPOLOGY_5_TET ) 
			{ 
				document.getElementById( "tet5TripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
				document.getElementById( "tet5TripedButton" ).style.borderWidth = "4px";   
			}
		}
		
		    	
		/*
		//-----------------------------------------------------------------------------------------
		// handle walking type buttons
		//-----------------------------------------------------------------------------------------
		document.getElementById( "bipedButton" 	).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;
		document.getElementById( "tripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;

		document.getElementById( "bipedButton" 	).style.borderWidth = "1px";   
		document.getElementById( "tripedButton" ).style.borderWidth = "1px";   
    	
    	if ( _walkingType === WALKING_TYPE_BIPED ) 
    	{ 
    		document.getElementById( "bipedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
	        document.getElementById( "bipedButton" ).style.borderWidth = "4px";   
    	}
    	if ( _walkingType === WALKING_TYPE_TRIPED ) 
    	{ 
    		document.getElementById( "tripedButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
	        document.getElementById( "tripedButton" ).style.borderWidth = "4px";   
    	}
    	*/
    	
    	
		//--------------------------------------------------		
		// preset button
		//--------------------------------------------------   
		/*	
		if ( _runMode === RUN_MODE_PRESET )
		{
    		document.getElementById( "presetButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
	        document.getElementById( "presetButton" ).style.borderWidth = "4px";   
		}
		else
		{
    		document.getElementById( "presetButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;             
	        document.getElementById( "presetButton" ).style.borderWidth = "1px";   
		}
		*/
		
		if ( _runMode === RUN_MODE_EVOLVE )
		{
    		document.getElementById( "evolveButton" ).style.borderColor = BUTTON_BORDER_COLOR_ACTIVE;             
	        document.getElementById( "evolveButton" ).style.borderWidth = "4px";   
		}
		else
		{
    		document.getElementById( "evolveButton" ).style.borderColor = BUTTON_BORDER_COLOR_NORMAL;             
	        document.getElementById( "evolveButton" ).style.borderWidth = "1px";   
		}
    }
        
    //----------------------------
	this.mouseDown = function( x, y )
    {
        //console.log( "mouse down: " + x + ", " + y );
    	_mouseX = x;
    	_mouseY = y;
    	
    	if ( _mouse3DPosition.getDistanceTo( _creatures[ _currentCreature ].getGrabHandle() ) < GRAB_RADIUS )
    	{
			_creatures[ _currentCreature ].setGrabbed( true );
    	}
    	
        if ( !_audioStarted )
        {
			//_synth = new Synthesizer();
            _synth.initialize();
            _audioStarted = true;
        	_synth.turnOffAllSounds();
        }    
	}
	
	//--------------------------------
	this.mouseMove = function( x, y )
    {
        //console.log( "mouse move: " + x + ", " + y );
    	_mouseX = x;
    	_mouseY = y;
    }
    
	//------------------------------
	this.mouseUp = function( x, y )
    {
        //console.log( "mouse up: " + x + ", " + y );
    	_mouseX = x;
    	_mouseY = y;
		_creatures[ _currentCreature ].setGrabbed( false );
    }

	//--------------------------------
	this.mouseOut = function( x, y )
    {
        //console.log( "mouse out: " + x + ", " + y );
    	_mouseX = x;
    	_mouseY = y;
    }
}


//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmousedown = function(e) 
{
	vestibular.mouseDown( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );  
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmousemove = function(e) 
{
	vestibular.mouseMove( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );  
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmouseup = function(e) 
{
	vestibular.mouseUp( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );  
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmouseout = function(e) 
{
	vestibular.mouseOut( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );  
}

//--------------------------------
// key down
//--------------------------------
document.onkeydown = function(e) 
{
    e = e || window.event;

	/*    
    if ( e.keyCode ===  37 ) { console.log( "left arrow key pressed" 	); } // left arrow key
    if ( e.keyCode ===  39 ) { console.log( "right arrow key pressed" 	); } // right arrow key
    if ( e.keyCode ===  38 ) { console.log( "up arrow key pressed" 		); } // up arrow key
    if ( e.keyCode ===  40 ) { console.log( "down arrow key pressed" 	); } // down arrow key
    if ( e.keyCode ===  61 ) { console.log( "plus key pressed" 			); } // plus key
    if ( e.keyCode === 173 ) { console.log( "minus key pressed" 		); } // minus key

    //apparently, Chrome and Safari  use different key codes...
    if ( e.keyCode === 187 ) { console.log( "plus key pressed" 			);	} // plus key
    if ( e.keyCode === 189 ) { console.log( "minus key pressed" 		);  } // minus key
    */
}

//------------------------------
document.onkeyup = function(e) 
{
    //console.log( "on key up" );
}
