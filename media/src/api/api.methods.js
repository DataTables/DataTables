
/*
 * Variable: oApi
 * Purpose:  Container for publicly exposed 'private' functions
 * Scope:    jQuery.dataTable
 */
this.oApi = {};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - API functions
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Function: fnDraw
 * Purpose:  Redraw the table
 * Returns:  -
 * Inputs:   bool:bComplete - Refilter and resort (if enabled) the table before the draw.
 *             Optional: default - true
 */
this.fnDraw = function( bComplete )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	if ( typeof bComplete != 'undefined' && bComplete === false )
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
	else
	{
		_fnReDraw( oSettings );
	}
};

/*
 * Function: fnFilter
 * Purpose:  Filter the input based on data
 * Returns:  -
 * Inputs:   string:sInput - string to filter the table on
 *           int:iColumn - optional - column to limit filtering to
 *           bool:bRegex - optional - treat as regular expression or not - default false
 *           bool:bSmart - optional - perform smart filtering or not - default true
 *           bool:bShowGlobal - optional - show the input global filter in it's input box(es)
 *              - default true
 */
this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	if ( !oSettings.oFeatures.bFilter )
	{
		return;
	}
	
	if ( typeof bRegex == 'undefined' )
	{
		bRegex = false;
	}
	
	if ( typeof bSmart == 'undefined' )
	{
		bSmart = true;
	}
	
	if ( typeof bShowGlobal == 'undefined' )
	{
		bShowGlobal = true;
	}
	
	if ( typeof iColumn == "undefined" || iColumn === null )
	{
		/* Global filter */
		_fnFilterComplete( oSettings, {
			"sSearch":sInput,
			"bRegex": bRegex,
			"bSmart": bSmart
		}, 1 );
		
		if ( bShowGlobal && typeof oSettings.aanFeatures.f != 'undefined' )
		{
			var n = oSettings.aanFeatures.f;
			for ( var i=0, iLen=n.length ; i<iLen ; i++ )
			{
				$('input', n[i]).val( sInput );
			}
		}
	}
	else
	{
		/* Single column filter */
		oSettings.aoPreSearchCols[ iColumn ].sSearch = sInput;
		oSettings.aoPreSearchCols[ iColumn ].bRegex = bRegex;
		oSettings.aoPreSearchCols[ iColumn ].bSmart = bSmart;
		_fnFilterComplete( oSettings, oSettings.oPreviousSearch, 1 );
	}
};

/*
 * Function: fnSettings
 * Purpose:  Get the settings for a particular table for extern. manipulation
 * Returns:  -
 * Inputs:   -
 */
this.fnSettings = function( nNode  )
{
	return _fnSettingsFromNode( this[_oExt.iApiIndex] );
};

/*
 * Function: fnVersionCheck
 * Notes:    The function is the same as the 'static' function provided in the ext variable
 */
this.fnVersionCheck = _oExt.fnVersionCheck;

/*
 * Function: fnSort
 * Purpose:  Sort the table by a particular row
 * Returns:  -
 * Inputs:   int:iCol - the data index to sort on. Note that this will
 *   not match the 'display index' if you have hidden data entries
 */
this.fnSort = function( aaSort )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	oSettings.aaSorting = aaSort;
	_fnSort( oSettings );
};

/*
 * Function: fnSortListener
 * Purpose:  Attach a sort listener to an element for a given column
 * Returns:  -
 * Inputs:   node:nNode - the element to attach the sort listener to
 *           int:iColumn - the column that a click on this node will sort on
 *           function:fnCallback - callback function when sort is run - optional
 */
this.fnSortListener = function( nNode, iColumn, fnCallback )
{
	_fnSortAttachListener( _fnSettingsFromNode( this[_oExt.iApiIndex] ), nNode, iColumn,
	 	fnCallback );
};

/*
 * Function: fnAddData
 * Purpose:  Add new row(s) into the table
 * Returns:  array int: array of indexes (aoData) which have been added (zero length on error)
 * Inputs:   array:mData - the data to be added. The length must match
 *               the original data from the DOM
 *             or
 *             array array:mData - 2D array of data to be added
 *           bool:bRedraw - redraw the table or not - default true
 * Notes:    Warning - the refilter here will cause the table to redraw
 *             starting at zero
 * Notes:    Thanks to Yekimov Denis for contributing the basis for this function!
 */
