

/**
 * Create a new TR element (and it's TD children) for a row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow Row to consider
 *  @private
 */
function _fnCreateTr ( oSettings, iRow )
{
	var oData = oSettings.aoData[iRow];
	var nTd;

	if ( oData.nTr === null )
	{
		oData.nTr = document.createElement('tr');

		/* Special parameters can be given by the data source to be used on the row */
		if ( typeof oData._aData.DT_RowId != 'undefined' )
		{
			oData.nTr.setAttribute( 'id', oData._aData.DT_RowId );
		}

		if ( typeof oData._aData.DT_RowClass != 'undefined' )
		{
			$(oData.nTr).addClass( oData._aData.DT_RowClass );
		}

		/* Process each column */
		for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			var oCol = oSettings.aoColumns[i];
			nTd = document.createElement('td');

			/* Render if needed - if bUseRendered is true then we already have the rendered
			 * value in the data source - so can just use that
			 */
			if ( typeof oCol.fnRender == 'function' && (!oCol.bUseRendered || oCol.mDataProp === null) )
			{
				nTd.innerHTML = oCol.fnRender( {
					"iDataRow": iRow,
					"iDataColumn": i,
					"aData": oData._aData,
					"oSettings": oSettings
				} );
			}
			else
			{
				nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
			}
		
			/* Add user defined class */
			if ( oCol.sClass !== null )
			{
				nTd.className = oCol.sClass;
			}
			
			if ( oCol.bVisible )
			{
				oData.nTr.appendChild( nTd );
				oData._anHidden[i] = null;
			}
			else
			{
				oData._anHidden[i] = nTd;
			}

			if ( oCol.fnCreatedCell )
			{
				oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i, 'display' ), oData._aData, iRow
				);
			}
		}
	}
}


/**
 * Create the HTML header for the table
 *  @param {object} oSettings dataTables settings object
 *  @private
 */
function _fnBuildHead( oSettings )
{
	var i, nTh, iLen, j, jLen;
	var anTr = oSettings.nTHead.getElementsByTagName('tr');
	var iThs = oSettings.nTHead.getElementsByTagName('th').length;
	var iCorrector = 0;
	var jqChildren;
	
	/* If there is a header in place - then use it - otherwise it's going to get nuked... */
	if ( iThs !== 0 )
	{
		/* We've got a thead from the DOM, so remove hidden columns and apply width to vis cols */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			
			if ( oSettings.aoColumns[i].sClass !== null )
			{
				$(nTh).addClass( oSettings.aoColumns[i].sClass );
			}
			
			/* Set the title of the column if it is user defined (not what was auto detected) */
			if ( oSettings.aoColumns[i].sTitle != nTh.innerHTML )
			{
				nTh.innerHTML = oSettings.aoColumns[i].sTitle;
			}
		}
	}
	else
	{
		/* We don't have a header in the DOM - so we are going to have to create one */
		var nTr = document.createElement( "tr" );
		
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			nTh.innerHTML = oSettings.aoColumns[i].sTitle;
			
			if ( oSettings.aoColumns[i].sClass !== null )
			{
				$(nTh).addClass( oSettings.aoColumns[i].sClass );
			}
			
			nTr.appendChild( nTh );
		}
		$(oSettings.nTHead).html( '' )[0].appendChild( nTr );
		_fnDetectHeader( oSettings.aoHeader, oSettings.nTHead );
	}
	
	/* Add the extra markup needed by jQuery UI's themes */
	if ( oSettings.bJUI )
	{
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			
			var nDiv = document.createElement('div');
			nDiv.className = oSettings.oClasses.sSortJUIWrapper;
			$(nTh).contents().appendTo(nDiv);
			
			var nSpan = document.createElement('span');
			nSpan.className = oSettings.oClasses.sSortIcon;
			nDiv.appendChild( nSpan );
			nTh.appendChild( nDiv );
		}
	}
	
	/* Add sort listener */
	var fnNoSelect = function (e) {
		this.onselectstart = function() { return false; };
		return false;
	};
	
	if ( oSettings.oFeatures.bSort )
	{
		for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			if ( oSettings.aoColumns[i].bSortable !== false )
			{
				_fnSortAttachListener( oSettings, oSettings.aoColumns[i].nTh, i );
				
				/* Take the brutal approach to cancelling text selection in header */
				$(oSettings.aoColumns[i].nTh).bind( 'mousedown.DT', fnNoSelect );
			}
			else
			{
				$(oSettings.aoColumns[i].nTh).addClass( oSettings.oClasses.sSortableNone );
			}
		}
	}
	
	/* Deal with the footer - add classes if required */
	if ( oSettings.oClasses.sFooterTH !== "" )
	{
		$(oSettings.nTFoot).children('tr').children('th').addClass( oSettings.oClasses.sFooterTH );
	}
	
	/* Cache the footer elements */
	if ( oSettings.nTFoot !== null )
	{
		var anCells = _fnGetUniqueThs( oSettings, null, oSettings.aoFooter );
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			if ( typeof anCells[i] != 'undefined' )
			{
				oSettings.aoColumns[i].nTf = anCells[i];
				if ( oSettings.aoColumns[i].sClass )
				{
					$(anCells[i]).addClass( oSettings.aoColumns[i].sClass );
				}
			}
		}
	}
}


