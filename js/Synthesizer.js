"use strict";

const NULL_INSTRUMENT    = -1;
const BUZZ_INSTRUMENT    =  0;
const SINE_INSTRUMENT    =  1;
const PING_INSTRUMENT    =  2;
const NOISE_INSTRUMENT   =  3;
const CLICK_INSTRUMENT   =  4;
const DRUM_INSTRUMENT    =  5;
const CRASH_INSTRUMENT   =  6;
const CHIME_INSTRUMENT   =  7;
const SPACEY_INSTRUMENT  =  8;
const CYMBAL_INSTRUMENT  =  9;
const GONG_INSTRUMENT    = 10;
const DEBUSSY_INSTRUMENT = 11;
const RICH_INSTRUMENT    = 12;
const SPOOK_INSTRUMENT   = 13;
const CHIRP_INSTRUMENT   = 14;
const MINOR_INSTRUMENT   = 15;
const NUM_INSTRUMENTS    = 16;

//----------------------
function Synthesizer()
{
	const MAX_SIMULTANEOUS_SOUND_EVENTS 	= 10;
	const MAX_OSCILLATORS_PER_SOUND_EVENT	= 6;
	const NULL_SOUND_EVENT      			= -1;
	const NUM_NOTES_IN_OCTAVE 				= 12;
	const MAX_NOISE             			= 1000;	
	
    const OVERTONE_0 = 0;   // the fundmental tone
    const OVERTONE_1 = 12;  // octave
    const OVERTONE_2 = 19;  // octave + 5th
    const OVERTONE_3 = 24;  // 2 octaves
    const OVERTONE_4 = 28;  // 2 octaves + major 3rd
    const OVERTONE_5 = 31;  // 2 octaves + 5th
    const OVERTONE_6 = 34;  // 2 octaves + minor 7th

    const NUM_OVERTONES = 7;
	
	function InstrumentWaveParameters()
	{
		this.volume 		 = 0;
		this.attackDuration  = 0;
		this.sustainDuration = 0;
		this.decayDuration   = 0;
		this.pitchOffset 	 = 0;
		this.noise 	 		 = 0;
	}
	
	//----------------------
	function Instrument()
	{			
		this.waveParams = new Array( MAX_OSCILLATORS_PER_SOUND_EVENT );

		for (let w=0; w<MAX_OSCILLATORS_PER_SOUND_EVENT; w++)
		{
			this.waveParams[w] = new InstrumentWaveParameters();
		}
				 
	} // Instrument ---------------------------

	//----------------
	function Wave()
	{	
		this.oscillator	= _audioContext.createOscillator();
		this.envelope	= _audioContext.createGain();
	}
	
	//----------------------
	function SoundEvent()
	{	
		this.playing 		= false;
		this.instrument 	= NULL_INSTRUMENT;
		this.startTime 		= 0;
		this.sustainTime 	= 0;
		this.decayTime 		= 0;
		this.endTime 		= 0;
		this.waves	    	= new Array( MAX_OSCILLATORS_PER_SOUND_EVENT );
	}

	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	
	let _audioContext 	= new AudioContext();
	let _soundEvents	= new Array( MAX_SIMULTANEOUS_SOUND_EVENTS );
	let _instruments	= new Array( NUM_INSTRUMENTS );
	
	//-------------------------------
	// initialize
	//-------------------------------
	this.initialize = function()
    {		
        //console.log( "initialize synthesizer" );
        
		for (let s=0; s<MAX_SIMULTANEOUS_SOUND_EVENTS; s++)
		{
			_soundEvents[s] = new SoundEvent();
			_soundEvents[s].playing 	= false;
			_soundEvents[s].instrument  = 1;
			_soundEvents[s].startTime 	= 0;
			_soundEvents[s].sustainTime = 0;
			_soundEvents[s].decayTime 	= 0;
			_soundEvents[s].endTime 	= 0;
			
			for (let w=0; w<MAX_OSCILLATORS_PER_SOUND_EVENT; w++)
			{			
				_soundEvents[s].waves[w] = new Wave();
				_soundEvents[s].waves[w].envelope.connect( _audioContext.destination );		
				_soundEvents[s].waves[w].envelope.gain.setValueAtTime( ZERO, 0 );
				_soundEvents[s].waves[w].oscillator.connect( _soundEvents[s].waves[w].envelope );
				_soundEvents[s].waves[w].oscillator.type = "sine";
				_soundEvents[s].waves[w].oscillator.start(0);
			}
		}
				
		for (let i=0; i<NUM_INSTRUMENTS; i++)
		{
            _instruments[i] = new Instrument();		
			this.configureInstrument(i);
	
			// under coinstruction
			//this.randomizeInstrument(i);
        }		
	}
	
	//--------------------------------------
	this.configureInstrument = function(i)
	{
		//---------------------------------------------------------
		// default for all instruments
		//---------------------------------------------------------
		for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
		{
			_instruments[i].waveParams[o].volume 		  = 0;
			_instruments[i].waveParams[o].attackDuration  = 0.001;
			_instruments[i].waveParams[o].sustainDuration = 0.001;
			_instruments[i].waveParams[o].decayDuration   = 0.001;
			_instruments[i].waveParams[o].noise 	  	  = 0;
			_instruments[i].waveParams[o].pitchOffset 	  = 0;
			
			//--------------------------------------------------------------------------
			// by default, these sound components correspond to the overtone series...
			//--------------------------------------------------------------------------
			if ( o === 0 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_0; }
			if ( o === 1 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_1; }
			if ( o === 2 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_2; }
			if ( o === 3 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_3; }
			if ( o === 4 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_4; }
			if ( o === 5 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_5; }
			if ( o === 6 ) { _instruments[i].waveParams[o].pitchOffset = OVERTONE_6; }
		}
		
		if ( i === BUZZ_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{                    
				_instruments[i].waveParams[o].volume    	  = 0.2;
				_instruments[i].waveParams[o].attackDuration  = 0.001;
				_instruments[i].waveParams[o].sustainDuration = 0.04;
				_instruments[i].waveParams[o].decayDuration   = 0.001;
			}
		}	
		else if ( i === NOISE_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{              
				_instruments[i].waveParams[o].volume         = 0.1;
				_instruments[i].waveParams[o].attackDuration = 0.01;
				_instruments[i].waveParams[o].decayDuration  = 0.01;
				_instruments[i].waveParams[o].pitchOffset    = o * 1.4;
				_instruments[i].waveParams[o].noise          = 0.2;
			}
		}
		else if ( i === CYMBAL_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume         = 0.1;
				_instruments[i].waveParams[o].attackDuration = 0.001;
				_instruments[i].waveParams[o].decayDuration  = 1.0;
				_instruments[i].waveParams[o].noise          = 0.9;
				_instruments[i].waveParams[o].pitchOffset    = o * 0.234;
			}
		}
		else if ( i === SINE_INSTRUMENT )
		{
			_instruments[i].waveParams[0].volume         = 0.5;
			_instruments[i].waveParams[0].attackDuration = 0.08;
			_instruments[i].waveParams[0].decayDuration  = 0.08;
		}
		else if ( i === DRUM_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume      = 0.5;
				_instruments[i].waveParams[o].attackDuration = 0.01;
				_instruments[i].waveParams[o].decayDuration = 0.02;
				_instruments[i].waveParams[o].noise       = 0.9;
				_instruments[i].waveParams[o].pitchOffset = ZERO;
			}
			
			_instruments[i].waveParams[0].noise  = 0.0;
			_instruments[i].waveParams[0].decay  = 0.4;                
		}
		else if ( i === CHIME_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume      = 0.1;
				_instruments[i].waveParams[o].attackDuration = 0.6;
				_instruments[i].waveParams[o].decayDuration = 0.6;
				_instruments[i].waveParams[o].noise       = 0.01;
				_instruments[i].waveParams[o].pitchOffset = o * 0;
			}
		}

		else if ( i === SPOOK_INSTRUMENT )
		{
			let num = 8;
			for (let o=0; o<num; o++)
			{
				if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
				{
					let f = o / ( num - 1 );
					let g = 1 - f;
				
					_instruments[i].waveParams[o].volume      = g * 0.7;
					_instruments[i].waveParams[o].attackDuration = g * 0.2;
					_instruments[i].waveParams[o].decayDuration = g * 1.0;
					_instruments[i].waveParams[o].pitchOffset = g * 0.2;
				}
			}
		}
		else if ( i === MINOR_INSTRUMENT )
		{
			let o = 0;
			if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
			{
				_instruments[i].waveParams[o].waveType     = "square";
				_instruments[i].waveParams[o].volume       = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.0;
				_instruments[i].waveParams[o].decayDuration = 0.04;
				_instruments[i].waveParams[o].noise        = 0.0;
				_instruments[i].waveParams[o].pitchOffset  = 0;             
			}
			o ++;
			if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
			{
				_instruments[i].waveParams[o].waveType     = "sine";
				_instruments[i].waveParams[o].volume       = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.0;
				_instruments[i].waveParams[o].decayDuration = 0.2;
				_instruments[i].waveParams[o].noise        = 0.0;
				_instruments[i].waveParams[o].pitchOffset  = 7;             
			}
			o ++;
			if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
			{
				_instruments[i].waveParams[o].waveType     = "sine";
				_instruments[i].waveParams[o].volume       = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.0;
				_instruments[i].waveParams[o].decayDuration = 0.3;
				_instruments[i].waveParams[o].noise        = 0.0;
				_instruments[i].waveParams[o].pitchOffset  = 0;             
			}			
			o ++;
			if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
			{
				_instruments[i].waveParams[o].waveType     = "sine";
				_instruments[i].waveParams[o].volume       = 0.1;
				_instruments[i].waveParams[o].attackDuration = 0.2;
				_instruments[i].waveParams[o].decayDuration = 0.1;
				_instruments[i].waveParams[o].noise        = 0.0;
				_instruments[i].waveParams[o].pitchOffset  = 3;    
			}         
		}
		else if ( i === CHIRP_INSTRUMENT )
		{
			let num = 8;
			for (let o=0; o<num; o++)
			{
				if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
				{
					let f = o / ( num - 1 );
					let g = 1 - f;
				
					_instruments[i].waveParams[o].volume      	 = f * 0.9;
					_instruments[i].waveParams[o].attackDuration = 0.01;
					_instruments[i].waveParams[o].sustainDuration = 0.01;
					_instruments[i].waveParams[o].decayDuration = 0.01;
				}
			}
		}
		
		else if ( i === SPACEY_INSTRUMENT )
		{
			for (let o=0; o<5; o++)
			{
				if ( o < MAX_OSCILLATORS_PER_SOUND_EVENT )
				{
					_instruments[i].waveParams[o].volume      = 0.4;
					_instruments[i].waveParams[o].attackDuration = o * 0.1;
					_instruments[i].waveParams[o].decayDuration = o * 0.01;
					_instruments[i].waveParams[o].noise       = 0.0;
					_instruments[i].waveParams[o].pitchOffset = o * 5;
				}
			}
		}
				
		else if ( i === CRASH_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume      = 0.3;
				_instruments[i].waveParams[o].attackDuration = 0.01;
				_instruments[i].waveParams[o].decayDuration = 0.1;
				_instruments[i].waveParams[o].noise       = 0.9;
				_instruments[i].waveParams[o].pitchOffset = ZERO;
			}
		}
		else if ( i === PING_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].attack = 0.01;
				
				if ( o === 0 ) { _instruments[i].waveParams[o].volume = 0.5; _instruments[i].waveParams[o].decayDuration = 0.1;  }
				if ( o === 1 ) { _instruments[i].waveParams[o].volume = 0.5; _instruments[i].waveParams[o].decayDuration = 0.15; }
				if ( o === 2 ) { _instruments[i].waveParams[o].volume = 0.5; _instruments[i].waveParams[o].decayDuration = 0.2;  }
				if ( o === 3 ) { _instruments[i].waveParams[o].volume = 0.4; _instruments[i].waveParams[o].decayDuration = 0.25; }
				if ( o === 4 ) { _instruments[i].waveParams[o].volume = 0.3; _instruments[i].waveParams[o].decayDuration = 0.3;  }
				if ( o === 5 ) { _instruments[i].waveParams[o].volume = 0.2; _instruments[i].waveParams[o].decayDuration = 0.35; }
				if ( o === 6 ) { _instruments[i].waveParams[o].volume = 0.1; _instruments[i].waveParams[o].decayDuration = 0.4;  }
			}
		}
		else if ( i === CLICK_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume         = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.01;
				_instruments[i].waveParams[o].decayDuration  = 0.01;
				_instruments[i].waveParams[o].pitchOffset    = Math.random() * 2.0;
				_instruments[i].waveParams[o].noise          = Math.random() * 0.0;
			}
		}
		else if ( i === GONG_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume         = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.01;
				_instruments[i].waveParams[o].decayDuration  = 0.2 + ( o / MAX_OSCILLATORS_PER_SOUND_EVENT ) * 0.9;
				_instruments[i].waveParams[o].noise          = 2.0;
			}
		}
		else if ( i === DEBUSSY_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				_instruments[i].waveParams[o].volume       = 0.2;
				_instruments[i].waveParams[o].attackDuration = 0.01 + ( o / MAX_OSCILLATORS_PER_SOUND_EVENT ) * 2.0;
				_instruments[i].waveParams[o].decayDuration = 0.2;// + ( o / NUM_OSCILLATORS_PER_INSTRUMENT ) * 0.9;
				_instruments[i].waveParams[o].noise        = 0.0;
				
				if ( o === 0 ) { _instruments[i].waveParams[o].pitchOffset = 0;  }
				if ( o === 1 ) { _instruments[i].waveParams[o].pitchOffset = 4;  }
				if ( o === 2 ) { _instruments[i].waveParams[o].pitchOffset = 7;  }
				if ( o === 3 ) { _instruments[i].waveParams[o].pitchOffset = 10; }
				if ( o === 4 ) { _instruments[i].waveParams[o].pitchOffset = 14; }
			}
		}
		else if ( i === RICH_INSTRUMENT )
		{
			for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
			{
				if ( o === 0 ) { _instruments[i].waveParams[o].volume = 0.4; _instruments[i].waveParams[o].pitchOffset =  0; }
				if ( o === 1 ) { _instruments[i].waveParams[o].volume = 0.4; _instruments[i].waveParams[o].pitchOffset =  7; }
				if ( o === 2 ) { _instruments[i].waveParams[o].volume = 0.4; _instruments[i].waveParams[o].pitchOffset = 12; }
					
				_instruments[i].waveParams[o].attackDuration = 0.1;
				_instruments[i].waveParams[o].decayDuration = 0.2;
				_instruments[i].waveParams[o].noise        = 0.0;
			}
		}
	}       

	
	//--------------------------------------
	// randomize instrument
	//--------------------------------------
	this.randomizeInstrument = function(i)
	{
		for (let w=0; w<MAX_OSCILLATORS_PER_SOUND_EVENT; w++)
		{
			_instruments[i].waveParams[w].volume 		 	= 0.05 + Math.random() * 0.2;
			_instruments[i].waveParams[w].attackDuration  	= 0.0  + Math.random() * Math.random() * 0.2;
			_instruments[i].waveParams[w].sustainDuration 	= 0.0  + Math.random() * Math.random() * 0.2;
			_instruments[i].waveParams[w].decayDuration   	= 0.0  + Math.random() * 0.5;
			//_instruments[i].waveParams[w].pitchOffset 	 	= 0.0;
			_instruments[i].waveParams[w].noise 	 	 	= 0.0;
			
			if ( Math.random() > 0.8 )
			{
				//_instruments[i].waveParams[w].noise = Math.random() * Math.random() * 0.5;
			}
    	}
	}
	
	//-----------------------------------------------------------------
	// play sound
	//-----------------------------------------------------------------
	this.playSound = function( instrument, pitch, volume, duration )
	{
	    //-----------------------------------------------------------------
	    // find a free (empty, non-playing) element in the array of 
	    // sound events, and initialize it to start playing the sound...
	    //-----------------------------------------------------------------
		let s = this.getFreeSoundEvent();

		if ( s != NULL_SOUND_EVENT )
		{
			_soundEvents[s].playing = true;

			for (let w=0; w<MAX_OSCILLATORS_PER_SOUND_EVENT; w++)
			{
				_soundEvents[s].waves[w].envelope.gain.cancelScheduledValues( 0 );
			
				let adjustedPitch = pitch + _instruments[ instrument ].waveParams[w].pitchOffset;				
				let frequency = Math.floor( 440 * Math.pow( 2, ( adjustedPitch - 69 ) / NUM_NOTES_IN_OCTAVE ) );	
				
                let noise = _instruments[ instrument ].waveParams[w].noise * MAX_NOISE;
                frequency += ( -noise * ONE_HALF + Math.random() * noise );
				
				_soundEvents[s].waves[w].oscillator.frequency.setValueAtTime( frequency, _audioContext.currentTime );	

				if ( duration < _instruments[ instrument ].waveParams[w].sustainDuration  ) 
				   { duration = _instruments[ instrument ].waveParams[w].sustainDuration; }

				_soundEvents[s].startTime   = _audioContext.currentTime;
				_soundEvents[s].sustainTime = _soundEvents[s].startTime   + _instruments[ instrument ].waveParams[w].attackDuration;
				_soundEvents[s].decayTime   = _soundEvents[s].sustainTime + duration;
				_soundEvents[s].endTime     = _soundEvents[s].decayTime   + _instruments[ instrument ].waveParams[w].decayDuration;

				let v = volume * _instruments[ instrument ].waveParams[w].volume;

				//---------------------------------------------------------------------------------------------
				// attack
				//---------------------------------------------------------------------------------------------
				_soundEvents[s].waves[w].envelope.gain.setValueAtTime( ZERO, _soundEvents[s].startTime );
				_soundEvents[s].waves[w].envelope.gain.linearRampToValueAtTime( v, _soundEvents[s].sustainTime );

				//---------------------------------------------------------------------------------------------
				// decay
				//---------------------------------------------------------------------------------------------
				_soundEvents[s].waves[w].envelope.gain.linearRampToValueAtTime( ZERO, _soundEvents[s].endTime );
			}
							
			return;
		}
	}
	
	//-----------------------------------
	this.getFreeSoundEvent = function()
	{
		let freeSoundEvent = NULL_SOUND_EVENT;
		let looking = true;
		let n = 0;

		while ( looking )
		{
			if ( !_soundEvents[n].playing )
			{
				freeSoundEvent = n;
				looking = false;
			}

			n ++;

			if ( n >= MAX_SIMULTANEOUS_SOUND_EVENTS )
			{
				looking = false;
			}
		}

		return freeSoundEvent;
	}
	
	//-------------------------
	// update
	//-------------------------
	this.update = function()
	{	
		for (let s=0; s<MAX_SIMULTANEOUS_SOUND_EVENTS; s++)
		{
			if ( _soundEvents[s].playing )
			{
				if ( _audioContext.currentTime > _soundEvents[s].endTime )
				{			
					_soundEvents[s].playing = false;
					//console.log( "stop" );
				}
			}
		}
    }

	//------------------------------
	// render
	//------------------------------
	this.render = function( x, y )
	{        
		for (let n=0; n<MAX_SIMULTANEOUS_SOUND_EVENTS; n++)
		{
            canvas.fillStyle = "rgb( 80, 80, 80 )";
            
            if ( _soundEvents[n].playing )
            {
                canvas.fillStyle = "rgb( 255, 255, 255 )";
            }
            
            canvas.beginPath();
            canvas.arc( x + n * 40, y, 7, 0, Math.PI*2, false );
            canvas.fill();	
            
            for (let o=0; o<MAX_OSCILLATORS_PER_SOUND_EVENT; o++)
            {
                canvas.fillStyle = "rgb( 80, 80, 80 )";
                
                if ( _soundEvents[n].playing )
                {
                    canvas.fillStyle = "rgb( 100, 100, 100 )";
                    
					if (( _audioContext.currentTime >  _soundEvents[n].startTime   )
					&&  ( _audioContext.currentTime <= _soundEvents[n].sustainTime ))
					{			
						canvas.fillStyle = "rgb( 255, 100, 100 )";
					}                    
					
					else if (( _audioContext.currentTime >  _soundEvents[n].sustainTime )
					&&  ( _audioContext.currentTime <= _soundEvents[n].decayTime   ))
					{			
						canvas.fillStyle = "rgb( 100, 255, 100 )";
					}                    

					else if (( _audioContext.currentTime >  _soundEvents[n].decayTime )
					&&  ( _audioContext.currentTime <= _soundEvents[n].endTime   ))
					{			
						canvas.fillStyle = "rgb( 100, 100, 255 )";
					}                    
                }
                
                canvas.beginPath();
                canvas.arc( x + n * 40, y + o * 40, 10, 0, Math.PI*2, false );
                canvas.fill();	
            }
        }
	}
	
	//----------------------------------
	// turn off all sounds
	//----------------------------------
	this.turnOffAllSounds = function()
	{
		console.log( "turnOffAllSounds" );

		for (let s=0; s<MAX_SIMULTANEOUS_SOUND_EVENTS; s++)
		{
			_soundEvents[s].playing 	= false;
			_soundEvents[s].instrument  = NULL_INSTRUMENT;
			_soundEvents[s].startTime 	= 0;
			_soundEvents[s].sustainTime = 0;
			_soundEvents[s].decayTime 	= 0;
			_soundEvents[s].endTime 	= 0;
			
			for (let w=0; w<MAX_OSCILLATORS_PER_SOUND_EVENT; w++)
			{			
				_soundEvents[s].waves[w].envelope.gain.setValueAtTime( ZERO, 0 );				
				_soundEvents[s].waves[w].oscillator.type = "sine";
			}
		}
	}
}