this.fnAddData = function( mData, bRedraw )
{
	if ( mData.length === 0 )
	{
		return [];
	}
	
	var aiReturn = [];
	var iTest;
	
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	/* Check if we want to add multiple rows or not */
	if ( typeof mData[0] == "object" )
	{
		for ( var i=0 ; i<mData.length ; i++ )
		{
			iTest = _fnAddData( oSettings, mData[i] );
			if ( iTest == -1 )
			{
				return aiReturn;
			}
			aiReturn.push( iTest );
		}
	}
	else
	{
		iTest = _fnAddData( oSettings, mData );
		if ( iTest == -1 )
		{
			return aiReturn;
		}
		aiReturn.push( iTest );
	}
	
	oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnReDraw( oSettings );
	}
	return aiReturn;
};

/*
 * Function: fnDeleteRow
 * Purpose:  Remove a row for the table
 * Returns:  array:aReturn - the row that was deleted
 * Inputs:   mixed:mTarget - 
 *             int: - index of aoData to be deleted, or
 *             node(TR): - TR element you want to delete
 *           function:fnCallBack - callback function - default null
 *           bool:bRedraw - redraw the table or not - default true
 */
this.fnDeleteRow = function( mTarget, fnCallBack, bRedraw )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	var i, iAODataIndex;
	
	iAODataIndex = (typeof mTarget == 'object') ? 
		_fnNodeToDataIndex(oSettings, mTarget) : mTarget;
	
	/* Return the data array from this row */
	var oData = oSettings.aoData.splice( iAODataIndex, 1 );
	
	/* Remove the target row from the search array */
	var iDisplayIndex = $.inArray( iAODataIndex, oSettings.aiDisplay );
	oSettings.asDataSearch.splice( iDisplayIndex, 1 );
	
	/* Delete from the display arrays */
	_fnDeleteIndex( oSettings.aiDisplayMaster, iAODataIndex );
	_fnDeleteIndex( oSettings.aiDisplay, iAODataIndex );
	
	/* If there is a user callback function - call it */
	if ( typeof fnCallBack == "function" )
	{
		fnCallBack.call( this, oSettings, oData );
	}
	
	/* Check for an 'overflow' they case for dislaying the table */
	if ( oSettings._iDisplayStart >= oSettings.aiDisplay.length )
	{
		oSettings._iDisplayStart -= oSettings._iDisplayLength;
		if ( oSettings._iDisplayStart < 0 )
		{
			oSettings._iDisplayStart = 0;
		}
	}
	
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
	
	return oData;
};

/*
 * Function: fnClearTable
 * Purpose:  Quickly and simply clear a table
 * Returns:  -
 * Inputs:   bool:bRedraw - redraw the table or not - default true
 * Notes:    Thanks to Yekimov Denis for contributing the basis for this function!
 */
this.fnClearTable = function( bRedraw )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	_fnClearTable( oSettings );
	
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnDraw( oSettings );
	}
};

/*
 * Function: fnOpen
 * Purpose:  Open a display row (append a row after the row in question)
 * Returns:  node:nNewRow - the row opened
 * Inputs:   node:nTr - the table row to 'open'
 *           string|node|jQuery:mHtml - the HTML to put into the row
 *           string:sClass - class to give the new TD cell
 */
this.fnOpen = function( nTr, mHtml, sClass )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	/* the old open one if there is one */
	this.fnClose( nTr );
	
	var nNewRow = document.createElement("tr");
	var nNewCell = document.createElement("td");
	nNewRow.appendChild( nNewCell );
	nNewCell.className = sClass;
	nNewCell.colSpan = _fnVisbleColumns( oSettings );

	if( typeof mHtml.jquery != 'undefined' || typeof mHtml == "object" )
	{
		nNewCell.appendChild( mHtml );
	}
	else
	{
		nNewCell.innerHTML = mHtml;
	}

	/* If the nTr isn't on the page at the moment - then we don't insert at the moment */
	var nTrs = $('tr', oSettings.nTBody);
	if ( $.inArray(nTr, nTrs) != -1 )
	{
		$(nNewRow).insertAfter(nTr);
	}
	
	oSettings.aoOpenRows.push( {
		"nTr": nNewRow,
		"nParent": nTr
	} );
	
	return nNewRow;
};

