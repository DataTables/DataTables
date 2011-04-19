// DATA_TEMPLATE: empty_table
oTest.fnStart( "oLanguage.sSearch" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mDataSource": "engine" },
			{ "mDataSource": "browser" },
			{ "mDataSource": "platform" },
			{ "mDataSource": "version" },
			{ "mDataSource": "grade" }
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Search language is 'Search:' by default",
		null,
		function () { return oSettings.oLanguage.sSearch == "Search:"; }
	);
	
	oTest.fnTest( 
		"Search language default is in the DOM",
		null,
		function () { return document.getElementById('example_filter').childNodes[0].nodeValue
		 	== "Search: "; }
	);
	
	
	oTest.fnWaitTest( 
		"Search language can be defined",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mDataSource": "engine", "aTargets": [0] },
					{ "mDataSource": "browser", "aTargets": [1] },
					{ "mDataSource": "platform", "aTargets": [2] },
					{ "mDataSource": "version", "aTargets": [3] },
					{ "mDataSource": "grade", "aTargets": [4] }
				],
				"oLanguage": {
					"sSearch": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oLanguage.sSearch == "unit test"; }
	);
	
	oTest.fnTest( 
		"Info language definition is in the DOM",
		null,
		function () { return document.getElementById('example_filter').childNodes[0].nodeValue
		 	== "unit test "; }
	);
	
	
	oTest.fnWaitTest( 
		"Blank search has a no space (separator) inserted",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mDataSource": "engine", "aTargets": [0] },
					{ "mDataSource": "browser", "aTargets": [1] },
					{ "mDataSource": "platform", "aTargets": [2] },
					{ "mDataSource": "version", "aTargets": [3] },
					{ "mDataSource": "grade", "aTargets": [4] }
				],
				"oLanguage": {
					"sSearch": ""
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return document.getElementById('example_filter').childNodes.length == 1; }
	);
	
	
	oTest.fnComplete();
} );