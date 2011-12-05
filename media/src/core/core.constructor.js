
var i=0, iLen, j, jLen, k, kLen;
var sId = this.getAttribute( 'id' );
var bInitHandedOff = false;
var bUsePassedData = false;


/* Sanity check */
if ( this.nodeName.toLowerCase() != 'table' )
{
	_fnLog( oSettings, 0, "Attempted to initialise DataTables on a node which is not a "+
		"table: "+this.nodeName );
	return;
}

/* Check to see if we are re-initialising a table */
for ( i=0, iLen=_aoSettings.length ; i<iLen ; i++ )
{
	/* Base check on table node */
	if ( _aoSettings[i].nTable == this )
	{
		if ( typeof oInit == 'undefined' || oInit.bRetrieve )
		{
			return _aoSettings[i].oInstance;
		}
		else if ( oInit.bDestroy )
		{
			_aoSettings[i].oInstance.fnDestroy();
			break;
		}
		else
		{
			_fnLog( _aoSettings[i], 0, "Cannot reinitialise DataTable.\n\n"+
				"To retrieve the DataTables object for this table, please pass either no arguments "+
				"to the dataTable() function, or set bRetrieve to true. Alternatively, to destroy "+
				"the old table and create a new one, set bDestroy to true (note that a lot of "+
				"changes to the configuration can be made through the API which is usually much "+
				"faster)." );
			return;
		}
	}
	
	/* If the element we are initialising has the same ID as a table which was previously
	 * initialised, but the table nodes don't match (from before) then we destroy the old
	 * instance by simply deleting it. This is under the assumption that the table has been
	 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
	 */
	if ( _aoSettings[i].sTableId !== "" && _aoSettings[i].sTableId == this.getAttribute('id') )
	{
		_aoSettings.splice( i, 1 );
		break;
	}
}

/* Create the settings object for this table and set some of the default parameters */
var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
	"nTable":        this,
	"oApi":          _that.oApi,
	"oInit":         oInit,
	"oInstance":     (_that.length===1) ? _that : $(this).dataTable(),
	"sDestroyWidth": $(this).width(),
	"sInstance":     (sId!==null) ? sId : _oExt._oExternConfig.iNextUnique++,
	"sTableId":      sId
} );
_aoSettings.push( oSettings );

/* Setting up the initialisation object */
if (typeof oInit === 'undefined' || oInit === null)
{
	oInit = {};
}

// Backwards compatibility, before we apply all the defaults
if ( typeof oInit.oLanguage != 'undefined' )
{
	_fnLanguageCompat( oInit.oLanguage );
}

oInit = _fnExtend( $.extend(true, {}, DataTable.models.oInit), oInit );

