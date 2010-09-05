// DATA_TEMPLATE: empty_table
oTest.fnStart( "bInfiniteScroll" );


$(document).ready( function () {
	var oTable = $('#example').dataTable( {
		"bScrollInfinite": true,
		"sScrollY": "200px",
		"bServerSide": true,
		"sAjaxSource": "../../../examples/examples_support/server_processing.php"
	} );
	
	oTest.fnWaitTest( 
		"10 rows by default",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll on 20px adds 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnWaitTest( 
		"Scroll on 10px more results in the same number of rows",
		function () { $('div.dataTables_scrollBody').scrollTop(30); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnWaitTest( 
		"Scroll to 240px adds another 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(240); },
		function () { return $('#example tbody tr').length == 30; }
	);
	
	oTest.fnWaitTest( 
		"Filtering will drop back to 10 rows",
		function () { oTable.fnFilter('gec') },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll after filtering adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnWaitTest( 
		"Sorting will drop back to 10 rows",
		function () { oTable.fnSort([[1,'asc']]) },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll after sorting adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	
	oTest.fnComplete();
} );