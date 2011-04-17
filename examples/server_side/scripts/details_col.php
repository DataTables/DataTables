<?php
  /* MySQL connection */
	include( $_SERVER['DOCUMENT_ROOT']."/datatables/mysql.php" ); /* ;-) */
	
	$gaSql['link'] =  mysql_pconnect( $gaSql['server'], $gaSql['user'], $gaSql['password']  ) or
		die( 'Could not open connection to server' );
	
	mysql_select_db( $gaSql['db'], $gaSql['link'] ) or 
		die( 'Could not select database '. $gaSql['db'] );
	
	/* Paging */
	$sLimit = "";
	if ( isset( $_GET['iDisplayStart'] ) && $_GET['iDisplayLength'] != '-1' )
	{
		$sLimit = "LIMIT ".mysql_real_escape_string( $_GET['iDisplayStart'] ).", ".
			mysql_real_escape_string( $_GET['iDisplayLength'] );
	}
	
	/* Ordering */
	if ( isset( $_GET['iSortCol_0'] ) )
	{
		$sOrder = "ORDER BY  ";
		for ( $i=0 ; $i<mysql_real_escape_string( $_GET['iSortingCols'] ) ; $i++ )
		{
			$sOrder .= fnColumnToField(mysql_real_escape_string( $_GET['iSortCol_'.$i] ))."
			 	".mysql_real_escape_string( $_GET['sSortDir_'.$i] ) .", ";
		}
		$sOrder = substr_replace( $sOrder, "", -2 );
	}
	
	/* Filtering */
	$sWhere = "";
	if ( $_GET['sSearch'] != "" )
	{
		$sWhere = "WHERE engine LIKE '%".mysql_real_escape_string( $_GET['sSearch'] )."%' OR ".
		                "browser LIKE '%".mysql_real_escape_string( $_GET['sSearch'] )."%' OR ".
		                "platform LIKE '%".mysql_real_escape_string( $_GET['sSearch'] )."%' OR ".
		                "version LIKE '%".mysql_real_escape_string( $_GET['sSearch'] )."%' OR ".
		                "grade LIKE '%".mysql_real_escape_string( $_GET['sSearch'] )."%'";
	}
	
	$sQuery = "
		SELECT SQL_CALC_FOUND_ROWS id, engine, browser, platform, version, grade
		FROM   ajax
		$sWhere
		$sOrder
		$sLimit
	";
	$rResult = mysql_query( $sQuery, $gaSql['link'] ) or die(mysql_error());
	
	$sQuery = "
		SELECT FOUND_ROWS()
	";
	$rResultFilterTotal = mysql_query( $sQuery, $gaSql['link'] ) or die(mysql_error());
	$aResultFilterTotal = mysql_fetch_array($rResultFilterTotal);
	$iFilteredTotal = $aResultFilterTotal[0];
	
	$sQuery = "
		SELECT COUNT(id)
		FROM   ajax
	";
	$rResultTotal = mysql_query( $sQuery, $gaSql['link'] ) or die(mysql_error());
	$aResultTotal = mysql_fetch_array($rResultTotal);
	$iTotal = $aResultTotal[0];
	
	
	$sOutput = '{';
	$sOutput .= '"sEcho": '.intval($_GET['sEcho']).', ';
	$sOutput .= '"iTotalRecords": '.$iTotal.', ';
	$sOutput .= '"iTotalDisplayRecords": '.$iFilteredTotal.', ';
	$sOutput .= '"aaData": [ ';
	while ( $aRow = mysql_fetch_array( $rResult ) )
	{
		$sOutput .= "[";
		$sOutput .= '"<img src=\"../examples_support/details_open.png\">",';
		$sOutput .= '"'.str_replace('"', '\"', $aRow['engine']).'",';
		$sOutput .= '"'.str_replace('"', '\"', $aRow['browser']).'",';
		$sOutput .= '"'.str_replace('"', '\"', $aRow['platform']).'",';
		if ( $aRow['version'] == "0" )
			$sOutput .= '"-",';
		else
			$sOutput .= '"'.str_replace('"', '\"', $aRow['version']).'",';
		$sOutput .= '"'.str_replace('"', '\"', $aRow['grade']).'"';
		$sOutput .= "],";
	}
	$sOutput = substr_replace( $sOutput, "", -1 );
	$sOutput .= '] }';
	
	echo $sOutput;
	
	
	function fnColumnToField( $i )
	{
		/* Note that column 0 is the details column */
		if ( $i == 0 ||$i == 1 )
			return "engine";
		else if ( $i == 2 )
			return "browser";
		else if ( $i == 3 )
			return "platform";
		else if ( $i == 4 )
			return "version";
		else if ( $i == 5 )
			return "grade";
	}
?>