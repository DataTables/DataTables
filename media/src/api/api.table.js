

(/** @lends <global> */function() {

var _Api = DataTable.Api;


/**
 * Context selector for the API's context (i.e. the tables the API instance
 * refers to.
 *
 * @name    DataTable.Api#tables
 * @param {string|integer} [selector] Selector to pick which tables the iterator
 *   should operate on. If not given, all tables in the current context are
 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
 *   select multiple tables or as an integer to select a single table.
 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
 */
_Api.register( 'tables()', function ( selector ) {
	// A new instance is created if there was a selector specified
	return selector ?
		new _Api( _table_selector( selector, this.context ) ) :
		this;
} );


/**
 * Get the DOM nodes for the `table` elements from the current API context.
 * @return {DataTable.Api} New Api instance containing the DOM nodes for the
 *   tables.
 */
_Api.register( 'tables().nodes()', function () {
	return this.iterator( 'table', function ( settings, i ) {
		return settings.nTable;
	} );
} );


_Api.register( 'table()', function ( selector ) {
	var tables = this.tables( selector );
	var ctx = tables.context;

	// Truncate to the first matched table
	if ( ctx.length ) {
		ctx.length = 1;
	}

	return tables;
} );


_Api.register( 'table().node()', function () {
	var ctx = this.context;

	if ( ctx.length ) {
		return ctx[0].nTable;
	}
	// return undefined;
} );


}());

