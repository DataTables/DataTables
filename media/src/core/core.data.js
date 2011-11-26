

/*
 * Function: _fnAddData
 * Purpose:  Add a data array to the table, creating DOM node etc
 * Returns:  int: - >=0 if successful (index of new aoData entry), -1 if failed
 * Inputs:   object:oSettings - dataTables settings object
 *           array:aData - data array to be added
 * Notes:    There are two basic methods for DataTables to get data to display - a JS array
 *   (which is dealt with by this function), and the DOM, which has it's own optimised
 *   function (_fnGatherData). Be careful to make the same changes here as there and vice-versa
 */
function _fnAddData ( oSettings, aDataSupplied )
{
	var oCol;
	
	/* Take an independent copy of the data source so we can bash it about as we wish */
	var aDataIn = ($.isArray(aDataSupplied)) ?
		aDataSupplied.slice() :
		$.extend( true, {}, aDataSupplied );
	
	/* Create the object for storing information about this new row */
	var iRow = oSettings.aoData.length;
	var oData = $.extend( true, {}, DataTable.models.oRow, {
		"_iId": oSettings.iNextId++,
		"_aData": aDataIn
	} );
	oSettings.aoData.push( oData );

	/* Create the cells */
	var nTd, sThisType;
	for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];

		/* Use rendered data for filtering/sorting */
		if ( typeof oCol.fnRender == 'function' && oCol.bUseRendered && oCol.mDataProp !== null )
		{
			_fnSetCellData( oSettings, iRow, i, oCol.fnRender( {
				"iDataRow": iRow,
				"iDataColumn": i,
				"aData": oData._aData,
				"oSettings": oSettings
			} ) );
		}
		
		/* See if we should auto-detect the column type */
		if ( oCol._bAutoType && oCol.sType != 'string' )
		{
			/* Attempt to auto detect the type - same as _fnGatherData() */
			var sVarType = _fnGetCellData( oSettings, iRow, i, 'type' );
			if ( sVarType !== null && sVarType !== '' )
			{
				sThisType = _fnDetectType( sVarType );
				if ( oCol.sType === null )
				{
					oCol.sType = sThisType;
				}
				else if ( oCol.sType != sThisType && oCol.sType != "html" )
				{
					/* String is always the 'fallback' option */
					oCol.sType = 'string';
				}
			}
		}
	}
	
	/* Add to the display array */
	oSettings.aiDisplayMaster.push( iRow );

	/* Create the DOM imformation */
	if ( !oSettings.oFeatures.bDeferRender )
	{
		_fnCreateTr( oSettings, iRow );
	}

	return iRow;
}

/*
 * Function: _fnGatherData
 * Purpose:  Read in the data from the target table from the DOM
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 * Notes:    This is a optimised version of _fnAddData (more or less) for reading information
 *   from the DOM. The basic actions must be identical in the two functions.
 */
