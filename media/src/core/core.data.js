/**
 * Add a data array to the table, creating DOM node etc. This is the parallel to
 * _fnGatherData, but for adding rows from a Javascript source, rather than a
 * DOM source.
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aData data array to be added
 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
 *  @memberof DataTable#oApi
 */
function _fnAddData ( oSettings, aDataIn, nTr, anTds )
{
	var oCol;

	/* Create the object for storing information about this new row */
	var iRow = oSettings.aoData.length;
	var oData = $.extend( true, {}, DataTable.models.oRow, {
		src: nTr ? 'dom' : 'data'
	} );

	oData._aData = aDataIn;
	oSettings.aoData.push( oData );

	/* Create the cells */
	var nTd, sThisType;
	for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		oCol = oSettings.aoColumns[i];

		_fnSetCellData( oSettings, iRow, i, _fnGetCellData( oSettings, iRow, i ) );

		/* See if we should auto-detect the column type */
		if ( oCol._bAutoType && oCol.sType != 'string' )
		{
			/* Attempt to auto detect the type - same as _fnGatherData() */
			var sVarType = _fnGetCellData( oSettings, iRow, i, 'type' );
			if ( sVarType !== null && sVarType !== '' )
			{
				sThisType = _fnDetectType( sVarType );
				if ( oCol.sType === null )
				{
					oCol.sType = sThisType;
				}
				else if ( oCol.sType != sThisType && oCol.sType != "html" )
				{
					/* String is always the 'fallback' option */
					oCol.sType = 'string';
				}
			}
		}
	}

	/* Add to the display array */
	oSettings.aiDisplayMaster.push( iRow );

	/* Create the DOM information */
	if ( !oSettings.oFeatures.bDeferRender )
	{
		_fnCreateTr( oSettings, iRow, nTr, anTds );
	}

	return iRow;
}


/**
 * Add one or more TR elements to the table. Generally we'd expect to
 * use this for reading data from a DOM sourced table, but it could be
 * used for an TR element. Note that if a TR is given, it is used (i.e.
 * it is not cloned).
 *  @param {object} settings dataTables settings object
 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
 *  @returns {array} Array of indexes for the added rows
 *  @memberof DataTable#oApi
 */
function _fnAddTr( settings, trs )
{
	var row;

	// Allow an individual node to be passed in
	if ( ! (trs instanceof $) ) {
		trs = $(trs);
	}

	return trs.map( function (i, el) {
		row = _fnGetRowElements( settings, el );
		return _fnAddData( settings, row.data, el, row.cells );
	} );
}


/**
 * Take a TR element and convert it to an index in aoData
 *  @param {object} oSettings dataTables settings object
 *  @param {node} n the TR element to find
 *  @returns {int} index if the node is found, null if not
 *  @memberof DataTable#oApi
 */
function _fnNodeToDataIndex( oSettings, n )
{
	return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
}


/**
 * Take a TD element and convert it into a column data index (not the visible index)
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow The row number the TD/TH can be found in
 *  @param {node} n The TD/TH element to find
 *  @returns {int} index if the node is found, -1 if not
 *  @memberof DataTable#oApi
 */
function _fnNodeToColumnIndex( oSettings, iRow, n )
{
	return $.inArray( n, oSettings.aoData[ iRow ].anCells );
}


/**
 * Get an array of data for a given row from the internal data cache
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow aoData row id
 *  @param {string} sSpecific data get type ('type' 'filter' 'sort')
 *  @param {array} aiColumns Array of column indexes to get data from
 *  @returns {array} Data array
 *  @memberof DataTable#oApi
 */
function _fnGetRowData( oSettings, iRow, sSpecific, aiColumns )
{
	var out = [];
	for ( var i=0, iLen=aiColumns.length ; i<iLen ; i++ )
	{
		out.push( _fnGetCellData( oSettings, iRow, aiColumns[i], sSpecific ) );
	}
	return out;
}


