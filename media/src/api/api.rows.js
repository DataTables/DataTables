

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


_api.register( 'rows().nodes()', function () {
	return this.iterator( function ( settings, el ) {
		return settings.aoData[ el ].nTr || undefined;
	} );
} );


_api.register( 'rows().data()', function ( data ) {
	return this.iterator( function ( settings, el ) {
		return settings.aoData[ el ]._aData;
	} );
} );


}());