/**
 * Draw the header (or footer) element based on the column visibility states. The
 * methodology here is to use the layout array from _fnDetectHeader, modified for
 * the instantaneous column visibility, to construct the new layout. The grid is
 * traversed over cell at a time in a rows x columns grid fashion, although each 
 * cell insert can cover multiple elements in the grid - which is tracks using the
 * aApplied array. Cell inserts in the grid will only occur where there isn't
 * already a cell in that position.
 *  @param {object} oSettings dataTables settings object
 *  @param array {objects} aoSource Layout array from _fnDetectHeader
 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc, 
 *  @private
 */
function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
{
	var i, iLen, j, jLen, k, kLen;
	var aoLocal = [];
	var aApplied = [];
	var iColumns = oSettings.aoColumns.length;
	var iRowspan, iColspan;

	if ( typeof bIncludeHidden == 'undefined' )
	{
		bIncludeHidden = false;
	}

	/* Make a copy of the master layout array, but without the visible columns in it */
	for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
	{
		aoLocal[i] = aoSource[i].slice();
		aoLocal[i].nTr = aoSource[i].nTr;

		/* Remove any columns which are currently hidden */
		for ( j=iColumns-1 ; j>=0 ; j-- )
		{
			if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
			{
				aoLocal[i].splice( j, 1 );
			}
		}

		/* Prep the applied array - it needs an element for each row */
		aApplied.push( [] );
	}

	for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
	{
		/* All cells are going to be replaced, so empty out the row */
		if ( aoLocal[i].nTr )
		{
			for ( k=0, kLen=aoLocal[i].nTr.childNodes.length ; k<kLen ; k++ )
			{
				aoLocal[i].nTr.removeChild( aoLocal[i].nTr.childNodes[0] );
			}
		}

		for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
		{
			iRowspan = 1;
			iColspan = 1;

			/* Check to see if there is already a cell (row/colspan) covering our target
			 * insert point. If there is, then there is nothing to do.
			 */
			if ( typeof aApplied[i][j] == 'undefined' )
			{
				aoLocal[i].nTr.appendChild( aoLocal[i][j].cell );
				aApplied[i][j] = 1;

				/* Expand the cell to cover as many rows as needed */
				while ( typeof aoLocal[i+iRowspan] != 'undefined' &&
				        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
				{
					aApplied[i+iRowspan][j] = 1;
					iRowspan++;
				}

				/* Expand the cell to cover as many columns as needed */
				while ( typeof aoLocal[i][j+iColspan] != 'undefined' &&
				        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
				{
					/* Must update the applied array over the rows for the columns */
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aApplied[i+k][j+iColspan] = 1;
					}
					iColspan++;
				}

				/* Do the actual expansion in the DOM */
				aoLocal[i][j].cell.rowSpan = iRowspan;
				aoLocal[i][j].cell.colSpan = iColspan;
			}
		}
	}
}


/**
 * Insert the required TR nodes into the table for display
 *  @param {object} oSettings dataTables settings object
 *  @private
 */
function _fnDraw( oSettings )
{
	var i, iLen;
	var anRows = [];
	var iRowCount = 0;
	var bRowError = false;
	var iStripes = oSettings.asStripeClasses.length;
	var iOpenRows = oSettings.aoOpenRows.length;
	
	/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
	if ( oSettings.fnPreDrawCallback !== null &&
	     oSettings.fnPreDrawCallback.call( oSettings.oInstance, oSettings ) === false )
	{
	     return;
	}
	
	oSettings.bDrawing = true;
	
	/* Check and see if we have an initial draw position from state saving */
	if ( typeof oSettings.iInitDisplayStart != 'undefined' && oSettings.iInitDisplayStart != -1 )
	{
		if ( oSettings.oFeatures.bServerSide )
		{
			oSettings._iDisplayStart = oSettings.iInitDisplayStart;
		}
		else
		{
			oSettings._iDisplayStart = (oSettings.iInitDisplayStart >= oSettings.fnRecordsDisplay()) ?
				0 : oSettings.iInitDisplayStart;
		}
		oSettings.iInitDisplayStart = -1;
		_fnCalculateEnd( oSettings );
	}
	
	/* Server-side processing draw intercept */
	if ( oSettings.bDeferLoading )
	{
		oSettings.bDeferLoading = false;
		oSettings.iDraw++;
	}
	else if ( !oSettings.oFeatures.bServerSide )
	{
		oSettings.iDraw++;
	}
	else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
	{
		return;
	}
	
	if ( oSettings.aiDisplay.length !== 0 )
	{
		var iStart = oSettings._iDisplayStart;
		var iEnd = oSettings._iDisplayEnd;
		
		if ( oSettings.oFeatures.bServerSide )
		{
			iStart = 0;
			iEnd = oSettings.aoData.length;
		}
		
		for ( var j=iStart ; j<iEnd ; j++ )
		{
			var aoData = oSettings.aoData[ oSettings.aiDisplay[j] ];
			if ( aoData.nTr === null )
			{
				_fnCreateTr( oSettings, oSettings.aiDisplay[j] );
			}

			var nRow = aoData.nTr;
			
			/* Remove the old striping classes and then add the new one */
			if ( iStripes !== 0 )
			{
				var sStripe = oSettings.asStripeClasses[ iRowCount % iStripes ];
				if ( aoData._sRowStripe != sStripe )
				{
					$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
					aoData._sRowStripe = sStripe;
				}
			}
			
			/* Custom row callback function - might want to manipule the row */
			if ( typeof oSettings.fnRowCallback == "function" )
			{
				nRow = oSettings.fnRowCallback.call( oSettings.oInstance, nRow, 
					oSettings.aoData[ oSettings.aiDisplay[j] ]._aData, iRowCount, j );
				if ( !nRow && !bRowError )
				{
					_fnLog( oSettings, 0, "A node was not returned by fnRowCallback" );
					bRowError = true;
				}
			}
			
			anRows.push( nRow );
			iRowCount++;
			
			/* If there is an open row - and it is attached to this parent - attach it on redraw */
			if ( iOpenRows !== 0 )
			{
				for ( var k=0 ; k<iOpenRows ; k++ )
				{
					if ( nRow == oSettings.aoOpenRows[k].nParent )
					{
						anRows.push( oSettings.aoOpenRows[k].nTr );
					}
				}
			}
		}
	}
	else
	{
		/* Table is empty - create a row with an empty message in it */
		anRows[ 0 ] = document.createElement( 'tr' );
		
		if ( typeof oSettings.asStripeClasses[0] != 'undefined' )
		{
			anRows[ 0 ].className = oSettings.asStripeClasses[0];
		}

		var sZero = oSettings.oLanguage.sZeroRecords.replace(
			'_MAX_', oSettings.fnFormatNumber(oSettings.fnRecordsTotal()) );
		if ( oSettings.iDraw == 1 && oSettings.sAjaxSource !== null && !oSettings.oFeatures.bServerSide )
		{
			sZero = oSettings.oLanguage.sLoadingRecords;
		}
		else if ( typeof oSettings.oLanguage.sEmptyTable != 'undefined' &&
		     oSettings.fnRecordsTotal() === 0 )
		{
			sZero = oSettings.oLanguage.sEmptyTable;
		}

		var nTd = document.createElement( 'td' );
		nTd.setAttribute( 'valign', "top" );
		nTd.colSpan = _fnVisbleColumns( oSettings );
		nTd.className = oSettings.oClasses.sRowEmpty;
		nTd.innerHTML = sZero;
		
		anRows[ iRowCount ].appendChild( nTd );
	}
	
	/* Callback the header and footer custom funcation if there is one */
	if ( typeof oSettings.fnHeaderCallback == 'function' )
	{
		oSettings.fnHeaderCallback.call( oSettings.oInstance, $(oSettings.nTHead).children('tr')[0], 
			_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(),
			oSettings.aiDisplay );
	}
	
	if ( typeof oSettings.fnFooterCallback == 'function' )
	{
		oSettings.fnFooterCallback.call( oSettings.oInstance, $(oSettings.nTFoot).children('tr')[0], 
			_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(),
			oSettings.aiDisplay );
	}
	
	/* 
	 * Need to remove any old row from the display - note we can't just empty the tbody using
	 * $().html('') since this will unbind the jQuery event handlers (even although the node 
	 * still exists!) - equally we can't use innerHTML, since IE throws an exception.
	 */
	var
		nAddFrag = document.createDocumentFragment(),
		nRemoveFrag = document.createDocumentFragment(),
		nBodyPar, nTrs;
	
	if ( oSettings.nTBody )
	{
		nBodyPar = oSettings.nTBody.parentNode;
		nRemoveFrag.appendChild( oSettings.nTBody );
		
		/* When doing infinite scrolling, only remove child rows when sorting, filtering or start
		 * up. When not infinite scroll, always do it.
		 */
		if ( !oSettings.oScroll.bInfinite || !oSettings._bInitComplete ||
		 	oSettings.bSorted || oSettings.bFiltered )
		{
			nTrs = oSettings.nTBody.childNodes;
			for ( i=nTrs.length-1 ; i>=0 ; i-- )
			{
				nTrs[i].parentNode.removeChild( nTrs[i] );
			}
		}
		
		/* Put the draw table into the dom */
		for ( i=0, iLen=anRows.length ; i<iLen ; i++ )
		{
			nAddFrag.appendChild( anRows[i] );
		}
		
		oSettings.nTBody.appendChild( nAddFrag );
		if ( nBodyPar !== null )
		{
			nBodyPar.appendChild( oSettings.nTBody );
		}
	}
	
	/* Call all required callback functions for the end of a draw */
	for ( i=oSettings.aoDrawCallback.length-1 ; i>=0 ; i-- )
	{
		oSettings.aoDrawCallback[i].fn.call( oSettings.oInstance, oSettings );
	}
	$(oSettings.oInstance).trigger('draw', oSettings);
	
	/* Draw is complete, sorting and filtering must be as well */
	oSettings.bSorted = false;
	oSettings.bFiltered = false;
	oSettings.bDrawing = false;
	
	if ( oSettings.oFeatures.bServerSide )
	{
		_fnProcessingDisplay( oSettings, false );
		if ( typeof oSettings._bInitComplete == 'undefined' )
		{
			_fnInitComplete( oSettings );
		}
	}
}


/**
 * Redraw the table - taking account of the various features which are enabled
 *  @param {object} oSettings dataTables settings object
 *  @private
 */
function _fnReDraw( oSettings )
{
	if ( oSettings.oFeatures.bSort )
	{
		/* Sorting will refilter and draw for us */
		_fnSort( oSettings, oSettings.oPreviousSearch );
	}
	else if ( oSettings.oFeatures.bFilter )
	{
		/* Filtering will redraw for us */
		_fnFilterComplete( oSettings, oSettings.oPreviousSearch );
	}
	else
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
}


/**
 * Update the table using an Ajax call
 *  @param {object} oSettings dataTables settings object
 *  @returns {boolean} Block the table drawing or not
 *  @private
 */
function _fnAjaxUpdate( oSettings )
{
	if ( oSettings.bAjaxDataGet )
	{
		oSettings.iDraw++;
		_fnProcessingDisplay( oSettings, true );
		var iColumns = oSettings.aoColumns.length;
		var aoData = _fnAjaxParameters( oSettings );
		_fnServerParams( oSettings, aoData );
		
		oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aoData,
			function(json) {
				_fnAjaxUpdateDraw( oSettings, json );
			}, oSettings );
		return false;
	}
	else
	{
		return true;
	}
}


