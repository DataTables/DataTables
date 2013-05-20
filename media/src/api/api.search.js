

(/** @lends <global> */function() {

var _api = DataTable.Api;


_api.register( 'search()', function ( input, caseInsen, regex, smart ) {
	return this.iterator( 'table', function ( settings ) {
		if ( ! settings.oFeatures.bFilter ) {
			return;
		}

		_fnFilterComplete( settings, {
			"sSearch": input+"",
			"bRegex":  regex === null ? false : regex,
			"bSmart":  smart === null ? true  : smart,
			"bCaseInsensitive": caseInsen === null ? true : caseInsen
		}, 1 );
	} );
} );


_api.register( [
	'columns().search()',
	'column().search()'
], function ( input, caseInsen, regex, smart ) {
	return this.iterator( 'column', function ( settings, column ) {
		if ( ! settings.oFeatures.bFilter ) {
			return;
		}

		$.extend( settings.aoPreSearchCols[ column ], {
			"sSearch": input+"",
			"bRegex":  regex === null ? false : regex,
			"bSmart":  smart === null ? true  : smart,
			"bCaseInsensitive": caseInsen === null ? true : caseInsen
		} );

		_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
	} );
} );


}());

