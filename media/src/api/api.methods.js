/**
 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
 * return the resulting jQuery object.
 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
 *    criterion ("applied") or all TR elements (i.e. no filter).
 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
 *    Can be either 'current', whereby the current sorting of the table is used, or
 *    'original' whereby the original order the data was read into the table is used.
 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
 *    'current' and filter is 'applied', regardless of what they might be given as.
 *  @returns {object} jQuery object, filtered by the given selector.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Highlight every second row
 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
 *    } );
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Filter to rows with 'Webkit' in them, add a background colour and then
 *      // remove the filter, thus highlighting the 'Webkit' rows only.
 *      oTable.fnFilter('Webkit');
 *      oTable.$('tr', {"filter": "applied"}).css('backgroundColor', 'blue');
 *      oTable.fnFilter('');
 *    } );
 */
this.$ = function ( sSelector, oOpts )
{
	return this.api(true).$( sSelector, oOpts );
};


/**
 * Almost identical to $ in operation, but in this case returns the data for the matched
 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
 * rather than any descendants, so the data can be obtained for the row/cell. If matching
 * rows are found, the data returned is the original data array/object that was used to
 * create the row (or a generated array if from a DOM source).
 *
 * This method is often useful in-combination with $ where both functions are given the
 * same parameters and the array indexes will match identically.
 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
 *    criterion ("applied") or all elements (i.e. no filter).
 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
 *    Can be either 'current', whereby the current sorting of the table is used, or
 *    'original' whereby the original order the data was read into the table is used.
 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
 *    'current' and filter is 'applied', regardless of what they might be given as.
 *  @returns {array} Data for the matched elements. If any elements, as a result of the
 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
 *    entry in the array.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Get the data from the first row in the table
 *      var data = oTable._('tr:first');
 *
 *      // Do something useful with the data
 *      alert( "First cell is: "+data[0] );
 *    } );
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Filter to 'Webkit' and get all data for
 *      oTable.fnFilter('Webkit');
 *      var data = oTable._('tr', {"filter": "applied"});
 *
 *      // Do something with the data
 *      alert( data.length+" rows matched the filter" );
 *    } );
 */
this._ = function ( sSelector, oOpts )
{
	return this.api(true).rows( sSelector, oOpts ).data();
};


/**
 * Create a DataTables Api instance, with the currently selected tables for
 * the Api's context.
 * @param {boolean} [traditional=false] Set the API instance's context to be
 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
 *   or if all tables captured in the jQuery object should be used.
 * @return {DataTables.Api}
 */
this.api = function ( traditional )
{
	return traditional ?
		new DataTable.Api(
			_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )
		) :
		new DataTable.Api( this );
};


/**
 * Add a single new row or multiple rows of data to the table. Please note
 * that this is suitable for client-side processing only - if you are using
 * server-side processing (i.e. "bServerSide": true), then to add data, you
 * must add it to the data source, i.e. the server-side, through an Ajax call.
 *  @param {array|object} data The data to be added to the table. This can be:
 *    <ul>
 *      <li>1D array of data - add a single row with the data provided</li>
 *      <li>2D array of arrays - add multiple rows in a single call</li>
 *      <li>object - data object when using <i>mData</i></li>
 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
 *    </ul>
 *  @param {bool} [redraw=true] redraw the table or not
 *  @returns {array} An array of integers, representing the list of indexes in
 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
 *    the table.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    // Global var for counter
 *    var giCount = 2;
 *
 *    $(document).ready(function() {
 *      $('#example').dataTable();
 *    } );
 *
 *    function fnClickAddRow() {
 *      $('#example').dataTable().fnAddData( [
 *        giCount+".1",
 *        giCount+".2",
 *        giCount+".3",
 *        giCount+".4" ]
 *      );
 *
 *      giCount++;
 *    }
 */
this.fnAddData = function( data, redraw )
{
	var api = this.api( true );

	/* Check if we want to add multiple rows or not */
	var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
		api.rows.add( data ) :
		api.row.add( data );

	if ( redraw === undefined || redraw ) {
		api.draw();
	}

	return rows.flatten().toArray();
};


/**
 * This function will make DataTables recalculate the column sizes, based on the data
 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
 * through the sWidth parameter). This can be useful when the width of the table's
 * parent element changes (for example a window resize).
 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable( {
 *        "sScrollY": "200px",
 *        "bPaginate": false
 *      } );
 *
 *      $(window).bind('resize', function () {
 *        oTable.fnAdjustColumnSizing();
 *      } );
 *    } );
 */
this.fnAdjustColumnSizing = function ( bRedraw )
{
	var api = this.api( true ).columns.adjust();
	var settings = api.settings()[0];
	var scroll = settings.oScroll;

	if ( bRedraw === undefined || bRedraw ) {
		api.draw( true );
	}
	else if ( scroll.sX !== "" || scroll.sY !== "" ) {
		/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
		_fnScrollDraw( settings );
	}
};


/**
 * Quickly and simply clear a table
 *  @param {bool} [bRedraw=true] redraw the table or not
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
 *      oTable.fnClearTable();
 *    } );
 */
