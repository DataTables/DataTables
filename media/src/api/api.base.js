
(/** @lends <global> */function() {


/**
 * Computed structure of the DataTables API, defined by the options passed to
 * `DataTable.Api.register()` when building the API.
 *
 * The structure is built in order to speed creation and extension of the Api
 * objects since the extensions are effectively pre-parsed.
 *
 * The array is an array of objects with the following structure, where this
 * base array represents the Api prototype base:
 *
 *     [
 *       {
 *         name:      'data'                -- string   - Property name
 *         val:       function () {},       -- function - Api method (or undefined if just an object
 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
 *       },
 *       {
 *         name:     'row'
 *         val:       {},
 *         methodExt: [ ... ],
 *         propExt:   [
 *           {
 *             name:      'data'
 *             val:       function () {},
 *             methodExt: [ ... ],
 *             propExt:   [ ... ]
 *           },
 *           ...
 *         ]
 *       }
 *     ]
 *
 * @type {Array}
 * @ignore
 */
var _apiStruct = [];


/**
 * Api object reference.
 *
 * @type object
 * @ignore
 */
var _Api;


/**
 * `Array.prototype` reference.
 *
 * @type object
 * @ignore
 */
var _arrayProto = Array.prototype;




/**
 * Abstraction for `context` parameter of the `Api` constructor to allow it to
 * take several different forms for ease of use.
 *
 * Each of the input parameter types will be converted to a DataTables settings
 * object where possible.
 *
 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
 *   of:
 *
 *   * `string` - jQuery selector. Any DataTables' matching the given selector
 *     with be found and used.
 *   * `node` - `TABLE` node which has already been formed into a DataTable.
 *   * `jQuery` - A jQuery object of `TABLE` nodes.
 *   * `object` - DataTables settings object
 * @return {array|null} Matching DataTables settings objects. `null` or
 *   `undefined` is returned if no matching DataTable is found.
 * @ignore
 */
var _toSettings = function ( mixed )
{
	var idx, jq;
	var settings = DataTable.settings;
	var tables = $.map( settings, function (el, i) {
		return el.nTable;
	} );

	if ( mixed.nTable && mixed.oApi ) {
		// DataTables settings object
		return [ mixed ];
	}
	else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
		// Table node
		idx = $.inArray( mixed, tables );
		return idx !== -1 ? [ settings[idx] ] : null;
	}
	else if ( typeof mixed === 'string' ) {
		// jQuery selector
		jq = $(mixed);
	}
	else if ( mixed instanceof $ ) {
		// jQuery object (also DataTables instance)
		jq = mixed;
	}

	if ( jq ) {
		return jq.map( function(i) {
			idx = $.inArray( this, tables );
			return idx !== -1 ? settings[idx] : null;
		} );
	}
};


/**
 * Find the unique elements in a source array.
 *
 * @param  {array} src Source array
 * @return {array} Array of unique items
 * @ignore
 */
var _unique = function ( src )
{
	// A faster unique method is to use object keys to identify used values,
	// but this doesn't work with arrays or objects, which we must also
	// consider. See jsperf.com/compare-array-unique-versions/4 for more
	// information.
	var
		out = [],
		val,
		i, ien=src.length,
		j, k=0;

	again: for ( i=0 ; i<ien ; i++ ) {
		val = src[i];

		for ( j=0 ; j<k ; j++ ) {
			if ( out[j] === val ) {
				continue again;
			}
		}

		out.push( val );
		k++;
	}

	return out;
};



/**
 * DataTables API class - used to control and interface with  one or more
 * DataTables enhanced tables.
 *
 * The API class is heavily based on jQuery, presenting a chainable interface
 * that you can use to interact with tables. Each instance of the API class has
 * a "context" - i.e. the tables that it will operate on. This could be a single
 * table, all tables on a page or a sub-set thereof.
 *
 * Additionally the API is designed to allow you to easily work with the data in
 * the tables, retrieving and manipulating it as required. This is done by
 * presenting the API class as an array like interface. The contents of the
 * array depend upon the actions requested by each method (for example
 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
 * return an array of objects or arrays depending upon your table's
 * configuration). The API object has a number of array like methods (`push`,
 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
 * `unique` etc) to assist your working with the data held in a table.
 *
 * Most methods (those which return an Api instance) are chainable, which means
 * the return from a method call also has all of the methods available that the
 * top level object had. For example, these two calls are equivalent:
 *
 *     // Not chained
 *     api.row.add( {...} );
 *     api.draw();
 *
 *     // Chained
 *     api.row.add( {...} ).draw();
 *
 * @class DataTable.Api
 * @param {array|object|string|jQuery} context DataTable identifier. This is
 *   used to define which DataTables enhanced tables this API will operate on.
 *   Can be one of:
 *
 *   * `string` - jQuery selector. Any DataTables' matching the given selector
 *     with be found and used.
 *   * `node` - `TABLE` node which has already been formed into a DataTable.
 *   * `jQuery` - A jQuery object of `TABLE` nodes.
 *   * `object` - DataTables settings object
 * @param {array} [data] Data to initialise the Api instance with.
 *
 * @example
 *   // Direct initialisation during DataTables construction
 *   var api = $('#example').DataTable();
 *
 * @example
 *   // Initialisation using a DataTables jQuery object
 *   var api = $('#example').dataTable().api();
 *
 * @example
 *   // Initialisation as a constructor
 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
 */
DataTable.Api = _Api = function ( context, data )
{
	if ( ! this instanceof _Api ) {
		throw 'DT API must be constructed as a new object';
		// or should it do the 'new' for the caller
		// return new _Api.apply( this, arguments );
	}

	var settings = [];
	var ctxSettings = function ( o ) {
		var a = _toSettings( o );
		if ( a ) {
			settings.push.apply( settings, a );
		}
	};

	if ( $.isArray( context ) ) {
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			ctxSettings( context[i] );
		}
	}
	else {
		ctxSettings( context );
	}

	// Remove duplicates
	this.context = _unique( settings );

	// Initial data
	if ( data ) {
		this.push.apply( this, data );
	}

	// selector
	this.selector = {
		rows: null,
		cols: null,
		opts: null
	};

	_Api.extend( this, this, _apiStruct );
};