/*
 * Function: fnClose
 * Purpose:  Close a display row
 * Returns:  int: 0 (success) or 1 (failed)
 * Inputs:   node:nTr - the table row to 'close'
 */
this.fnClose = function( nTr )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	for ( var i=0 ; i<oSettings.aoOpenRows.length ; i++ )
	{
		if ( oSettings.aoOpenRows[i].nParent == nTr )
		{
			var nTrParent = oSettings.aoOpenRows[i].nTr.parentNode;
			if ( nTrParent )
			{
				/* Remove it if it is currently on display */
				nTrParent.removeChild( oSettings.aoOpenRows[i].nTr );
			}
			oSettings.aoOpenRows.splice( i, 1 );
			return 0;
		}
	}
	return 1;
};

/*
 * Function: fnGetData
 * Purpose:  Return an array with the data which is used to make up the table
 * Returns:  array array string: 2d data array ([row][column]) or array string: 1d data array
 *           or string if both row and column are given
 * Inputs:   mixed:mRow - optional - if not present, then the full 2D array for the table 
 *             if given then:
 *               int: - return data object for aoData entry of this index
 *               node(TR): - return data object for this TR element
 *           int:iCol - optional - the column that you want the data of. This will take into
 *               account mDataProp and return the value DataTables uses for this column
 */
this.fnGetData = function( mRow, iCol )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	if ( typeof mRow != 'undefined' )
	{
		var iRow = (typeof mRow == 'object') ? 
			_fnNodeToDataIndex(oSettings, mRow) : mRow;
		
		if ( typeof iCol != 'undefined' )
		{
			return _fnGetCellData( oSettings, iRow, iCol, '' );
		}
		return (typeof oSettings.aoData[iRow] != 'undefined') ? 
			oSettings.aoData[iRow]._aData : null;
	}
	return _fnGetDataMaster( oSettings );
};

/*
 * Function: fnGetNodes
 * Purpose:  Return an array with the TR nodes used for drawing the table
 * Returns:  array node: TR elements
 *           or
 *           node (if iRow specified)
 * Inputs:   int:iRow - optional - if present then the array returned will be the node for
 *             the row with the index 'iRow'
 */
this.fnGetNodes = function( iRow )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	
	if ( typeof iRow != 'undefined' )
	{
		return (typeof oSettings.aoData[iRow] != 'undefined') ? oSettings.aoData[iRow].nTr : null;
	}
	return _fnGetTrNodes( oSettings );
};

/*
 * Function: fnGetPosition
 * Purpose:  Get the array indexes of a particular cell from it's DOM element
 * Returns:  int: - row index, or array[ int, int, int ]: - row index, column index (visible)
 *             and column index including hidden columns
 * Inputs:   node:nNode - this can either be a TR, TD or TH in the table's body, the return is
 *             dependent on this input
 */
this.fnGetPosition = function( nNode )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	var sNodeName = nNode.nodeName.toUpperCase();
	
	if ( sNodeName == "TR" )
	{
		return _fnNodeToDataIndex(oSettings, nNode);
	}
	else if ( sNodeName == "TD" || sNodeName == "TH" )
	{
		var iDataIndex = _fnNodeToDataIndex(oSettings, nNode.parentNode);
		var anCells = _fnGetTdNodes( oSettings, iDataIndex );

		for ( var i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			if ( anCells[i] == nNode )
			{
				return [ iDataIndex, _fnColumnIndexToVisible(oSettings, i ), i ];
			}
		}
	}
	return null;
};

/*
 * Function: fnUpdate
 * Purpose:  Update a table cell or row - this method will accept either a single value to
 *             update the cell with, an array of values with one element for each column or
 *             an object in the same format as the original data source. The function is
 *             self-referencing in order to make the multi column updates easier.
 * Returns:  int: 0 okay, 1 error
 * Inputs:   object | array string | string:mData - data to update the cell/row with
 *           mixed:mRow - 
 *             int: - index of aoData to be updated, or
 *             node(TR): - TR element you want to update
 *           int:iColumn - the column to update - optional (not used of mData is an array or object)
 *           bool:bRedraw - redraw the table or not - default true
 *           bool:bAction - perform predraw actions or not (you will want this as 'true' if
 *             you have bRedraw as true) - default true
 */
