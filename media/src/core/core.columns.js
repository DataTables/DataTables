

/*
 * Function: _fnAddColumn
 * Purpose:  Add a column to the list used for the table with default values
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           node:nTh - the th element for this column
 */
function _fnAddColumn( oSettings, nTh )
{
	var iCol = oSettings.aoColumns.length;
	var oCol = {
		"sType": null,
		"_bAutoType": true,
		"bVisible": true,
		"bSearchable": true,
		"bSortable": true,
		"asSorting": [ 'asc', 'desc' ],
		"sSortingClass": oSettings.oClasses.sSortable,
		"sSortingClassJUI": oSettings.oClasses.sSortJUI,
		"sTitle": nTh ? nTh.innerHTML : '',
		"sName": '',
		"sWidth": null,
		"sWidthOrig": null,
		"sClass": null,
		"fnRender": null,
		"bUseRendered": true,
		"aDataSort": [ iCol ],
		"mDataProp": iCol,
		"fnGetData": null,
		"fnSetData": null,
		"sSortDataType": 'std',
		"sDefaultContent": null,
		"sContentPadding": "",
		"nTh": nTh ? nTh : document.createElement('th'),
		"nTf": null
	};
	oSettings.aoColumns.push( oCol );
	
	/* Add a column specific filter */
	if ( typeof oSettings.aoPreSearchCols[ iCol ] == 'undefined' ||
	     oSettings.aoPreSearchCols[ iCol ] === null )
	{
		oSettings.aoPreSearchCols[ iCol ] = {
			"sSearch": "",
			"bRegex": false,
			"bSmart": true
		};
	}
	else
	{
		/* Don't require that the user must specify bRegex and / or bSmart */
		if ( typeof oSettings.aoPreSearchCols[ iCol ].bRegex == 'undefined' )
		{
			oSettings.aoPreSearchCols[ iCol ].bRegex = true;
		}
		
		if ( typeof oSettings.aoPreSearchCols[ iCol ].bSmart == 'undefined' )
		{
			oSettings.aoPreSearchCols[ iCol ].bSmart = true;
		}
	}
	
	/* Use the column options function to initialise classes etc */
	_fnColumnOptions( oSettings, iCol, null );
}

/*
 * Function: _fnColumnOptions
 * Purpose:  Apply options for a column
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iCol - column index to consider
 *           object:oOptions - object with sType, bVisible and bSearchable
 */
function _fnColumnOptions( oSettings, iCol, oOptions )
{
	var oCol = oSettings.aoColumns[ iCol ];
	
	/* User specified column options */
	if ( typeof oOptions != 'undefined' && oOptions !== null )
	{
		if ( typeof oOptions.sType != 'undefined' )
		{
			oCol.sType = oOptions.sType;
			oCol._bAutoType = false;
		}
		
		_fnMap( oCol, oOptions, "bVisible" );
		_fnMap( oCol, oOptions, "bSearchable" );
		_fnMap( oCol, oOptions, "bSortable" );
		_fnMap( oCol, oOptions, "sTitle" );
		_fnMap( oCol, oOptions, "sName" );
		_fnMap( oCol, oOptions, "sWidth" );
		_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
		_fnMap( oCol, oOptions, "sClass" );
		_fnMap( oCol, oOptions, "fnRender" );
		_fnMap( oCol, oOptions, "bUseRendered" );
		_fnMap( oCol, oOptions, "mDataProp" );
		_fnMap( oCol, oOptions, "asSorting" );
		_fnMap( oCol, oOptions, "sSortDataType" );
		_fnMap( oCol, oOptions, "sDefaultContent" );
		_fnMap( oCol, oOptions, "sContentPadding" );

		/* iDataSort to be applied (backwards compatibility), but aDataSort will take
		 * priority if defined
		 */
		if ( typeof oOptions.iDataSort != 'undefined' )
		{
			oCol.aDataSort = [ oOptions.iDataSort ];
		}
		_fnMap( oCol, oOptions, "aDataSort" );
	}

	/* Cache the data get and set functions for speed */
	oCol.fnGetData = _fnGetObjectDataFn( oCol.mDataProp );
	oCol.fnSetData = _fnSetObjectDataFn( oCol.mDataProp );
	
	/* Feature sorting overrides column specific when off */
	if ( !oSettings.oFeatures.bSort )
	{
		oCol.bSortable = false;
	}
	
	/* Check that the class assignment is correct for sorting */
	if ( !oCol.bSortable ||
		 ($.inArray('asc', oCol.asSorting) == -1 && $.inArray('desc', oCol.asSorting) == -1) )
	{
		oCol.sSortingClass = oSettings.oClasses.sSortableNone;
		oCol.sSortingClassJUI = "";
	}
	else if ( oCol.bSortable ||
	          ($.inArray('asc', oCol.asSorting) == -1 && $.inArray('desc', oCol.asSorting) == -1) )
	{
	  oCol.sSortingClass = oSettings.oClasses.sSortable;
	  oCol.sSortingClassJUI = oSettings.oClasses.sSortJUI;
	}
	else if ( $.inArray('asc', oCol.asSorting) != -1 && $.inArray('desc', oCol.asSorting) == -1 )
	{
		oCol.sSortingClass = oSettings.oClasses.sSortableAsc;
		oCol.sSortingClassJUI = oSettings.oClasses.sSortJUIAscAllowed;
	}
	else if ( $.inArray('asc', oCol.asSorting) == -1 && $.inArray('desc', oCol.asSorting) != -1 )
	{
		oCol.sSortingClass = oSettings.oClasses.sSortableDesc;
		oCol.sSortingClassJUI = oSettings.oClasses.sSortJUIDescAllowed;
	}
}




