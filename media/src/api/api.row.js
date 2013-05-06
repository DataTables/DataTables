

(/** @lends <global> */function() {

var _api = DataTable.Api;





/**
 *
 */
_api.register( 'row()', function ( selector, opts ) {
	return _selector_first( this.rows( selector, opts ) );
} );


_api.register( 'row().node()', function () {
	var ctx = this.context;
	
	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0] ].nTr || undefined;
	}
	// return undefined;
} );


_api.register( 'row().cells()', function () {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0] ].anCells || undefined;
	}
	// return undefined;
} );


_api.register( 'row().data()', function ( data ) {
	var ctx = this.context;

	if ( ctx.length && this.length ) {
		return ctx[0].aoData[ this[0] ]._aData;
	}
	// return undefined;

	// @todo - Set operator
} );


_api.register( 'row().index()', function () {
	return this.length ? this[0] : undefined;
} );


_api.register( 'row().remove()', function () {
	if ( this.length ) {
		// Hand off to the rows function
		this.rows( this[0] ).remove();
	}
	return this;
} );



}());