/**
 * Get the data for a given cell from the internal cache, taking into account data mapping
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow aoData row id
 *  @param {int} iCol Column index
 *  @param {string} sSpecific data get type ('display', 'type' 'filter' 'sort')
 *  @returns {*} Cell data
 *  @memberof DataTable#oApi
 */
function _fnGetCellData( oSettings, iRow, iCol, sSpecific )
{
	var oCol = oSettings.aoColumns[iCol];
	var oData = oSettings.aoData[iRow]._aData;
	var sData = oCol.fnGetData( oData, sSpecific );

	if ( sData === undefined )
	{
		if ( oSettings.iDrawError != oSettings.iDraw && oCol.sDefaultContent === null )
		{
			_fnLog( oSettings, 0, "Requested unknown parameter "+
				(typeof oCol.mData=='function' ? '{function}' : "'"+oCol.mData+"'")+
				" for row "+iRow, 4 );
			oSettings.iDrawError = oSettings.iDraw;
		}
		return oCol.sDefaultContent;
	}

	/* When the data source is null, we can use default column data */
	if ( (sData === oData || sData === null) && oCol.sDefaultContent !== null )
	{
		sData = oCol.sDefaultContent;
	}
	else if ( typeof sData === 'function' )
	{
		// If the data source is a function, then we run it and use the return
		return sData();
	}

	if ( sData === null && sSpecific == 'display' )
	{
		return '';
	}
	return sData;
}


/**
 * Set the value for a specific cell, into the internal data cache
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow aoData row id
 *  @param {int} iCol Column index
 *  @param {*} val Value to set
 *  @memberof DataTable#oApi
 */
function _fnSetCellData( oSettings, iRow, iCol, val )
{
	var oCol = oSettings.aoColumns[iCol];
	var oData = oSettings.aoData[iRow]._aData;

	oCol.fnSetData( oData, val );
}


// Private variable that is used to match action syntax in the data property object
var __reArray = /\[.*?\]$/;
var __reFn = /\(\)$/;

/**
 * Split string on periods, taking into account escaped periods
 * @param  {string} str String to split
 * @return {array} Split string
 */
function _fnSplitObjNotation( str )
{
	return $.map( str.match(/(\\.|[^\.])+/g), function ( s ) {
		return s.replace('\\.', '.');
	} );
}


/**
 * Return a function that can be used to get data from a source object, taking
 * into account the ability to use nested objects as a source
 *  @param {string|int|function} mSource The data source for the object
 *  @returns {function} Data get function
 *  @memberof DataTable#oApi
 */
function _fnGetObjectDataFn( mSource )
{
	if ( $.isPlainObject( mSource ) )
	{
		/* Build an object of get functions, and wrap them in a single call */
		var o = {};
		$.each( mSource, function (key, val) {
			o[key] = _fnGetObjectDataFn( val );
		} );

		return function (data, type, extra) {
			return o[ o[type] !== undefined ? type : '_' ](data, type, extra);
		};
	}
	else if ( mSource === null )
	{
		/* Give an empty string for rendering / sorting etc */
		return function (data, type) {
			return data;
		};
	}
	else if ( typeof mSource === 'function' )
	{
		return function (data, type, extra) {
			return mSource( data, type, extra );
		};
	}
	else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
		      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
	{
		/* If there is a . in the source string then the data source is in a
		 * nested object so we loop over the data for each level to get the next
		 * level down. On each loop we test for undefined, and if found immediately
		 * return. This allows entire objects to be missing and sDefaultContent to
		 * be used if defined, rather than throwing an error
		 */
		var fetchData = function (data, type, src) {
			var a = _fnSplitObjNotation( src );
			var arrayNotation, funcNotation, out, innerSrc;

			if ( src !== "" )
			{
				for ( var i=0, iLen=a.length ; i<iLen ; i++ )
				{
					// Check if we are dealing with special notation
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);

					if ( arrayNotation )
					{
						// Array notation
						a[i] = a[i].replace(__reArray, '');

						// Condition allows simply [] to be passed in
						if ( a[i] !== "" ) {
							data = data[ a[i] ];
						}
						out = [];

						// Get the remainder of the nested object to get
						a.splice( 0, i+1 );
						innerSrc = a.join('.');

						// Traverse each entry in the array getting the properties requested
						for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
							out.push( fetchData( data[j], type, innerSrc ) );
						}

						// If a string is given in between the array notation indicators, that
						// is used to join the strings together, otherwise an array is returned
						var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
						data = (join==="") ? out : out.join(join);

						// The inner call to fetchData has already traversed through the remainder
						// of the source requested, so we exit from the loop
						break;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]();
						continue;
					}

					if ( data === null || data[ a[i] ] === undefined )
					{
						return undefined;
					}
					data = data[ a[i] ];
				}
			}

			return data;
		};

		return function (data, type) {
			return fetchData( data, type, mSource );
		};
	}
	else
	{
		/* Array or flat object mapping */
		return function (data, type) {
			return data[mSource];
		};
	}
}


