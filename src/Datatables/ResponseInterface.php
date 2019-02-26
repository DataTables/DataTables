<?php
/**
 * Datatables PHP Model
 */

namespace DataTables\DataTables;

use JsonSerializable;

/**
 * Interface ResponseInterface
 * @package DataTables\DataTables
 * @see     https://datatables.net/manual/server-side
 * @author  Krzysztof Kardasz <krzysztof@kardasz.eu>
 */
interface ResponseInterface extends JsonSerializable
{
    /**
     * @return null|int
     */
    public function getDraw(): ?int;

    /**
     * @return int
     */
    public function getRecordsTotal(): int;

    /**
     * @return int
     */
    public function getRecordsFiltered(): int;

    /**
     * @return string|null
     */
    public function getError(): ?string;

    /**
     * @return array
     */
    public function getData(): array;
}