// Map the initialisation options onto the settings object
_fnMap( oSettings.oFeatures, oInit, "bPaginate" );
_fnMap( oSettings.oFeatures, oInit, "bLengthChange" );
_fnMap( oSettings.oFeatures, oInit, "bFilter" );
_fnMap( oSettings.oFeatures, oInit, "bSort" );
_fnMap( oSettings.oFeatures, oInit, "bInfo" );
_fnMap( oSettings.oFeatures, oInit, "bProcessing" );
_fnMap( oSettings.oFeatures, oInit, "bAutoWidth" );
_fnMap( oSettings.oFeatures, oInit, "bSortClasses" );
_fnMap( oSettings.oFeatures, oInit, "bServerSide" );
_fnMap( oSettings.oFeatures, oInit, "bDeferRender" );
_fnMap( oSettings.oScroll, oInit, "sScrollX", "sX" );
_fnMap( oSettings.oScroll, oInit, "sScrollXInner", "sXInner" );
_fnMap( oSettings.oScroll, oInit, "sScrollY", "sY" );
_fnMap( oSettings.oScroll, oInit, "bScrollCollapse", "bCollapse" );
_fnMap( oSettings.oScroll, oInit, "bScrollInfinite", "bInfinite" );
_fnMap( oSettings.oScroll, oInit, "iScrollLoadGap", "iLoadGap" );
_fnMap( oSettings.oScroll, oInit, "bScrollAutoCss", "bAutoCss" );
_fnMap( oSettings, oInit, "asStripClasses", "asStripeClasses" ); // legacy
_fnMap( oSettings, oInit, "asStripeClasses" );
_fnMap( oSettings, oInit, "fnPreDrawCallback" );
_fnMap( oSettings, oInit, "fnRowCallback" );
_fnMap( oSettings, oInit, "fnHeaderCallback" );
_fnMap( oSettings, oInit, "fnFooterCallback" );
_fnMap( oSettings, oInit, "fnCookieCallback" );
_fnMap( oSettings, oInit, "fnInitComplete" );
_fnMap( oSettings, oInit, "fnServerData" );
_fnMap( oSettings, oInit, "sServerMethod" );
_fnMap( oSettings, oInit, "fnFormatNumber" );
_fnMap( oSettings, oInit, "aaSorting" );
_fnMap( oSettings, oInit, "aaSortingFixed" );
_fnMap( oSettings, oInit, "aLengthMenu" );
_fnMap( oSettings, oInit, "sPaginationType" );
_fnMap( oSettings, oInit, "sAjaxSource" );
_fnMap( oSettings, oInit, "sAjaxDataProp" );
_fnMap( oSettings, oInit, "iCookieDuration" );
_fnMap( oSettings, oInit, "sCookiePrefix" );
_fnMap( oSettings, oInit, "sDom" );
_fnMap( oSettings, oInit, "bSortCellsTop" );
_fnMap( oSettings, oInit, "oSearch", "oPreviousSearch" );
_fnMap( oSettings, oInit, "aoSearchCols", "aoPreSearchCols" );
_fnMap( oSettings, oInit, "iDisplayLength", "_iDisplayLength" );
_fnMap( oSettings, oInit, "bJQueryUI", "bJUI" );
_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );

/* Callback functions which are array driven */
if ( typeof oInit.fnDrawCallback == 'function' )
{
	oSettings.aoDrawCallback.push( {
		"fn": oInit.fnDrawCallback,
		"sName": "user"
	} );
}

/* Ajax additional variables are array driven */
if ( typeof oInit.fnServerParams == 'function' )
{
	oSettings.aoServerParams.push( {
		"fn": oInit.fnServerParams,
		"sName": "user"
	} );
}

if ( typeof oInit.fnStateSaveCallback == 'function' )
{
	oSettings.aoStateSave.push( {
		"fn": oInit.fnStateSaveCallback,
		"sName": "user"
	} );
}

if ( typeof oInit.fnStateLoadCallback == 'function' )
{
	oSettings.aoStateLoad.push( {
		"fn": oInit.fnStateLoadCallback,
		"sName": "user"
	} );
}

if ( oSettings.oFeatures.bServerSide && oSettings.oFeatures.bSort &&
	   oSettings.oFeatures.bSortClasses )
{
	/* Enable sort classes for server-side processing. Safe to do it here, since server-side
	 * processing must be enabled by the developer
	 */
	oSettings.aoDrawCallback.push( {
		"fn": _fnSortingClasses,
		"sName": "server_side_sort_classes"
	} );
}
else if ( oSettings.oFeatures.bDeferRender )
{
	oSettings.aoDrawCallback.push( {
		"fn": _fnSortingClasses,
		"sName": "defer_sort_classes"
	} );
}

if ( oInit.bJQueryUI )
{
	/* Use the JUI classes object for display. You could clone the oStdClasses object if 
	 * you want to have multiple tables with multiple independent classes 
	 */
	oSettings.oClasses = _oExt.oJUIClasses;
	
	if ( typeof oInit.sDom == 'undefined' )
	{
		/* Set the DOM to use a layout suitable for jQuery UI's theming */
		oSettings.sDom = '<"H"lfr>t<"F"ip>';
	}
}
else
{
	oSettings.oClasses = _oExt.oStdClasses;
}

/* Calculate the scroll bar width and cache it for use later on */
if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
{
	oSettings.oScroll.iBarWidth = _fnScrollBarWidth();
}

if ( typeof oSettings.iInitDisplayStart == 'undefined' )
{
	/* Display start point, taking into account the save saving */
	oSettings.iInitDisplayStart = oInit.iDisplayStart;
	oSettings._iDisplayStart = oInit.iDisplayStart;
}

/* Must be done after everything which can be overridden by a cookie! */
if ( oInit.bStateSave )
{
	oSettings.oFeatures.bStateSave = true;
	_fnLoadState( oSettings, oInit );
	oSettings.aoDrawCallback.push( {
		"fn": _fnSaveState,
		"sName": "state_save"
	} );
}