this.fnClearTable = function( bRedraw )
{
	var api = this.api( true ).clear();

	if ( bRedraw === undefined || bRedraw ) {
		api.draw();
	}
};


/**
 * The exact opposite of 'opening' a row, this function will close any rows which
 * are currently 'open'.
 *  @param {node} nTr the table row to 'close'
 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnClose = function( nTr )
{
	this.api( true ).row( nTr ).child.hide();
};


/**
 * Remove a row for the table
 *  @param {mixed} target The index of the row from aoData to be deleted, or
 *    the TR element you want to delete
 *  @param {function|null} [callBack] Callback function
 *  @param {bool} [redraw=true] Redraw the table or not
 *  @returns {array} The row that was deleted
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Immediately remove the first row
 *      oTable.fnDeleteRow( 0 );
 *    } );
 */
this.fnDeleteRow = function( target, callback, redraw )
{
	var rows = this.api( true ).rows( target );
	var settings = rows.settings()[0];
	var data = settings.aoData[ rows[0][0] ];

	rows.remove();

	if ( callback ) {
		callback.call( this, settings, data );
	}

	if ( redraw === undefined || redraw ) {
		api.draw();
	}

	return data;
};


/**
 * Restore the table to it's original state in the DOM by removing all of DataTables
 * enhancements, alterations to the DOM structure of the table and event listeners.
 *  @param {boolean} [remove=false] Completely remove the table from the DOM
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
 *      var oTable = $('#example').dataTable();
 *      oTable.fnDestroy();
 *    } );
 */
this.fnDestroy = function ( remove )
{
	this.api( true ).destroy( remove );
};


/**
 * Redraw the table
 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
 *      oTable.fnDraw();
 *    } );
 */
this.fnDraw = function( complete )
{
	// Note that this isn't an exact match to the old call to _fnDraw - it takes
	// into account the new data, but can old position.
	this.api( true ).draw( ! complete );
};


/**
 * Filter the input based on data
 *  @param {string} sInput String to filter the table on
 *  @param {int|null} [iColumn] Column to limit filtering to
 *  @param {bool} [bRegex=false] Treat as regular expression or not
 *  @param {bool} [bSmart=true] Perform smart filtering or not
 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Sometime later - filter...
 *      oTable.fnFilter( 'test string' );
 *    } );
 */
this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
{
	var api = this.api( true );

	if ( iColumn === null || iColumn === undefined ) {
		api.search( sInput, bRegex, bSmart, bCaseInsensitive );
	}
	else {
		api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
	}

	api.draw();
};


/**
 * Get the data for the whole table, an individual row or an individual cell based on the
 * provided parameters.
 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
 *    a TR node then the data source for the whole row will be returned. If given as a
 *    TD/TH cell node then iCol will be automatically calculated and the data for the
 *    cell returned. If given as an integer, then this is treated as the aoData internal
 *    data index for the row (see fnGetPosition) and the data for that row used.
 *  @param {int} [col] Optional column index that you want the data of.
 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
 *    returned. If mRow is defined, just data for that row, and is iCol is
 *    defined, only data for the designated cell is returned.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    // Row data
 *    $(document).ready(function() {
 *      oTable = $('#example').dataTable();
 *
 *      oTable.$('tr').click( function () {
 *        var data = oTable.fnGetData( this );
 *        // ... do something with the array / object of data for the row
 *      } );
 *    } );
 *
 *  @example
 *    // Individual cell data
 *    $(document).ready(function() {
 *      oTable = $('#example').dataTable();
 *
 *      oTable.$('td').click( function () {
 *        var sData = oTable.fnGetData( this );
 *        alert( 'The cell clicked on had the value of '+sData );
 *      } );
 *    } );
 */
this.fnGetData = function( src, col )
{
	var api = this.api( true );

	if ( src !== undefined ) {
		var type = src.nodeName ? src.nodeName.toLowerCase() : '';

		return col !== undefined || type == 'td' || type == 'th' ?
			api.cell( src, col ).data() :
			api.row( src ).data();
	}

	return api.data();
};


/**
 * Get an array of the TR nodes that are used in the table's body. Note that you will
 * typically want to use the '$' API method in preference to this as it is more
 * flexible.
 *  @param {int} [iRow] Optional row index for the TR element you want
 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
 *    in the table's body, or iRow is defined, just the TR element requested.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Get the nodes from the table
 *      var nNodes = oTable.fnGetNodes( );
 *    } );
 */
this.fnGetNodes = function( iRow )
{
	var api = this.api( true );

	return iRow !== undefined ?
		api.row( iRow ).node() :
		api.rows().nodes().toArray();
};


