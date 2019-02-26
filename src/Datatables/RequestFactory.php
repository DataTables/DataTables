<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables;

use DataTables\DataTables\Request\Column;
use DataTables\DataTables\Request\Order;
use DataTables\DataTables\Request\Search;
use Psr\Http\Message as Psr;

/**
 * Class RequestFactory
 * @see     https://datatables.net/manual/server-side
 * @author  Krzysztof Kardasz <krzysztof@kardasz.eu>
 */
class RequestFactory
{
    private const DRAW               = 'draw';
    private const COLUMNS            = 'columns';
    private const ORDER              = 'order';
    private const ORDER_COLUMN       = 'column';
    private const ORDER_DIR          = 'dir';
    private const START              = 'start';
    private const LENGTH             = 'length';
    private const SEARCH             = 'search';
    private const SEARCH_VALUE       = 'value';
    private const SEARCH_REGEX       = 'regex';
    private const COLUMNS_DATA       = 'data';
    private const COLUMNS_NAME       = 'name';
    private const COLUMNS_SEARCHABLE = 'searchable';
    private const COLUMNS_ORDERABLE  = 'orderable';

    /** @var array */
    private $request = [];

    /**
     * DataTablesRequestFactory constructor.
     *
     * @param array $request
     */
    public function __construct(array $request)
    {
        $this->request = $request;
    }

    /**
     * @return RequestInterface
     */
    public static function fromGlobals() : RequestInterface
    {
        return (new self($_GET))->create();
    }

    /**
     * @param Psr\RequestInterface $request
     *
     * @return RequestInterface
     */
    public static function fromPsr7(Psr\RequestInterface $request) : RequestInterface
    {
        return self::fromUri($request->getUri());
    }

    /**
     * @param Psr\UriInterface $uri
     *
     * @return RequestInterface
     */
    public static function fromUri(Psr\UriInterface $uri) : RequestInterface
    {
        parse_str(urldecode($uri->getQuery()), $query);
        return (new self($query))->create();
    }

    /**
     * @return RequestInterface
     */
    public function create() : RequestInterface
    {
        return new Request(
            $this->getDraw(),
            $this->getColumns(),
            $this->getOrder(),
            $this->getStart(),
            $this->getLength(),
            $this->getSearch()
        );
    }

    /**
     * @return int|null
     */
    private function getDraw() : ?int
    {
        return (isset($this->request[self::DRAW])) ? (int)$this->request[self::DRAW] : null;
    }

    /**
     * @return int|null
     */
    private function getStart() : ?int
    {
        return (isset($this->request[self::START])) ? (int)$this->request[self::START] : null;
    }

    /**
     * @return int|null
     */
    private function getLength() : ?int
    {
        return (isset($this->request[self::LENGTH])) ? (int)$this->request[self::LENGTH] : null;
    }

    /**
     * @return array
     */
    private function getColumns() : array
    {
        if (!isset($this->request[self::COLUMNS])) {
            return [];
        }

        return array_map(function (array $column) {
            return new Column(
                $column[self::COLUMNS_DATA] ?? null,
                $column[self::COLUMNS_NAME] ?? null,
                $column[self::COLUMNS_SEARCHABLE] ?? false,
                $column[self::COLUMNS_ORDERABLE] ?? false,
                $this->getSearchFromArray($column[self::SEARCH] ?? null)
            );
        }, $this->request[self::COLUMNS]);
    }

    /**
     * @return array
     */
    private function getOrder() : array
    {
        if (!isset($this->request[self::ORDER])) {
            return [];
        }

        return array_map(function (array $column) {
            return new Order(
                $column[self::ORDER_COLUMN] ?? null,
                $column[self::ORDER_DIR] ?? null
            );
        }, $this->request[self::ORDER]);
    }

    /**
     * @return Search|null
     */
    private function getSearch() : ?Search
    {
        return (isset($this->request[self::SEARCH])) ? $this->getSearchFromArray($this->request[self::SEARCH]) : null;
    }

    /**
     * @param array|null $data
     *
     * @return Search|null
     */
    private function getSearchFromArray(?array $data) : ?Search
    {
        if (
            null === $data ||
            !array_key_exists(self::SEARCH_VALUE, $data) ||
            !array_key_exists(self::SEARCH_REGEX, $data)
        ) {
            return null;
        }

        return new Search($data[self::SEARCH_VALUE], $data[self::SEARCH_REGEX]);
    }
}
