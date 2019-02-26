<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables;

use DataTables\DataTables\Request\Column;
use DataTables\DataTables\Request\Order;
use DataTables\DataTables\Request\Search;
use ArrayIterator;
use Iterator;

/**
 * Class Request
 *
 * @package DataTables\DataTables\Request
 * @see     https://datatables.net/manual/server-side
 * @author  Krzysztof Kardasz <krzysztof@kardasz.eu>
 */
class Request implements RequestInterface
{
    /** @var null|int */
    private $draw;

    /** @var Iterator|Column[] */
    private $columns;

    /** @var Iterator|Order[] */
    private $order;

    /** @var null|int */
    private $start;

    /** @var null|int */
    private $length;

    /** @var null|Search */
    private $search;

    /**
     * DataTablesRequest constructor.
     *
     * @param int|null    $draw
     * @param Column[]    $columns
     * @param Order[]     $order
     * @param int|null    $start
     * @param int|null    $length
     * @param Search|null $search
     */
    public function __construct(?int $draw, array $columns, array $order, ?int $start, ?int $length, ?Search $search)
    {
        $this->draw    = $draw;
        $this->columns = new ArrayIterator($columns);
        $this->order   = new ArrayIterator($order);
        $this->start   = $start;
        $this->length  = $length;
        $this->search  = $search;
    }

    /**
     * @return int|null
     */
    public function getDraw(): ?int
    {
        return $this->draw;
    }

    /**
     * @return Iterator|Column[]
     */
    public function getColumns(): Iterator
    {
        return $this->columns;
    }

    /**
     * @param int $index
     *
     * @return null|Column
     */
    public function getColumnAt(int $index): ?Column
    {
        return $this->columns[$index] ?? null;
    }

    /**
     * @return Iterator|Order[]
     */
    public function getOrder(): Iterator
    {
        return $this->order;
    }

    /**
     * @return int|null
     */
    public function getStart(): ?int
    {
        return $this->start;
    }

    /**
     * @return int|null
     */
    public function getLength(): ?int
    {
        return $this->length;
    }

    /**
     * @return Search|null
     */
    public function getSearch(): ?Search
    {
        return $this->search;
    }
}
