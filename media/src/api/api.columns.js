

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


}());