function _fnGatherData( oSettings )
{
	var iLoop, i, iLen, j, jLen, jInner,
	 	nTds, nTrs, nTd, aLocalData, iThisIndex,
		iRow, iRows, iColumn, iColumns, sNodeName;
	
	/*
	 * Process by row first
	 * Add the data object for the whole table - storing the tr node. Note - no point in getting
	 * DOM based data if we are going to go and replace it with Ajax source data.
	 */
	if ( oSettings.bDeferLoading || oSettings.sAjaxSource === null )
	{
		nTrs = oSettings.nTBody.childNodes;
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			if ( nTrs[i].nodeName.toUpperCase() == "TR" )
			{
				iThisIndex = oSettings.aoData.length;
				oSettings.aoData.push( $.extend( true, {}, DataTable.models.oRow, {
					"nTr": nTrs[i],
					"_iId": oSettings.iNextId++
				} ) );
				
				oSettings.aiDisplayMaster.push( iThisIndex );
				nTds = nTrs[i].childNodes;
				jInner = 0;
				
				for ( j=0, jLen=nTds.length ; j<jLen ; j++ )
				{
					sNodeName = nTds[j].nodeName.toUpperCase();
					if ( sNodeName == "TD" || sNodeName == "TH" )
					{
						_fnSetCellData( oSettings, iThisIndex, jInner, $.trim(nTds[j].innerHTML) );
						jInner++;
					}
				}
			}
		}
	}
	
	/* Gather in the TD elements of the Table - note that this is basically the same as
	 * fnGetTdNodes, but that function takes account of hidden columns, which we haven't yet
	 * setup!
	 */
	nTrs = _fnGetTrNodes( oSettings );
	nTds = [];
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		for ( j=0, jLen=nTrs[i].childNodes.length ; j<jLen ; j++ )
		{
			nTd = nTrs[i].childNodes[j];
			sNodeName = nTd.nodeName.toUpperCase();
			if ( sNodeName == "TD" || sNodeName == "TH" )
			{
				nTds.push( nTd );
			}
		}
	}
	
	/* Sanity check */
	if ( nTds.length != nTrs.length * oSettings.aoColumns.length )
	{
		_fnLog( oSettings, 1, "Unexpected number of TD elements. Expected "+
			(nTrs.length * oSettings.aoColumns.length)+" and got "+nTds.length+". DataTables does "+
			"not support rowspan / colspan in the table body, and there must be one cell for each "+
			"row/column combination." );
	}
	
	/* Now process by column */
	for ( iColumn=0, iColumns=oSettings.aoColumns.length ; iColumn<iColumns ; iColumn++ )
	{
		/* Get the title of the column - unless there is a user set one */
		if ( oSettings.aoColumns[iColumn].sTitle === null )
		{
			oSettings.aoColumns[iColumn].sTitle = oSettings.aoColumns[iColumn].nTh.innerHTML;
		}
		
		var
			bAutoType = oSettings.aoColumns[iColumn]._bAutoType,
			bRender = typeof oSettings.aoColumns[iColumn].fnRender == 'function',
			bClass = oSettings.aoColumns[iColumn].sClass !== null,
			bVisible = oSettings.aoColumns[iColumn].bVisible,
			nCell, sThisType, sRendered, sValType;
		
		/* A single loop to rule them all (and be more efficient) */
		if ( bAutoType || bRender || bClass || !bVisible )
		{
			for ( iRow=0, iRows=oSettings.aoData.length ; iRow<iRows ; iRow++ )
			{
				nCell = nTds[ (iRow*iColumns) + iColumn ];
				
				/* Type detection */
				if ( bAutoType && oSettings.aoColumns[iColumn].sType != 'string' )
				{
					sValType = _fnGetCellData( oSettings, iRow, iColumn, 'type' );
					if ( sValType !== '' )
					{
						sThisType = _fnDetectType( sValType );
						if ( oSettings.aoColumns[iColumn].sType === null )
						{
							oSettings.aoColumns[iColumn].sType = sThisType;
						}
						else if ( oSettings.aoColumns[iColumn].sType != sThisType && 
						          oSettings.aoColumns[iColumn].sType != "html" )
						{
							/* String is always the 'fallback' option */
							oSettings.aoColumns[iColumn].sType = 'string';
						}
					}
				}
				
				/* Rendering */
				if ( bRender )
				{
					sRendered = oSettings.aoColumns[iColumn].fnRender( {
							"iDataRow": iRow,
							"iDataColumn": iColumn,
							"aData": oSettings.aoData[iRow]._aData,
							"oSettings": oSettings
						} );
					nCell.innerHTML = sRendered;
					if ( oSettings.aoColumns[iColumn].bUseRendered )
					{
						/* Use the rendered data for filtering/sorting */
						_fnSetCellData( oSettings, iRow, iColumn, sRendered );
					}
				}
				
				/* Classes */
				if ( bClass )
				{
					nCell.className += ' '+oSettings.aoColumns[iColumn].sClass;
				}
				
				/* Column visability */
				if ( !bVisible )
				{
					oSettings.aoData[iRow]._anHidden[iColumn] = nCell;
					nCell.parentNode.removeChild( nCell );
				}
				else
				{
					oSettings.aoData[iRow]._anHidden[iColumn] = null;
				}
			}
		}
	}
}





