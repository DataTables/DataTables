<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

use DataTables\DataTables\RequestFactory;
use DataTables\DataTables\Response;

$data = [
    [
        'first_name' => 'Tiger Nixon',
        'last_name' => 'System Architect',
        'position' => 'Edinburgh',
        'office' => '5421',
        'start_date' => '2011/04/25',
        'salary' => '$320,800'
    ],
    [
        'first_name' => 'Garrett Winters',
        'last_name' => 'Accountant',
        'position' => 'Tokyo',
        'office' => '8422',
        'start_date' => '2011/07/25',
        'salary' => '$170,750'
    ],
    [
        'first_name' => 'Ashton Cox',
        'last_name' => 'Junior Technical Author',
        'position' => 'San Francisco',
        'office' => '1562',
        'start_date' => '2009/01/12',
        'salary' => '$86,000'
    ],
    [
        'first_name' => 'Cedric Kelly',
        'last_name' => 'Senior Javascript Developer',
        'position' => 'Edinburgh',
        'office' => '6224',
        'start_date' => '2012/03/29',
        'salary' => '$433,060'
    ],
    [
        'first_name' => 'Airi Satou',
        'last_name' => 'Accountant',
        'position' => 'Tokyo',
        'office' => '5407',
        'start_date' => '2008/11/28',
        'salary' => '$162,700'
    ],
    [
        'first_name' => 'Brielle Williamson',
        'last_name' => 'Integration Specialist',
        'position' => 'New York',
        'office' => '4804',
        'start_date' => '2012/12/02',
        'salary' => '$372,000'
    ],
    [
        'first_name' => 'Herrod Chandler',
        'last_name' => 'Sales Assistant',
        'position' => 'San Francisco',
        'office' => '9608',
        'start_date' => '2012/08/06',
        'salary' => '$137,500'
    ],
    [
        'first_name' => 'Rhona Davidson',
        'last_name' => 'Integration Specialist',
        'position' => 'Tokyo',
        'office' => '6200',
        'start_date' => '2010/10/14',
        'salary' => '$327,900'
    ],
    [
        'first_name' => 'Colleen Hurst',
        'last_name' => 'Javascript Developer',
        'position' => 'San Francisco',
        'office' => '2360',
        'start_date' => '2009/09/15',
        'salary' => '$205,500'
    ],
    [
        'first_name' => 'Sonya Frost',
        'last_name' => 'Software Engineer',
        'position' => 'Edinburgh',
        'office' => '1667',
        'start_date' => '2008/12/13',
        'salary' => '$103,600'
    ],
    [
        'first_name' => 'Jena Gaines',
        'last_name' => 'Office Manager',
        'position' => 'London',
        'office' => '3814',
        'start_date' => '2008/12/19',
        'salary' => '$90,560'
    ],
    [
        'first_name' => 'Quinn Flynn',
        'last_name' => 'Support Lead',
        'position' => 'Edinburgh',
        'office' => '9497',
        'start_date' => '2013/03/03',
        'salary' => '$342,000'
    ],
    [
        'first_name' => 'Charde Marshall',
        'last_name' => 'Regional Director',
        'position' => 'San Francisco',
        'office' => '6741',
        'start_date' => '2008/10/16',
        'salary' => '$470,600'
    ],
    [
        'first_name' => 'Haley Kennedy',
        'last_name' => 'Senior Marketing Designer',
        'position' => 'London',
        'office' => '3597',
        'start_date' => '2012/12/18',
        'salary' => '$313,500'
    ],
    [
        'first_name' => 'Tatyana Fitzpatrick',
        'last_name' => 'Regional Director',
        'position' => 'London',
        'office' => '1965',
        'start_date' => '2010/03/17',
        'salary' => '$385,750'
    ],
    [
        'first_name' => 'Michael Silva',
        'last_name' => 'Marketing Designer',
        'position' => 'London',
        'office' => '1581',
        'start_date' => '2012/11/27',
        'salary' => '$198,500'
    ],
    [
        'first_name' => 'Paul Byrd',
        'last_name' => 'Chief Financial Officer (CFO)',
        'position' => 'New York',
        'office' => '3059',
        'start_date' => '2010/06/09',
        'salary' => '$725,000'
    ],
    [
        'first_name' => 'Gloria Little',
        'last_name' => 'Systems Administrator',
        'position' => 'New York',
        'office' => '1721',
        'start_date' => '2009/04/10',
        'salary' => '$237,500'
    ],
    [
        'first_name' => 'Bradley Greer',
        'last_name' => 'Software Engineer',
        'position' => 'London',
        'office' => '2558',
        'start_date' => '2012/10/13',
        'salary' => '$132,000'
    ],
    [
        'first_name' => 'Dai Rios',
        'last_name' => 'Personnel Lead',
        'position' => 'Edinburgh',
        'office' => '2290',
        'start_date' => '2012/09/26',
        'salary' => '$217,500'
    ],
    [
        'first_name' => 'Jenette Caldwell',
        'last_name' => 'Development Lead',
        'position' => 'New York',
        'office' => '1937',
        'start_date' => '2011/09/03',
        'salary' => '$345,000'
    ],
    [
        'first_name' => 'Yuri Berry',
        'last_name' => 'Chief Marketing Officer (CMO)',
        'position' => 'New York',
        'office' => '6154',
        'start_date' => '2009/06/25',
        'salary' => '$675,000'
    ],
    [
        'first_name' => 'Caesar Vance',
        'last_name' => 'Pre-Sales Support',
        'position' => 'New York',
        'office' => '8330',
        'start_date' => '2011/12/12',
        'salary' => '$106,450'
    ],
    [
        'first_name' => 'Doris Wilder',
        'last_name' => 'Sales Assistant',
        'position' => 'Sidney',
        'office' => '3023',
        'start_date' => '2010/09/20',
        'salary' => '$85,600'
    ],
    [
        'first_name' => 'Angelica Ramos',
        'last_name' => 'Chief Executive Officer (CEO)',
        'position' => 'London',
        'office' => '5797',
        'start_date' => '2009/10/09',
        'salary' => '$1,200,000'
    ],
    [
        'first_name' => 'Gavin Joyce',
        'last_name' => 'Developer',
        'position' => 'Edinburgh',
        'office' => '8822',
        'start_date' => '2010/12/22',
        'salary' => '$92,575'
    ],
    [
        'first_name' => 'Jennifer Chang',
        'last_name' => 'Regional Director',
        'position' => 'Singapore',
        'office' => '9239',
        'start_date' => '2010/11/14',
        'salary' => '$357,650'
    ],
    [
        'first_name' => 'Brenden Wagner',
        'last_name' => 'Software Engineer',
        'position' => 'San Francisco',
        'office' => '1314',
        'start_date' => '2011/06/07',
        'salary' => '$206,850'
    ],
    [
        'first_name' => 'Fiona Green',
        'last_name' => 'Chief Operating Officer (COO)',
        'position' => 'San Francisco',
        'office' => '2947',
        'start_date' => '2010/03/11',
        'salary' => '$850,000'
    ],
    [
        'first_name' => 'Shou Itou',
        'last_name' => 'Regional Marketing',
        'position' => 'Tokyo',
        'office' => '8899',
        'start_date' => '2011/08/14',
        'salary' => '$163,000'
    ],
    [
        'first_name' => 'Michelle House',
        'last_name' => 'Integration Specialist',
        'position' => 'Sidney',
        'office' => '2769',
        'start_date' => '2011/06/02',
        'salary' => '$95,400'
    ],
    [
        'first_name' => 'Suki Burks',
        'last_name' => 'Developer',
        'position' => 'London',
        'office' => '6832',
        'start_date' => '2009/10/22',
        'salary' => '$114,500'
    ],
    [
        'first_name' => 'Prescott Bartlett',
        'last_name' => 'Technical Author',
        'position' => 'London',
        'office' => '3606',
        'start_date' => '2011/05/07',
        'salary' => '$145,000'
    ],
    [
        'first_name' => 'Gavin Cortez',
        'last_name' => 'Team Leader',
        'position' => 'San Francisco',
        'office' => '2860',
        'start_date' => '2008/10/26',
        'salary' => '$235,500'
    ],
    [
        'first_name' => 'Martena Mccray',
        'last_name' => 'Post-Sales support',
        'position' => 'Edinburgh',
        'office' => '8240',
        'start_date' => '2011/03/09',
        'salary' => '$324,050'
    ],
    [
        'first_name' => 'Unity Butler',
        'last_name' => 'Marketing Designer',
        'position' => 'San Francisco',
        'office' => '5384',
        'start_date' => '2009/12/09',
        'salary' => '$85,675'
    ],
    [
        'first_name' => 'Howard Hatfield',
        'last_name' => 'Office Manager',
        'position' => 'San Francisco',
        'office' => '7031',
        'start_date' => '2008/12/16',
        'salary' => '$164,500'
    ],
    [
        'first_name' => 'Hope Fuentes',
        'last_name' => 'Secretary',
        'position' => 'San Francisco',
        'office' => '6318',
        'start_date' => '2010/02/12',
        'salary' => '$109,850'
    ],
    [
        'first_name' => 'Vivian Harrell',
        'last_name' => 'Financial Controller',
        'position' => 'San Francisco',
        'office' => '9422',
        'start_date' => '2009/02/14',
        'salary' => '$452,500'
    ],
    [
        'first_name' => 'Timothy Mooney',
        'last_name' => 'Office Manager',
        'position' => 'London',
        'office' => '7580',
        'start_date' => '2008/12/11',
        'salary' => '$136,200'
    ],
    [
        'first_name' => 'Jackson Bradshaw',
        'last_name' => 'Director',
        'position' => 'New York',
        'office' => '1042',
        'start_date' => '2008/09/26',
        'salary' => '$645,750'
    ],
    [
        'first_name' => 'Olivia Liang',
        'last_name' => 'Support Engineer',
        'position' => 'Singapore',
        'office' => '2120',
        'start_date' => '2011/02/03',
        'salary' => '$234,500'
    ],
    [
        'first_name' => 'Bruno Nash',
        'last_name' => 'Software Engineer',
        'position' => 'London',
        'office' => '6222',
        'start_date' => '2011/05/03',
        'salary' => '$163,500'
    ],
    [
        'first_name' => 'Sakura Yamamoto',
        'last_name' => 'Support Engineer',
        'position' => 'Tokyo',
        'office' => '9383',
        'start_date' => '2009/08/19',
        'salary' => '$139,575'
    ],
    [
        'first_name' => 'Thor Walton',
        'last_name' => 'Developer',
        'position' => 'New York',
        'office' => '8327',
        'start_date' => '2013/08/11',
        'salary' => '$98,540'
    ],
    [
        'first_name' => 'Finn Camacho',
        'last_name' => 'Support Engineer',
        'position' => 'San Francisco',
        'office' => '2927',
        'start_date' => '2009/07/07',
        'salary' => '$87,500'
    ],
    [
        'first_name' => 'Serge Baldwin',
        'last_name' => 'Data Coordinator',
        'position' => 'Singapore',
        'office' => '8352',
        'start_date' => '2012/04/09',
        'salary' => '$138,575'
    ],
    [
        'first_name' => 'Zenaida Frank',
        'last_name' => 'Software Engineer',
        'position' => 'New York',
        'office' => '7439',
        'start_date' => '2010/01/04',
        'salary' => '$125,250'
    ],
    [
        'first_name' => 'Zorita Serrano',
        'last_name' => 'Software Engineer',
        'position' => 'San Francisco',
        'office' => '4389',
        'start_date' => '2012/06/01',
        'salary' => '$115,000'
    ],
    [
        'first_name' => 'Jennifer Acosta',
        'last_name' => 'Junior Javascript Developer',
        'position' => 'Edinburgh',
        'office' => '3431',
        'start_date' => '2013/02/01',
        'salary' => '$75,650'
    ],
    [
        'first_name' => 'Cara Stevens',
        'last_name' => 'Sales Assistant',
        'position' => 'New York',
        'office' => '3990',
        'start_date' => '2011/12/06',
        'salary' => '$145,600'
    ],
    [
        'first_name' => 'Hermione Butler',
        'last_name' => 'Regional Director',
        'position' => 'London',
        'office' => '1016',
        'start_date' => '2011/03/21',
        'salary' => '$356,250'
    ],
    [
        'first_name' => 'Lael Greer',
        'last_name' => 'Systems Administrator',
        'position' => 'London',
        'office' => '6733',
        'start_date' => '2009/02/27',
        'salary' => '$103,500'
    ],
    [
        'first_name' => 'Jonas Alexander',
        'last_name' => 'Developer',
        'position' => 'San Francisco',
        'office' => '8196',
        'start_date' => '2010/07/14',
        'salary' => '$86,500'
    ],
    [
        'first_name' => 'Shad Decker',
        'last_name' => 'Regional Director',
        'position' => 'Edinburgh',
        'office' => '6373',
        'start_date' => '2008/11/13',
        'salary' => '$183,000'
    ],
    [
        'first_name' => 'Michael Bruce',
        'last_name' => 'Javascript Developer',
        'position' => 'Singapore',
        'office' => '5384',
        'start_date' => '2011/06/27',
        'salary' => '$183,000'
    ],
    [
        'first_name' => 'Donna Snider',
        'last_name' => 'Customer Support',
        'position' => 'New York',
        'office' => '4226',
        'start_date' => '2011/01/25',
        'salary' => '$112,000'
    ]
];

$request = (new RequestFactory($_GET))->create();

if ($order = $request->getOrder()->current()){
    usort($data, function ($a, $b) use($request, $order) {
        $column = $request->getColumnAt($order->getColumn());
        $multiplier = ($order->getDir() === 'asc') ? 1 : -1;
        return strcmp($a[$column->getData()], $b[$column->getData()]) * $multiplier;
    });
}

header('Content-Type: application/json');
echo json_encode(new Response(
    $data,
    count($data),
    count($data),
    $request->getDraw())
);