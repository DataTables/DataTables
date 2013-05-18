

(/** @lends <global> */function() {

var _api = DataTable.Api;





/**
 *
 */
_api.register( 'row()', function ( selector, opts ) {
	return _selector_first( this.rows( selector, opts ) );
} );


_api.register( 'row().node()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0] ].nTr || undefined;
	}
	// return undefined;
} );


_api.register( 'row().cells()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0] ].anCells || undefined;
	}
	// return undefined;
} );


_api.register( 'row().data()', function ( data ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		// Get
		return ctx[0].aoData[ this[0] ]._aData;
	}

	// Set
	ctx[0].aoData[ this[0] ]._aData = data;

	// Automatically invalidate
	_fnInvalidateRow( ctx[0], this[0], 'data' );

	return this;
} );


_api.register( 'row().invalidate()', function ( src ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		_fnInvalidateRow( ctx[0], this[0], src );
	}

	return this;
} );


_api.register( 'row().index()', function () {
	return this.length ? this[0] : undefined;
} );


_api.register( 'row().remove()', function () {
	if ( this.length ) {
		// Hand off to the rows function
		this.rows( this[0] ).remove();
	}
	return this;
} );







(function() {

var details_add = function ( ctx, row, data, klass )
{
	// Convert to array of TR elements
	var rows = [];
	var addRow = function ( r, k ) {
		if ( ! r.nodeName || r.nodeName.toUpperCase() !== 'tr' ) {
			r = $('<tr><td></td></tr>').find('td').html( r ).parent();
		}

		$('td', r).addClass( k )[0].colSpan = _fnVisbleColumns( ctx );
		rows.push( r[0] );
	};

	if ( $.isArray( data ) || data instanceof $ ) {
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			addRow( data[i], klass );
		}
	}
	else {
		addRow( data, klass );
	}

	if ( row._details ) {
		row._details.remove();
	}

	row._details = $(rows);

	// If the children were already shown, that state should be retained
	if ( row._detailsShow ) {
		row._details.insertAfter( row.nTr );
	}
};


var details_display = function ( show ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		var row = ctx[0].aoData[ this[0] ];

		if ( row._details ) {
			row._detailsShow = show;
			if ( show ) {
				row._details.insertAfter( row.nTr );
			}
			else {
				row._details.remove();
			}

			details_events( ctx[0] );
		}
	}

	return this;
};


var details_events = function ( settings )
{
	var table = $(settings.nTable);

	table.off('draw.DT_details');
	table.off('column-visibility.DT_details');

	if ( _pluck( settings.aoData, '_details' ).length > 0 ) {
		// On each draw, insert the required elements into the document
		table.on('draw.DT_details', function () {
			table.find('tbody tr').each( function () {
				// Look up the row index for each row and append open row
				var rowIdx = _fnNodeToDataIndex( settings, this );
				var row = settings.aoData[ rowIdx ];

				if ( row._detailsShow ) {
					row._details.insertAfter( this );
				}
			} );
		} );

		// Column visibility change - update the colspan
		table.on( 'column-visibility.DT_details', function ( e, settings, idx, vis ) {
			// Update the colspan for the details rows (note, only if it already has
			// a colspan)
			var row, visible = _fnVisbleColumns( settings );

			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				row = settings.aoData[i];

				if ( row._details ) {
					row._details.children('td[colspan]').attr('colspan', visible );
				}
			}
		} );
	}
};

// data can be:
//  tr
//  string
//  jQuery or array of any of the above
_api.register( 'row().child()', function ( data, klass ) {
	var ctx = this.context;

	if ( ! data ) {
		// get
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ]._details :
			undefined;
	}
	else if ( ctx.length && this.length ) {
		// set
		details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
	}

	return this;
} );

_api.register( ['row().child.show()', 'row().child().show()'], function () {
	details_display.call( this, true );
} );

_api.register( ['row().child.hide()', 'row().child().hide()'], function () {
	details_display.call( this, false );
} );

_api.register( 'row().child.isShown()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		// _detailsShown as false or undefined will fall through to return false
		return ctx[0].aoData[ this[0] ]._detailsShow || false;
	}
	return false;
} );

}());


_api.register( 'row.add()', function ( row ) {
	// Allow a jQuery object to be passed in - only a single row is added from
	// it though - the first element in the set
	if ( row instanceof $ && row.length ) {
		row = row[0];
	}

	return this.iterator( 'table', function ( settings ) {
		if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
			_fnAddTr( settings, row );
		}
		else {
			_fnAddData( settings, row );
		}
	} );
} );



}());