if ( oInit.iDeferLoading !== null )
{
	oSettings.bDeferLoading = true;
	oSettings._iRecordsTotal = oInit.iDeferLoading;
	oSettings._iRecordsDisplay = oInit.iDeferLoading;
}

if ( oInit.aaData !== null )
{
	bUsePassedData = true;
}

/* Language definitions */
if ( oInit.oLanguage.sUrl !== "" )
{
	/* Get the language definitions from a file - because this Ajax call makes the language
	 * get async to the remainder of this function we use bInitHandedOff to indicate that 
	 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
	 */
	oSettings.oLanguage.sUrl = oInit.oLanguage.sUrl;
	$.getJSON( oSettings.oLanguage.sUrl, null, function( json ) {
		_fnLanguageCompat( json );
		$.extend( true, oSettings.oLanguage, json );
		_fnInitialise( oSettings );
	} );
	bInitHandedOff = true;
}
else
{
	$.extend( true, oSettings.oLanguage, oInit.oLanguage );
}


/*
 * Stripes
 */

/* Remove row stripe classes if they are already on the table row */
var bStripeRemove = false;
var anRows = $(this).children('tbody').children('tr');
for ( i=0, iLen=oSettings.asStripeClasses.length ; i<iLen ; i++ )
{
	if ( anRows.filter(":lt(2)").hasClass( oSettings.asStripeClasses[i]) )
	{
		bStripeRemove = true;
		break;
	}
}
		
if ( bStripeRemove )
{
	/* Store the classes which we are about to remove so they can be readded on destroy */
	oSettings.asDestroyStripes = [ '', '' ];
	if ( $(anRows[0]).hasClass(oSettings.oClasses.sStripeOdd) )
	{
		oSettings.asDestroyStripes[0] += oSettings.oClasses.sStripeOdd+" ";
	}
	if ( $(anRows[0]).hasClass(oSettings.oClasses.sStripeEven) )
	{
		oSettings.asDestroyStripes[0] += oSettings.oClasses.sStripeEven;
	}
	if ( $(anRows[1]).hasClass(oSettings.oClasses.sStripeOdd) )
	{
		oSettings.asDestroyStripes[1] += oSettings.oClasses.sStripeOdd+" ";
	}
	if ( $(anRows[1]).hasClass(oSettings.oClasses.sStripeEven) )
	{
		oSettings.asDestroyStripes[1] += oSettings.oClasses.sStripeEven;
	}
	
	anRows.removeClass( oSettings.asStripeClasses.join(' ') );
}


/*
 * Columns
 * See if we should load columns automatically or use defined ones
 */
var anThs = [];
var aoColumnsInit;
var nThead = this.getElementsByTagName('thead');
if ( nThead.length !== 0 )
{
	_fnDetectHeader( oSettings.aoHeader, nThead[0] );
	anThs = _fnGetUniqueThs( oSettings );
}

/* If not given a column array, generate one with nulls */
if ( oInit.aoColumns === null )
{
	aoColumnsInit = [];
	for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
	{
		aoColumnsInit.push( null );
	}
}
else
{
	aoColumnsInit = oInit.aoColumns;
}

/* Add the columns */
for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
{
	/* Check if we have column visibilty state to restore */
	if ( typeof oInit.saved_aoColumns != 'undefined' && oInit.saved_aoColumns.length == iLen )
	{
		if ( aoColumnsInit[i] === null )
		{
			aoColumnsInit[i] = {};
		}
		aoColumnsInit[i].bVisible = oInit.saved_aoColumns[i].bVisible;
	}
	
	_fnAddColumn( oSettings, anThs ? anThs[i] : null );
}