/**
 * Return a function that can be used to set data from a source object, taking
 * into account the ability to use nested objects as a source
 *  @param {string|int|function} mSource The data source for the object
 *  @returns {function} Data set function
 *  @memberof DataTable#oApi
 */
function _fnSetObjectDataFn( mSource )
{
	if ( $.isPlainObject( mSource ) )
	{
		/* Unlike get, only the underscore (global) option is used for for
		 * setting data since we don't know the type here. This is why an object
		 * option is not documented for `mData` (which is read/write), but it is
		 * for `mRender` which is read only.
		 */
		return _fnSetObjectDataFn( mSource._ );
	}
	else if ( mSource === null )
	{
		/* Nothing to do when the data source is null */
		return function (data, val) {};
	}
	else if ( typeof mSource === 'function' )
	{
		return function (data, val) {
			mSource( data, 'set', val );
		};
	}
	else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
		      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
	{
		/* Like the get, we need to get data from a nested object */
		var setData = function (data, val, src) {
			var a = _fnSplitObjNotation( src ), b;
			var aLast = a[a.length-1];
			var arrayNotation, funcNotation, o, innerSrc;

			for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
			{
				// Check if we are dealing with an array notation request
				arrayNotation = a[i].match(__reArray);
				funcNotation = a[i].match(__reFn);

				if ( arrayNotation )
				{
					a[i] = a[i].replace(__reArray, '');
					data[ a[i] ] = [];

					// Get the remainder of the nested object to set so we can recurse
					b = a.slice();
					b.splice( 0, i+1 );
					innerSrc = b.join('.');

					// Traverse each entry in the array setting the properties requested
					for ( var j=0, jLen=val.length ; j<jLen ; j++ )
					{
						o = {};
						setData( o, val[j], innerSrc );
						data[ a[i] ].push( o );
					}

					// The inner call to setData has already traversed through the remainder
					// of the source and has set the data, thus we can exit here
					return;
				}
				else if ( funcNotation )
				{
					// Function call
					a[i] = a[i].replace(__reFn, '');
					data = data[ a[i] ]( val );
				}

				// If the nested object doesn't currently exist - since we are
				// trying to set the value - create it
				if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
				{
					data[ a[i] ] = {};
				}
				data = data[ a[i] ];
			}

			// Last item in the input - i.e, the actual set
			if ( aLast.match(__reFn ) )
			{
				// Function call
				data = data[ aLast.replace(__reFn, '') ]( val );
			}
			else
			{
				// If array notation is used, we just want to strip it and use the property name
				// and assign the value. If it isn't used, then we get the result we want anyway
				data[ aLast.replace(__reArray, '') ] = val;
			}
		};

		return function (data, val) {
			return setData( data, val, mSource );
		};
	}
	else
	{
		/* Array or flat object mapping */
		return function (data, val) {
			data[mSource] = val;
		};
	}
}


