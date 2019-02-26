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
class Search
{
    /** @var null|string */
    private $value;

    /** @var bool */
    private $regex;

    /**
     * Search constructor.
     *
     * @param string|null $value
     * @param bool        $regex
     */
    public function __construct(?string $value, bool $regex)
    {
        $this->value = $value;
        $this->regex = $regex;
    }

    /**
     * @return string|null
     */
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @return bool
     */
    public function isEmpty(): bool
    {
        return empty($this->value);
    }

    /**
     * @return bool
     */
    public function isRegex(): bool
    {
        return $this->regex;
    }
}