this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	var iVisibleColumn, i, iLen, sDisplay;
	var iRow = (typeof mRow == 'object') ? 
		_fnNodeToDataIndex(oSettings, mRow) : mRow;
	
	if ( typeof oSettings.__fnUpdateDeep == 'undefined' && $.isArray(mData) && typeof mData == 'object' )
	{
		/* Array update - update the whole row */
		oSettings.aoData[iRow]._aData = mData.slice();
		
		/* Flag to the function that we are recursing */
		oSettings.__fnUpdateDeep = true;
		for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			this.fnUpdate( _fnGetCellData( oSettings, iRow, i ), iRow, i, false, false );
		}
		oSettings.__fnUpdateDeep = undefined;
	}
	else if ( typeof oSettings.__fnUpdateDeep == 'undefined' && mData !== null && typeof mData == 'object' )
	{
		/* Object update - update the whole row - assume the developer gets the object right */
		oSettings.aoData[iRow]._aData = $.extend( true, {}, mData );

		oSettings.__fnUpdateDeep = true;
		for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			this.fnUpdate( _fnGetCellData( oSettings, iRow, i ), iRow, i, false, false );
		}
		oSettings.__fnUpdateDeep = undefined;
	}
	else
	{
		/* Individual cell update */
		sDisplay = mData;
		_fnSetCellData( oSettings, iRow, iColumn, sDisplay );
		
		if ( oSettings.aoColumns[iColumn].fnRender !== null )
		{
			sDisplay = oSettings.aoColumns[iColumn].fnRender( {
				"iDataRow": iRow,
				"iDataColumn": iColumn,
				"aData": oSettings.aoData[iRow]._aData,
				"oSettings": oSettings
			} );
			
			if ( oSettings.aoColumns[iColumn].bUseRendered )
			{
				_fnSetCellData( oSettings, iRow, iColumn, sDisplay );
			}
		}
		
		if ( oSettings.aoData[iRow].nTr !== null )
		{
			/* Do the actual HTML update */
			_fnGetTdNodes( oSettings, iRow )[iColumn].innerHTML = sDisplay;
		}
	}
	
	/* Modify the search index for this row (strictly this is likely not needed, since fnReDraw
	 * will rebuild the search array - however, the redraw might be disabled by the user)
	 */
	var iDisplayIndex = $.inArray( iRow, oSettings.aiDisplay );
	oSettings.asDataSearch[iDisplayIndex] = _fnBuildSearchRow( oSettings, 
		_fnGetRowData( oSettings, iRow, 'filter' ) );
	
	/* Perform pre-draw actions */
	if ( typeof bAction == 'undefined' || bAction )
	{
		_fnAdjustColumnSizing( oSettings );
	}
	
	/* Redraw the table */
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnReDraw( oSettings );
	}
	return 0;
};


/*
 * Function: fnSetColumnVis
 * Purpose:  Show a particular column
 * Returns:  -
 * Inputs:   int:iCol - the column whose display should be changed
 *           bool:bShow - show (true) or hide (false) the column
 *           bool:bRedraw - redraw the table or not - default true
 */
this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	var i, iLen;
	var iColumns = oSettings.aoColumns.length;
	var nTd, nCell, anTrs, jqChildren, bAppend, iBefore;
	
	/* No point in doing anything if we are requesting what is already true */
	if ( oSettings.aoColumns[iCol].bVisible == bShow )
	{
		return;
	}
	
	/* Show the column */
	if ( bShow )
	{
		var iInsert = 0;
		for ( i=0 ; i<iCol ; i++ )
		{
			if ( oSettings.aoColumns[i].bVisible )
			{
				iInsert++;
			}
		}
		
		/* Need to decide if we should use appendChild or insertBefore */
		bAppend = (iInsert >= _fnVisbleColumns( oSettings ));

		/* Which coloumn should we be inserting before? */
		if ( !bAppend )
		{
			for ( i=iCol ; i<iColumns ; i++ )
			{
				if ( oSettings.aoColumns[i].bVisible )
				{
					iBefore = i;
					break;
				}
			}
		}

		for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
		{
			if ( oSettings.aoData[i].nTr !== null )
			{
				if ( bAppend )
				{
					oSettings.aoData[i].nTr.appendChild( 
						oSettings.aoData[i]._anHidden[iCol]
					);
				}
				else
				{
					oSettings.aoData[i].nTr.insertBefore(
						oSettings.aoData[i]._anHidden[iCol], 
						_fnGetTdNodes( oSettings, i )[iBefore] );
				}
			}
		}
	}
	else
	{
		/* Remove a column from display */
		for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
		{
			if ( oSettings.aoData[i].nTr !== null )
			{
				nTd = _fnGetTdNodes( oSettings, i )[iCol];
				oSettings.aoData[i]._anHidden[iCol] = nTd;
				nTd.parentNode.removeChild( nTd );
			}
		}
	}

	/* Clear to set the visible flag */
	oSettings.aoColumns[iCol].bVisible = bShow;

	/* Redraw the header and footer based on the new column visibility */
	_fnDrawHead( oSettings, oSettings.aoHeader );
	if ( oSettings.nTFoot )
	{
		_fnDrawHead( oSettings, oSettings.aoFooter );
	}
	
	/* If there are any 'open' rows, then we need to alter the colspan for this col change */
	for ( i=0, iLen=oSettings.aoOpenRows.length ; i<iLen ; i++ )
	{
		oSettings.aoOpenRows[i].nTr.colSpan = _fnVisbleColumns( oSettings );
	}
	
	/* Do a redraw incase anything depending on the table columns needs it 
	 * (built-in: scrolling) 
	 */
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnAdjustColumnSizing( oSettings );
		_fnDraw( oSettings );
	}
	
	_fnSaveState( oSettings );
};

