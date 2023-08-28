function Orientation()
{	
	this.rightward	= new Vector3D();
	this.upward		= new Vector3D();
	this.forward	= new Vector3D();
	
	this.rightward.setXYZ( ONE,  ZERO, ZERO );
	this.upward.setXYZ   ( ZERO, ONE,  ZERO );
	this.forward.setXYZ  ( ZERO, ZERO, ONE  );

	let cosineRight	= new Vector3D();
	let cosineUp 	= new Vector3D();
	let cosineFront = new Vector3D();
	let sineRight	= new Vector3D();
	let sineUp   	= new Vector3D();
	let sineFront   = new Vector3D();

	//---------------------------------
	this.setToIdentity = function()
	{
		this.rightward.setXYZ( ONE,  ZERO, ZERO );
		this.upward.setXYZ	 ( ZERO, ONE,  ZERO );
		this.forward.setXYZ  ( ZERO, ZERO, ONE  );
	}
	
	//-------------------------------
	this.yaw = function( angle )
	{
		let r = angle * ( Math.PI / 180.0 );
		let s = Math.sin( r );
		let c = Math.cos( r );
		
		cosineFront.copyFrom( this.forward );
		cosineFront.scale(c);
	
		cosineRight.copyFrom( this.rightward );
		cosineRight.scale(c);

		sineFront.copyFrom( this.forward );
		sineFront.scale(s);

		sineRight.copyFrom( this.rightward );
		sineRight.scale(s);
		
		this.forward.copyFrom( cosineFront );
		this.forward.add( sineRight );

		this.rightward.copyFrom( cosineRight );
		this.rightward.subtract( sineFront );		
	}
	
	//-------------------------------
	this.pitch = function( angle )
	{
		let r = angle * ( Math.PI / 180.0 );
		let s = Math.sin( r );
		let c = Math.cos( r );
		
		cosineUp.copyFrom( this.upward );
		cosineUp.scale(c);
	
		cosineFront.copyFrom( this.forward );
		cosineFront.scale(c);

		sineUp.copyFrom( this.upward );
		sineUp.scale(s);

		sineFront.copyFrom( this.forward );
		sineFront.scale(s);
		
		this.upward.copyFrom( cosineUp );
		this.upward.add( sineFront );
		
		this.forward.copyFrom( cosineFront );
		this.forward.add( sineUp );
	}
	
	//-------------------------------
	this.roll = function( angle )
	{
		let r = angle * ( Math.PI / 180.0 );
		let s = Math.sin( r );
		let c = Math.cos( r );
		
		cosineUp.copyFrom( this.upward );
		cosineUp.scale(c);
	
		cosineRight.copyFrom( this.rightward );
		cosineRight.scale(c);

		sineUp.copyFrom( this.upward );
		sineUp.scale(s);

		sineRight.copyFrom( this.rightward );
		sineRight.scale(s);
		
		this.upward.copyFrom( cosineUp );
		this.upward.add( sineRight );
		
		this.rightward.copyFrom( cosineRight );
		this.rightward.add( sineUp );
	}
	
	
/*
//--------------------------------------------------------
this.roll = function( angle )
{
	var r = angle * ( Math.PI / 180.0 );
	var s = Math.sin( r );
	var c = Math.cos( r );

	var cosineUp 	= new Vector3D();
	var cosineRight = new Vector3D();
	var sineUp   	= new Vector3D();
	var sineRight   = new Vector3D();

	cosineUp.setXYZ
	(
		up.x * c,
		up.y * c,
		up.z * c
	);

	cosineRight.setXYZ
	(
		right.x * c,
		right.y * c,
		right.z * c
	);

	sineUp.setXYZ
	(
		up.x * s,
		up.y * s,
		up.z * s
	);

	sineRight.setXYZ
	(
		right.x * s,
		right.y * s,
		right.z * s
	);

	up.setXYZ
	(
		cosineUp.x + sineRight.x,
		cosineUp.y + sineRight.y,
		cosineUp.z + sineRight.z
	);

	right.setXYZ
	(
		cosineRight.x - sineUp.x,
		cosineRight.y - sineUp.y,
		cosineRight.z - sineUp.z
	);
	
}//----------------------------------------
*/


/*
	//-------------------------------------------------------------------------------------------
	this.pushFrontAxisTowardsDirection = function( force, direction, upVector )
	{
		var v = new Vector3D();
		v.setToDifference( direction, front );
		
		front.set( direction );
		front.normalize();

		this.orthogonalizeAndNormalize();

	};//-----------------------------------------------------------
*/




/*
	//----------------------------------------------------------------
	this.forceAxisInDirection = function( whichAxis, direction, forceAmount )
	{
		var diff = new Vector3D();

		if ( whichAxis == 0 )
		{
			diff.setToDifference( direction, right );
			right.addScaled( diff, forceAmount );
			right.normalize();
			up.setToCross( right, front );
			up.normalize();
			front.setToCross( up, right );
			front.normalize();
		}
		else if ( whichAxis == 1 )
		{
			diff.setToDifference( direction, up );
			up.addScaled( diff, forceAmount );
			up.normalize();
			front.setToCross( up, right );
			front.normalize();
			right.setToCross( front, up );
			right.normalize();
		}
		else if ( whichAxis == 2 )
		{
			diff.setToDifference( direction, front );
			front.addScaled( diff, forceAmount );
			front.normalize();
			right.setToCross( front, up );
			right.normalize();
			up.setToCross( right, front );
			up.normalize();
		}
		
		
//this.orthogonalizeAndNormalize();

	}//----------------------------------------------------------------
*/

/*
	//----------------------------------------------------------------
	this.orthogonalizeAndNormalize = function()
	{
		right.setToCross( front, up );
		right.normalize();

		up.setToCross( right, front );
		up.normalize();

		front.setToCross( up, right );
		front.normalize();
		
	}; //-----------------------------------------------
*/


/*
//--------------------------------------------------------
this.render = function( p, size )
{
	var r = new Vector3D();
	var u = new Vector3D();
	var f = new Vector3D();
	
	r.set( right 	);
	u.set( up 		);
	f.set( front 	);
	
	r.scale( size );
	u.scale( size );
	f.scale( size );

	r.add( p );
	u.add( p );
	f.add( p );
	
	var p			= camera.project3DCoordinateToViewport( p );
	var rightAxis 	= camera.project3DCoordinateToViewport( r );
	var upAxis 		= camera.project3DCoordinateToViewport( u );
	var frontAxis 	= camera.project3DCoordinateToViewport( f );


	if ( p.x > 0 ) 
	{
		canvas.beginPath();
	
		canvas.lineWidth = 3;
		canvas.strokeStyle  = "rgb( 200, 0, 0 )"; 
		canvas.moveTo( p.x, p.y );
		canvas.lineTo( rightAxis.x, rightAxis.y );
		canvas.stroke();
	
		canvas.beginPath();
		canvas.strokeStyle  = "rgb( 0, 200, 0 )"; 
		canvas.moveTo( p.x, p.y );
		canvas.lineTo( upAxis.x, upAxis.y );
		canvas.stroke();
	
		canvas.beginPath();
		canvas.strokeStyle  = "rgb( 0, 0, 200 )"; 
		canvas.moveTo( p.x, p.y );
		canvas.lineTo( frontAxis.x, frontAxis.y );
		canvas.stroke();
	}

}//----------------------------------------
*/





/*
	
	       
	
	//----------------------------------------
	public void setComponents( Vector3D r, Vector3D u, Vector3D f )	    
	{
		right.set( r ); 
		up.set   ( u ); 
		front.set( f ); 
	       
	}//----------------------------------------
	
	    
	//----------------------------------------
	public void yaw( double angle )
	{
		double r = angle * PI_180;
		double s = Math.sin( r );
 		double c = Math.cos( r );
   
		Vector3D cosineFront = new Vector3D();
		Vector3D cosineRight = new Vector3D();
		Vector3D sineFront   = new Vector3D();
		Vector3D sineRight   = new Vector3D();
   
		cosineFront.setToScaled( front, c );
		cosineRight.setToScaled( right, c );
		sineFront.setToScaled( front, s );
		sineRight.setToScaled( right, s );
   
		front.setToSum       ( cosineFront, sineRight );
		right.setToDifference( cosineRight, sineFront );
     
	}//----------------------------------------


	//----------------------------------------
	public void pitch( double angle )
	{
		double r = angle * PI_180;
		double s = Math.sin( r );
		double c = Math.cos( r );
   
		Vector3D cosineUp	= new Vector3D();
		Vector3D cosineFront	= new Vector3D();
		Vector3D sineUp		= new Vector3D();
		Vector3D sineFront	= new Vector3D();
   
 		cosineUp.setToScaled	( up,    c );
		cosineFront.setToScaled	( front, c );
		sineUp.setToScaled	( up,    s );
		sineFront.setToScaled	( front, s );
   
		up.setToSum          ( cosineUp,   sineFront );
		front.setToDifference( cosineFront, sineUp   );
  
	}//----------------------------------------




	//----------------------------------------
	public void roll( double angle )
	{
		double r = angle * PI_180;
		double s = Math.sin( r );
		double c = Math.cos( r );
   
		Vector3D cosineUp	= new Vector3D();
		Vector3D cosineRight	= new Vector3D();
		Vector3D sineUp		= new Vector3D();
		Vector3D sineRight	= new Vector3D();
   
		cosineUp.setToScaled	( up,    c );
		cosineRight.setToScaled	( right, c );
		sineUp.setToScaled	( up,    s );
		sineRight.setToScaled	( right, s );
   
		up.setToSum          ( cosineUp,	sineRight	);
		right.setToDifference( cosineRight,	sineUp		);
   
	}//----------------------------------------





	//---------------------------------------------------------
	public void previousRotateAboutVector( Vector3D rotationVector )
	{
		Vector3D rightCross	= new Vector3D();
		Vector3D upCross	= new Vector3D();
		Vector3D frontCross	= new Vector3D();

		rightCross.setToCross	( rotationVector, right );
		upCross.setToCross	( rotationVector, up );
		frontCross.setToCross	( rotationVector, front );

		right.add	( rightCross	);
		up.add		( upCross	);
		front.add	( frontCross	);

		orthogonalizeAndNormalize();

	}//----------------------------------------








	//---------------------------------------------------------
	public void rotateAboutVector( Vector3D rotationVector )
	{
//System.out.println( "");
//System.out.println( "");
//System.out.println( "-------------------------------------");


//right.set	( 1.0, 0.0, 0.0 );
//up.set	( 0.0, 1.0, 0.0 );
//front.set	( 0.0, 0.0, 1.0 );

//rotationVector.set( 0.0, 45.0, 0.0 );


//System.out.println( "right	= " 	+ right.x		+ "  " 	+ right.y		+ "  "	+ right.z	);
//System.out.println( "up		= "	+ up.x 		+ "  "	+ up.y		+ "  "	+ up.z	);
//System.out.println( "front	= "	+ front.x 		+ "  "	+ front.y		+ "  "	+ front.z	);

//System.out.println( "rv	= " + rotationVector.x + "  "	+ rotationVector.y	+ "  "	+ rotationVector.z	);

		double length = rotationVector.length();

		if ( length > 0.0 )
		{
			Vector3D rotationNormal = new Vector3D();
			rotationNormal.setToScaled( rotationVector, 1.0 / length );

			Vector3D upSin		= new Vector3D();
			Vector3D frontSin	= new Vector3D();
			Vector3D upCos		= new Vector3D();
			Vector3D frontCos	= new Vector3D();

			upSin.setToCross    ( rotationNormal, up );
			frontSin.setToCross ( rotationNormal, front );

//System.out.println( "upSin = " 		+ upSin.x		+ "  " 	+ upSin.y		+ "  "	+ upSin.z	);
//System.out.println( "frontSin = "	+ frontSin.x 	+ "  "	+ frontSin.y	+ "  "	+ frontSin.z	);

//System.out.println( "length of upSin	= " + upSin.length() 	);
//System.out.println( "length of frontSin = " + frontSin.length() );

			upCos.setToCross    ( upSin,    rotationNormal );
			frontCos.setToCross ( frontSin, rotationNormal );

//System.out.println( "upCos = " 		+ upCos.x		+ "  " 	+ upCos.y		+ "  "	+ upCos.z	);
//System.out.println( "frontCos = "	+ frontCos.x 	+ "  "	+ frontCos.y	+ "  "	+ frontCos.z	);

//System.out.println( "length of upCos		= " + upCos.length() 	);
//System.out.println( "length of frontCos	= " + frontCos.length()	);

			double radian = length * ( Math.PI / 180.0 );

			double sine   =	Math.sin( radian );
			double cosine =	Math.cos( radian ) - 1.0;

//System.out.println( "sine	= " + sine	);
//System.out.println( "cosine	= " + cosine	);

			up.addScaled   	( upCos,	cosine	);
			front.addScaled	( frontCos,	cosine	);
			up.addScaled   	( upSin,	sine	);
			front.addScaled	( frontSin,	sine	);

			orthogonalizeAndNormalize();

//System.out.println( "right = " 	+ right.x	+ "  " 	+ right.y	+ "  "	+ right.z	);
//System.out.println( "up = " 	+ up.x	+ "  " 	+ up.y	+ "  "	+ up.z	);
//System.out.println( "front = "	+ front.x	+ "  "	+ front.y	+ "  "	+ front.z	);

		}


	}//-------------------------------------------------------------------------------------





	//----------------------------------------------------------------
	public Vector3D getUpDirection()
	{
		return up;

	}//----------------------------------------------------------------

	//----------------------------------------------------------------
	public Vector3D getRightDirection()
	{
		return right;

	}//----------------------------------------------------------------

	//----------------------------------------------------------------
	public Vector3D getFrontDirection()
	{
		return front;

	}//----------------------------------------------------------------
*/





} //---------------------------------------------------------------------------------
 //---------------  END of class constructor ---------------------------------------
//---------------------------------------------------------------------------------

