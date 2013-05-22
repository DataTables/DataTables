

// Filter formatting functions. See model.ext.ofnSearch for information about
// what is required from these methods.

var __filter_lines = /[\r\n]/g;
var __filter_html = /[\r\n]/g;

$.extend( DataTable.ext.ofnSearch, {
	html: function ( data ) {
		return data
			.replace( __filter_lines, " " )
			.replace( __filter_html, "" );
	},

	string: function ( data ) {
		return data.replace ?
			data.replace( __filter_lines, " " ) :
			data;
	}
} );

