

(/** @lends <global> */function() {

var _Api = DataTable.Api;

/**
 * Selector for HTML tables. Apply the given selector to the give array of
 * DataTables settings objects.
 *
 * @param {string|integer} [selector] jQuery selector string or integer
 * @param  {array} Array of DataTables settings objects to be filtered
 * @return {array}
 * @ignore
 */
var _table_selector = function ( selector, a )
{
	// Integer is used to pick out a table by index
	if ( typeof selector === 'number' ) {
		return [ a[ selector ] ];
	}

	// Perform a jQuery selector on the table nodes
	var nodes = $.map( a, function (el, i) {
		return el.nTable;
	} );

	return $(nodes)
		.filter( selector )
		.map( function (i) {
			// Need to translate back from the table node to the settings
			var idx = $.inArray( this, nodes );
			return a[ idx ];
		} )
		.toArray();
};


/**
 * Context selector and iterator for the API's context (i.e. the tables the
 * API instance refers to.
 *
 * @name    DataTable.Api#tables
 * @param {string|integer} [selector] Selector to pick which tables the iterator
 *   should operate on. If not given, all tables in the current context are
 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
 *   select multiple tables or as an integer to select a single table.
 * @param {function} [fn] Iterator function. Will be called for every table in
 *   the current context (once the selector has been applied, if one is given).
 *   The function is passed two parameters: 1. the DataTables settings object
 *   for the table in question and 2. the index of that table in the current
 *   context. The execution scope of the function is the API instance.
 * @returns {DataTable.Api} Returns a new API instance if a selector is given,
 *   or the callback function returns information from each loop. The
 *   information, if returned, is assigned to the API instance. Otherwise the
 *   original API instance is returned for chaining.
 */
_Api.register( 'tables()', function ( selector, fn ) {
	// Argument shifting
	if ( typeof selector === 'function' ) {
		fn = selector;
		selector = undefined;
	}

	var a = [];
	var context = selector ?
		_table_selector( selector, this.context ) :
		this.context;

	if ( fn ) {
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			var ret = fn.call( this, context[i], i );
			if ( ret !== undefined ) {
				a.push( ret );
			}
		}
	}

	// A new instance is created if there was a selector specified, or if
	// data was returned from the callback
	var api = selector || a.length ?
		new _Api( context, a ) :
		this;

	return api;
} );


/**
 * Get the DOM nodes for the `table` elements from the current API context.
 * @return {DataTable.Api} New Api instance containing the DOM nodes for the
 *   tables.
 */
_Api.register( 'tables().nodes()', function () {
	return this.tables( function ( settings, i ) {
		return settings.nTable;
	} );
} );


}());