/* Add options from column definations */
if ( oInit.aoColumnDefs !== null )
{
	/* Loop over the column defs array - loop in reverse so first instace has priority */
	for ( i=oInit.aoColumnDefs.length-1 ; i>=0 ; i-- )
	{
		/* Each column def can target multiple columns, as it is an array */
		var aTargets = oInit.aoColumnDefs[i].aTargets;
		if ( !$.isArray( aTargets ) )
		{
			_fnLog( oSettings, 1, 'aTargets must be an array of targets, not a '+(typeof aTargets) );
		}
		for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
		{
			if ( typeof aTargets[j] == 'number' && aTargets[j] >= 0 )
			{
				/* 0+ integer, left to right column counting. We add columns which are unknown
				 * automatically. Is this the right behaviour for this? We should at least
				 * log it in future. We cannot do this for the negative or class targets, only here.
				 */
				while( oSettings.aoColumns.length <= aTargets[j] )
				{
					_fnAddColumn( oSettings );
				}
				_fnColumnOptions( oSettings, aTargets[j], oInit.aoColumnDefs[i] );
			}
			else if ( typeof aTargets[j] == 'number' && aTargets[j] < 0 )
			{
				/* Negative integer, right to left column counting */
				_fnColumnOptions( oSettings, oSettings.aoColumns.length+aTargets[j], 
					oInit.aoColumnDefs[i] );
			}
			else if ( typeof aTargets[j] == 'string' )
			{
				/* Class name matching on TH element */
				for ( k=0, kLen=oSettings.aoColumns.length ; k<kLen ; k++ )
				{
					if ( aTargets[j] == "_all" ||
					     $(oSettings.aoColumns[k].nTh).hasClass( aTargets[j] ) )
					{
						_fnColumnOptions( oSettings, k, oInit.aoColumnDefs[i] );
					}
				}
			}
		}
	}
}

/* Add options from column array - after the defs array so this has priority */
if ( typeof aoColumnsInit != 'undefined' )
{
	for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
	{
		_fnColumnOptions( oSettings, i, aoColumnsInit[i] );
	}
}


/*
 * Sorting
 * Check the aaSorting array
 */
for ( i=0, iLen=oSettings.aaSorting.length ; i<iLen ; i++ )
{
	if ( oSettings.aaSorting[i][0] >= oSettings.aoColumns.length )
	{
		oSettings.aaSorting[i][0] = 0;
	}
	var oColumn = oSettings.aoColumns[ oSettings.aaSorting[i][0] ];
	
	/* Add a default sorting index */
	if ( typeof oSettings.aaSorting[i][2] == 'undefined' )
	{
		oSettings.aaSorting[i][2] = 0;
	}
	
	/* If aaSorting is not defined, then we use the first indicator in asSorting */
	if ( typeof oInit.aaSorting == "undefined" && 
			 typeof oSettings.saved_aaSorting == "undefined" )
	{
		oSettings.aaSorting[i][1] = oColumn.asSorting[0];
	}
	
	/* Set the current sorting index based on aoColumns.asSorting */
	for ( j=0, jLen=oColumn.asSorting.length ; j<jLen ; j++ )
	{
		if ( oSettings.aaSorting[i][1] == oColumn.asSorting[j] )
		{
			oSettings.aaSorting[i][2] = j;
			break;
		}
	}
}
	
/* Do a first pass on the sorting classes (allows any size changes to be taken into
 * account, and also will apply sorting disabled classes if disabled
 */
_fnSortingClasses( oSettings );


/*
 * Final init
 * Cache the header, body and footer as required, creating them if needed
 */
var thead = $(this).children('thead');
if ( thead.length === 0 )
{
	thead = [ document.createElement( 'thead' ) ];
	this.appendChild( thead[0] );
}
oSettings.nTHead = thead[0];

var tbody = $(this).children('tbody');
if ( tbody.length === 0 )
{
	tbody = [ document.createElement( 'tbody' ) ];
	this.appendChild( tbody[0] );
}
oSettings.nTBody = tbody[0];

var tfoot = $(this).children('tfoot');
if ( tfoot.length > 0 )
{
	oSettings.nTFoot = tfoot[0];
	_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
}

/* Check if there is data passing into the constructor */
if ( bUsePassedData )
{
	for ( i=0 ; i<oInit.aaData.length ; i++ )
	{
		_fnAddData( oSettings, oInit.aaData[ i ] );
	}
}
else
{
	/* Grab the data from the page */
	_fnGatherData( oSettings );
}

/* Copy the data index array */
oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

/* Initialisation complete - table can be drawn */
oSettings.bInitialised = true;

/* Check if we need to initialise the table (it might not have been handed off to the
 * language processor)
 */
if ( bInitHandedOff === false )
{
	_fnInitialise( oSettings );
}
