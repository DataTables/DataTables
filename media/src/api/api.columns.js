

(/** @lends <global> */function() {

var _api = DataTable.Api;


/**
 * 
 */
_api.register( 'columns()', function ( selector ) {
	return this.tables( function ( settings ) {
		return _column_selector( settings, selector );
	} );
} );


/**
 * 
 */
_api.register( 'columns().cells()', function ( selector ) {
	var that = this;

	return this.tables( function ( settings, thatIdx ) {
		var cols = that[thatIdx];
		var a = [];

		// cols is an array of columns for the table
		for ( var i=0, ien=cols.length ; i<ien ; i++ ) {
			var colIdx = cols[i];
			var col = settings.aoColumns[ colIdx ];


		}

		return a;

		// should the resulting API instance be flattened, otherwise it is an
		// array item for each table. Thinking yes. How?
	} );
} );


}());

