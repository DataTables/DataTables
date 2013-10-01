/**
 * Generate the node required for the info display
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Information element
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlInfo ( settings )
{
	var
		tid = settings.sTableId,
		nodes = settings.aanFeatures.i;
	
	if ( ! nodes ) {
		// Update display on each draw
		settings.aoDrawCallback.push( {
			"fn": _fnUpdateInfo,
			"sName": "information"
		} );

		// Table is described by our info div
		$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
	}

	return $('<div/>', {
		'class': settings.oClasses.sInfo,
		'id': ! nodes ? tid+'_info' : null
	} )[0];
}


/**
 * Update the information elements in the display
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnUpdateInfo ( settings )
{
	/* Show information about the table */
	var nodes = settings.aanFeatures.i;
	if ( nodes.length === 0 ) {
		return;
	}
	
	var
		lang  = settings.oLanguage,
		start = settings._iDisplayStart+1,
		end   = settings.fnDisplayEnd(),
		max   = settings.fnRecordsTotal(),
		total = settings.fnRecordsDisplay(),
		out   = total ?
			lang.sInfo :
			lang.sInfoEmpty;

	if ( total !== max ) {
		/* Record set after filtering */
		out += ' ' + lang.sInfoFiltered;
	}

	// Convert the macros
	out += lang.sInfoPostFix;
	out = _fnInfoMacros( settings, out );
	
	var callback = lang.fnInfoCallback;
	if ( callback !== null ) {
		out = callback.call( settings.oInstance,
			settings, start, end, max, total, out
		);
	}
	
	$(nodes).html( out );
}


function _fnInfoMacros ( settings, str )
{
	// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
	// internally
	var
		start = settings.oScroll.bInfinite ? 1 : settings._iDisplayStart+1,
		formatter = settings.fnFormatNumber;

	return str.
		replace(/_START_/g, formatter( start ) ).
		replace(/_END_/g,   formatter( settings.fnDisplayEnd() ) ).
		replace(/_TOTAL_/g, formatter( settings.fnRecordsDisplay() ) ).
		replace(/_MAX_/g,   formatter( settings.fnRecordsTotal() ) );
}

