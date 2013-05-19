

(/** @lends <global> */function() {

var _api = DataTable.Api;





/**
 *
 */
_api.register( 'rows()', function ( selector, opts ) {
	// argument shifting
	if ( selector === undefined ) {
		selector = '';
	}
	else if ( $.isPlainObject( selector ) ) {
		opts = selector;
		selector = '';
	}

	opts = _selector_opts( opts );

	var inst = this.iterator( 'table', function ( settings ) {
		return _row_selector( settings, selector, opts );
	} );

	// Want argument shifting here and in _row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
} );


_api.register( 'rows().nodes()', function () {
	return this.iterator( 'row', function ( settings, row ) {
		// use pluck order on an array rather - rows gives an array, row gives it individually
		return settings.aoData[ row ].nTr || undefined;
	} );
} );


_api.register( 'rows().data()', function ( data ) {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	} );
} );


_api.register( 'rows().invalidate()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		_fnInvalidateRow( settings, row, src );
	} );
} );


_api.register( 'rows().remove()', function () {
	var that = this;

	return this.iterator( 'row', function ( settings, row, thatIdx ) {
		var data = settings.aoData;

		data.splice( row, 1 );

		// Update the _DT_RowIndex parameter on all rows in the table
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			if ( data[i].nTr !== null ) {
				data[i].nTr._DT_RowIndex = i;
			}
		}

		// Remove the target row from the search array
		var displayIndex = $.inArray( row, settings.aiDisplay );
		settings.asDataSearch.splice( displayIndex, 1 );

		// Delete from the display arrays
		_fnDeleteIndex( settings.aiDisplayMaster, row );
		_fnDeleteIndex( settings.aiDisplay, row );
		_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes

		// Check for an 'overflow' they case for displaying the table
		_fnLengthOverflow( settings );
	} );
} );


_api.register( 'rows.add()', function ( rows ) {
	return this.iterator( 'table', function ( settings ) {
		var row, i, ien;

		for ( i=0, ien=rows.length ; i<ien ; i++ ) {
			row = rows[i];

			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				_fnAddTr( settings, row );
			}
			else {
				_fnAddData( settings, row );
			}
		}
	} );
} );


}());

