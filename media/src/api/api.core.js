

(/** @lends <global> */function() {

var _api = DataTable.Api;


/**
 *
 */
_api.register( '$()', function ( selector, opts ) {
	var
		rows   = this.rows( opts ).nodes(), // Get all rows
		jqRows = $(rows);

	return $( [].concat(
		jqRows.filter( selector ).toArray(),
		jqRows.find( selector ).toArray()
	) );
} );


// jQuery functions to operate on the tables
$.each( [ 'on', 'one', 'off' ], function (i, key) {
	_api.register( key+'()', function ( /* ... */ ) {
		var inst = $( this.tables().nodes() );
		inst[key].apply( inst, arguments );
		return this;
	} );
} );


_api.register( 'clear()', function () {
	return this.iterator( 'table', function ( settings ) {
		_fnClearTable( settings );
	} );
} );


_api.register( 'settings()', function () {
	return new _api( this.context, this.context );
} );


_api.register( 'destroy()', function ( remove ) {
	remove = remove || false;

	return this.iterator( 'table', function ( settings ) {
		var orig      = settings.nTableWrapper.parentNode;
		var classes   = settings.oClasses;
		var table     = settings.nTable;
		var tbody     = settings.nTBody;
		var thead     = settings.nTHead;
		var tfoot     = settings.nTFoot;
		var jqTable   = $(table);
		var jqTbody   = $(tbody);
		var jqWrapper = $(settings.nTableWrapper);
		var rows      = _pluck( settings.aoData, 'nTr' );
		var i, ien;
		
		// Flag to note that the table is currently being destroyed - no action
		// should be taken
		settings.bDestroying = true;
		
		// Fire off the destroy callbacks for plug-ins etc
		_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );

		// If not being removed from the document, make all columns visible
		if ( ! remove ) {
			new _api( settings ).columns().visible( true );
		}
		
		// Blitz all DT events
		jqWrapper.unbind('.DT').find('*').unbind('.DT');
		$(window).unbind('.DT-'+settings.sInstance);
		
		// When scrolling we had to break the table up - restore it
		if ( table != thead.parentNode ) {
			jqTable.children('thead').remove();
			jqTable( thead );
		}
		
		if ( tfoot && table != tfoot.parentNode ) {
			jqTable.children('tfoot').remove();
			jqTable( tfoot );
		}
		
		// Remove the DataTables generated nodes, events and classes
		jqTable.remove();
		jqWrapper.remove();
		
		settings.aaSorting = [];
		settings.aaSortingFixed = [];
		_fnSortingClasses( settings );
		
		$( rows ).removeClass( settings.asStripeClasses.join(' ') );
		
		$('th, td', thead).removeClass( classes.sSortable+' '+
			classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
		);

		if ( settings.bJUI ) {
			$('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).remove();
			$('th, td', thead).each( function () {
				var wrapper = $('div.'+classes.sSortJUIWrapper, this);
				$(this).append( wrapper.contents() );
				wrapper.remove();
			} );
		}

		if ( ! remove ) {
			// insertBefore acts like appendChild if !arg[1]
			orig.insertBefore( table, settings.nTableReinsertBefore );
		}

		// Add the TR elements back into the table in their original order
		jqTbody.children().detach();
		jqTbody.append( rows );
		
		// Restore the width of the original table - was read from the style property,
		// so we can restore directly to that
		jqTable.css( 'width', settings.sDestroyWidth );
		
		// If the were originally stripe classes - then we add them back here.
		// Note this is not fool proof (for example if not all rows had stripe
		// classes - but it's a good effort without getting carried away
		ien = settings.asDestroyStripes.length;

		if ( ien ) {
			jqTbody.children().each( function (i) {
				$(this).addClass( settings.asDestroyStripes[i % ien] );
			} );
		}
		
		/* Remove the settings object from the settings array */
		var idx = $.inArray( settings, DataTable.settings );
		if ( idx !== -1 ) {
			DataTable.settings.splice( idx, 1 );
		}
	} );
} );



}());

