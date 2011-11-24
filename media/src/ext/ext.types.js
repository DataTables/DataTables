

/*
 * Variable: aTypes
 * Purpose:  Container for the various type of type detection that dataTables supports
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    The functions in this array are expected to parse a string to see if it is a data
 *   type that it recognises. If so then the function should return the name of the type (a
 *   corresponding sort function should be defined!), if the type is not recognised then the
 *   function should return null such that the parser and move on to check the next type.
 *   Note that ordering is important in this array - the functions are processed linearly,
 *   starting at index 0.
 *   Note that the input for these functions is always a string! It cannot be any other data
 *   type
 */
_oExt.aTypes = [
	/*
	 * Function: -
	 * Purpose:  Check to see if a string is numeric
	 * Returns:  string:'numeric' or null
	 * Inputs:   mixed:sText - string to check
	 */
	function ( sData )
	{
		/* Allow zero length strings as a number */
		if ( typeof sData == 'number' )
		{
			return 'numeric';
		}
		else if ( typeof sData != 'string' )
		{
			return null;
		}
		
		var sValidFirstChars = "0123456789-";
		var sValidChars = "0123456789.";
		var Char;
		var bDecimal = false;
		
		/* Check for a valid first char (no period and allow negatives) */
		Char = sData.charAt(0); 
		if (sValidFirstChars.indexOf(Char) == -1) 
		{
			return null;
		}
		
		/* Check all the other characters are valid */
		for ( var i=1 ; i<sData.length ; i++ ) 
		{
			Char = sData.charAt(i); 
			if (sValidChars.indexOf(Char) == -1) 
			{
				return null;
			}
			
			/* Only allowed one decimal place... */
			if ( Char == "." )
			{
				if ( bDecimal )
				{
					return null;
				}
				bDecimal = true;
			}
		}
		
		return 'numeric';
	},
	
	/*
	 * Function: -
	 * Purpose:  Check to see if a string is actually a formatted date
	 * Returns:  string:'date' or null
	 * Inputs:   string:sText - string to check
	 */
	function ( sData )
	{
		var iParse = Date.parse(sData);
		if ( (iParse !== null && !isNaN(iParse)) || (typeof sData == 'string' && sData.length === 0) )
		{
			return 'date';
		}
		return null;
	},
	
	/*
	 * Function: -
	 * Purpose:  Check to see if a string should be treated as an HTML string
	 * Returns:  string:'html' or null
	 * Inputs:   string:sText - string to check
	 */
	function ( sData )
	{
		if ( typeof sData == 'string' && sData.indexOf('<') != -1 && sData.indexOf('>') != -1 )
		{
			return 'html';
		}
		return null;
	}
];