/*
 * Function: _fnNodeToDataIndex
 * Purpose:  Take a TR element and convert it to an index in aoData
 * Returns:  int:i - index if found, null if not
 * Inputs:   object:s - dataTables settings object
 *           node:n - the TR element to find
 */
function _fnNodeToDataIndex( s, n )
{
	var i, iLen;
	
	/* Optimisation - see if the nodes which are currently visible match, since that is
	 * the most likely node to be asked for (a selector or event for example)
	 */
	for ( i=s._iDisplayStart, iLen=s._iDisplayEnd ; i<iLen ; i++ )
	{
		if ( s.aoData[ s.aiDisplay[i] ].nTr == n )
		{
			return s.aiDisplay[i];
		}
	}
	
	/* Otherwise we are in for a slog through the whole data cache */
	for ( i=0, iLen=s.aoData.length ; i<iLen ; i++ )
	{
		if ( s.aoData[i].nTr == n )
		{
			return i;
		}
	}
	return null;
}




/*
 * Function: _fnGetRowData
 * Purpose:  Get an array of data for a given row from the internal data cache
 * Returns:  array: - Data array
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iRow - aoData row id
 *           string:sSpecific - data get type ('type' 'filter' 'sort')
 */
function _fnGetRowData( oSettings, iRow, sSpecific )
{
	var out = [];
	for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		out.push( _fnGetCellData( oSettings, iRow, i, sSpecific ) );
	}
	return out;
}

/*
 * Function: _fnGetCellData
 * Purpose:  Get the data for a given cell from the internal cache, taking into account data mapping
 * Returns:  *: - Cell data
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iRow - aoData row id
 *           int:iCol - Column index
 *           string:sSpecific - data get type ('display', 'type' 'filter' 'sort')
 */
function _fnGetCellData( oSettings, iRow, iCol, sSpecific )
{
	var sData;
	var oCol = oSettings.aoColumns[iCol];
	var oData = oSettings.aoData[iRow]._aData;

	if ( (sData=oCol.fnGetData( oData, sSpecific )) === undefined )
	{
		if ( oSettings.iDrawError != oSettings.iDraw && oCol.sDefaultContent === null )
		{
			_fnLog( oSettings, 0, "Requested unknown parameter '"+oCol.mDataProp+
				"' from the data source for row "+iRow );
			oSettings.iDrawError = oSettings.iDraw;
		}
		return oCol.sDefaultContent;
	}

	/* When the data source is null, we can use default column data */
	if ( sData === null && oCol.sDefaultContent !== null )
	{
		sData = oCol.sDefaultContent;
	}
	else if ( typeof sData == 'function' )
	{
		/* If the data source is a function, then we run it and use the return */
		return sData();
	}

	if ( sSpecific == 'display' && sData === null )
	{
		return '';
	}
	return sData;
}

/*
 * Function: _fnSetCellData
 * Purpose:  Set the value for a specific cell, into the internal data cache
 * Returns:  *: - Cell data
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iRow - aoData row id
 *           int:iCol - Column index
 *           *:val - Value to set
 */
function _fnSetCellData( oSettings, iRow, iCol, val )
{
	var oCol = oSettings.aoColumns[iCol];
	var oData = oSettings.aoData[iRow]._aData;

	oCol.fnSetData( oData, val );
}

/*
 * Function: _fnGetObjectDataFn
 * Purpose:  Return a function that can be used to get data from a source object, taking
 *           into account the ability to use nested objects as a source
 * Returns:  function: - Data get function
 * Inputs:   string|int|function:mSource - The data source for the object
 */
