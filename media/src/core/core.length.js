
function _fnLengthChange ( settings, val )
{
	var
		start = settings._iDisplayStart,
		records = settings.fnRecordsDisplay(),
		end,
		len = parseInt( val, 10 );

	/* Redraw the table */
	settings._iDisplayLength = len;
	_fnCalculateEnd( settings );

	end = settings.fnDisplayEnd();
	
	/* If we have space to show extra rows (backing up from the end point - then do so */
	if ( end === records )
	{
		start = end - len;
	}
	
	if ( len === -1 || start < 0 )
	{
		start = 0;
	}

	settings._iDisplayStart = start;

	// Fire length change event
	$(settings.oInstance).trigger( 'length', [settings, len] );
}


/**
 * Generate the node required for user display length changing
 *  @param {object} settings dataTables settings object
 *  @returns {node} Display length feature node
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlLength ( settings )
{
	if ( settings.oScroll.bInfinite ) {
		return null;
	}

	var
		tableId  = settings.sTableId,
		menu     = settings.aLengthMenu,
		d2       = $.isArray( menu[0] ),
		lengths  = d2 ? menu[0] : menu,
		language = d2 ? menu[1] : menu;

	var select = $('<select/>', {
		'name':          tableId+'_length',
		'aria-controls': tableId
	} );

	for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
		select[0][ i ] = new Option( language[i], lengths[i] );
	}

	var div = $('<div><label/></div>').addClass( settings.oClasses.sLength );
	if ( ! settings.aanFeatures.l ) {
		div[0].id = tableId+'_length';
	}

	// This split doesn't matter where _MENU_ is, we get three items back from it
	var a = settings.oLanguage.sLengthMenu.split(/(_MENU_)/);
	div.children()
		.append( a[0] )
		.append( select )
		.append( a[2] );

	select
		.val( settings._iDisplayLength )
		.bind( 'change.DT', function(e) {
			_fnLengthChange( settings, $(this).val() );
			_fnDraw( settings );
		} );

	// Update node value whenever anything changes the table's length
	$(settings.nTable).bind( 'length', function (e, s, len) {
		select.val( len );
	} );

	return div[0];
}


/**
 * Recalculate the end point based on the start point
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnCalculateEnd( settings )
{
	var
		len     = settings._iDisplayLength,
		calc    = settings._iDisplayStart + len,
		records = settings.aiDisplay.length;

	settings._iDisplayEnd = ! settings.oFeatures.bPaginate || calc>records || len===-1 ?
		records :
		calc;
}

