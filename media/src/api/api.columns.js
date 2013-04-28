

(/** @lends <global> */function() {

var _api = DataTable.Api;


/**
 *
 */
_api.register( 'columns()', function ( selector, opts ) {
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
		return _column_selector( settings, selector, opts );
	} );

	// Want argument shifting here and in _row_selector?
	inst.selector.cols = selector;
	inst.selector.opts = opts;

	return inst;
} );


/**
 *
 */
_api.register( 'columns().header()', function ( selector, opts ) {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].nTh;
	} );
} );


/**
 *
 */
_api.register( 'columns().cells()', function () {
	return this.iterator( true, 'column-rows', function ( settings, column, i, j, rows ) {
		return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
	} );
} );


/**
 *
 */
_api.register( 'columns().data()', function () {
	return this.iterator( true, 'column-rows', function ( settings, column, i, j, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column, '' ) );
		}
		return a;
	} );
} );




_api.register( 'columns().visible()', function ( vis ) {
	return this.iterator( 'column', function ( settings, column ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;

		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}

		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}

		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );

			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;

				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).remove();

			col.bVisible = false;
			_fnDrawHead( settings, settings.aoHeader );
			_fnDrawHead( settings, settings.aoFooter );

			_fnSaveState( settings );
		}

		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );

		_fnSaveState( settings );
	} );
} );


// _api.register( 'columns().show()', function () {
// 	var selector = this.selector;
// 	return this.columns( selector.cols, selector.opts ).visible( true );
// } );


// _api.register( 'columns().hide()', function () {
// 	var selector = this.selector;
// 	return this.columns( selector.cols, selector.opts ).visible( false );
// } );




}());

