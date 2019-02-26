<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables\Request;

/**
 * Class Column
 * @package DataTables\DataTables\Request
 * @author Krzysztof Kardasz <krzysztof@kardasz.eu>
 */
class Order
{
    /** @var null|int */
    private $column;

    /** @var null|string */
    private $dir;

    /**
     * Order constructor.
     *
     * @param int|null    $column
     * @param string|null $dir
     */
    public function __construct(?int $column, ?string $dir)
    {
        $this->column = $column;
        $this->dir = $dir;
    }

    /**
     * @return int|null
     */
    public function getColumn(): ?int
    {
        return $this->column;
    }

    /**
     * @return string|null
     */
    public function getDir(): ?string
    {
        return $this->dir;
    }
}