_Api.prototype = /** @lends DataTables.Api */{
	/**
	 * Return a new Api instance, comprised of the data held in the current
	 * instance, join with the other array(s) and/or value(s).
	 *
	 * An alias for `Array.prototype.concat`.
	 *
	 * @type method
	 * @param {*} value1 Arrays and/or values to concatenate.
	 * @param {*} [...] Additional arrays and/or values to concatenate.
	 * @returns {DataTables.Api} New API instance, comprising of the combined
	 *   array.
	 */
	concat:  _arrayProto.concat,


	context: [], // array of table settings objects


	each: function ( fn )
	{
		if ( _arrayProto.forEach ) {
			// Where possible, use the built-in forEach
			_arrayProto.forEach.call( this, fn, this );
		}
		else {
			// Compatibility for browsers without EMCA-252-5 (JS 1.6)
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				// In strict mode the execution scope is the passed value
				fn.call( this, this[i], i, this );
			}
		}

		return this;
	},


	filter: function ( fn )
	{
		var a = [];

		if ( _arrayProto.filter ) {
			a = _arrayProto.filter( this, fn, this );
		}
		else {
			// Compatibility for browsers without EMCA-252-5 (JS 1.6)
			for ( var i=0, ien=this.length ; i<ien ; i++ ) {
				if ( fn.call( this, this[i], i, this ) ) {
					a.push( this[i] );
				}
			}
		}

		return new _Api( this.context, a );
	},


	indexOf: _arrayProto.indexOf || function (obj, start)
	{
		for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
			if ( this[i] === obj ) {
				return i;
			}
		}
		return -1;
	},

	// Internal only at the moment - relax?
	iterator: function ( flatten, type, fn ) {
		var
			a = [], ret,
			i, ien, j, jen,
			context = this.context,
			rows, items, item,
			selector = this.selector;

		// Argument shifting
		if ( typeof flatten === 'string' ) {
			fn = type;
			type = flatten;
			flatten = false;
		}

		for ( i=0, ien=context.length ; i<ien ; i++ ) {
			if ( type === 'table' ) {
				ret = fn( context[i], i );

				if ( ret !== undefined ) {
					a.push( ret );
				}
			}
			else if ( type === 'columns' || type === 'rows' ) {
				// this has same length as context - one entry for each table
				ret = fn( context[i], this[i], i );

				if ( ret !== undefined ) {
					a.push( ret );
				}
			}
			else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
				// columns and rows share the same structure.
				// 'this' is an array of column indexes for each context
				items = this[i];

				if ( type === 'column-rows' ) {
					rows = _row_selector_indexes( context[i], selector.opts );
				}

				for ( j=0, jen=items.length ; j<jen ; j++ ) {
					item = items[j];

					if ( type === 'cell' ) {
						ret = fn( context[i], item.row, item.column, i, j );
					}
					else {
						ret = fn( context[i], item, i, j, rows );
					}

					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
			}
		}

		if ( a.length ) {
			var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
			var apiSelector = api.selector;
			apiSelector.rows = selector.rows;
			apiSelector.cols = selector.cols;
			apiSelector.opts = selector.opts;
			return api;
		}
		return this;
	},


	lastIndexOf: _arrayProto.lastIndexOf || function (obj, start)
	{
		// Bit cheeky...
		return this.indexOf.apply( this.toArray.reverse(), arguments );
	},


	length:  0,


	map: function ( fn )
	{
		var a = [];

		if ( _arrayProto.map ) {
			a = _arrayProto.map( this, fn, this );
		}
		else {
			// Compatibility for browsers without EMCA-252-5 (JS 1.6)
			for ( var i=0, ien=this.length ; i<ien ; i++ ) {
				a.push( fn.call( this, this[i], i ) );
			}
		}

		return new _Api( this.context, a );
	},


	pluck: function ( prop )
	{
		return this.map( function ( el ) {
			return el[ prop ];
		} );
	},

	pop:     _arrayProto.pop,


	push:    _arrayProto.push,


	reduce: _arrayProto.reduce || function ( fn, init )
	{
		var
			value,
			isSet = false;

		if ( arguments.length > 1 ) {
			value = init;
			isSet = true;
		}

		for ( var i=0, ien=this.length ; i<ien ; i++ ) {
			if ( ! this.hasOwnProperty(i) ) {
				continue;
			}

			value = isSet ?
				fn( value, this[i], i, this ) :
				this[i];

			isSet = true;
		}

		return value;
	},


	reduceRight: _arrayProto.reduceRight || function ( fn, init )
	{
		var
			value,
			isSet = false;

		if ( arguments.length > 1 ) {
			value = init;
			isSet = true;
		}

		for ( var i=this.length-1 ; i>=0 ; i-- ) {
			if ( ! this.hasOwnProperty(i) ) {
				continue;
			}

			value = isSet ?
				fn( value, this[i], i, this ) :
				this[i];

			isSet = true;
		}

		return value;
	},

	reverse: _arrayProto.reverse,


	// Object with rows, columns and opts
	selector: null,


	shift:   _arrayProto.shift,


	sort:    _arrayProto.sort, // ? name - order?


	splice:  _arrayProto.splice,


	toArray: function ()
	{
		return _arrayProto.slice.call( this );
	},


	unique: function ()
	{
		return new _Api( this.context, _unique(this) );
	},


	unshift: _arrayProto.unshift
};




 _Api.extend = function ( scope, obj, ext )
{
	if ( ! obj instanceof _Api ) {
		return;
	}

	var
		i, ien,
		j, jen,
		struct,
		methodScoping = function ( fn, struc ) {
			return function () {
				var ret = fn.apply( scope, arguments );

				// Method extension
				_Api.extend( ret, ret, struc.methodExt );
				return ret;
			};
		};

	for ( i=0, ien=ext.length ; i<ien ; i++ ) {
		struct = ext[i];

		// Value
		if ( typeof struct.val === 'function' ) {
			obj[ struct.name ] = methodScoping( struct.val, struct );
		}
		else {
			obj[ struct.name ] = struct.val;
		}

		// Property extension
		_Api.extend( scope, obj[ struct.name ], struct.propExt );
	}
};


_Api.register = function ( name, val )
{
	if ( $.isArray( name ) ) {
		for ( var j=0, jen=name.length ; j<jen ; j++ ) {
			_Api.register( name[j], val );
		}
		return;
	}

	var
		i, ien,
		heir = name.split('.'),
		struct = _apiStruct,
		key, method;

	var find = function ( src, name ) {
		for ( var i=0, ien=src.length ; i<ien ; i++ ) {
			if ( src[i].name === name ) {
				return src[i];
			}
		}
		return null;
	};

	for ( i=0, ien=heir.length ; i<ien ; i++ ) {
		method = heir[i].indexOf('()') !== -1;
		key = method ?
			heir[i].replace('()', '') :
			heir[i];

		var src = find( struct, key );
		if ( ! src ) {
			src = {
				name:      key,
				val:       {},
				methodExt: [],
				propExt:   []
			};
			struct.push( src );
		}

		if ( i === ien-1 ) {
			src.val = val;
		}
		else {
			struct = method ?
				src.methodExt :
				src.propExt;
		}
	}

	// Rebuild the API with the new construct
	if ( _Api.ready ) {
		DataTable.api.build();
	}
};


}());

