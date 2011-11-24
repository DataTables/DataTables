
/*
 * Variable: oSort
 * Purpose:  Wrapper for the sorting functions that can be used in DataTables
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    The functions provided in this object are basically standard javascript sort
 *   functions - they expect two inputs which they then compare and then return a priority
 *   result. For each sort method added, two functions need to be defined, an ascending sort and
 *   a descending sort.
 */
_oExt.oSort = {
	/*
	 * text sorting
	 */
	"string-pre": function ( a )
	{
		if ( typeof a != 'string' ) { a = ''; }
		return a.toLowerCase();
	},

	"string-asc": function ( x, y )
	{
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},
	
	"string-desc": function ( x, y )
	{
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	},
	
	
	/*
	 * html sorting (ignore html tags)
	 */
	"html-pre": function ( a )
	{
		return a.replace( /<.*?>/g, "" ).toLowerCase();
	},
	
	"html-asc": function ( x, y )
	{
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},
	
	"html-desc": function ( x, y )
	{
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	},
	
	
	/*
	 * date sorting
	 */
	"date-pre": function ( a )
	{
		var x = Date.parse( a );
		
		if ( isNaN(x) || x==="" )
		{
			x = Date.parse( "01/01/1970 00:00:00" );
		}
		return x;
	},

	"date-asc": function ( x, y )
	{
		return x - y;
	},
	
	"date-desc": function ( x, y )
	{
		return y - x;
	},
	
	
	/*
	 * numerical sorting
	 */
	"numeric-asc": function ( a )
	{
		return (a=="-" || a==="") ? 0 : a*1;
	},

	"numeric-asc": function ( x, y )
	{
		return x - y;
	},
	
	"numeric-desc": function ( x, y )
	{
		return y - x;
	}
};
