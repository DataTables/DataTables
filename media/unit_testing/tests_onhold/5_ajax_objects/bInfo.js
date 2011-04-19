// DATA_TEMPLATE: empty_table
oTest.fnStart( "bInfo" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mDataSource": "engine" },
			{ "mDataSource": "browser" },
			{ "mDataSource": "platform" },
			{ "mDataSource": "version" },
			{ "mDataSource": "grade" }
		]
	} );
	
	oTest.fnWaitTest( 
		"Info div exists by default",
		null,
		function () { return document.getElementById('example_info') != null; }
	);
	
	/* Check can disable */
	oTest.fnWaitTest( 
		"Info can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mDataSource": "engine", "aTargets": [0] },
					{ "mDataSource": "browser", "aTargets": [1] },
					{ "mDataSource": "platform", "aTargets": [2] },
					{ "mDataSource": "version", "aTargets": [3] },
					{ "mDataSource": "grade", "aTargets": [4] }
				],
				"bInfo": false
			} );
		},
		function () { return document.getElementById('example_info') == null; }
	);
	
	/* Enable makes no difference */
	oTest.fnWaitTest( 
		"Info enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mDataSource": "engine", "aTargets": [0] },
					{ "mDataSource": "browser", "aTargets": [1] },
					{ "mDataSource": "platform", "aTargets": [2] },
					{ "mDataSource": "version", "aTargets": [3] },
					{ "mDataSource": "grade", "aTargets": [4] }
				],
				"bInfo": true
			} );
		},
		function () { return document.getElementById('example_info') != null; }
	);
	
	
	oTest.fnComplete();
} );