// DATA_TEMPLATE: empty_table
oTest.fnStart( "Row ids" );

$(document).ready( function () {
	var table = $('#example').DataTable( {
		"ajax": "../../../examples/ajax/data/objects.txt",
		"deferRender": true,
		"rowId": 'name',
		"columns": [
			{ "data": "name" },
			{ "data": "position" },
			{ "data": "office" },
			{ "data": "extn" },
			{ "data": "start_date" },
			{ "data": "salary" }
		]
	} );
	
	/* Basic checks */
	oTest.fnWaitTest( 
		"Table draws",
		null,
		function () { return $('tbody td:eq(0)').text() === 'Airi Satou'; }
	);
	
	oTest.fnTest( 
		"First row has an ID assigned",
		null,
		function () { return $('tbody tr:eq(0)').attr('id') === 'Airi Satou'; }
	);
	
	oTest.fnTest( 
		"Can select first row by ID via API",
		null,
		function () { return table.row('#Airi Satou').data().name === 'Airi Satou'; }
	);
	
	oTest.fnTest( 
		"Can select second row by ID via API",
		null,
		function () { return table.row('#Angelica Ramos').data().extn === '5797'; }
	);
	
	oTest.fnTest( 
		"Can select 11th row (deferred rendering) by ID via API - node doesn't exist",
		null,
		function () { return table.row('#Charde Marshall').data().extn === '6741'; }
	);
	
	oTest.fnTest( 
		"Get id for a row",
		null,
		function () { return table.row('#Dai Rios').id() === 'Dai Rios'; }
	);
	
	oTest.fnTest( 
		"Get id for a row with a hash",
		null,
		function () { return table.row('#Dai Rios').id(true) === '#Dai Rios'; }
	);
	
	oTest.fnTest( 
		"Get ids for a rows",
		null,
		function () {
			return JSON.stringify(table.rows([':eq(0)', ':eq(1)']).ids().toArray()) === '["Airi Satou","Angelica Ramos"]';
		}
	);
	
	oTest.fnTest( 
		"Get ids for a rows with a hash",
		null,
		function () {
			return JSON.stringify(table.rows([':eq(0)', ':eq(1)']).ids(true).toArray()) === '["#Airi Satou","#Angelica Ramos"]';
		}
	);
	
	
	oTest.fnComplete();
} );