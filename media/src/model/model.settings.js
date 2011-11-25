
/*
 * Variable: dataTableSettings
 * Purpose:  Store the settings for each dataTables instance
 * Scope:    jQuery.fn
 */
var _aoSettings = [];

/*
 * Function: classSettings
 * Purpose:  Settings container function for all 'class' properties which are required
 *   by dataTables
 * Returns:  -
 * Inputs:   -
 */
DataTable.models.oSettings = {
	
	/*
	 * Variable: oFeatures
	 * Purpose:  Indicate the enablement of key dataTable features
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	oFeatures: {
		"bPaginate": true,
		"bLengthChange": true,
		"bFilter": true,
		"bSort": true,
		"bInfo": true,
		"bAutoWidth": true,
		"bProcessing": false,
		"bSortClasses": true,
		"bStateSave": false,
		"bServerSide": false,
		"bDeferRender": false
	},
	
	/*
	 * Variable: oScroll
	 * Purpose:  Container for scrolling options
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	oScroll: {
		"sX": "",
		"sXInner": "",
		"sY": "",
		"bCollapse": false,
		"bInfinite": false,
		"iLoadGap": 100,
		"iBarWidth": 0,
		"bAutoCss": true
	},
	
	/*
	 * Variable: aanFeatures
	 * Purpose:  Array referencing the nodes which are used for the features
	 * Scope:    jQuery.dataTable.classSettings 
	 * Notes:    The parameters of this object match what is allowed by sDom - i.e.
	 *   'l' - Length changing
	 *   'f' - Filtering input
	 *   't' - The table!
	 *   'i' - Information
	 *   'p' - Pagination
	 *   'r' - pRocessing
	 */
	aanFeatures: [],
	
	/*
	 * Variable: oLanguage
	 * Purpose:  Store the language strings used by dataTables
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    The words in the format _VAR_ are variables which are dynamically replaced
	 *   by javascript
	 */
	oLanguage: {
		"sProcessing": "Processing...",
		"sLengthMenu": "Show _MENU_ entries",
		"sZeroRecords": "No matching records found",
		"sEmptyTable": "No data available in table",
		"sLoadingRecords": "Loading...",
		"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
		"sInfoEmpty": "Showing 0 to 0 of 0 entries",
		"sInfoFiltered": "(filtered from _MAX_ total entries)",
		"sInfoPostFix": "",
		"sInfoThousands": ",",
		"sSearch": "Search:",
		"sUrl": "",
		"oPaginate": {
			"sFirst":    "First",
			"sPrevious": "Previous",
			"sNext":     "Next",
			"sLast":     "Last"
		},
		"fnInfoCallback": null
	},
	
	/*
	 * Variable: aoData
	 * Purpose:  Store data information
	 * Scope:    jQuery.dataTable.classSettings 
	 * Notes:    This is an array of objects with the following parameters:
	 *   int: _iId - internal id for tracking
	 *   array: _aData - internal data - used for sorting / filtering etc
	 *   node: nTr - display node
	 *   array node: _anHidden - hidden TD nodes
	 *   string: _sRowStripe
	 */
	aoData: [],
	
	/*
	 * Variable: aiDisplay
	 * Purpose:  Array of indexes which are in the current display (after filtering etc)
	 * Scope:    jQuery.dataTable.classSettings
	 */
	aiDisplay: [],
	
	/*
	 * Variable: aiDisplayMaster
	 * Purpose:  Array of indexes for display - no filtering
	 * Scope:    jQuery.dataTable.classSettings
	 */
	aiDisplayMaster: [],
					
	/*
	 * Variable: aoColumns
	 * Purpose:  Store information about each column that is in use
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	aoColumns: [],
					
	/*
	 * Variable: aoHeader
	 * Purpose:  Store information about the table's header
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	aoHeader: [],
					
	/*
	 * Variable: aoFooter
	 * Purpose:  Store information about the table's footer
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	aoFooter: [],
	
	/*
	 * Variable: iNextId
	 * Purpose:  Store the next unique id to be used for a new row
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	iNextId: 0,
	
	/*
	 * Variable: asDataSearch
	 * Purpose:  Search data array for regular expression searching
	 * Scope:    jQuery.dataTable.classSettings
	 */
	asDataSearch: [],
	
	/*
	 * Variable: oPreviousSearch
	 * Purpose:  Store the previous search incase we want to force a re-search
	 *   or compare the old search to a new one
	 * Scope:    jQuery.dataTable.classSettings
	 */
	oPreviousSearch: {
		"sSearch": "",
		"bRegex": false,
		"bSmart": true
	},
	
	/*
	 * Variable: aoPreSearchCols
	 * Purpose:  Store the previous search for each column
	 * Scope:    jQuery.dataTable.classSettings
	 */
	aoPreSearchCols: [],
	
	/*
	 * Variable: aaSorting
	 * Purpose:  Sorting information
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Index 0 - column number
	 *           Index 1 - current sorting direction
	 *           Index 2 - index of asSorting for this column
	 */
	aaSorting: [ [0, 'asc', 0] ],
	
	/*
	 * Variable: aaSortingFixed
	 * Purpose:  Sorting information that is always applied
	 * Scope:    jQuery.dataTable.classSettings
	 */
	aaSortingFixed: null,
	
	/*
	 * Variable: asStripeClasses
	 * Purpose:  Classes to use for the striping of a table
	 * Scope:    jQuery.dataTable.classSettings
	 */
	asStripeClasses: [],
	
	/*
	 * Variable: asDestroyStripes
	 * Purpose:  If restoring a table - we should restore its striping classes as well
	 * Scope:    jQuery.dataTable.classSettings
	 */
	asDestroyStripes: [],
	
	/*
	 * Variable: sDestroyWidth
	 * Purpose:  If restoring a table - we should restore its width
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sDestroyWidth: 0,
	
	/*
	 * Variable: fnRowCallback
	 * Purpose:  Call this function every time a row is inserted (draw)
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnRowCallback: null,
	
	/*
	 * Variable: fnHeaderCallback
	 * Purpose:  Callback function for the header on each draw
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnHeaderCallback: null,
	
	/*
	 * Variable: fnFooterCallback
	 * Purpose:  Callback function for the footer on each draw
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnFooterCallback: null,
	
	/*
	 * Variable: aoDrawCallback
	 * Purpose:  Array of callback functions for draw callback functions
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Each array element is an object with the following parameters:
	 *   function:fn - function to call
	 *   string:sName - name callback (feature). useful for arranging array
	 */
	aoDrawCallback: [],
	
	/*
	 * Variable: fnPreDrawCallback
	 * Purpose:  Callback function for just before the table is redrawn. A return of false
	 *           will be used to cancel the draw.
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnPreDrawCallback: null,
	
	/*
	 * Variable: fnInitComplete
	 * Purpose:  Callback function for when the table has been initialised
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnInitComplete: null,
	
	/*
	 * Variable: sTableId
	 * Purpose:  Cache the table ID for quick access
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sTableId: "",
	
	/*
	 * Variable: nTable
	 * Purpose:  Cache the table node for quick access
	 * Scope:    jQuery.dataTable.classSettings
	 */
	nTable: null,
	
	/*
	 * Variable: nTHead
	 * Purpose:  Permanent ref to the thead element
	 * Scope:    jQuery.dataTable.classSettings
	 */
	nTHead: null,
	
	/*
	 * Variable: nTFoot
	 * Purpose:  Permanent ref to the tfoot element - if it exists
	 * Scope:    jQuery.dataTable.classSettings
	 */
	nTFoot: null,
	
	/*
	 * Variable: nTBody
	 * Purpose:  Permanent ref to the tbody element
	 * Scope:    jQuery.dataTable.classSettings
	 */
	nTBody: null,
	
	/*
	 * Variable: nTableWrapper
	 * Purpose:  Cache the wrapper node (contains all DataTables controlled elements)
	 * Scope:    jQuery.dataTable.classSettings
	 */
	nTableWrapper: null,
	
	/*
	 * Variable: bDeferLoading
	 * Purpose:  Indicate if when using server-side processing the loading of data 
	 *           should be deferred until the second draw
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bDeferLoading: false,
	
	/*
	 * Variable: bInitialised
	 * Purpose:  Indicate if all required information has been read in
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bInitialised: false,
	
	/*
	 * Variable: aoOpenRows
	 * Purpose:  Information about open rows
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Has the parameters 'nTr' and 'nParent'
	 */
	aoOpenRows: [],
	
	/*
	 * Variable: sDom
	 * Purpose:  Dictate the positioning that the created elements will take
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    
	 *   The following options are allowed:
	 *     'l' - Length changing
	 *     'f' - Filtering input
	 *     't' - The table!
	 *     'i' - Information
	 *     'p' - Pagination
	 *     'r' - pRocessing
	 *   The following constants are allowed:
	 *     'H' - jQueryUI theme "header" classes
	 *     'F' - jQueryUI theme "footer" classes
	 *   The following syntax is expected:
	 *     '<' and '>' - div elements
	 *     '<"class" and '>' - div with a class
	 *   Examples:
	 *     '<"wrapper"flipt>', '<lf<t>ip>'
	 */
	sDom: 'lfrtip',
	
	/*
	 * Variable: sPaginationType
	 * Purpose:  Note which type of sorting should be used
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sPaginationType: "two_button",
	
	/*
	 * Variable: iCookieDuration
	 * Purpose:  The cookie duration (for bStateSave) in seconds - default 2 hours
	 * Scope:    jQuery.dataTable.classSettings
	 */
	iCookieDuration: 60 * 60 * 2,
	
	/*
	 * Variable: sCookiePrefix
	 * Purpose:  The cookie name prefix
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sCookiePrefix: "SpryMedia_DataTables_",
	
	/*
	 * Variable: fnCookieCallback
	 * Purpose:  Callback function for cookie creation
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnCookieCallback: null,
	
	/*
	 * Variable: aoStateSave
	 * Purpose:  Array of callback functions for state saving
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Each array element is an object with the following parameters:
	 *   function:fn - function to call. Takes two parameters, oSettings and the JSON string to
	 *     save that has been thus far created. Returns a JSON string to be inserted into a 
	 *     json object (i.e. '"param": [ 0, 1, 2]')
	 *   string:sName - name of callback
	 */
	aoStateSave: [],
	
	/*
	 * Variable: aoStateLoad
	 * Purpose:  Array of callback functions for state loading
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Each array element is an object with the following parameters:
	 *   function:fn - function to call. Takes two parameters, oSettings and the object stored.
	 *     May return false to cancel state loading.
	 *   string:sName - name of callback
	 */
	aoStateLoad: [],
	
	/*
	 * Variable: oLoadedState
	 * Purpose:  State that was loaded from the cookie. Useful for back reference
	 * Scope:    jQuery.dataTable.classSettings
	 */
	oLoadedState: null,
	
	/*
	 * Variable: sAjaxSource
	 * Purpose:  Source url for AJAX data for the table
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sAjaxSource: null,
	
	/*
	 * Variable: sAjaxDataProp
	 * Purpose:  Property from a given object from which to read the table data from. This can
	 *           be an empty string (when not server-side processing), in which case it is 
	 *           assumed an an array is given directly.
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sAjaxDataProp: 'aaData',
	
	/*
	 * Variable: bAjaxDataGet
	 * Purpose:  Note if draw should be blocked while getting data
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bAjaxDataGet: true,
	
	/*
	 * Variable: jqXHR
	 * Purpose:  The last jQuery XHR object that was used for server-side data gathering. 
	 *           This can be used for working with the XHR information in one of the callbacks
	 * Scope:    jQuery.dataTable.classSettings
	 */
	jqXHR: null,
	
	/*
	 * Variable: fnServerData
	 * Purpose:  Function to get the server-side data - can be overruled by the developer
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnServerData: function ( url, data, callback, settings ) {
		settings.jqXHR = $.ajax( {
			"url": url,
			"data": data,
			"success": function (json) {
				$(settings.oInstance).trigger('xhr', settings);
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": settings.sServerMethod,
			"error": function (xhr, error, thrown) {
				if ( error == "parsererror" ) {
					alert( "DataTables warning: JSON data from server could not be parsed. "+
						"This is caused by a JSON formatting error." );
				}
			}
		} );
	},
	
	/*
	 * Variable: aoServerParams
	 * Purpose:  Functions which are called prior to sending an Ajax request so extra parameters
	 *           can easily be sent to the server
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    Each array element is an object with the following parameters:
	 *   function:fn - function to call
	 *   string:sName - name callback - useful for knowing where it came from (plugin etc)
	 */
	aoServerParams: [],
	
	/*
	 * Variable: sServerType
	 * Purpose:  Send the XHR HTTP method - GET or POST (could be PUT or DELETE if required)
	 * Scope:    jQuery.dataTable.classSettings
	 */
	sServerMethod: "GET",
	
	/*
	 * Variable: fnFormatNumber
	 * Purpose:  Format numbers for display
	 * Scope:    jQuery.dataTable.classSettings
	 */
	fnFormatNumber: function ( iIn )
	{
		if ( iIn < 1000 )
		{
			/* A small optimisation for what is likely to be the vast majority of use cases */
			return iIn;
		}
		else
		{
			var s=(iIn+""), a=s.split(""), out="", iLen=s.length;
			
			for ( var i=0 ; i<iLen ; i++ )
			{
				if ( i%3 === 0 && i !== 0 )
				{
					out = this.oLanguage.sInfoThousands+out;
				}
				out = a[iLen-i-1]+out;
			}
		}
		return out;
	},
	
	/*
	 * Variable: aLengthMenu
	 * Purpose:  List of options that can be used for the user selectable length menu
	 * Scope:    jQuery.dataTable.classSettings
	 * Note:     This varaible can take for form of a 1D array, in which case the value and the 
	 *   displayed value in the menu are the same, or a 2D array in which case the value comes
	 *   from the first array, and the displayed value to the end user comes from the second
	 *   array. 2D example: [ [ 10, 25, 50, 100, -1 ], [ 10, 25, 50, 100, 'All' ] ];
	 */
	aLengthMenu: [ 10, 25, 50, 100 ],
	
	/*
	 * Variable: iDraw
	 * Purpose:  Counter for the draws that the table does. Also used as a tracker for
	 *   server-side processing
	 * Scope:    jQuery.dataTable.classSettings
	 */
	iDraw: 0,
	
	/*
	 * Variable: bDrawing
	 * Purpose:  Indicate if a redraw is being done - useful for Ajax
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bDrawing: 0,
	
	/*
	 * Variable: iDrawError
	 * Purpose:  Last draw error
	 * Scope:    jQuery.dataTable.classSettings
	 */
	iDrawError: -1,
	
	/*
	 * Variable: _iDisplayLength, _iDisplayStart, _iDisplayEnd
	 * Purpose:  Display length variables
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    These variable must NOT be used externally to get the data length. Rather, use
	 *   the fnRecordsTotal() (etc) functions.
	 */
	_iDisplayLength: 10,
	_iDisplayStart: 0,
	_iDisplayEnd: 10,
	
	/*
	 * Variable: _iRecordsTotal, _iRecordsDisplay
	 * Purpose:  Display length variables used for server side processing
	 * Scope:    jQuery.dataTable.classSettings
	 * Notes:    These variable must NOT be used externally to get the data length. Rather, use
	 *   the fnRecordsTotal() (etc) functions.
	 */
	_iRecordsTotal: 0,
	_iRecordsDisplay: 0,
	
	/*
	 * Variable: bJUI
	 * Purpose:  Should we add the markup needed for jQuery UI theming?
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bJUI: false,
	
	/*
	 * Variable: oClasses
	 * Purpose:  Should we add the markup needed for jQuery UI theming?
	 * Scope:    jQuery.dataTable.classSettings
	 */
	oClasses: null,
	
	/*
	 * Variable: bFiltered and bSorted
	 * Purpose:  Flags to allow callback functions to see what actions have been performed
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bFiltered: false,
	bSorted: false,
	
	/*
	 * Variable: bSortCellsTop
	 * Purpose:  Indicate that if multiple rows are in the header and there is more than one
	 *           unique cell per column, if the top one (true) or bottom one (false) should
	 *           be used for sorting / title by DataTables
	 * Scope:    jQuery.dataTable.classSettings
	 */
	bSortCellsTop: false,
	
	/*
	 * Variable: oInit
	 * Purpose:  Initialisation object that is used for the table
	 * Scope:    jQuery.dataTable.classSettings
	 */
	oInit: null,
	
	/*
	 * Variable: aoDestroyCallback
	 * Purpose:  Destroy callback functions
	 * Scope:    jQuery.dataTable.classSettings
	 */
	aoDestroyCallback: [],

	
	fnRecordsTotal: function ()
	{
		if ( this.oFeatures.bServerSide ) {
			return parseInt(this._iRecordsTotal, 10);
		} else {
			return this.aiDisplayMaster.length;
		}
	},
	
	fnRecordsDisplay: function ()
	{
		if ( this.oFeatures.bServerSide ) {
			return parseInt(this._iRecordsDisplay, 10);
		} else {
			return this.aiDisplay.length;
		}
	},
	
	fnDisplayEnd: function ()
	{
		if ( this.oFeatures.bServerSide ) {
			if ( this.oFeatures.bPaginate === false || this._iDisplayLength == -1 ) {
				return this._iDisplayStart+this.aiDisplay.length;
			} else {
				return Math.min( this._iDisplayStart+this._iDisplayLength, 
					this._iRecordsDisplay );
			}
		} else {
			return this._iDisplayEnd;
		}
	},
	
	/*
	 * Variable: oInstance
	 * Purpose:  The DataTables object for this table
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	oInstance: null,
	
	/*
	 * Variable: sInstance
	 * Purpose:  Unique idendifier for each instance of the DataTables object
	 * Scope:    jQuery.dataTable.classSettings 
	 */
	sInstance: null,

	oClasses: null
};
