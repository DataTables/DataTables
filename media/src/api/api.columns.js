

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
_api.register( 'columns().header()', function ( selector, opts ) {
	return this.iterator( function ( settings, el ) {
		return settings.aoColumns[ el ].nTh;
	} );
} );


}());

