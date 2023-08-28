"use strict";

const TARGET_START_ANGLE		= Math.PI;
const TARGET_START_DISTANCE		= 16;//12;//6;
const TARGET_RANDOM_START_ANGLE = true;
const TARGET_START_AT_ORIGIN	= false;
const TARGET_VIEW_HORIZON		= 4;//6.0;
const TARGET_REPULSION		 	= 0.000004;//0.00001;//0.000004;//0.00001;
const TARGET_JITTER			  	= 0.0002;
const TARGET_FRICTION	 		= 0.002;
const TARGET_RENDER_RADIUS 		= 0.1;

//-----------------------
function Target()
{
	let _position 	 		= new Vector3D();
	let _velocity 	 	 	= new Vector3D();  
	let _pursuantPosition 	= new Vector3D();  
	let _pursuantDirection 	= new Vector3D();
    let _drawPos       		= new Vector2D();
	let _fleeing			= false;
	
	//----------------------------------
	this.initialize = function()
	{	    		
		if ( TARGET_START_AT_ORIGIN )
		{
			_position.clear();		
		}
		else
		{
			let targetAngle = TARGET_START_ANGLE;
		
			if ( TARGET_RANDOM_START_ANGLE )
			{
				targetAngle = Math.random() * Math.PI * 2;
			}
		
			let targetX = TARGET_START_DISTANCE * Math.sin( targetAngle );
			let targetZ = TARGET_START_DISTANCE * Math.cos( targetAngle );
		
			_position.setXYZ( targetX, world.getHeightAtPosition( _position ), targetZ );	
		}
		
		//-------------------------
		// clear velocity
		//-------------------------
		_velocity.clear();	 
	}	
	
	//-------------------------------------
	this.setPursuantPosition = function(p)
	{
		_pursuantPosition.copyFrom(p);
	}

	//-------------------------------------
	this.getPosition = function()
	{
		return _position;
	}

	//------------------------------
	this.update = function()
	{
		//------------------------------------------
		// target repulsion from pursuant  
		//------------------------------------------
		_pursuantDirection.setToDifference( _position, _pursuantPosition );
		let distance = _pursuantDirection.getMagnitude();
		
		if ( distance > ZERO )
		{
			if ( distance < TARGET_VIEW_HORIZON )
			{
				_fleeing = true;
				
				//----------------------
				// repulsion
				//----------------------
				_pursuantDirection.scale( ONE / distance );
				let force = distance / TARGET_VIEW_HORIZON * TARGET_REPULSION;
				_velocity.addScaled( _pursuantDirection, force );

				//----------------------
				// the jitters
				//----------------------
				_velocity.x += ( -TARGET_JITTER * ONE_HALF + Math.random() * TARGET_JITTER );
				_velocity.z += ( -TARGET_JITTER * ONE_HALF + Math.random() * TARGET_JITTER );
			}			
			else
			{
				_fleeing = false;
			}	
		}
		
		//-------------------------------------
		// ambient friction
		//-------------------------------------
		_velocity.scale( ONE - TARGET_FRICTION );

		//-------------------------------------
		// update position by velocity
		//-------------------------------------
		_position.add( _velocity );
		
		//-------------------------------------
		// clamp to ground surface
		//-------------------------------------
		_position.y = world.getHeightAtPosition( _position );
	}
	
	//--------------------------
	this.render = function()
	{
        _drawPos     = camera.project  ( _position );
         let drawRad = camera.getRadius( _position, TARGET_RENDER_RADIUS );  
                                
        canvas.strokeStyle = "rgb( 255, 255, 255 )";
        canvas.fillStyle   = "rgb( 0, 0, 100 )";
        canvas.lineWidth = 4;

		if ( _fleeing )
		{
			canvas.fillStyle = "rgb( 200, 0, 0 )";
		}
		
        canvas.beginPath();
        canvas.arc( _drawPos.x, _drawPos.y, drawRad, 0, Math.PI*2, false );
        canvas.fill();
        canvas.stroke();
        canvas.closePath();			
	}	
	
}

