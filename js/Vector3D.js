function Vector3D()
{	
    "use strict";

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
	
	//-----------------------------------
	this.set = function( v )
	{
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}


	//--------------------------
	this.copyFrom = function(v)
	{	
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	//-----------------------------------
	this.setXYZ = function( x_, y_, z_ )
	{
		this.x = x_;
		this.y = y_;
		this.z = z_;
	}
	
	

	//------------------------------------
	this.addXYZ = function( x_, y_, z_ )
	{
		this.x += x_;
		this.y += y_;
		this.z += z_;	
	} 
	
	/*
	//-------------------------------------------------------------------------------------------
	this.set = function( p_ )
	{
		//if ( p_ === undefined ) { alert( "p undefined" );}
	
		this.x = p_.getX();
		this.y = p_.getY();
		this.z = p_.getZ();

	};//-----------------------------------------------------------

	//-------------------------------------------------------------------------------------------
	this.setToSum = function( v1, v2 )
	{
		x = v1.getX() + v2.getX();
		y = v1.getY() + v2.getY();
		z = v1.getZ() + v2.getZ();
		
	};//-----------------------------------------------------------
    */



	//----------------------------------------
	this.setToDifference = function( v1, v2 )
	{
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;
	} 

	//--------------------------
	this.normalize = function()
	{
		var m = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
		
		if ( m > 0 )
		{
			this.x /= m;
			this.y /= m;
			this.z /= m;
		}
		else
		{
			this.x = 1.0;
			this.y = 0.0;
			this.z = 0.0;
		}
		
	}
	
	
	//------------------------
	this.add = function( v )
	{
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	} 


	//---------------------------
	this.subtract = function( v )
	{
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	}
    
	//--------------------------------------------
	this.addX = function( x_ ) { this.x += x_; }; 
	this.addY = function( y_ ) { this.y += y_; }; 
	this.addZ = function( z_ ) { this.x += z_; }; 


	//-----------------------------
	this.getMagnitude = function()
	{
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	} 
	


	//-------------------------------
	this.getDistanceTo = function(v)
	{
		let xx = v.x - this.x;
		let yy = v.y - this.y;
		let zz = v.z - this.z;

		return Math.sqrt( xx*xx + yy*yy + zz*zz );
	}

	//-----------------------------------------
	this.getDistanceSquaredTo = function(v)
	{
		let xx = v.x - this.x;
		let yy = v.y - this.y;
		let zz = v.z - this.z;

		return xx*xx + yy*yy + zz*zz;
	}


	//-------------------------------------
	this.setToCross = function( v1, v2 )
	{
		this.x = v1.z * v2.y - v1.y * v2.z;
		this.y = v1.x * v2.z - v1.z * v2.x;
		this.z = v1.y * v2.x - v1.x * v2.y;
	}
	

	//-------------------------------------
	this.setToSum = function( v1, v2 )
	{
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;
	}
	
	
	
    /*
	//-------------------------------------------------------------------------------------------
	this.getX = function() { return x; }
	this.getY = function() { return y; }  
	this.getZ = function() { return z; }  

	//-------------------------------------------------------------------------------------------
	this.setX = function( x_ ) { x = x_;  }  
	this.setY = function( y_ ) { y = y_;  }  
	this.setZ = function( z_ ) { z = z_;  }   
    */
	
	//-------------------------------------------------------------------------------------------
	this.clear = function()
	{
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;	
	}
	
    
	//-------------------------
	this.scale = function( s )
	{
		this.x *= s;
		this.y *= s;
		this.z *= s;
	} 
	
	
	//----------------------------------------------
	this.addScaled = function( vectorToAdd, scale ) 
	{ 
		this.x += vectorToAdd.x * scale; 
		this.y += vectorToAdd.y * scale; 
		this.z += vectorToAdd.z * scale; 
	}; 
	
	
	
	/*

	//------------------------------------------------
	this.setToCross = function( v1, v2 )
	{
		x = v1.getZ() * v2.getY() - v1.getY() * v2.getZ();
		y = v1.getX() * v2.getZ() - v1.getZ() * v2.getX();
		z = v1.getY() * v2.getX() - v1.getX() * v2.getY();

	}//------------------------------------------------
*/



	//---------------------------
	this.dotWith = function( v )
	{		
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	
	//--------------------------------
	this.getDot = function( v1, v2 )
	{
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}
	
	

} //---------------------------------------------------------------------------------
 //---------------  END of class constructor ---------------------------------------
//---------------------------------------------------------------------------------




/*

	//----------------------------------------
	// constuctor
	//----------------------------------------
	public Vector3D()
	{
		x = 0.0;
		y = 0.0;
		z = 0.0;

	}//----------------------------------------
	  

	//---------------------------------------------------------------
	// constructor with ability to set via the three components
	//---------------------------------------------------------------
	public Vector3D( double xx, double yy, double zz )
	{
		x = xx;
		y = yy;
		z = zz;

	}//----------------------------------------
	    
	  
	  
	//----------------------------------------
	public void zeroOut()
	{
		x = 0.0;
		y = 0.0;
		z = 0.0;

	}//----------------------------------------
	   

	//----------------------------------------
	public void set( double x_, double y_, double z_ )
	{
		x = x_;
		y = y_;
		z = z_;

	}//----------------------------------------


	//----------------------------------------
	public void set( Vector3D v )
	{
		x = v.x;
		y = v.y;
		z = v.z;

	}//----------------------------------------



	//----------------------------------------
	public void add( Vector3D v )
	{
		x += v.x;
		y += v.y;
		z += v.z;

	}//----------------------------------------
	   

	//----------------------------------------
	public void add( double xx, double yy, double zz )
	{
		x += xx;
		y += yy;
		z += zz;

	}//----------------------------------------
	   


	//----------------------------------------
	public void subtract( Vector3D v )
	{
		x -= v.x;
		y -= v.y;
		z -= v.z;

	}//----------------------------------------
	   

	//----------------------------------------
	public void setToDifference( Vector3D v1, Vector3D v2 )
	{
		x = v1.x - v2.x;
		y = v1.y - v2.y;
		z = v1.z - v2.z;

	}//----------------------------------------


	//----------------------------------------
	public void setToAverage( Vector3D v1, Vector3D v2 )
	{
		x = ( v1.x + v2.x ) * 0.5;
		y = ( v1.y + v2.y ) * 0.5;
		z = ( v1.z + v2.z ) * 0.5;

	}//----------------------------------------
	   

	//----------------------------------------
	public void setToScaled( Vector3D v, double s )
	{
		x = v.x * s;
		y = v.y * s;
		z = v.z * s;

	}//----------------------------------------
	   


	//----------------------------------------
	public void setToSum( Vector3D v1, Vector3D v2 )
	{
		x = v1.x + v2.x;
		y = v1.y + v2.y;
		z = v1.z + v2.z;

	}//----------------------------------------
	   
	   
	   
	   
	//----------------------------------------
	public void scale( double s )
	{
		x *= s;
		y *= s;
		z *= s;

	}//----------------------------------------
	   

	//----------------------------------------
	public void halve()
	{
		x *= 0.5;
		y *= 0.5;
		z *= 0.5;

	}//----------------------------------------
	   
	   

	//----------------------------------------
	public void addScaled( Vector3D v, double s )
	{
		x += v.x * s;
		y += v.y * s;
		z += v.z * s;

	}//----------------------------------------
	   

	//----------------------------------------
	public void subtractScaled( Vector3D v, double s )
	{
		x -= v.x * s;
		y -= v.y * s;
		z -= v.z * s;

	}//----------------------------------------
	   
	   
	//----------------------------------------
	public void normalize()
	{
		double length = Math.sqrt( x*x + y*y + z*z );
	     
		if ( length == 0 )
		{
			//System.out.println( "Yo - trying to normalize a zero-length vector in Vector3D method 'normalize()' " );
			x = 0.0;
			y = 0.0;
			z = 0.0;
		}
		else
		{
			x /= length;
			y /= length;
			z /= length;
		}

	}//----------------------------------------
	   
	  
	//----------------------------------------
	public void setX( double s )
	{ 
		x = s;

	}//----------------------------------------

	//----------------------------------------
	public void setY( double s )
	{ 
		y = s;

	}//----------------------------------------

	//----------------------------------------
	public void setZ( double s )
	{ 
		z = s;

	}//----------------------------------------


	//----------------------------------------
	public double getX()
	{
		return x;

	}//----------------------------------------

	//----------------------------------------
	public double getY()
	{
		return y;

	}//----------------------------------------

	//----------------------------------------
	public double getZ()
	{
		return z;

	}//----------------------------------------


	//----------------------------------------
	public void addX( double a )
	{
		x += a;

	}//----------------------------------------

	//----------------------------------------
	public void addY( double a )
	{
		y += a;

	}//----------------------------------------

	//----------------------------------------
	public void addZ( double a )
	{
		z += a;

	}//----------------------------------------

	//----------------------------------------
	public void scaleX( double scale )
	{ 
		x *= scale;

	}//----------------------------------------

	//----------------------------------------
	public void scaleY( double scale )
	{ 
		y *= scale;

	}//----------------------------------------

	//----------------------------------------
	public void scaleZ( double scale )
	{ 
		z *= scale;

	}//----------------------------------------


	//-----------------------------------------------------
	// This creates a vector with a length of 1.0, 
	// which is aimed in a random direction. It is not
	// exactly evenly distributed about a sphere, but 
	// close enough for some purposes. 
	//-----------------------------------------------------
	public Vector3D getRandomNormal()
	{
		Vector3D r = new Vector3D();

		r.setX( -0.5 + Math.random() );
		r.setY( -0.5 + Math.random() );
		r.setZ( -0.5 + Math.random() );
	   
		r.normalize();
	   
		return r;
	  
	}//----------------------------------------


	//------------------------------------------------
	public double dot ( Vector3D v1, Vector3D v2 )
	{
		return
 		( 
			v1.x * v2.x + 
			v1.y * v2.y + 
			v1.z * v2.z
		);
    
	}//------------------------------------------------
	   
	   
	//------------------------------------------------
	public double dotProduct( Vector3D v1, Vector3D v2 )
	{
		return
 		( 
			v1.x * v2.x + 
			v1.y * v2.y + 
			v1.z * v2.z
		);
    
	}//------------------------------------------------
	   
	   

	//------------------------------------------------
	public double distance( Vector3D v1, Vector3D v2 )
	{
		double xx = v1.x - v2.x;
		double yy = v1.y - v2.y;
		double zz = v1.z - v2.z;

		return Math.sqrt( xx*xx + yy*yy + zz*zz );

	}//-----------------------------------------------
	  


	//------------------------------------------------
	public double distanceTo( Vector3D v )
	{
		double xx = v.x - x;
		double yy = v.y - y;
		double zz = v.z - z;

		return Math.sqrt( xx*xx + yy*yy + zz*zz );

	}//-----------------------------------------------
	  


	//------------------------------------------------
	public double distanceSquared( Vector3D v1, Vector3D v2 )
	{
		Vector3D d = new Vector3D();

		d.x = v1.x - v2.x;
		d.y = v1.y - v2.y;
		d.z = v1.z - v2.z;

		return d.x*d.x + d.y*d.y + d.z*d.z;

	}//-----------------------------------------------
	  


	//------------------------------------------------
	public double length()
	{
		return Math.sqrt( x*x + y*y + z*z );

	}//------------------------------------------------



	//------------------------------------------------
	public double magnitude()
	{
		return Math.sqrt( x*x + y*y + z*z );

	}//------------------------------------------------


     	   	   	  
	//------------------------------------------------
	public double lengthSquared()
	{
		return x*x + y*y + z*z;

	}//------------------------------------------------

     	   	   	  
	  
	//------------------------------------------------
	public double magnitude( Vector3D v )
	{
		return Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );

	}//------------------------------------------------

     	   	   
	//------------------------------------------------
	public double magnitudeSquared()
	{
		return x*x + y*y + z*z;

	}//------------------------------------------------

     	   	   

	//------------------------------------------------
	public Vector3D crossOf( Vector3D v1, Vector3D v2 )
	{
		Vector3D c = new Vector3D();
    
		c.setX( v1.z * v2.y - v1.y * v2.z );
		c.setY( v1.x * v2.z - v1.z * v2.x );
		c.setZ( v1.y * v2.x - v1.x * v2.y );
    
		return c;

	}//------------------------------------------------



	//------------------------------------------------
	public void cross( Vector3D v1, Vector3D v2 )
	{
		x = v1.z * v2.y - v1.y * v2.z;
		y = v1.x * v2.z - v1.z * v2.x;
		z = v1.y * v2.x - v1.x * v2.y;

	}//------------------------------------------------


	   
	//------------------------------------------------
	public void setToCrossProduct( Vector3D v1, Vector3D v2 )
	{
		x = v1.z * v2.y - v1.y * v2.z;
		y = v1.x * v2.z - v1.z * v2.x;
		z = v1.y * v2.x - v1.x * v2.y;

	}//------------------------------------------------


*/


//EXAMPLE...
/*
 var v = [ 1, 0, 0 ];
 var m = oriIdentity();
 var m3 = oriCompose( m1, m2 ); // does m1 first, then m2
*/