/*
 * Function: fnPageChange
 * Purpose:  Change the pagination
 * Returns:  -
 * Inputs:   string:sAction - paging action to take: "first", "previous", "next" or "last"
 *           bool:bRedraw - redraw the table or not - optional - default true
 */
this.fnPageChange = function ( sAction, bRedraw )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	_fnPageChange( oSettings, sAction );
	_fnCalculateEnd( oSettings );
	
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		_fnDraw( oSettings );
	}
};

/*
 * Function: fnDestroy
 * Purpose:  Destructor for the DataTable
 * Returns:  -
 * Inputs:   -
 */
this.fnDestroy = function ( )
{
	var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
	var nOrig = oSettings.nTableWrapper.parentNode;
	var nBody = oSettings.nTBody;
	var i, iLen;
	
	/* Flag to note that the table is currently being destroyed - no action should be taken */
	oSettings.bDestroying = true;
	
	/* Restore hidden columns */
	for ( i=0, iLen=oSettings.aoDestroyCallback.length ; i<iLen ; i++ ) {
		oSettings.aoDestroyCallback[i].fn();
	}
	
	/* Restore hidden columns */
	for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoColumns[i].bVisible === false )
		{
			this.fnSetColumnVis( i, true );
		}
	}
	
	/* Blitz all DT events */
	$(oSettings.nTableWrapper).find('*').andSelf().unbind('.DT');
	
	/* If there is an 'empty' indicator row, remove it */
	$('tbody>tr>td.'+oSettings.oClasses.sRowEmpty, oSettings.nTable).parent().remove();
	
	/* When scrolling we had to break the table up - restore it */
	if ( oSettings.nTable != oSettings.nTHead.parentNode )
	{
		$(oSettings.nTable).children('thead').remove();
		oSettings.nTable.appendChild( oSettings.nTHead );
	}
	
	if ( oSettings.nTFoot && oSettings.nTable != oSettings.nTFoot.parentNode )
	{
		$(oSettings.nTable).children('tfoot').remove();
		oSettings.nTable.appendChild( oSettings.nTFoot );
	}
	
	/* Remove the DataTables generated nodes, events and classes */
	oSettings.nTable.parentNode.removeChild( oSettings.nTable );
	$(oSettings.nTableWrapper).remove();
	
	oSettings.aaSorting = [];
	oSettings.aaSortingFixed = [];
	_fnSortingClasses( oSettings );
	
	$(_fnGetTrNodes( oSettings )).removeClass( oSettings.asStripeClasses.join(' ') );
	
	if ( !oSettings.bJUI )
	{
		$('th', oSettings.nTHead).removeClass( [ _oExt.oStdClasses.sSortable,
			_oExt.oStdClasses.sSortableAsc,
			_oExt.oStdClasses.sSortableDesc,
			_oExt.oStdClasses.sSortableNone ].join(' ')
		);
	}
	else
	{
		$('th, td', oSettings.nTHead).removeClass( [ _oExt.oStdClasses.sSortable,
			_oExt.oJUIClasses.sSortableAsc,
			_oExt.oJUIClasses.sSortableDesc,
			_oExt.oJUIClasses.sSortableNone ].join(' ')
		);
		$('th span.'+_oExt.oJUIClasses.sSortIcon
			+ ', td span.'+_oExt.oJUIClasses.sSortIcon, oSettings.nTHead).remove();

		$('th, td', oSettings.nTHead).each( function () {
			var jqWrapper = $('div.'+_oExt.oJUIClasses.sSortJUIWrapper, this);
			var kids = jqWrapper.contents();
			$(this).append( kids );
			jqWrapper.remove();
		} );
	}
	
	/* Add the TR elements back into the table in their original order */
	if ( oSettings.nTableReinsertBefore )
	{
		nOrig.insertBefore( oSettings.nTable, oSettings.nTableReinsertBefore );
	}
	else
	{
		nOrig.appendChild( oSettings.nTable );
	}

	for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoData[i].nTr !== null )
		{
			nBody.appendChild( oSettings.aoData[i].nTr );
		}
	}
	
	/* Restore the width of the original table */
	if ( oSettings.oFeatures.bAutoWidth === true )
	{
	  oSettings.nTable.style.width = _fnStringToCss(oSettings.sDestroyWidth);
	}
	
	/* If the were originally odd/even type classes - then we add them back here. Note
	 * this is not fool proof (for example if not all rows as odd/even classes - but 
	 * it's a good effort without getting carried away
	 */
	$(nBody).children('tr:even').addClass( oSettings.asDestroyStripes[0] );
	$(nBody).children('tr:odd').addClass( oSettings.asDestroyStripes[1] );
	
	/* Remove the settings object from the settings array */
	for ( i=0, iLen=_aoSettings.length ; i<iLen ; i++ )
	{
		if ( _aoSettings[i] == oSettings )
		{
			_aoSettings.splice( i, 1 );
		}
	}
	
	/* End it all */
	oSettings = null;
};

