
//------------------
function Camera()
{	
    "use strict";

	const FIELD_OF_VIEW_EFFECT = 0.3;
	const PUSH_FORCE = 0.0001;

    let _projected      	= new Vector2D();
	let _projectedIntoScene	= new Vector3D();
	let _position			= new Vector3D();
	let _vectorUtility		= new Vector3D();
	let _targetPosition 	= new Vector3D();
	let _orientation		= new Orientation();
	
	let _viewportCenterX = ZERO;
	let _viewportCenterY = ZERO;
	let _viewportScale   = ZERO;
    
	//-----------------------------
	this.initialize = function()
	{
		_orientation.setToIdentity();
		_position.clear();
		_targetPosition.clear();
		_projected.clear();
		_vectorUtility.clear();
	}
	
	//--------------------------------
	this.setPosition = function( p )
	{
		_position.copyFrom(p);
	}
	
	//-----------------------------
	this.getPosition = function()
	{
		return _position;
	}
	
	//--------------------------------
	this.setOrientation = function(o)
	{
		_orientation.rightward.copyFrom( o.rightward );
		_orientation.upward.copyFrom   ( o.upward    );
		_orientation.forward.copyFrom  ( o.forward   );
	}
	
	//--------------------------------
	this.getOrientation = function()
	{
		return _orientation;
	}
	
	//------------------------------------------------------
	this.setViewToTarget = function( target, upDirection )
	{
		_orientation.upward.copyFrom( upDirection );
		_orientation.forward.setToDifference( target, _position );
		_orientation.forward.normalize();
		_orientation.rightward.setToCross( _orientation.upward, _orientation.forward );
	}
	
	//-----------------------------------------------------------------
	this.pushViewToTarget = function( targetPosition, upDirection )
	{
		_vectorUtility.setToDifference( targetPosition, _position );
		
		_orientation.forward.addScaled( _vectorUtility, PUSH_FORCE );		
		_orientation.forward.normalize();
		_orientation.rightward.setToCross( upDirection, _orientation.forward );
		_orientation.upward.setToCross( _orientation.forward, _orientation.rightward );
	}
	
	//--------------------------------------------------------------------------------------
	this.pushToDistanceAndHeight = function( targetPosition, targetDistance, targetHeight )
	{
// this needs work	
	
		_targetPosition.copyFrom( targetPosition );

//_targetPosition.addY( targetHeight );
// make height relative to the ground
_targetPosition.y = world.getHeightAtPosition( targetPosition ) + targetHeight;

		_vectorUtility.setToDifference( _targetPosition, _position );
		let currentDistance = _vectorUtility.getMagnitude();
		let diff = currentDistance - targetDistance;	
		
//if ( diff > 0.7 )
		{	
			_position.addScaled( _vectorUtility, diff * PUSH_FORCE );
		}
	}
	
	//-----------------------------
	this.getOrientation = function()
	{
		return _orientation;
	}
		
	//-----------------------------
	this.getViewDirection = function()
	{
		return _orientation.forward;
	}
	

	//---------------------------------------------
	this.getRadius = function( position, radius )
	{
		_vectorUtility.setToDifference( position, _position );
		
		let distance = _vectorUtility.getMagnitude();
		let scale = _viewportScale / distance;
	
	    return radius * scale;	    
	}
	
	//--------------------------------
	this.resizeViewport = function()
	{
		_viewportCenterX = ( canvasID.width - MAIN_PANEL_WIDTH ) * ONE_HALF;
		_viewportCenterY = canvasID.height * ONE_HALF;
		_viewportScale   = canvasID.height / FIELD_OF_VIEW_EFFECT;
	}
    
	//-----------------------------------
	this.project = function( p )
	{
		_vectorUtility.setToDifference( p, _position );
		_vectorUtility.normalize();
	
		//let dot = _vectorUtility.getDot( _vectorUtility, _orientation.forward );

		//if ( dot < 0.1 )
		{
			//_projected.clear();
		}
		//else
		{
			let horizontalDot = _orientation.rightward.dotWith( _vectorUtility );
			let verticalDot   = _orientation.upward.dotWith   ( _vectorUtility );
			
		
		
//horizontalDot = Math.sin( horizontalDot * Math.PI ) * ONE_HALF;
//verticalDot   = Math.sin( verticalDot   * Math.PI ) * ONE_HALF;
			

			//let scale = canvasID.height / FIELD_OF_VIEW_EFFECT;

		    _projected.x = _viewportCenterX + horizontalDot * _viewportScale;
		    _projected.y = _viewportCenterY - verticalDot   * _viewportScale;
		}
		
	    return _projected;
	}
	
	
	//-------------------------------------------------------------
	this.projectPixelTo3DCoordinate = function( x, y, distance )
	{
		//let scale = canvasID.height * FIELD_OF_VIEW_EFFECT * ONE_HALF;

		let scale = _viewportScale * FIELD_OF_VIEW_EFFECT * FIELD_OF_VIEW_EFFECT * ONE_HALF;


		let xOffset = ( x - _viewportCenterX ) /  scale;
		let yOffset = ( y - _viewportCenterY ) / -scale;
				
		_projectedIntoScene.setXYZ
		(
			_position.x + _orientation.rightward.x * xOffset + _orientation.upward.x * yOffset + _orientation.forward.x * distance,
			_position.y + _orientation.rightward.y * xOffset + _orientation.upward.y * yOffset + _orientation.forward.y * distance,
			_position.z + _orientation.rightward.z * xOffset + _orientation.upward.z * yOffset + _orientation.forward.z * distance
		);
		
		return _projectedIntoScene;
	}
}



