

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - Feature: Filtering
 */

/*
 * Function: _fnFeatureHtmlFilter
 * Purpose:  Generate the node required for filtering text
 * Returns:  node
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnFeatureHtmlFilter ( oSettings )
{
	var sSearchStr = oSettings.oLanguage.sSearch;
	sSearchStr = (sSearchStr.indexOf('_INPUT_') !== -1) ?
	  sSearchStr.replace('_INPUT_', '<input type="text" />') :
	  sSearchStr==="" ? '<input type="text" />' : sSearchStr+' <input type="text" />';
	
	var nFilter = document.createElement( 'div' );
	nFilter.className = oSettings.oClasses.sFilter;
	nFilter.innerHTML = '<label>'+sSearchStr+'</label>';
	if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.f == "undefined" )
	{
		nFilter.setAttribute( 'id', oSettings.sTableId+'_filter' );
	}
	
	var jqFilter = $("input", nFilter);
	jqFilter.val( oSettings.oPreviousSearch.sSearch.replace('"','&quot;') );
	jqFilter.bind( 'keyup.DT', function(e) {
		/* Update all other filter input elements for the new display */
		var n = oSettings.aanFeatures.f;
		for ( var i=0, iLen=n.length ; i<iLen ; i++ )
		{
			if ( n[i] != $(this).parents('div.dataTables_filter')[0] )
			{
				$('input', n[i]).val( this.value );
			}
		}
		
		/* Now do the filter */
		if ( this.value != oSettings.oPreviousSearch.sSearch )
		{
			_fnFilterComplete( oSettings, { 
				"sSearch": this.value, 
				"bRegex":  oSettings.oPreviousSearch.bRegex,
				"bSmart":  oSettings.oPreviousSearch.bSmart 
			} );
		}
	} );
	
	jqFilter.bind( 'keypress.DT', function(e) {
		/* Prevent default */
		if ( e.keyCode == 13 )
		{
			return false;
		}
	} );
	
	return nFilter;
}

/*
 * Function: _fnFilterComplete
 * Purpose:  Filter the table using both the global filter and column based filtering
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           object:oSearch: search information
 *           int:iForce - optional - force a research of the master array (1) or not (undefined or 0)
 */
function _fnFilterComplete ( oSettings, oInput, iForce )
{
	/* Filter on everything */
	_fnFilter( oSettings, oInput.sSearch, iForce, oInput.bRegex, oInput.bSmart );
	
	/* Now do the individual column filter */
	for ( var i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
	{
		_fnFilterColumn( oSettings, oSettings.aoPreSearchCols[i].sSearch, i, 
			oSettings.aoPreSearchCols[i].bRegex, oSettings.aoPreSearchCols[i].bSmart );
	}
	
	/* Custom filtering */
	if ( _oExt.afnFiltering.length !== 0 )
	{
		_fnFilterCustom( oSettings );
	}
	
	/* Tell the draw function we have been filtering */
	oSettings.bFiltered = true;
	$(oSettings.oInstance).trigger('filter', oSettings);
	
	/* Redraw the table */
	oSettings._iDisplayStart = 0;
	_fnCalculateEnd( oSettings );
	_fnDraw( oSettings );
	
	/* Rebuild search array 'offline' */
	_fnBuildSearchArray( oSettings, 0 );
}

/*
 * Function: _fnFilterCustom
 * Purpose:  Apply custom filtering functions
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnFilterCustom( oSettings )
{
	var afnFilters = _oExt.afnFiltering;
	for ( var i=0, iLen=afnFilters.length ; i<iLen ; i++ )
	{
		var iCorrector = 0;
		for ( var j=0, jLen=oSettings.aiDisplay.length ; j<jLen ; j++ )
		{
			var iDisIndex = oSettings.aiDisplay[j-iCorrector];
			
			/* Check if we should use this row based on the filtering function */
			if ( !afnFilters[i]( oSettings, _fnGetRowData( oSettings, iDisIndex, 'filter' ), iDisIndex ) )
			{
				oSettings.aiDisplay.splice( j-iCorrector, 1 );
				iCorrector++;
			}
		}
	}
}

