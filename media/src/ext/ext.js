
var _oExt = {};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - DataTables extensible objects
 * 
 * The _oExt object is used to provide an area where user defined plugins can be 
 * added to DataTables. The following properties of the object are used:
 *   oApi - Plug-in API functions
 *   aTypes - Auto-detection of types
 *   oSort - Sorting functions used by DataTables (based on the type)
 *   oPagination - Pagination functions for different input styles
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Variable: sVersion
 * Purpose:  Version string for plug-ins to check compatibility
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    Allowed format is a.b.c.d.e where:
 *   a:int, b:int, c:int, d:string(dev|beta), e:int. d and e are optional
 */
_oExt.sVersion = "1.9.0.dev";

/*
 * Variable: sErrMode
 * Purpose:  How should DataTables report an error. Can take the value 'alert' or 'throw'
 * Scope:    jQuery.fn.dataTableExt
 */
_oExt.sErrMode = "alert";

/*
 * Variable: iApiIndex
 * Purpose:  Index for what 'this' index API functions should use
 * Scope:    jQuery.fn.dataTableExt
 */
_oExt.iApiIndex = 0;

/*
 * Variable: aFiltering
 * Purpose:  Container for plugin filtering functions
 * Scope:    jQuery.fn.dataTableExt
 */
_oExt.afnFiltering = [ ];

/*
 * Variable: aoFeatures
 * Purpose:  Container for plugin function functions
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    Array of objects with the following parameters:
 *   fnInit: Function for initialisation of Feature. Takes oSettings and returns node
 *   cFeature: Character that will be matched in sDom - case sensitive
 *   sFeature: Feature name - just for completeness :-)
 */
_oExt.aoFeatures = [ ];

/*
 * Variable: ofnSearch
 * Purpose:  Container for custom filtering functions
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    This is an object (the name should match the type) for custom filtering function,
 *   which can be used for live DOM checking or formatted text filtering
 */
_oExt.ofnSearch = { };

/*
 * Variable: afnSortData
 * Purpose:  Container for custom sorting data source functions
 * Scope:    jQuery.fn.dataTableExt
 * Notes:    Array (associative) of functions which is run prior to a column of this 
 *   'SortDataType' being sorted upon.
 *   Function input parameters:
 *     object:oSettings-  DataTables settings object
 *     int:iColumn - Target column number
 *   Return value: Array of data which exactly matched the full data set size for the column to
 *     be sorted upon
 */
_oExt.afnSortData = [ ];




/**
 * Provide a common method for plug-ins to check the version of DataTables being used, in order
 * to ensure compatibility.
 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
 *    formats "X" and "X.Y" are also acceptable.
 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
 *    version, or false if this version of DataTales is not suitable
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
 *    } );
 */
_oExt.fnVersionCheck = function( sVersion )
{
	/* This is cheap, but very effective */
	var fnZPad = function (Zpad, count)
	{
		while(Zpad.length < count) {
			Zpad += '0';
		}
		return Zpad;
	};
	var aThis = _oExt.sVersion.split('.');
	var aThat = sVersion.split('.');
	var sThis = '', sThat = '';
	
	for ( var i=0, iLen=aThat.length ; i<iLen ; i++ )
	{
		sThis += fnZPad( aThis[i], 3 );
		sThat += fnZPad( aThat[i], 3 );
	}
	
	return parseInt(sThis, 10) >= parseInt(sThat, 10);
};

/*
 * Variable: _oExternConfig
 * Purpose:  Store information for DataTables to access globally about other instances
 * Scope:    jQuery.fn.dataTableExt
 */
_oExt._oExternConfig = {
	/* int:iNextUnique - next unique number for an instance */
	"iNextUnique": 0
};

