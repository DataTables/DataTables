

/**
 * Compare two arrays
 *  @param {array} aArray1 first array
 *  @param {array} aArray2 second array
 *  @returns {int} 0 if match, 1 if length is different, 2 if no match
 *  @private
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


/**
 * Return the settings object for a particular table
 *  @param {node} nTable table we are using as a dataTable
 *  @returns {object} Settings object - or null if not found
 *  @private
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


/**
 * Return an array with the TR nodes for the table
 *  @param {object} oSettings dataTables settings object
 *  @returns {array} TR array
 *  @private
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


/**
 * Return an flat array with all TD nodes for the table, or row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} [iIndividualRow] aoData index to get the nodes for - optional 
 *    if not given then the return array will contain all nodes for the table
 *  @returns {array} TD array
 *  @private
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


/**
 * Log an error message
 *  @param {int} iLevel log error messages, or display them to the user
 *  @param {string} sMesg error message
 *  @private
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


/**
 * See if a property is defined on one object, if so assign it to the other object
 *  @param {object} oRet target object
 *  @param {object} oSrc source object
 *  @param {string} sName property
 *  @param {string} [sMappedName] name to map too - optional, sName used if not given
 *  @private
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


/**
 * Extend objects - very similar to jQuery.extend, but deep copy objects, and shallow
 * copy arrays. The reason we need to do this, is that we don't want to deep copy array
 * init values (such as aaSorting) since the dev wouldn't be able to override them, but
 * we do want to deep copy arrays.
 *  @param {object} oOut Object to extend
 *  @param {object} oExtender Object from which the properties will be applied to oOut
 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
 *  @private
 *  @todo This doesn't take account of arrays inside the deep copied objects.
 */
function _fnExtend( oOut, oExtender )
{
	for ( var prop in oOut )
	{
		if ( oOut.hasOwnProperty(prop) && typeof oExtender[prop] != 'undefined' )
		{
			if ( typeof oInit[prop] == 'object' && $.isArray(oExtender[prop]) === false )
			{
				$.extend( true, oOut[prop], oExtender[prop] );
			}
			else
			{
				oOut[prop] = oExtender[prop];
			}
		}
	}

	return oOut;
}



