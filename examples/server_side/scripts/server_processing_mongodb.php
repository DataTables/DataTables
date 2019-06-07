<?php
set_time_limit(0);
ini_set('memory_limit', '-1');
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('America/Mexico_City');

/**
 * data to modify for it to work
 */
$database   = 'database'; //indicate the name of data base
$collection = 'collection'; //indicate the name of collection
 
/**
 * MongoDB connection
 */
try {
    $m = new MongoDB\Driver\Manager("mongodb://localhost:27017");
} catch (MongoConnectionException $e) {
    die('Error connecting to MongoDB server');
}
/**
 * get the parameters of the call
 */
$input =& $_GET; 
/**
 * get columns
 */
$columnas=[];
foreach($input['columns'] as $cl){
    array_push($columnas,$cl['data']);
}

/**
 * generate custom filter
 */

$condicion=[];
$iColumns = count($input['columns']);
for($i=0;$i<$iColumns;$i++){
    if($input['columns'][$i]['search']['value'] != ""){
        if(is_numeric($input['columns'][$i]['search']['value'])){
           $condicion[$columnas[$i]]= intval($input['columns'][$i]['search']['value']); 
        }else{
            $condicion[$columnas[$i]]= $input['columns'][$i]['search']['value'];
        }        
    }
}

/**
 * search in table
 */
$search = $input['search']['value'];
$base = [];
if($search != ""){
    foreach($columnas as $cl){
        $base[]= [$cl=>['$regex'=>$search]];
    }
    $condicion['$or']=$base;
}
/**
 * order
 */
$sort=[];
if($input['order'][0]['dir']=="asc"){$dir=1;}else{$dir=-1;}
$sort=array($columnas[$input['order'][0]['column']]=>$dir);
/**
 * total results
 */
$total="";
$recordsTotal="";
if(count($condicion)==0){
    $option=array(['$count'=>'total']);
}else{
    $option=array(['$match' => $condicion],['$count'=>'total']);  
}
$command = new MongoDB\Driver\Command([
    'aggregate' => $collection,
    'pipeline' => $option,
    'allowDiskUse' => true,
    'cursor' => new stdClass,
]);
$totales = $m->executeCommand($database, $command);
foreach($totales as $d){
    $total = $d->total;
}
/**
 * Total records in collection
 */
$command = new MongoDB\Driver\Command([
    'aggregate' => $collection,
    'pipeline' => [['$count'=>'total']],
    'allowDiskUse' => true,
    'cursor' => new stdClass,
]);
$totalesx = $m->executeCommand($database, $command);
foreach($totalesx as $d){
   $recordsTotal=$d->total;
}
/**
 * filtering and paging
 */
$project=['_id' => 0];
foreach($columnas as $col){
    $project[$col]=1;
}
if(count($condicion)==0){
    $optionx=array(       
        ['$skip' => intval($input['start'])],
        ['$project'=>$project],             
        ['$limit'=> intval($input['length'])],
        ['$sort'=>$sort],
    );
}else{
    $optionx=array( 
        ['$match'=>$condicion],        
        ['$skip' => intval($input['start'])],
        ['$project'=>$project],            
        ['$limit'=> intval($input['length'])],
        ['$sort'=>$sort], 
          
    );
}
    
$command = new MongoDB\Driver\Command([
    'aggregate' => $collection,
    'pipeline' => $optionx,
    'allowDiskUse' => true,
    'cursor' => new stdClass,
]);
$cursor = $m->executeCommand($database, $command);
/**
 * result
 */

$output = array(
    "draw" => $input['draw'],
    "recordsTotal" => $recordsTotal,
    "recordsFiltered" => $total,
    "data" => array()
);

foreach ( $cursor as $doc ) {
    $finales=array();
    foreach($doc as $key => $value){
        $finales[$key]=$value;
    }
    $output['data'][] = $finales;
}
echo "$input[callback](".json_encode( $output , true),")";