/**
 * Build up the parameters in an object needed for a server-side processing request
 *  @param {object} oSettings dataTables settings object
 *  @returns {bool} block the table drawing or not
 *  @private
 */
function _fnAjaxParameters( oSettings )
{
	var iColumns = oSettings.aoColumns.length;
	var aoData = [], mDataProp;
	var i;
	
	aoData.push( { "name": "sEcho",          "value": oSettings.iDraw } );
	aoData.push( { "name": "iColumns",       "value": iColumns } );
	aoData.push( { "name": "sColumns",       "value": _fnColumnOrdering(oSettings) } );
	aoData.push( { "name": "iDisplayStart",  "value": oSettings._iDisplayStart } );
	aoData.push( { "name": "iDisplayLength", "value": oSettings.oFeatures.bPaginate !== false ?
		oSettings._iDisplayLength : -1 } );
		
	for ( i=0 ; i<iColumns ; i++ )
	{
	  mDataProp = oSettings.aoColumns[i].mDataProp;
		aoData.push( { "name": "mDataProp_"+i, "value": typeof(mDataProp)=="function" ? 'function' : mDataProp } );
	}
	
	/* Filtering */
	if ( oSettings.oFeatures.bFilter !== false )
	{
		aoData.push( { "name": "sSearch", "value": oSettings.oPreviousSearch.sSearch } );
		aoData.push( { "name": "bRegex",  "value": oSettings.oPreviousSearch.bRegex } );
		for ( i=0 ; i<iColumns ; i++ )
		{
			aoData.push( { "name": "sSearch_"+i,     "value": oSettings.aoPreSearchCols[i].sSearch } );
			aoData.push( { "name": "bRegex_"+i,      "value": oSettings.aoPreSearchCols[i].bRegex } );
			aoData.push( { "name": "bSearchable_"+i, "value": oSettings.aoColumns[i].bSearchable } );
		}
	}
	
	/* Sorting */
	if ( oSettings.oFeatures.bSort !== false )
	{
		var iFixed = oSettings.aaSortingFixed !== null ? oSettings.aaSortingFixed.length : 0;
		var iUser = oSettings.aaSorting.length;
		aoData.push( { "name": "iSortingCols",   "value": iFixed+iUser } );
		for ( i=0 ; i<iFixed ; i++ )
		{
			aoData.push( { "name": "iSortCol_"+i,  "value": oSettings.aaSortingFixed[i][0] } );
			aoData.push( { "name": "sSortDir_"+i,  "value": oSettings.aaSortingFixed[i][1] } );
		}
		
		for ( i=0 ; i<iUser ; i++ )
		{
			aoData.push( { "name": "iSortCol_"+(i+iFixed),  "value": oSettings.aaSorting[i][0] } );
			aoData.push( { "name": "sSortDir_"+(i+iFixed),  "value": oSettings.aaSorting[i][1] } );
		}
		
		for ( i=0 ; i<iColumns ; i++ )
		{
			aoData.push( { "name": "bSortable_"+i,  "value": oSettings.aoColumns[i].bSortable } );
		}
	}
	
	return aoData;
}


