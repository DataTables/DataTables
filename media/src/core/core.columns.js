

/**
 * Add a column to the list used for the table with default values
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nTh The th element for this column
 *  @private
 */
function _fnAddColumn( oSettings, nTh )
{
	var iCol = oSettings.aoColumns.length;
	var oCol = $.extend( {}, DataTable.models.oColumn, {
		"sSortingClass": oSettings.oClasses.sSortable,
		"sSortingClassJUI": oSettings.oClasses.sSortJUI,
		"sTitle": nTh ? nTh.innerHTML : '',
		"aDataSort": [ iCol ],
		"mDataProp": iCol,
		"nTh": nTh ? nTh : document.createElement('th')
	} );
	oSettings.aoColumns.push( oCol );
	
	/* Add a column specific filter */
	if ( typeof oSettings.aoPreSearchCols[ iCol ] == 'undefined' ||
	     oSettings.aoPreSearchCols[ iCol ] === null )
	{
		oSettings.aoPreSearchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch );
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


/**
 * Apply options for a column
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iCol column index to consider
 *  @param {object} oOptions object with sType, bVisible and bSearchable
 *  @private
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
		_fnMap( oCol, oOptions, "fnCreatedCell" );
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


/**
 * Adjust the table column widths for new data. Note: you would probably want to 
 * do a redraw after calling this function!
 *  @param {object} oSettings dataTables settings object
 *  @private
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


/**
 * Covert the index of a visible column to the index in the data array (take account
 * of hidden columns)
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iMatch Visible column index to lookup
 *  @returns {int} i the data index
 *  @private
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


/**
 * Covert the index of an index in the data array and convert it to the visible
 *   column index (take account of hidden columns)
 *  @param {int} iMatch Column index to lookup
 *  @param {object} oSettings dataTables settings object
 *  @returns {int} i the data index
 *  @private
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


/**
 * Get the number of visible columns
 *  @returns {int} i the number of visible columns
 *  @param {object} oS dataTables settings object
 *  @private
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


/**
 * Get the sort type based on an input string
 *  @param {string} sData data we wish to know the type of
 *  @returns {string} type (defaults to 'string' if no type can be detected)
 *  @private
 */
function _fnDetectType( sData )
{
	var aTypes = DataTable.ext.aTypes;
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


/**
 * Figure out how to reorder a display list
 *  @param {object} oSettings dataTables settings object
 *  @returns array {int} aiReturn index list for reordering
 *  @private
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


/**
 * Get the column ordering that DataTables expects
 *  @param {object} oSettings dataTables settings object
 *  @returns {string} comma separated list of names
 *  @private
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


/**
 * Take the column definitions and static columns arrays and calculate how
 * they relate to column indexes. The callback function will then apply the
 * definition found for a column to a suitable configuration object.
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
 *  @param {array} aoCols The aoColumns array that defines columns individually
 *  @param {function} fn Callback function - takes two parameters, the calculated
 *    column index and the definition for that column.
 *  @private
 */
function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
{
	var i, iLen, j, jLen, k, kLen;

	// Column definitions with aTargets
	if ( aoColDefs )
	{
		/* Loop over the definitions array - loop in reverse so first instance has priority */
		for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
		{
			/* Each definition can target multiple columns, as it is an array */
			var aTargets = aoColDefs[i].aTargets;
			if ( !$.isArray( aTargets ) )
			{
				_fnLog( oSettings, 1, 'aTargets must be an array of targets, not a '+(typeof aTargets) );
			}

			for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
			{
				if ( typeof aTargets[j] == 'number' && aTargets[j] >= 0 )
				{
					/* Add columns that we don't yet know about */
					while( oSettings.aoColumns.length <= aTargets[j] )
					{
						_fnAddColumn( oSettings );
					}

					/* Integer, basic index */
					fn( aTargets[j], aoColDefs[i] );
				}
				else if ( typeof aTargets[j] == 'number' && aTargets[j] < 0 )
				{
					/* Negative integer, right to left column counting */
					fn( oSettings.aoColumns.length+aTargets[j], aoColDefs[i] );
				}
				else if ( typeof aTargets[j] == 'string' )
				{
					/* Class name matching on TH element */
					for ( k=0, kLen=oSettings.aoColumns.length ; k<kLen ; k++ )
					{
						if ( aTargets[j] == "_all" ||
						     $(oSettings.aoColumns[k].nTh).hasClass( aTargets[j] ) )
						{
							fn( k, aoColDefs[i] );
						}
					}
				}
			}
		}
	}

	// Statically defined columns array
	if ( aoCols )
	{
		for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
		{
			fn( i, aoCols[i] );
		}
	}
}

