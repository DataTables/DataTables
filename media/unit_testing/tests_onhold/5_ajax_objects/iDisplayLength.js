// DATA_TEMPLATE: empty_table
oTest.fnStart( "iDisplayLength" );

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
		"Default length is ten",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 10",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 25",
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
				"iDisplayLength": 25
			} );
		},
		function () { return $('#example tbody tr').length == 25; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 25; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 100",
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
				"iDisplayLength": 100
			} );
		},
		function () { return $('#example tbody tr').length == 57; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 100; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 23 (unknown select menu length)",
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
				"iDisplayLength": 23
			} );
		},
		function () { return $('#example tbody tr').length == 23; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 10 (since 23 is unknow)",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnComplete();
} );