/**
 * Add Ajax parameters from plugins
 *  @param {object} oSettings dataTables settings object
 *  @param array {objects} aoData name/value pairs to send to the server
 *  @private
 */
function _fnServerParams( oSettings, aoData )
{
	for ( var i=0, iLen=oSettings.aoServerParams.length ; i<iLen ; i++ )
	{
		oSettings.aoServerParams[i].fn.call( oSettings.oInstance, aoData );
	}
}


/**
 * Data the data from the server (nuking the old) and redraw the table
 *  @param {object} oSettings dataTables settings object
 *  @param {object} json json data return from the server.
 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
 *  @param {array} json.aaData The data to display on this page
 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
 *  @private
 */
function _fnAjaxUpdateDraw ( oSettings, json )
{
	if ( typeof json.sEcho != 'undefined' )
	{
		/* Protect against old returns over-writing a new one. Possible when you get
		 * very fast interaction, and later queires are completed much faster
		 */
		if ( json.sEcho*1 < oSettings.iDraw )
		{
			return;
		}
		else
		{
			oSettings.iDraw = json.sEcho * 1;
		}
	}
	
	if ( !oSettings.oScroll.bInfinite ||
		   (oSettings.oScroll.bInfinite && (oSettings.bSorted || oSettings.bFiltered)) )
	{
		_fnClearTable( oSettings );
	}
	oSettings._iRecordsTotal = parseInt(json.iTotalRecords, 10);
	oSettings._iRecordsDisplay = parseInt(json.iTotalDisplayRecords, 10);
	
	/* Determine if reordering is required */
	var sOrdering = _fnColumnOrdering(oSettings);
	var bReOrder = (typeof json.sColumns != 'undefined' && sOrdering !== "" && json.sColumns != sOrdering );
	if ( bReOrder )
	{
		var aiIndex = _fnReOrderIndex( oSettings, json.sColumns );
	}
	
	var aData = _fnGetObjectDataFn( oSettings.sAjaxDataProp )( json );
	for ( var i=0, iLen=aData.length ; i<iLen ; i++ )
	{
		if ( bReOrder )
		{
			/* If we need to re-order, then create a new array with the correct order and add it */
			var aDataSorted = [];
			for ( var j=0, jLen=oSettings.aoColumns.length ; j<jLen ; j++ )
			{
				aDataSorted.push( aData[i][ aiIndex[j] ] );
			}
			_fnAddData( oSettings, aDataSorted );
		}
		else
		{
			/* No re-order required, sever got it "right" - just straight add */
			_fnAddData( oSettings, aData[i] );
		}
	}
	oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	
	oSettings.bAjaxDataGet = false;
	_fnDraw( oSettings );
	oSettings.bAjaxDataGet = true;
	_fnProcessingDisplay( oSettings, false );
}


