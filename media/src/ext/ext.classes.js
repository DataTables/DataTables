
$.extend( DataTable.ext.oStdClasses, {
	"sTable": "dataTable",

	/* Paging buttons */
	"sPageButton": "paginate_button",
	"sPageButtonActive": "current",
	"sPageButtonDisabled": "disabled",

	/* Striping classes */
	"sStripeOdd": "odd",
	"sStripeEven": "even",

	/* Empty row */
	"sRowEmpty": "dataTables_empty",

	/* Features */
	"sWrapper": "dataTables_wrapper",
	"sFilter": "dataTables_filter",
	"sInfo": "dataTables_info",
	"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
	"sLength": "dataTables_length",
	"sProcessing": "dataTables_processing",

	/* Sorting */
	"sSortAsc": "sorting_asc",
	"sSortDesc": "sorting_desc",
	"sSortable": "sorting", /* Sortable in both directions */
	"sSortableAsc": "sorting_asc_disabled",
	"sSortableDesc": "sorting_desc_disabled",
	"sSortableNone": "sorting_disabled",
	"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	"sSortJUIAsc": "",
	"sSortJUIDesc": "",
	"sSortJUI": "",
	"sSortJUIAscAllowed": "",
	"sSortJUIDescAllowed": "",
	"sSortJUIWrapper": "",
	"sSortIcon": "",

	/* Scrolling */
	"sScrollWrapper": "dataTables_scroll",
	"sScrollHead": "dataTables_scrollHead",
	"sScrollHeadInner": "dataTables_scrollHeadInner",
	"sScrollBody": "dataTables_scrollBody",
	"sScrollFoot": "dataTables_scrollFoot",
	"sScrollFootInner": "dataTables_scrollFootInner",

	/* Misc */
	"sHeaderTH": "",
	"sFooterTH": "",
	"sJUIHeader": "",
	"sJUIFooter": ""
} );


(function() {

// Reused strings for better compression. Closure compiler appears to have a
// weird edge case where it is trying to expand strings rather than use the
// variable version. This results in about 200 bytes being added, for very
// little preference benefit since it this run on script load only.
var _empty = '';
_empty = '';

var _stateDefault = _empty + 'ui-state-default';
var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';

$.extend( DataTable.ext.oJUIClasses, DataTable.ext.oStdClasses, {
	/* Full numbers paging buttons */
	"sPageButton":         "fg-button ui-button "+_stateDefault,
	"sPageButtonActive":   "ui-state-disabled",
	"sPageButtonDisabled": "ui-state-disabled",

	/* Features */
	"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
		"ui-buttonset-multi paging_", /* Note that the type is postfixed */

	/* Sorting */
	"sSortAsc":            _stateDefault+" sorting_asc",
	"sSortDesc":           _stateDefault+" sorting_desc",
	"sSortable":           _stateDefault+" sorting",
	"sSortableAsc":        _stateDefault+" sorting_asc_disabled",
	"sSortableDesc":       _stateDefault+" sorting_desc_disabled",
	"sSortableNone":       _stateDefault+" sorting_disabled",
	"sSortJUIAsc":         _sortIcon+"triangle-1-n",
	"sSortJUIDesc":        _sortIcon+"triangle-1-s",
	"sSortJUI":            _sortIcon+"carat-2-n-s",
	"sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
	"sSortJUIDescAllowed": _sortIcon+"carat-1-s",
	"sSortJUIWrapper":     "DataTables_sort_wrapper",
	"sSortIcon":           "DataTables_sort_icon",

	/* Scrolling */
	"sScrollHead": "dataTables_scrollHead "+_stateDefault,
	"sScrollFoot": "dataTables_scrollFoot "+_stateDefault,

	/* Misc */
	"sHeaderTH":  _stateDefault,
	"sFooterTH":  _stateDefault,
	"sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
	"sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
} );

}());

