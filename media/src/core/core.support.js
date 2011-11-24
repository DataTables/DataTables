

/*
 * Function: _fnArrayCmp
 * Purpose:  Compare two arrays
 * Returns:  0 if match, 1 if length is different, 2 if no match
 * Inputs:   array:aArray1 - first array
 *           array:aArray2 - second array
 */
function _fnArrayCmp( aArray1, aArray2 )
{
	if ( aArray1.length != aArray2.length )
	{
		return 1;
	}
	
	for ( var i=0 ; i<aArray1.length ; i++ )
	{
		if ( aArray1[i] != aArray2[i] )
		{
			return 2;
		}
	}
	
	return 0;
}

/*
 * Function: _fnSettingsFromNode
 * Purpose:  Return the settings object for a particular table
 * Returns:  object: Settings object - or null if not found
 * Inputs:   node:nTable - table we are using as a dataTable
 */
function _fnSettingsFromNode ( nTable )
{
	for ( var i=0 ; i<_aoSettings.length ; i++ )
	{
		if ( _aoSettings[i].nTable == nTable )
		{
			return _aoSettings[i];
		}
	}
	
	return null;
}

/*
 * Function: _fnGetTrNodes
 * Purpose:  Return an array with the TR nodes for the table
 * Returns:  array: - TR array
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnGetTrNodes ( oSettings )
{
	var aNodes = [];
	for ( var i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoData[i].nTr !== null )
		{
			aNodes.push( oSettings.aoData[i].nTr );
		}
	}
	return aNodes;
}

/*
 * Function: _fnGetTdNodes
 * Purpose:  Return an flat array with all TD nodes for the table, or row
 * Returns:  array: - TD array
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iIndividualRow - aoData index to get the nodes for - optional if not
 *             given then the return array will contain all nodes for the table
 */
function _fnGetTdNodes ( oSettings, iIndividualRow )
{
	var anReturn = [];
	var iCorrector;
	var anTds;
	var iRow, iRows=oSettings.aoData.length,
		iColumn, iColumns, oData, sNodeName, iStart=0, iEnd=iRows;
	
	/* Allow the collection to be limited to just one row */
	if ( typeof iIndividualRow != 'undefined' )
	{
		iStart = iIndividualRow;
		iEnd = iIndividualRow+1;
	}

	for ( iRow=iStart ; iRow<iEnd ; iRow++ )
	{
		oData = oSettings.aoData[iRow];
		if ( oData.nTr !== null )
		{
			/* get the TD child nodes - taking into account text etc nodes */
			anTds = [];
			for ( iColumn=0, iColumns=oData.nTr.childNodes.length ; iColumn<iColumns ; iColumn++ )
			{
				sNodeName = oData.nTr.childNodes[iColumn].nodeName.toLowerCase();
				if ( sNodeName == 'td' || sNodeName == 'th' )
				{
					anTds.push( oData.nTr.childNodes[iColumn] );
				}
			}

			iCorrector = 0;
			for ( iColumn=0, iColumns=oSettings.aoColumns.length ; iColumn<iColumns ; iColumn++ )
			{
				if ( oSettings.aoColumns[iColumn].bVisible )
				{
					anReturn.push( anTds[iColumn-iCorrector] );
				}
				else
				{
					anReturn.push( oData._anHidden[iColumn] );
					iCorrector++;
				}
			}
		}
	}

	return anReturn;
}

/*
 * Function: _fnLog
 * Purpose:  Log an error message
 * Returns:  -
 * Inputs:   int:iLevel - log error messages, or display them to the user
 *           string:sMesg - error message
 */
function _fnLog( oSettings, iLevel, sMesg )
{
	var sAlert = oSettings.sTableId === "" ?
	 	"DataTables warning: " +sMesg :
	 	"DataTables warning (table id = '"+oSettings.sTableId+"'): " +sMesg;
	
	if ( iLevel === 0 )
	{
		if ( _oExt.sErrMode == 'alert' )
		{
			alert( sAlert );
		}
		else
		{
			throw sAlert;
		}
		return;
	}
	else if ( typeof console != 'undefined' && typeof console.log != 'undefined' )
	{
		console.log( sAlert );
	}
}

/*
 * Function: _fnMap
 * Purpose:  See if a property is defined on one object, if so assign it to the other object
 * Returns:  - (done by reference)
 * Inputs:   object:oRet - target object
 *           object:oSrc - source object
 *           string:sName - property
 *           string:sMappedName - name to map too - optional, sName used if not given
 */
function _fnMap( oRet, oSrc, sName, sMappedName )
{
	if ( typeof sMappedName == 'undefined' )
	{
		sMappedName = sName;
	}
	if ( typeof oSrc[sName] != 'undefined' )
	{
		oRet[sMappedName] = oSrc[sName];
	}
}