/**
 * Get the array indexes of a particular cell from it's DOM element
 * and column index including hidden columns
 *  @param {node} node this can either be a TR, TD or TH in the table's body
 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
 *    if given as a cell, an array of [row index, column index (visible),
 *    column index (all)] is given.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      $('#example tbody td').click( function () {
 *        // Get the position of the current data from the node
 *        var aPos = oTable.fnGetPosition( this );
 *
 *        // Get the data array for this row
 *        var aData = oTable.fnGetData( aPos[0] );
 *
 *        // Update the data array and return the value
 *        aData[ aPos[1] ] = 'clicked';
 *        this.innerHTML = 'clicked';
 *      } );
 *
 *      // Init DataTables
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnGetPosition = function( node )
{
	var api = this.api( true );
	var nodeName = node.nodeName.toUpperCase();

	if ( nodeName == 'TR' ) {
		return api.row( node ).index();
	}
	else if ( nodeName == 'TD' || nodeName == 'TH' ) {
		var cell = api.cell( node ).index();

		return [
			cell.row,
			cell.columnVisible,
			cell.column
		];
	}
	return null;
};


/**
 * Check to see if a row is 'open' or not.
 *  @param {node} nTr the table row to check
 *  @returns {boolean} true if the row is currently open, false otherwise
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnIsOpen = function( nTr )
{
	return this.api( true ).row( nTr ).child.isShown();
};


/**
 * This function will place a new row directly after a row which is currently
 * on display on the page, with the HTML contents that is passed into the
 * function. This can be used, for example, to ask for confirmation that a
 * particular record should be deleted.
 *  @param {node} nTr The table row to 'open'
 *  @param {string|node|jQuery} mHtml The HTML to put into the row
 *  @param {string} sClass Class to give the new TD cell
 *  @returns {node} The row opened. Note that if the table row passed in as the
 *    first parameter, is not found in the table, this method will silently
 *    return.
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnOpen = function( nTr, mHtml, sClass )
{
	return this.api( true ).row( nTr ).child( mHtml, sClass ).show();
};


/**
 * Change the pagination - provides the internal logic for pagination in a simple API
 * function. With this function you can have a DataTables table go to the next,
 * previous, first or last pages.
 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
 *    or page number to jump to (integer), note that page 0 is the first page.
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      oTable.fnPageChange( 'next' );
 *    } );
 */
this.fnPageChange = function ( mAction, bRedraw )
{
	var api = this.api( true ).page( mAction );

	if ( bRedraw === undefined || bRedraw ) {
		api.draw(false);
	}
};


/**
 * Show a particular column
 *  @param {int} iCol The column whose display should be changed
 *  @param {bool} bShow Show (true) or hide (false) the column
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Hide the second column after initialisation
 *      oTable.fnSetColumnVis( 1, false );
 *    } );
 */
this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
{
	var api = this.api( true ).column( iCol ).visible( bShow );

	if ( bRedraw === undefined || bRedraw ) {
		api.columns.adjust().draw();
	}
};


/**
 * Get the settings for a particular table for external manipulation
 *  @returns {object} DataTables settings object. See
 *    {@link DataTable.models.oSettings}
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      var oSettings = oTable.fnSettings();
 *
 *      // Show an example parameter from the settings
 *      alert( oSettings._iDisplayStart );
 *    } );
 */
this.fnSettings = function()
{
	return _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
};


/**
 * Sort the table by a particular column
 *  @param {int} iCol the data index to sort on. Note that this will not match the
 *    'display index' if you have hidden data entries
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Sort immediately with columns 0 and 1
 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
 *    } );
 */
this.fnSort = function( aaSort )
{
	this.api( true ).order( aaSort ).draw();
};


/**
 * Attach a sort listener to an element for a given column
 *  @param {node} nNode the element to attach the sort listener to
 *  @param {int} iColumn the column that a click on this node will sort on
 *  @param {function} [fnCallback] callback function when sort is run
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Sort on column 1, when 'sorter' is clicked on
 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
 *    } );
 */
this.fnSortListener = function( nNode, iColumn, fnCallback )
{
	this.api( true ).order.listener( nNode, iColumn, fnCallback );
};


/**
 * Update a table cell or row - this method will accept either a single value to
 * update the cell with, an array of values with one element for each column or
 * an object in the same format as the original data source. The function is
 * self-referencing in order to make the multi column updates easier.
 *  @param {object|array|string} mData Data to update the cell/row with
 *  @param {node|int} mRow TR element you want to update or the aoData index
 *  @param {int} [iColumn] The column to update, give as null or undefined to
 *    update a whole row.
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @param {bool} [bAction=true] Perform pre-draw actions or not
 *  @returns {int} 0 on success, 1 on error
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
 *    } );
 */
this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
{
	var api = this.api( true );

	if ( iColumn === undefined || iColumn === null ) {
		api.row( mRow ).data( mData );
	}
	else {
		api.cell( mRow, iColumn ).data( mData );
	}

	if ( bAction === undefined || bAction ) {
		api.columns.adjust();
	}

	if ( bRedraw === undefined || bRedraw ) {
		api.draw();
	}
	return 0;
};


/**
 * Provide a common method for plug-ins to check the version of DataTables being used, in order
 * to ensure compatibility.
 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
 *    formats "X" and "X.Y" are also acceptable.
 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
 *    version, or false if this version of DataTales is not suitable
 *  @method
 *  @dtopt API
 *  @deprecated Since v1.10
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
 *    } );
 */
this.fnVersionCheck = DataTable.ext.fnVersionCheck;

