
/**
 * Return the settings object for a particular table
 *  @param {node} table table we are using as a dataTable
 *  @returns {object} Settings object - or null if not found
 *  @memberof DataTable#oApi
 */
function _fnSettingsFromNode ( table )
{
	var settings = DataTable.settings;
	var idx = $.inArray( table, _pluck( settings, 'nTable' ) );

	return idx !== -1 ?
		settings[ idx ] :
		null;
}


/**
 * Log an error message
 *  @param {object} settings dataTables settings object
 *  @param {int} level log error messages, or display them to the user
 *  @param {string} msg error message
 *  @param {int} tn Technical note id to get more information about the error.
 *  @memberof DataTable#oApi
 */
function _fnLog( settings, level, msg, tn )
{
	msg = 'DataTables warning: '+
		(settings!==null ? 'table id='+settings.sTableId+' - ' : '')+msg;

	if ( tn ) {
		msg += '. For more information about this error, please see '+
		'http://datatables.net/tn/'+tn;
	}

	if ( ! level  ) {
		if ( DataTable.ext.sErrMode == 'alert' ) {
			alert( msg );
		}
		else {
			throw new Error(msg);
		}
	}
	else if ( window.console && console.log ) {
		console.log( msg );
	}
}


/**
 * See if a property is defined on one object, if so assign it to the other object
 *  @param {object} ret target object
 *  @param {object} src source object
 *  @param {string} name property
 *  @param {string} [mappedName] name to map too - optional, name used if not given
 *  @memberof DataTable#oApi
 */
function _fnMap( ret, src, name, mappedName )
{
	if ( $.isArray( name ) ) {
		$.each( name, function (i, val) {
			if ( $.isArray( val ) ) {
				_fnMap( ret, src, val[0], val[1] );
			}
			else {
				_fnMap( ret, src, val[0] );
			}
		} );

		return;
	}

	if ( mappedName === undefined ) {
		mappedName = name;
	}

	if ( src[name] !== undefined ) {
		ret[mappedName] = src[name];
	}
}


/**
 * Extend objects - very similar to jQuery.extend, but deep copy objects, and shallow
 * copy arrays. The reason we need to do this, is that we don't want to deep copy array
 * init values (such as aaSorting) since the dev wouldn't be able to override them, but
 * we do want to deep copy objects.
 *  @param {object} oOut Object to extend
 *  @param {object} oExtender Object from which the properties will be applied to oOut
 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
 *  @memberof DataTable#oApi
 *  @todo This doesn't take account of arrays inside the deep copied objects.
 */
function _fnExtend( oOut, oExtender )
{
	var val;

	for ( var prop in oExtender )
	{
		if ( oExtender.hasOwnProperty(prop) )
		{
			val = oExtender[prop];

			if ( $.isPlainObject( val ) )
			{
				if ( ! oOut[prop] )
				{
					oOut[prop] = {};
				}
				$.extend( true, oOut[prop], val );
			}
			else
			{
				oOut[prop] = val;
			}
		}
	}

	return oOut;
}


/**
 * Bind an event handers to allow a click or return key to activate the callback.
 * This is good for accessibility since a return on the keyboard will have the
 * same effect as a click, if the element has focus.
 *  @param {element} n Element to bind the action to
 *  @param {object} oData Data object to pass to the triggered function
 *  @param {function} fn Callback function for when the event is triggered
 *  @memberof DataTable#oApi
 */
function _fnBindAction( n, oData, fn )
{
	$(n)
		.bind( 'click.DT', oData, function (e) {
				n.blur(); // Remove focus outline for mouse users
				fn(e);
			} )
		.bind( 'keypress.DT', oData, function (e){
			if ( e.which === 13 ) {
				fn(e);
			} } )
		.bind( 'selectstart.DT', function () {
			/* Take the brutal approach to cancelling text selection */
			return false;
			} );
}


/**
 * Register a callback function. Easily allows a callback function to be added to
 * an array store of callback functions that can then all be called together.
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
 *  @param {function} fn Function to be called back
 *  @param {string} sName Identifying name for the callback (i.e. a label)
 *  @memberof DataTable#oApi
 */
function _fnCallbackReg( oSettings, sStore, fn, sName )
{
	if ( fn )
	{
		oSettings[sStore].push( {
			"fn": fn,
			"sName": sName
		} );
	}
}


/**
 * Fire callback functions and trigger events. Note that the loop over the callback
 * array store is done backwards! Further note that you do not want to fire off triggers
 * in time sensitive applications (for example cell creation) as its slow.
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
 *  @param {string} sTrigger Name of the jQuery custom event to trigger. If null no trigger
 *    is fired
 *  @param {array} aArgs Array of arguments to pass to the callback function / trigger
 *  @memberof DataTable#oApi
 */
function _fnCallbackFire( settings, callbackArr, event, args )
{
	var ret = [];

	if ( callbackArr ) {
		ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
			return val.fn.apply( settings.oInstance, args );
		} );
	}

	if ( event !== null ) {
		$(settings.oInstance).trigger(event, args);
	}

	return ret;
}


function _fnLengthOverflow ( settings )
{
	var
		start = settings._iDisplayStart,
		end = settings.fnDisplayEnd(),
		len = settings._iDisplayLength;

	/* If we have space to show extra rows (backing up from the end point - then do so */
	if ( end === settings.fnRecordsDisplay() )
	{
		start = end - len;
	}

	if ( len === -1 || start < 0 )
	{
		start = 0;
	}

	settings._iDisplayStart = start;
}


function _fnRenderer( settings, type )
{
	var renderer = settings.renderer;
	var host = DataTable.ext.renderer[type];

	if ( $.isPlainObject( renderer ) && renderer[type] ) {
		// Specific renderer for this type. If available use it, otherwise use
		// the default.
		return host[renderer[type]] || host._;
	}
	else if ( typeof renderer === 'string' ) {
		// Common renderer - if there is one available for this type use it,
		// otherwise use the default
		return host[renderer] || host._;
	}

	// Use the default
	return host._;
}

