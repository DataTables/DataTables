

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Note that most of the paging logic is done in
 * DataTable.ext.oPagination
 */

/**
 * Generate the node required for default pagination
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Pagination feature node
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlPaginate ( settings )
{
	if ( settings.oScroll.bInfinite )
	{
		return null;
	}

	var
		type   = settings.sPaginationType,
		plugin = DataTable.ext.oPagination[ type ],
		modern = typeof plugin === 'function',
		redraw = function( settings ) {
			_fnDraw( settings );
		},
		node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
		features = settings.aanFeatures;

	if ( ! modern ) {
		plugin.fnInit( settings, node, redraw );
	}

	/* Add a draw callback for the pagination on first instance, to update the paging display */
	if ( ! features.p )
	{
		node.id = settings.sTableId+'_paginate';

		settings.aoDrawCallback.push( {
			"fn": function( settings ) {
				if ( modern ) {
					var
						start      = settings._iDisplayStart,
						len        = settings._iDisplayLength,
						visRecords = settings.fnRecordsDisplay(),
						all        = len === -1,
						page = all ? 0 : Math.ceil( start / len ),
						pages = all ? 1 : Math.ceil( visRecords / len ),
						buttons = plugin(page, pages),
						i, ien;

					for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
						_fnRenderer( settings, 'paging' )(
							settings, features.p[i], i, buttons, page, pages
						);
					}
				}
				else {
					plugin.fnUpdate( settings, redraw );
				}
			},
			"sName": "pagination"
		} );
	}

	return node;
}


/**
 * Alter the display settings to change the page
 *  @param {object} settings DataTables settings object
 *  @param {string|int} action Paging action to take: "first", "previous",
 *    "next" or "last" or page number to jump to (integer)
 *  @param [bool] redraw Automatically draw the update or not
 *  @returns {bool} true page has changed, false - no change
 *  @memberof DataTable#oApi
 */
function _fnPageChange ( settings, action, redraw )
{
	var
		start     = settings._iDisplayStart,
		len       = settings._iDisplayLength,
		records   = settings.fnRecordsDisplay();

	if ( records === 0 || len === -1 )
	{
		start = 0;
	}
	else if ( typeof action === "number" )
	{
		start = action * len;

		if ( start > records )
		{
			start = 0;
		}
	}
	else if ( action == "first" )
	{
		start = 0;
	}
	else if ( action == "previous" )
	{
		start = len >= 0 ?
			start - len :
			0;

		if ( start < 0 )
		{
		  start = 0;
		}
	}
	else if ( action == "next" )
	{
		if ( start + len < records )
		{
			start += len;
		}
	}
	else if ( action == "last" )
	{
		start = Math.floor( (records-1) / len) * len;
	}
	else
	{
		_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
	}

	var changed = settings._iDisplayStart !== start;
	settings._iDisplayStart = start;

	$(settings.oInstance).trigger('page', settings);

	if ( redraw ) {
		_fnDraw( settings );
	}

	return changed;
}

