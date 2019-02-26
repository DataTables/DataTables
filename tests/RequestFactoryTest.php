<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables\Tests;

use PHPUnit\Framework\TestCase;
use DataTables\DataTables\RequestFactory;
use DataTables\DataTables\Request;
use DataTables\DataTables\Request\Column;
use DataTables\DataTables\Request\Order;

/**
 * @coversDefaultClass \DataTables\DataTables\RequestFactory
 */
class RequestFactoryTest extends TestCase
{
    /**
     * @dataProvider urlDataProvider
     *
     * @param string  $url
     * @param Request $expected
     *
     * @return void
     *
     * @covers ::create
     */
    public function testCreate(string $url, Request $expected): void
    {
        parse_str(urldecode($url), $query);

        $subject = new RequestFactory($query);

        $this->assertEquals($expected, $subject->create());
    }

    /**
     * @return array
     */
    public function urlDataProvider() : array
    {
        return [
            [
                http_build_query([
                    'draw' => 15,
                    'columns' => [
                        [
                            'data' => 'first_name',
                            'name' => '',
                            'searchable' => true,
                            'orderable' => true,
                            'search' =>
                                [
                                    'value' => '',
                                    'regex' => false
                                ]
                        ],
                    ],
                    'order' => [
                        ['column' => 0, 'dir' => 'desc']
                    ],
                    'start' => 5,
                    'length' => 10,
                    'search' =>
                        [
                            'value' => '',
                            'regex' => false
                        ]
                ]),
                new Request(
                    15,
                    [
                        new Column(
                            'first_name',
                            null,
                            true,
                            true,
                            new Request\Search(null, false)
                        )
                    ],
                    [
                        new Order(0, 'desc')
                    ],
                    5,
                    10,
                    new Request\Search(null, false)
                )
            ]
        ];
    }
}