/*
 * Function: fnAdjustColumnSizing
 * Purpose:  Update table sizing based on content. This would most likely be used for scrolling
 *   and will typically need a redraw after it.
 * Returns:  -
 * Inputs:   bool:bRedraw - redraw the table or not, you will typically want to - default true
 */
this.fnAdjustColumnSizing = function ( bRedraw )
{
	var oSettings = _fnSettingsFromNode(this[_oExt.iApiIndex]);
	_fnAdjustColumnSizing( oSettings );
	
	if ( typeof bRedraw == 'undefined' || bRedraw )
	{
		this.fnDraw( false );
	}
	else if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
	{
		/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
		this.oApi._fnScrollDraw(oSettings);
	}
};

/*
 * Function: $
 * Purpose:  Do a jQuery selector action on the table's TR elements (from the tbody) and
 *   return the resulting expression
 * Returns:  jQuery object
 * Inputs:   string:sSelector - jQuery selector
 */
this.$ = function ( sSelector )
{
	// xxx - filtering, sorting, column visibility options
	var oSettings = _fnSettingsFromNode(this[_oExt.iApiIndex]);
	return $(this.oApi._fnGetTrNodes(oSettings)).filter(sSelector);
};


/*
 * Plugin API functions
 * 
 * This call will add the functions which are defined in _oExt.oApi to the
 * DataTables object, providing a rather nice way to allow plug-in API functions. Note that
 * this is done here, so that API function can actually override the built in API functions if
 * required for a particular purpose.
 */

/*
 * Function: _fnExternApiFunc
 * Purpose:  Create a wrapper function for exporting an internal func to an external API func
 * Returns:  function: - wrapped function
 * Inputs:   string:sFunc - API function name
 */
function _fnExternApiFunc (sFunc)
{
	return function() {
			var aArgs = [_fnSettingsFromNode(this[_oExt.iApiIndex])].concat( 
				Array.prototype.slice.call(arguments) );
			return _oExt.oApi[sFunc].apply( this, aArgs );
		};
}

for ( var sFunc in _oExt.oApi )
{
	if ( sFunc )
	{
		/*
		 * Function: anon
		 * Purpose:  Wrap the plug-in API functions in order to provide the settings as 1st arg 
		 *   and execute in this scope
		 * Returns:  -
		 * Inputs:   -
		 */
		this[sFunc] = _fnExternApiFunc(sFunc);
	}
}