/**
 * Return an array with the full table data
 *  @param {object} oSettings dataTables settings object
 *  @returns array {array} aData Master data array
 *  @memberof DataTable#oApi
 */
function _fnGetDataMaster ( settings )
{
	return _pluck( settings.aoData, '_aData' );
}


/**
 * Nuke the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnClearTable( settings )
{
	settings.aoData.length = 0;
	settings.aiDisplayMaster.length = 0;
	settings.aiDisplay.length = 0;
}


 /**
 * Take an array of integers (index array) and remove a target integer (value - not
 * the key!)
 *  @param {array} a Index array to target
 *  @param {int} iTarget value to find
 *  @memberof DataTable#oApi
 */
function _fnDeleteIndex( a, iTarget, splice )
{
	var iTargetIndex = -1;

	for ( var i=0, iLen=a.length ; i<iLen ; i++ )
	{
		if ( a[i] == iTarget )
		{
			iTargetIndex = i;
		}
		else if ( a[i] > iTarget )
		{
			a[i]--;
		}
	}

	if ( iTargetIndex != -1 && splice === undefined )
	{
		a.splice( iTargetIndex, 1 );
	}
}


/**
 * Mark cached data as invalid such that a re-read of the data will occur when
 * the cached data is next requested. Also update from the data source object.
 *
 * @param {object} settings DataTables settings object
 * @param  {int}    rowIdx   Row index to invalidate
 * @memberof DataTable#oApi
 *
 * @todo For the modularisation of v1.11 this will need to become a callback, so
 *   the sort and filter methods can subscribe to it. That will required
 *   initialisation options for sorting, which is why it is not already baked in
 */
function _fnInvalidateRow( settings, rowIdx, src )
{
	var row = settings.aoData[ rowIdx ];

	// Are we reading last data from DOM or the data object?
	if ( src === 'dom' || (! src && row.src === 'dom') ) {
		// Read the data from the DOM
		row._aData = _fnGetRowElements( settings, row.nTr ).data;
	}
	else {
		// Reading from data object, update the DOM
		var cells = row.anCells;

		for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
			cells[i].innerHTML = _fnGetCellData( settings, rowIdx, i, 'display' );
		}
	}

	row._aSortData = null;
	row._aFilterData = null;
}


/**
 * Build a data source object from an HTML row, reading the contents of the
 * cells that are in the row.
 *
 * @param {object} settings DataTables settings object
 * @param {node} TR element from which to read data
 * @returns {object} Object with two parameters: `data` the data read, in
 *   document order, and `cells` and array of nodes (they can be useful to the
 *   caller, so rather than needing a second traversal to get them, just return
 *   them from here).
 * @memberof DataTable#oApi
 */
function _fnGetRowElements( settings, row )
{
	var
		d = [],
		tds = [],
		td = row.firstChild,
		name, col, o, i=0, contents,
		columns = settings.aoColumns;

	var attr = function ( str, data, td  ) {
		if ( typeof str === 'string' ) {
			var idx = str.indexOf('@');

			if ( idx !== -1 ) {
				var src = str.substring( idx+1 );
				o[ '@'+src ] = td.getAttribute( src );
			}
		}
	};

	while ( td ) {
		name = td.nodeName.toUpperCase();

		if ( name == "TD" || name == "TH" ) {
			col = columns[i];
			contents = $.trim(td.innerHTML);

			if ( col && col._bAttrSrc ) {
				o = {
					display: contents
				};

				attr( col.mData.sort, o, td );
				attr( col.mData.type, o, td );
				attr( col.mData.filter, o, td );

				d.push( o );
			}
			else {
				d.push( contents );
			}

			tds.push( td );
			i++;
		}

		td = td.nextSibling;
	}

	return {
		data: d,
		cells: tds
	};
}