function _fnGetObjectDataFn( mSource )
{
	if ( mSource === null )
	{
		/* Give an empty string for rendering / sorting etc */
		return function (data) {
			return null;
		};
	}
	else if ( typeof mSource == 'function' )
	{
	    return function (data, type) {
	        return mSource( data, type );
	    };
	}
	else if ( typeof mSource == 'string' && mSource.indexOf('.') != -1 )
	{
		/* If there is a . in the source string then the data source is in a nested object
		 * we provide two 'quick' functions for the look up to speed up the most common
		 * operation, and a generalised one for when it is needed
		 */
		var a = mSource.split('.');
		if ( a.length == 2 )
		{
			return function (data) {
				return data[ a[0] ][ a[1] ];
			};
		}
		else if ( a.length == 3 )
		{
			return function (data) {
				return data[ a[0] ][ a[1] ][ a[2] ];
			};
		}
		else
		{
			return function (data) {
				for ( var i=0, iLen=a.length ; i<iLen ; i++ )
				{
					data = data[ a[i] ];
				}
				return data;
			};
		}
	}
	else
	{
		/* Array or flat object mapping */
		return function (data) {
			return data[mSource];	
		};
	}
}

/*
 * Function: _fnSetObjectDataFn
 * Purpose:  Return a function that can be used to set data from a source object, taking
 *           into account the ability to use nested objects as a source
 * Returns:  function: - Data set function
 * Inputs:   string|int|function:mSource - The data source for the object
 */
function _fnSetObjectDataFn( mSource )
{
	if ( mSource === null )
	{
		/* Nothing to do when the data source is null */
		return function (data, val) {};
	}
	else if ( typeof mSource == 'function' )
	{
	    return function (data, val) {
	        return mSource( data, val );
	    };
	}
	else if ( typeof mSource == 'string' && mSource.indexOf('.') != -1 )
	{
		/* Like the get, we need to get data from a nested object. Again two fast lookup
		 * functions are provided, and a generalised one.
		 */
		var a = mSource.split('.');
		if ( a.length == 2 )
		{
			return function (data, val) {
				data[ a[0] ][ a[1] ] = val;
			};
		}
		else if ( a.length == 3 )
		{
			return function (data, val) {
				data[ a[0] ][ a[1] ][ a[2] ] = val;
			};
		}
		else
		{
			return function (data, val) {
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					data = data[ a[i] ];
				}
				data[ a[a.length-1] ] = val;
			};
		}
	}
	else
	{
		/* Array or flat object mapping */
		return function (data, val) {
			data[mSource] = val;	
		};
	}
}

/*
 * Function: _fnGetDataMaster
 * Purpose:  Return an array with the full table data
 * Returns:  array array:aData - Master data array
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnGetDataMaster ( oSettings )
{
	var aData = [];
	var iLen = oSettings.aoData.length;
	for ( var i=0 ; i<iLen; i++ )
	{
		aData.push( oSettings.aoData[i]._aData );
	}
	return aData;
}


/*
 * Function: _fnClearTable
 * Purpose:  Nuke the table
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnClearTable( oSettings )
{
	oSettings.aoData.splice( 0, oSettings.aoData.length );
	oSettings.aiDisplayMaster.splice( 0, oSettings.aiDisplayMaster.length );
	oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length );
	_fnCalculateEnd( oSettings );
}


/*
 * Function: _fnDeleteIndex
 * Purpose:  Take an array of integers (index array) and remove a target integer (value - not 
 *             the key!)
 * Returns:  -
 * Inputs:   a:array int - Index array to target
 *           int:iTarget - value to find
 */
function _fnDeleteIndex( a, iTarget )
{
	var iTargetIndex = -1;
	
	for ( var i=0, iLen=a.length ; i<iLen ; i++ )
	{
		if ( a[i] == iTarget )
		{
			iTargetIndex = i;
		}
		else if ( a[i] > iTarget )
		{
			a[i]--;
		}
	}
	
	if ( iTargetIndex != -1 )
	{
		a.splice( iTargetIndex, 1 );
	}
}
