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
class Column
{
    /** @var null|int|string */
    private $data;

    /** @var null|string */
    private $name;

    /** @var bool */
    private $searchable;

    /** @var bool */
    private $orderable;

    /** @var null|Search */
    private $search;

    /**
     * Column constructor.
     *
     * @param null|int|string $data
     * @param string|null     $name
     * @param bool            $searchable
     * @param bool            $orderable
     * @param Search|null     $search
     */
    public function __construct($data, ?string $name, bool $searchable, bool $orderable, ?Search $search)
    {
        $this->data = $data;
        $this->name = $name;
        $this->searchable = $searchable;
        $this->orderable = $orderable;
        $this->search = $search;
    }

    /**
     * @return null|int|string
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @return bool
     */
    public function isSearchable(): bool
    {
        return $this->searchable;
    }

    /**
     * @return bool
     */
    public function isOrderable(): bool
    {
        return $this->orderable;
    }

    /**
     * @return Search|null
     */
    public function getSearch(): ?Search
    {
        return $this->search;
    }
}
