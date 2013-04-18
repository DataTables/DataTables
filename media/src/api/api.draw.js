

(/** @lends <global> */function() {

var _api = DataTable.Api;


// draw()
// draw.standing()

/**
 * 
 */
_api.register( 'draw()', function ( full ) {
	return this.tables( function ( settings ) {
		if ( full ) {
			_fnReDraw( settings );
		}
		else {
			_fnCalculateEnd( settings );
			_fnDraw( settings );
		}
	} );
} );


}());

