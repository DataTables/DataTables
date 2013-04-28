

/**
 * Draw the table for the first time, adding all required features
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnInitialise ( oSettings )
{
	var i, iLen, iAjaxStart=oSettings.iInitDisplayStart;
	
	/* Ensure that the table data is fully initialised */
	if ( oSettings.bInitialised === false )
	{
		setTimeout( function(){ _fnInitialise( oSettings ); }, 200 );
		return;
	}
	
	/* Show the display HTML options */
	_fnAddOptionsHtml( oSettings );
	
	/* Build and draw the header / footer for the table */
	_fnBuildHead( oSettings );
	_fnDrawHead( oSettings, oSettings.aoHeader );
	_fnDrawHead( oSettings, oSettings.aoFooter );

	/* Okay to show that something is going on now */
	_fnProcessingDisplay( oSettings, true );
	
	/* Calculate sizes for columns */
	if ( oSettings.oFeatures.bAutoWidth )
	{
		_fnCalculateColumnWidths( oSettings );
	}
	
	for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoColumns[i].sWidth !== null )
		{
			oSettings.aoColumns[i].nTh.style.width = _fnStringToCss( oSettings.aoColumns[i].sWidth );
		}
	}
	
	/* If there is default sorting required - let's do it. The sort function will do the
	 * drawing for us. Otherwise we draw the table regardless of the Ajax source - this allows
	 * the table to look initialised for Ajax sourcing data (show 'loading' message possibly)
	 */
	_fnReDraw( oSettings );
	
	/* if there is an ajax source load the data */
	if ( (oSettings.sAjaxSource || oSettings.ajax) && !oSettings.oFeatures.bServerSide )
	{
		var aoData = [];
		_fnBuildAjax( oSettings, [], function(json) {
			var aData = _fnAjaxDataSrc( oSettings, json );

			/* Got the data - add it to the table */
			for ( i=0 ; i<aData.length ; i++ )
			{
				_fnAddData( oSettings, aData[i] );
			}
			
			/* Reset the init display for cookie saving. We've already done a filter, and
			 * therefore cleared it before. So we need to make it appear 'fresh'
			 */
			oSettings.iInitDisplayStart = iAjaxStart;
			
			_fnReDraw( oSettings );
			
			_fnProcessingDisplay( oSettings, false );
			_fnInitComplete( oSettings, json );
		}, oSettings );
		return;
	}
	
	/* Server-side processing init complete is done by _fnAjaxUpdateDraw */
	if ( !oSettings.oFeatures.bServerSide )
	{
		_fnProcessingDisplay( oSettings, false );
		_fnInitComplete( oSettings );
	}
}


/**
 * Draw the table for the first time, adding all required features
 *  @param {object} oSettings dataTables settings object
 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
 *    with client-side processing (optional)
 *  @memberof DataTable#oApi
 */
function _fnInitComplete ( oSettings, json )
{
	oSettings._bInitComplete = true;
	_fnCallbackFire( oSettings, 'aoInitComplete', 'init', [oSettings, json] );
}

