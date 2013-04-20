

(/** @lends <global> */function() {

var _Api = DataTable.Api;


/**
 * Get current ordering (sorting) that has been applied to the table.
 *
 * @returns {array} 2D array containing the sorting information for the first
 *   table in the current context. Each element in the parent array represents
 *   a column being sorted upon (i.e. multi-sorting with two columns would have
 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
 *   the column index that the sorting condition applies to, the second is the
 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
 *   index of the sorting order from the `column.sorting` initialisation array.
 *//**
 * Set the ordering for the table.
 *
 * @param {integer} order Column index to sort upon.
 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
 * @returns {DataTables.Api} this
 *//**
 * Set the ordering for the table.
 *
 * @param {array} order 1D array of sorting information to be applied.
 * @param {array} [...] Optional additional sorting conditions
 * @returns {DataTables.Api} this
 *//**
 * Set the ordering for the table.
 *
 * @param {array} order 2D array of sorting information to be applied.
 * @returns {DataTables.Api} this
 */
_Api.register( 'order()', function ( order, dir ) {
	var ctx = this.context;

	if ( order === undefined ) {
		// get
		return ctx.length !== 0 ?
			ctx[0].aaSorting :
			undefined;
	}

	// set
	if ( typeof order === 'number' ) {
		// Simple column / direction passed in
		order = [ [ order, dir ] ];
	}
	else if ( arguments.length > 1 ) {
		// Arguments passed in (list of 1D arrays)
		order = Array.prototype.slice.call( arguments );
	}
	else if ( ! $.isArray( order[0] ) ) {
		// Just a 1D array passed in, convert to 2D to use for sorting
		order = [ order ];
	}
	// otherwise a 2D array was passed in

	return this.tables( function ( settings ) {
		settings.aaSorting = order;
	} );
} );


/**
 * Attach a sort listener to an element for a given column
 *
 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
 *   listener to. This can take the form of a single DOM node, a jQuery
 *   collection of nodes or a jQuery selector which will identify the node(s).
 * @param {integer} column the column that a click on this node will sort on
 * @param {function} [callback] callback function when sort is run
 * @returns {DataTables.Api} this
 */
_Api.register( 'order.listener()', function ( node, column, callback ) {
	return this.tables( function ( settings ) {
		_fnSortAttachListener( settings, node, column, callback );
	} );
} );


}());

