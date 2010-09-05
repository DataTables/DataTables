// DATA_TEMPLATE: dom_data
oTest.fnStart( "bInfiniteScroll" );


$(document).ready( function () {
	var oTable = $('#example').dataTable( {
		"bScrollInfinite": true,
		"sScrollY": "200px"
	} );
	
	oTest.fnTest( 
		"10 rows by default",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Scroll on 20px adds 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Scroll on 10px more results in the same number of rows",
		function () { $('div.dataTables_scrollBody').scrollTop(30); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Scroll to 240px adds another 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(240); },
		function () { return $('#example tbody tr').length == 30; }
	);
	
	oTest.fnTest( 
		"Filtering will drop back to 10 rows",
		function () { oTable.fnFilter('gec') },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Scroll after filtering adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Sorting will drop back to 10 rows",
		function () { oTable.fnSort([[1,'asc']]) },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Scroll after sorting adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	
	oTest.fnComplete();
} );