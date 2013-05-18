

(/** @lends <global> */function() {

var _api = DataTable.Api;


_api.register( 'cells()', function ( rowSelector, columnSelector, opts ) {
	var columns = this.columns( columnSelector, opts );
	var rows = this.rows( rowSelector, opts );
	var a, i, ien, j, jen;

	return this.iterator( 'table', function ( settings, idx ) {
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
} );


_api.register( 'cells().nodes()', function () {
	return this.iterator( true, 'cell', function ( settings, row, column ) {
		return settings.aoData[ row ].anCells[ column ];
	} );
} );


_api.register( 'cells().data()', function () {
	return this.iterator( true, 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column );
	} );
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
	// @todo
} );



}());

