

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


_api.register( 'clear()', function ( selector, opts ) {
	return this.iterator( 'table', function ( settings ) {
		_fnClearTable( settings );
	} );
} );


_api.register( 'settings()', function ( selector, opts ) {
	return this.iterator( 'table', function ( settings ) {
		return settings;
	} );
} );



}());

