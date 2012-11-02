

$.extend( DataTable.ext.aTypes, [
	/*
	 * Function: -
	 * Purpose:  Check to see if a string is numeric
	 * Returns:  string:'numeric' or null
	 * Inputs:   mixed:data - string to check
	 */
	function ( data )
	{
		return data==='' || data==='-' || (!isNaN( parseFloat(data) ) && isFinite( data )) ?
			'numeric' :
			null;
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
		if ( (iParse !== null && !isNaN(iParse)) || (typeof sData === 'string' && sData.length === 0) )
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
		if ( typeof sData === 'string' && sData.indexOf('<') != -1 && sData.indexOf('>') != -1 )
		{
			return 'html';
		}
		return null;
	}
] );

