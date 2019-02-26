<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables;

/**
 * Class Response
 *
 * @package DataTables\DataTables
 * @see     https://datatables.net/manual/server-side
 * @author  Krzysztof Kardasz <krzysztof@kardasz.eu>
 */
class Response implements ResponseInterface
{
    /** @var null|int */
    private $draw;

    /** @var int */
    private $recordsTotal;

    /** @var int */
    private $recordsFiltered;

    /** @var null|string */
    private $error;

    /** @var array */
    private $data = [];

    /**
     * DataTableResponse constructor.
     *
     * @param array       $data
     * @param int         $recordsTotal
     * @param int         $recordsFiltered
     * @param int         $draw
     * @param string|null $error
     */
    public function __construct(
        ?array $data,
        ?int $recordsTotal = 0,
        ?int $recordsFiltered = 0,
        ?int $draw = 1,
        ?string $error = null
    ) {
        $this->data            = $data ?? [];
        $this->recordsTotal    = $recordsTotal ?? 0;
        $this->recordsFiltered = $recordsFiltered ?? 0;
        $this->draw            = $draw;
        $this->error           = $error;
    }

    /**
     * @return null|int
     */
    public function getDraw(): ?int
    {
        return $this->draw;
    }

    /**
     * @param int $draw
     */
    public function setDraw(int $draw): void
    {
        $this->draw = $draw;
    }

    /**
     * @return int
     */
    public function getRecordsTotal(): int
    {
        return $this->recordsTotal;
    }

    /**
     * @param int $recordsTotal
     */
    public function setRecordsTotal(int $recordsTotal): void
    {
        $this->recordsTotal = $recordsTotal;
    }

    /**
     * @return int
     */
    public function getRecordsFiltered(): int
    {
        return $this->recordsFiltered;
    }

    /**
     * @param int $recordsFiltered
     */
    public function setRecordsFiltered(int $recordsFiltered): void
    {
        $this->recordsFiltered = $recordsFiltered;
    }

    /**
     * @return string|null
     */
    public function getError(): ?string
    {
        return $this->error;
    }

    /**
     * @param string|null $error
     */
    public function setError(?string $error): void
    {
        $this->error = $error;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param array $data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize()
    {
        return [
            'draw'            => $this->getDraw(),
            'recordsTotal'    => $this->getRecordsTotal(),
            'recordsFiltered' => $this->getRecordsFiltered(),
            'error'           => $this->getError(),
            'data'            => $this->getData()
        ];
    }
}
