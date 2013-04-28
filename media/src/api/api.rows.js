

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


_api.register( 'rows().cells()', function () {
	return this.iterator( true, 'row', function ( settings, row ) {
		return settings.aoData[ row ].anCells || undefined;
	} );
} );


_api.register( 'rows().data()', function ( data ) {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	} );
} );


}());

