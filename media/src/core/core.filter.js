

/**
 * Generate the node required for filtering text
 *  @returns {node} Filter control element
 *  @param {object} oSettings dataTables settings object
 *  @private
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


/**
 * Filter the table using both the global filter and column based filtering
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oSearch search information
 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
 *  @private
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


/**
 * Apply custom filtering functions
 *  @param {object} oSettings dataTables settings object
 *  @private
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


/**
 * Filter the table on a per-column basis
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sInput string to filter on
 *  @param {int} iColumn column to filter
 *  @param {bool} bRegex treat search string as a regular expression or not
 *  @param {bool} bSmart use smart filtering or not
 *  @private
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


/**
 * Filter the data table based on user input and draw the table
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sInput string to filter on
 *  @param {int} iForce optional - force a research of the master array (1) or not (undefined or 0)
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @private
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


/**
 * Create an array which can be quickly search through
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iMaster use the master data array - optional
 *  @private
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


/**
 * Create a searchable string from a single data row
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aData Row data array to use for the data to search
 *  @private
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

/**
 * Build a regular expression object suitable for searching a table
 *  @param {string} sSearch string to search for
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @returns {RegExp} constructed object
 *  @private
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


/**
 * Convert raw data into something that the user can search on
 *  @param {string} sData data to be modified
 *  @param {string} sType data type
 *  @returns {string} search string
 *  @private
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


/**
 * scape a string stuch that it can be used in a regular expression
 *  @param {string} sVal string to escape
 *  @returns {string} escaped string
 *  @private
 */
function _fnEscapeRegex ( sVal )
{
	var acEscape = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^' ];
  var reReplace = new RegExp( '(\\' + acEscape.join('|\\') + ')', 'g' );
  return sVal.replace(reReplace, '\\$1');
}