/**
 * Add the options to the page HTML for the table
 *  @param {object} oSettings dataTables settings object
 *  @private
 */
function _fnAddOptionsHtml ( oSettings )
{
	/*
	 * Create a temporary, empty, div which we can later on replace with what we have generated
	 * we do it this way to rendering the 'options' html offline - speed :-)
	 */
	var nHolding = document.createElement( 'div' );
	oSettings.nTable.parentNode.insertBefore( nHolding, oSettings.nTable );
	
	/* 
	 * All DataTables are wrapped in a div
	 */
	oSettings.nTableWrapper = document.createElement( 'div' );
	oSettings.nTableWrapper.className = oSettings.oClasses.sWrapper;
	if ( oSettings.sTableId !== '' )
	{
		oSettings.nTableWrapper.setAttribute( 'id', oSettings.sTableId+'_wrapper' );
	}

	oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;

	/* Track where we want to insert the option */
	var nInsertNode = oSettings.nTableWrapper;
	
	/* Loop over the user set positioning and place the elements as needed */
	var aDom = oSettings.sDom.split('');
	var nTmp, iPushFeature, cOption, nNewNode, cNext, sAttr, j;
	for ( var i=0 ; i<aDom.length ; i++ )
	{
		iPushFeature = 0;
		cOption = aDom[i];
		
		if ( cOption == '<' )
		{
			/* New container div */
			nNewNode = document.createElement( 'div' );
			
			/* Check to see if we should append an id and/or a class name to the container */
			cNext = aDom[i+1];
			if ( cNext == "'" || cNext == '"' )
			{
				sAttr = "";
				j = 2;
				while ( aDom[i+j] != cNext )
				{
					sAttr += aDom[i+j];
					j++;
				}
				
				/* Replace jQuery UI constants */
				if ( sAttr == "H" )
				{
					sAttr = "fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix";
				}
				else if ( sAttr == "F" )
				{
					sAttr = "fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix";
				}
				
				/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
				 * breaks the string into parts and applies them as needed
				 */
				if ( sAttr.indexOf('.') != -1 )
				{
					var aSplit = sAttr.split('.');
					nNewNode.setAttribute('id', aSplit[0].substr(1, aSplit[0].length-1) );
					nNewNode.className = aSplit[1];
				}
				else if ( sAttr.charAt(0) == "#" )
				{
					nNewNode.setAttribute('id', sAttr.substr(1, sAttr.length-1) );
				}
				else
				{
					nNewNode.className = sAttr;
				}
				
				i += j; /* Move along the position array */
			}
			
			nInsertNode.appendChild( nNewNode );
			nInsertNode = nNewNode;
		}
		else if ( cOption == '>' )
		{
			/* End container div */
			nInsertNode = nInsertNode.parentNode;
		}
		else if ( cOption == 'l' && oSettings.oFeatures.bPaginate && oSettings.oFeatures.bLengthChange )
		{
			/* Length */
			nTmp = _fnFeatureHtmlLength( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'f' && oSettings.oFeatures.bFilter )
		{
			/* Filter */
			nTmp = _fnFeatureHtmlFilter( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'r' && oSettings.oFeatures.bProcessing )
		{
			/* pRocessing */
			nTmp = _fnFeatureHtmlProcessing( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 't' )
		{
			/* Table */
			nTmp = _fnFeatureHtmlTable( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption ==  'i' && oSettings.oFeatures.bInfo )
		{
			/* Info */
			nTmp = _fnFeatureHtmlInfo( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'p' && oSettings.oFeatures.bPaginate )
		{
			/* Pagination */
			nTmp = _fnFeatureHtmlPaginate( oSettings );
			iPushFeature = 1;
		}
		else if ( DataTable.ext.aoFeatures.length !== 0 )
		{
			/* Plug-in features */
			var aoFeatures = DataTable.ext.aoFeatures;
			for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
			{
				if ( cOption == aoFeatures[k].cFeature )
				{
					nTmp = aoFeatures[k].fnInit( oSettings );
					if ( nTmp )
					{
						iPushFeature = 1;
					}
					break;
				}
			}
		}
		
		/* Add to the 2D features array */
		if ( iPushFeature == 1 && nTmp !== null )
		{
			if ( typeof oSettings.aanFeatures[cOption] != 'object' )
			{
				oSettings.aanFeatures[cOption] = [];
			}
			oSettings.aanFeatures[cOption].push( nTmp );
			nInsertNode.appendChild( nTmp );
		}
	}
	
	/* Built our DOM structure - replace the holding div with what we want */
	nHolding.parentNode.replaceChild( oSettings.nTableWrapper, nHolding );
}


/**
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference
 * to the cell that that point in the grid (regardless of col/rowspan), such that
 * any column / row could be removed and the new grid constructed
 *  @param array {object} aLayout Array to store the calculated layout in
 *  @param {node} nThead The header/footer element for the table
 *  @private
 */
function _fnDetectHeader ( aLayout, nThead )
{
	var nTrs = $(nThead).children('tr');
	var nCell;
	var i, j, k, l, iLen, jLen, iColShifted;
	var fnShiftCol = function ( a, i, j ) {
		while ( typeof a[i][j] != 'undefined' ) {
			j++;
		}
		return j;
	};

	aLayout.splice( 0, aLayout.length );
	
	/* We know how many rows there are in the layout - so prep it */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		aLayout.push( [] );
	}
	
	/* Calculate a layout array */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		var iColumn = 0;
		
		/* For every cell in the row... */
		for ( j=0, jLen=nTrs[i].childNodes.length ; j<jLen ; j++ )
		{
			nCell = nTrs[i].childNodes[j];

			if ( nCell.nodeName.toUpperCase() == "TD" ||
			     nCell.nodeName.toUpperCase() == "TH" )
			{
				/* Get the col and rowspan attributes from the DOM and sanitise them */
				var iColspan = nCell.getAttribute('colspan') * 1;
				var iRowspan = nCell.getAttribute('rowspan') * 1;
				iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
				iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

				/* There might be colspan cells already in this row, so shift our target 
				 * accordingly
				 */
				iColShifted = fnShiftCol( aLayout, i, iColumn );
				
				/* If there is col / rowspan, copy the information into the layout grid */
				for ( l=0 ; l<iColspan ; l++ )
				{
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aLayout[i+k][iColShifted+l] = {
							"cell": nCell,
							"unique": iColspan == 1 ? true : false
						};
						aLayout[i+k].nTr = nTrs[i];
					}
				}
			}
		}
	}
}


/**
 * Get an array of unique th elements, one for each column
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nHeader automatically detect the layout from this node - optional
 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
 *  @returns array {node} aReturn list of unique ths
 *  @private
 */
function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
{
	var aReturn = [];
	if ( typeof aLayout == 'undefined' )
	{
		aLayout = oSettings.aoHeader;
		if ( typeof nHeader != 'undefined' )
		{
			aLayout = [];
			_fnDetectHeader( aLayout, nHeader );
		}
	}

	for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
	{
		for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
		{
			if ( aLayout[i][j].unique && 
				 (typeof aReturn[j] == 'undefined' || !oSettings.bSortCellsTop) )
			{
				aReturn[j] = aLayout[i][j].cell;
			}
		}
	}
	
	return aReturn;
}

