
//------------------
function World()
{	
    "use strict";

    const GROUND_SQUARE_SIZE = 40;
    const GROUND_SQUARE_RES	 = 70;
    const BUMPY_WORLD		 = false;
	const BUMPY_HEIGHT 		 = 0.1;
	const BUMPY_FREQUENCY 	 = 1.3;
	const RANDOMIZER_SCALE	 = 4.0;

	let _zenith			= new Vector3D();
    let _vectorUtility	= new Vector3D();
    let _position 	 	= new Vector3D();
	let _orientation 	= new Orientation();
    let _drawPos     	= new Vector2D();
    let _randomizer		= ZERO;

	let v0 = new Vector3D();
	let v1 = new Vector3D();
	let v2 = new Vector3D();
	let v3 = new Vector3D();
    
	//--------------------------------
	this.initialize = function()
	{
		_orientation.setToIdentity();
		_position.setXYZ( ZERO, ZERO, ZERO );
		_zenith.setXYZ( ZERO, 1000000000, ZERO );
		
		_randomizer = Math.random() * RANDOMIZER_SCALE;
		
		//console.log( "_randomizer = " + _randomizer );
	}

	//----------------------------------------------------
	this.getHeightAtPosition = function( testPosition )
	{
		let offset = ZERO;

		if ( BUMPY_WORLD ) 
		{
			offset = BUMPY_HEIGHT * ( Math.sin( testPosition.x * BUMPY_FREQUENCY + _randomizer ) + Math.sin( testPosition.z * BUMPY_FREQUENCY + _randomizer ) );
		}
		
		return _position.y + offset;
	}
	
	//----------------------------------------------------------
	this.getSurfaceNormalAtPosition = function( testPosition )
	{
		// implement this !!!
		return _position.y;
	}
	
	//-----------------------------
	this.getPosition = function()
	{
		return _position;
	}
	
	//-----------------------------
	this.getZenith = function()
	{
		return _zenith;
	}
	
	//-----------------------------
	this.getOrientation = function()
	{
		return _orientation;
	}
	
	//-----------------------------
	this.getUpDirection = function()
	{
		return _orientation.upward;
	}
		
	//------------------------
	this.update = function()
	{
    }
    
	//------------------------
	this.render = function()
	{
		let inc 	 = GROUND_SQUARE_SIZE / ( GROUND_SQUARE_RES - 1 );
		let halfSize = GROUND_SQUARE_SIZE * ONE_HALF;

    	canvas.lineWidth = 1;
		canvas.strokeStyle = "rgba( 20, 50, 0, 0.3 )";		

		for (let i=0; i<GROUND_SQUARE_RES; i++)
		{
			for (let j=0; j<GROUND_SQUARE_RES; j++)
			{
				_vectorUtility.x = -halfSize + i * inc;
				_vectorUtility.z = -halfSize + j * inc;
				_vectorUtility.y = world.getHeightAtPosition( _vectorUtility );
				_drawPos = camera.project( _vectorUtility );

//if ( _drawPos.x != ZERO )
{				
				canvas.beginPath();				
				canvas.moveTo( _drawPos.x, _drawPos.y );

				_vectorUtility.x = -halfSize + ( i + 1 ) * inc;
				_vectorUtility.z = -halfSize + j * inc;
				_vectorUtility.y = world.getHeightAtPosition( _vectorUtility );
				_drawPos = camera.project( _vectorUtility );
				canvas.lineTo( _drawPos.x, _drawPos.y );

				_vectorUtility.x = -halfSize + ( i + 1 ) * inc;
				_vectorUtility.z = -halfSize + ( j + 1 ) * inc;
				_vectorUtility.y = world.getHeightAtPosition( _vectorUtility );
				_drawPos = camera.project( _vectorUtility );
				canvas.lineTo( _drawPos.x, _drawPos.y );

				canvas.stroke();
				canvas.closePath();	
}
				
				/*
				canvas.fillStyle = "rgba( 30, 100, 0, 0.3 )";		
				canvas.beginPath();
				canvas.arc( _drawPos.x, _drawPos.y, 3, 0, Math.PI*2, false );
				canvas.fill();
				canvas.closePath();	
				*/
				
						
			}
		}
			
		/*
		let groundLevel = world.getPosition().y;
		let inc 		= GROUND_SQUARE_SIZE / ( GROUND_SQUARE_RES - 1 );
		let halfSize 	= GROUND_SQUARE_SIZE * ONE_HALF;

		canvas.strokeStyle = 'rgba( 0, 0, 0, 0.2 )';
		canvas.lineWidth = 3;
		
		for (let i=0; i<GROUND_SQUARE_RES; i++)
		{
			canvas.beginPath();

			v0.setXYZ( -halfSize, groundLevel, -halfSize + inc * i );
			v1.setXYZ(  halfSize, groundLevel, -halfSize + inc * i );

			_drawPos = camera.project( v0 );
			canvas.moveTo( _drawPos.x, _drawPos.y );

			_drawPos = camera.project( v1 );
			canvas.lineTo( _drawPos.x, _drawPos.y );

			canvas.closePath();
			canvas.fill();	    	
			canvas.stroke();
		}

		for (let i=0; i<GROUND_SQUARE_RES; i++)
		{
			canvas.beginPath();

			v0.setXYZ( -halfSize + inc * i, groundLevel, -halfSize );
			v1.setXYZ( -halfSize + inc * i, groundLevel,  halfSize );

			_drawPos = camera.project( v0 );
			canvas.moveTo( _drawPos.x, _drawPos.y );

			_drawPos = camera.project( v1 );
			canvas.lineTo( _drawPos.x, _drawPos.y );

			canvas.closePath();
			canvas.fill();	    	
			canvas.stroke();
		}
		
		
           _drawPos = camera.project  ( _position );
        let drawRad = camera.getRadius( _position, 0.1 );            
              
        canvas.fillStyle   = "rgba( 0, 100, 0, 0.2 )";
        canvas.beginPath();
        canvas.arc( _drawPos.x, _drawPos.y, drawRad, 0, Math.PI*2, false );
        canvas.fill();
        canvas.closePath();	
		*/
		
		
		
		
	
		/*
		//let s = 1;
		
		//console.log( _world.getOrientation().upward.y );
		//console.log( world.getPosition().y );
		
		let groundLevel = world.getPosition().y;
		
		v0.setXYZ( -GROUND_SQUARE_SIZE, groundLevel, -GROUND_SQUARE_SIZE );
		v1.setXYZ(  GROUND_SQUARE_SIZE, groundLevel, -GROUND_SQUARE_SIZE );
		v2.setXYZ(  GROUND_SQUARE_SIZE, groundLevel,  GROUND_SQUARE_SIZE );
		v3.setXYZ( -GROUND_SQUARE_SIZE, groundLevel,  GROUND_SQUARE_SIZE );
		GROUND_SQUARE_SIZE
		
		canvas.fillStyle   = 'rgba( 250, 250, 250, 0.8 )';
		canvas.strokeStyle = 'rgba( 100, 100, 100, 0.2 )';
		canvas.beginPath();

		_drawPos = camera.project( v0 );
		canvas.moveTo( _drawPos.x, _drawPos.y );

		_drawPos = camera.project( v1 );
		canvas.lineTo( _drawPos.x, _drawPos.y );
		
		_drawPos = camera.project( v2 );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		_drawPos = camera.project( v3 );
		canvas.lineTo( _drawPos.x, _drawPos.y );

		canvas.closePath();
		canvas.fill();	    	
		canvas.stroke();
		*/
		
    }
}



