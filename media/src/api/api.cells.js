

(/** @lends <global> */function() {

var _api = DataTable.Api;


_api.register( 'cells()', function ( rowSelector, columnSelector, opts ) {
	var columns = this.columns( columnSelector, opts );
	var rows = this.rows( rowSelector, opts );
	var a, i, ien, j, jen;

	var cells = this.iterator( 'table', function ( settings, idx ) {
		a = [];

		for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
			for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
				a.push( {
					row:    rows[idx][i],
					column: columns[idx][j]
				} );
			}
		}

		return a;
	} );

	$.extend( cells.selector, {
		cols: columnSelector,
		rows: rowSelector,
		opts: opts
	} );

	return cells;
} );


_api.register( 'cells().nodes()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return settings.aoData[ row ].anCells[ column ];
	} );
} );


_api.register( 'cells().data()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column );
	} );
} );


_api.register( 'cells().invalidate()', function ( src ) {
	var selector = this.selector;

	// Use the rows method of the instance to perform the invalidation, rather
	// than doing it here. This avoids needing to handle duplicate rows from
	// the cells.
	this.rows( selector.rows, selector.opts ).invalidate( src );

	return this;
} );




_api.register( 'cell()', function ( rowSelector, columnSelector, opts ) {
	return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
} );


_api.register( 'cell().node()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0].row ].anCells[ this[0].column ];
	}
	// undefined
} );


_api.register( 'cell().data()', function ( data ) {
	var ctx = this.context;

	if ( data === undefined ) {
		// Get
		return ctx.length && this.length ?
			_fnGetCellData( ctx[0], this[0].row, this[0].column ) :
			undefined;
	}

	// Set
	_fnSetCellData( ctx[0], this[0].row, this[0].column, data );
	_fnInvalidateRow( ctx[0], this[0].row, 'data' );

	return this;
} );


_api.register( 'cell().invalidate()', function ( src ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		_fnInvalidateRow( ctx[0], this[0].row, src );
	}

	return this;
} );



}());