/*
 * Function: _fnFilterColumn
 * Purpose:  Filter the table on a per-column basis
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           string:sInput - string to filter on
 *           int:iColumn - column to filter
 *           bool:bRegex - treat search string as a regular expression or not
 *           bool:bSmart - use smart filtering or not
 */
function _fnFilterColumn ( oSettings, sInput, iColumn, bRegex, bSmart )
{
	if ( sInput === "" )
	{
		return;
	}
	
	var iIndexCorrector = 0;
	var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart );
	
	for ( var i=oSettings.aiDisplay.length-1 ; i>=0 ; i-- )
	{
		var sData = _fnDataToSearch( _fnGetCellData( oSettings, oSettings.aiDisplay[i], iColumn, 'filter' ),
			oSettings.aoColumns[iColumn].sType );
		if ( ! rpSearch.test( sData ) )
		{
			oSettings.aiDisplay.splice( i, 1 );
			iIndexCorrector++;
		}
	}
}

/*
 * Function: _fnFilter
 * Purpose:  Filter the data table based on user input and draw the table
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           string:sInput - string to filter on
 *           int:iForce - optional - force a research of the master array (1) or not (undefined or 0)
 *           bool:bRegex - treat as a regular expression or not
 *           bool:bSmart - perform smart filtering or not
 */
function _fnFilter( oSettings, sInput, iForce, bRegex, bSmart )
{
	var i;
	var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart );
	
	/* Check if we are forcing or not - optional parameter */
	if ( typeof iForce == 'undefined' || iForce === null )
	{
		iForce = 0;
	}
	
	/* Need to take account of custom filtering functions - always filter */
	if ( _oExt.afnFiltering.length !== 0 )
	{
		iForce = 1;
	}
	
	/*
	 * If the input is blank - we want the full data set
	 */
	if ( sInput.length <= 0 )
	{
		oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	}
	else
	{
		/*
		 * We are starting a new search or the new search string is smaller 
		 * then the old one (i.e. delete). Search from the master array
	 	 */
		if ( oSettings.aiDisplay.length == oSettings.aiDisplayMaster.length ||
			   oSettings.oPreviousSearch.sSearch.length > sInput.length || iForce == 1 ||
			   sInput.indexOf(oSettings.oPreviousSearch.sSearch) !== 0 )
		{
			/* Nuke the old display array - we are going to rebuild it */
			oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
			
			/* Force a rebuild of the search array */
			_fnBuildSearchArray( oSettings, 1 );
			
			/* Search through all records to populate the search array
			 * The the oSettings.aiDisplayMaster and asDataSearch arrays have 1 to 1 
			 * mapping
			 */
			for ( i=0 ; i<oSettings.aiDisplayMaster.length ; i++ )
			{
				if ( rpSearch.test(oSettings.asDataSearch[i]) )
				{
					oSettings.aiDisplay.push( oSettings.aiDisplayMaster[i] );
				}
			}
	  }
	  else
		{
	  	/* Using old search array - refine it - do it this way for speed
	  	 * Don't have to search the whole master array again
			 */
	  	var iIndexCorrector = 0;
	  	
	  	/* Search the current results */
	  	for ( i=0 ; i<oSettings.asDataSearch.length ; i++ )
			{
	  		if ( ! rpSearch.test(oSettings.asDataSearch[i]) )
				{
	  			oSettings.aiDisplay.splice( i-iIndexCorrector, 1 );
	  			iIndexCorrector++;
	  		}
	  	}
	  }
	}
	oSettings.oPreviousSearch.sSearch = sInput;
	oSettings.oPreviousSearch.bRegex = bRegex;
	oSettings.oPreviousSearch.bSmart = bSmart;
}

/*
 * Function: _fnBuildSearchArray
 * Purpose:  Create an array which can be quickly search through
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           int:iMaster - use the master data array - optional
 */
