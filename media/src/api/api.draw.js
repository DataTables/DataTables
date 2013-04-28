

(/** @lends <global> */function() {

var _api = DataTable.Api;


/**
 * Redraw the tables in the current context.
 *
 * @param {boolean} [reset=true] Reset (default) or hold the current paging
 *   position. A full re-sort and re-filter is performed when this method is
 *   called, which is why the pagination reset is the default action.
 * @returns {DataTables.Api} this
 */
_api.register( 'draw()', function ( resetPaging ) {
	return this.iterator( 'table', function ( settings ) {
		_fnReDraw( settings, resetPaging===false );
	} );
} );


}());

