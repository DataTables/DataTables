

(/** @lends <global> */function() {

var _api = DataTable.Api;



/**
 * 
 */
_api.register( 'rows()', function ( selector, opts ) {
	return this.tables( function ( settings ) {
		return _row_selector( settings, selector, opts );
	} );
} );



}());