function _fnBuildSearchArray ( oSettings, iMaster )
{
	if ( !oSettings.oFeatures.bServerSide )
	{
		/* Clear out the old data */
		oSettings.asDataSearch.splice( 0, oSettings.asDataSearch.length );
		
		var aArray = (typeof iMaster != 'undefined' && iMaster == 1) ?
		 	oSettings.aiDisplayMaster : oSettings.aiDisplay;
		
		for ( var i=0, iLen=aArray.length ; i<iLen ; i++ )
		{
			oSettings.asDataSearch[i] = _fnBuildSearchRow( oSettings,
				_fnGetRowData( oSettings, aArray[i], 'filter' ) );
		}
	}
}

/*
 * Function: _fnBuildSearchRow
 * Purpose:  Create a searchable string from a single data row
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           array:aData - Row data array to use for the data to search
 */
function _fnBuildSearchRow( oSettings, aData )
{
	var sSearch = '';
	if ( typeof oSettings.__nTmpFilter == 'undefined' ) {
		oSettings.__nTmpFilter = document.createElement('div');
	}
	var nTmp = oSettings.__nTmpFilter;
	
	for ( var j=0, jLen=oSettings.aoColumns.length ; j<jLen ; j++ )
	{
		if ( oSettings.aoColumns[j].bSearchable )
		{
			var sData = aData[j];
			sSearch += _fnDataToSearch( sData, oSettings.aoColumns[j].sType )+'  ';
		}
	}
	
	/* If it looks like there is an HTML entity in the string, attempt to decode it */
	if ( sSearch.indexOf('&') !== -1 )
	{
		nTmp.innerHTML = sSearch;
		sSearch = nTmp.textContent ? nTmp.textContent : nTmp.innerText;
		
		/* IE and Opera appear to put an newline where there is a <br> tag - remove it */
		sSearch = sSearch.replace(/\n/g," ").replace(/\r/g,"");
	}
	
	return sSearch;
}

/*
 * Function: _fnFilterCreateSearch
 * Purpose:  Build a regular expression object suitable for searching a table
 * Returns:  RegExp: - constructed object
 * Inputs:   string:sSearch - string to search for
 *           bool:bRegex - treat as a regular expression or not
 *           bool:bSmart - perform smart filtering or not
 */
function _fnFilterCreateSearch( sSearch, bRegex, bSmart )
{
	var asSearch, sRegExpString;
	
	if ( bSmart )
	{
		/* Generate the regular expression to use. Something along the lines of:
		 * ^(?=.*?\bone\b)(?=.*?\btwo\b)(?=.*?\bthree\b).*$
		 */
		asSearch = bRegex ? sSearch.split( ' ' ) : _fnEscapeRegex( sSearch ).split( ' ' );
		sRegExpString = '^(?=.*?'+asSearch.join( ')(?=.*?' )+').*$';
		return new RegExp( sRegExpString, "i" );
	}
	else
	{
		sSearch = bRegex ? sSearch : _fnEscapeRegex( sSearch );
		return new RegExp( sSearch, "i" );
	}
}

/*
 * Function: _fnDataToSearch
 * Purpose:  Convert raw data into something that the user can search on
 * Returns:  string: - search string
 * Inputs:   string:sData - data to be modified
 *           string:sType - data type
 */
function _fnDataToSearch ( sData, sType )
{
	if ( typeof _oExt.ofnSearch[sType] == "function" )
	{
		return _oExt.ofnSearch[sType]( sData );
	}
	else if ( sType == "html" )
	{
		return sData.replace(/[\r\n]/g," ").replace( /<.*?>/g, "" );
	}
	else if ( typeof sData == "string" )
	{
		return sData.replace(/[\r\n]/g," ");
	}
	else if ( sData === null )
	{
		return '';
	}
	return sData;
}


/*
 * Function: _fnEscapeRegex
 * Purpose:  scape a string stuch that it can be used in a regular expression
 * Returns:  string: - escaped string
 * Inputs:   string:sVal - string to escape
 */
function _fnEscapeRegex ( sVal )
{
	var acEscape = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^' ];
  var reReplace = new RegExp( '(\\' + acEscape.join('|\\') + ')', 'g' );
  return sVal.replace(reReplace, '\\$1');
}
