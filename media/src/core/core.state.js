

/**
 * Save the state of a table in a cookie such that the page can be reloaded
 *  @param {object} oSettings dataTables settings object
 *  @private
 */
function _fnSaveState ( oSettings )
{
	if ( !oSettings.oFeatures.bStateSave || typeof oSettings.bDestroying != 'undefined' )
	{
		return;
	}
	
	/* Store the interesting variables */
	var i, iLen, sTmp;
	var sValue = "{";
	sValue += '"iCreate":'+ new Date().getTime()+',';
	sValue += '"iStart":'+ (oSettings.oScroll.bInfinite ? 0 : oSettings._iDisplayStart)+',';
	sValue += '"iEnd":'+ (oSettings.oScroll.bInfinite ? oSettings._iDisplayLength : oSettings._iDisplayEnd)+',';
	sValue += '"iLength":'+ oSettings._iDisplayLength+',';
	sValue += '"sFilter":"'+ encodeURIComponent(oSettings.oPreviousSearch.sSearch)+'",';
	sValue += '"sFilterEsc":'+ !oSettings.oPreviousSearch.bRegex+',';
	
	sValue += '"aaSorting":[ ';
	for ( i=0 ; i<oSettings.aaSorting.length ; i++ )
	{
		sValue += '['+oSettings.aaSorting[i][0]+',"'+oSettings.aaSorting[i][1]+'"],';
	}
	sValue = sValue.substring(0, sValue.length-1);
	sValue += "],";
	
	sValue += '"aaSearchCols":[ ';
	for ( i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
	{
		sValue += '["'+encodeURIComponent(oSettings.aoPreSearchCols[i].sSearch)+
			'",'+!oSettings.aoPreSearchCols[i].bRegex+'],';
	}
	sValue = sValue.substring(0, sValue.length-1);
	sValue += "],";
	
	sValue += '"abVisCols":[ ';
	for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
	{
		sValue += oSettings.aoColumns[i].bVisible+",";
	}
	sValue = sValue.substring(0, sValue.length-1);
	sValue += "]";
	
	/* Save state from any plug-ins */
	for ( i=0, iLen=oSettings.aoStateSave.length ; i<iLen ; i++ )
	{
		sTmp = oSettings.aoStateSave[i].fn( oSettings, sValue );
		if ( sTmp !== "" )
		{
			sValue = sTmp;
		}
	}
	
	sValue += "}";
	
	_fnCreateCookie( oSettings.sCookiePrefix+oSettings.sInstance, sValue, 
		oSettings.iCookieDuration, oSettings.sCookiePrefix, oSettings.fnCookieCallback );
}


/**
 * Attempt to load a saved table state from a cookie
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oInit DataTables init object so we can override settings
 *  @private
 */
function _fnLoadState ( oSettings, oInit )
{
	if ( !oSettings.oFeatures.bStateSave )
	{
		return;
	}
	
	var oData, i, iLen;
	var sData = _fnReadCookie( oSettings.sCookiePrefix+oSettings.sInstance );
	if ( sData !== null && sData !== '' )
	{
		/* Try/catch the JSON eval - if it is bad then we ignore it - note that 1.7.0 and before
		 * incorrectly used single quotes for some strings - hence the replace below
		 */
		try
		{
			oData = (typeof $.parseJSON == 'function') ? 
				$.parseJSON( sData.replace(/'/g, '"') ) : eval( '('+sData+')' );
		}
		catch( e )
		{
			return;
		}
		
		/* Allow custom and plug-in manipulation functions to alter the data set which was
		 * saved, and also reject any saved state by returning false
		 */
		for ( i=0, iLen=oSettings.aoStateLoad.length ; i<iLen ; i++ )
		{
			if ( !oSettings.aoStateLoad[i].fn( oSettings, oData ) )
			{
				return;
			}
		}
		
		/* Store the saved state so it might be accessed at any time (particualrly a plug-in */
		oSettings.oLoadedState = $.extend( true, {}, oData );
		
		/* Restore key features */
		oSettings._iDisplayStart = oData.iStart;
		oSettings.iInitDisplayStart = oData.iStart;
		oSettings._iDisplayEnd = oData.iEnd;
		oSettings._iDisplayLength = oData.iLength;
		oSettings.oPreviousSearch.sSearch = decodeURIComponent(oData.sFilter);
		oSettings.aaSorting = oData.aaSorting.slice();
		oSettings.saved_aaSorting = oData.aaSorting.slice();
		
		/*
		 * Search filtering - global reference added in 1.4.1
		 * Note that we use a 'not' for the value of the regular expression indicator to maintain
		 * compatibility with pre 1.7 versions, where this was basically inverted. Added in 1.7.0
		 */
		if ( typeof oData.sFilterEsc != 'undefined' )
		{
			oSettings.oPreviousSearch.bRegex = !oData.sFilterEsc;
		}
		
		/* Column filtering - added in 1.5.0 beta 6 */
		if ( typeof oData.aaSearchCols != 'undefined' )
		{
			for ( i=0 ; i<oData.aaSearchCols.length ; i++ )
			{
				oSettings.aoPreSearchCols[i] = {
					"sSearch": decodeURIComponent(oData.aaSearchCols[i][0]),
					"bRegex": !oData.aaSearchCols[i][1]
				};
			}
		}
		
		/* Column visibility state - added in 1.5.0 beta 10 */
		if ( typeof oData.abVisCols != 'undefined' )
		{
			/* Pass back visibiliy settings to the init handler, but to do not here override
			 * the init object that the user might have passed in
			 */
			oInit.saved_aoColumns = [];
			for ( i=0 ; i<oData.abVisCols.length ; i++ )
			{
				oInit.saved_aoColumns[i] = {};
				oInit.saved_aoColumns[i].bVisible = oData.abVisCols[i];
			}
		}
	}
}


/**
 * Create a new cookie with a value to store the state of a table
 *  @param {string} sName name of the cookie to create
 *  @param {string} sValue the value the cookie should take
 *  @param {int} iSecs duration of the cookie
 *  @param {string} sBaseName sName is made up of the base + file name - this is the base
 *  @param {function} fnCallback User definable function to modify the cookie
 *  @private
 */
function _fnCreateCookie ( sName, sValue, iSecs, sBaseName, fnCallback )
{
	var date = new Date();
	date.setTime( date.getTime()+(iSecs*1000) );
	
	/* 
	 * Shocking but true - it would appear IE has major issues with having the path not having
	 * a trailing slash on it. We need the cookie to be available based on the path, so we
	 * have to append the file name to the cookie name. Appalling. Thanks to vex for adding the
	 * patch to use at least some of the path
	 */
	var aParts = window.location.pathname.split('/');
	var sNameFile = sName + '_' + aParts.pop().replace(/[\/:]/g,"").toLowerCase();
	var sFullCookie, oData;
	
	if ( fnCallback !== null )
	{
		oData = (typeof $.parseJSON == 'function') ? 
			$.parseJSON( sValue ) : eval( '('+sValue+')' );
		sFullCookie = fnCallback( sNameFile, oData, date.toGMTString(),
			aParts.join('/')+"/" );
	}
	else
	{
		sFullCookie = sNameFile + "=" + encodeURIComponent(sValue) +
			"; expires=" + date.toGMTString() +"; path=" + aParts.join('/')+"/";
	}
	
	/* Are we going to go over the cookie limit of 4KiB? If so, try to delete a cookies
	 * belonging to DataTables. This is FAR from bullet proof
	 */
	var sOldName="", iOldTime=9999999999999;
	var iLength = _fnReadCookie( sNameFile )!==null ? document.cookie.length : 
		sFullCookie.length + document.cookie.length;
	
	if ( iLength+10 > 4096 ) /* Magic 10 for padding */
	{
		var aCookies =document.cookie.split(';');
		for ( var i=0, iLen=aCookies.length ; i<iLen ; i++ )
		{
			if ( aCookies[i].indexOf( sBaseName ) != -1 )
			{
				/* It's a DataTables cookie, so eval it and check the time stamp */
				var aSplitCookie = aCookies[i].split('=');
				try { oData = eval( '('+decodeURIComponent(aSplitCookie[1])+')' ); }
				catch( e ) { continue; }
				
				if ( typeof oData.iCreate != 'undefined' && oData.iCreate < iOldTime )
				{
					sOldName = aSplitCookie[0];
					iOldTime = oData.iCreate;
				}
			}
		}
		
		if ( sOldName !== "" )
		{
			document.cookie = sOldName+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+
				aParts.join('/') + "/";
		}
	}
	
	document.cookie = sFullCookie;
}


/**
 * Read an old cookie to get a cookie with an old table state
 *  @param {string} sName name of the cookie to read
 *  @returns {string} contents of the cookie - or null if no cookie with that name found
 *  @private
 */
function _fnReadCookie ( sName )
{
	var
		aParts = window.location.pathname.split('/'),
		sNameEQ = sName + '_' + aParts[aParts.length-1].replace(/[\/:]/g,"").toLowerCase() + '=',
	 	sCookieContents = document.cookie.split(';');
	
	for( var i=0 ; i<sCookieContents.length ; i++ )
	{
		var c = sCookieContents[i];
		
		while (c.charAt(0)==' ')
		{
			c = c.substring(1,c.length);
		}
		
		if (c.indexOf(sNameEQ) === 0)
		{
			return decodeURIComponent( c.substring(sNameEQ.length,c.length) );
		}
	}
	return null;
}