/*
 * Function: _fnAdjustColumnSizing
 * Purpose:  Adjust the table column widths for new data
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 * Notes:    You would probably want to do a redraw after calling this function!
 */
function _fnAdjustColumnSizing ( oSettings )
{
	/* Not interested in doing column width calculation if autowidth is disabled */
	if ( oSettings.oFeatures.bAutoWidth === false )
	{
		return false;
	}
	
	_fnCalculateColumnWidths( oSettings );
	for ( var i=0 , iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		oSettings.aoColumns[i].nTh.style.width = oSettings.aoColumns[i].sWidth;
	}
}





/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - Support functions
 */

/*
 * Function: _fnVisibleToColumnIndex
 * Purpose:  Covert the index of a visible column to the index in the data array (take account
 *   of hidden columns)
 * Returns:  int:i - the data index
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnVisibleToColumnIndex( oSettings, iMatch )
{
	var iColumn = -1;
	
	for ( var i=0 ; i<oSettings.aoColumns.length ; i++ )
	{
		if ( oSettings.aoColumns[i].bVisible === true )
		{
			iColumn++;
		}
		
		if ( iColumn == iMatch )
		{
			return i;
		}
	}
	
	return null;
}

/*
 * Function: _fnColumnIndexToVisible
 * Purpose:  Covert the index of an index in the data array and convert it to the visible
 *   column index (take account of hidden columns)
 * Returns:  int:i - the data index
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnColumnIndexToVisible( oSettings, iMatch )
{
	var iVisible = -1;
	for ( var i=0 ; i<oSettings.aoColumns.length ; i++ )
	{
		if ( oSettings.aoColumns[i].bVisible === true )
		{
			iVisible++;
		}
		
		if ( i == iMatch )
		{
			return oSettings.aoColumns[i].bVisible === true ? iVisible : null;
		}
	}
	
	return null;
}



/*
 * Function: _fnVisbleColumns
 * Purpose:  Get the number of visible columns
 * Returns:  int:i - the number of visible columns
 * Inputs:   object:oS - dataTables settings object
 */
function _fnVisbleColumns( oS )
{
	var iVis = 0;
	for ( var i=0 ; i<oS.aoColumns.length ; i++ )
	{
		if ( oS.aoColumns[i].bVisible === true )
		{
			iVis++;
		}
	}
	return iVis;
}


/*
 * Function: _fnDetectType
 * Purpose:  Get the sort type based on an input string
 * Returns:  string: - type (defaults to 'string' if no type can be detected)
 * Inputs:   string:sData - data we wish to know the type of
 * Notes:    This function makes use of the DataTables plugin objct _oExt 
 *   (.aTypes) such that new types can easily be added.
 */
function _fnDetectType( sData )
{
	var aTypes = _oExt.aTypes;
	var iLen = aTypes.length;
	
	for ( var i=0 ; i<iLen ; i++ )
	{
		var sType = aTypes[i]( sData );
		if ( sType !== null )
		{
			return sType;
		}
	}
	
	return 'string';
}


/*
 * Function: _fnReOrderIndex
 * Purpose:  Figure out how to reorder a display list
 * Returns:  array int:aiReturn - index list for reordering
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnReOrderIndex ( oSettings, sColumns )
{
	var aColumns = sColumns.split(',');
	var aiReturn = [];
	
	for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		for ( var j=0 ; j<iLen ; j++ )
		{
			if ( oSettings.aoColumns[i].sName == aColumns[j] )
			{
				aiReturn.push( j );
				break;
			}
		}
	}
	
	return aiReturn;
}

/*
 * Function: _fnColumnOrdering
 * Purpose:  Get the column ordering that DataTables expects
 * Returns:  string: - comma separated list of names
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnColumnOrdering ( oSettings )
{
	var sNames = '';
	for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		sNames += oSettings.aoColumns[i].sName+',';
	}
	if ( sNames.length == iLen )
	{
		return "";
	}
	return sNames.slice(0, -1);
}
