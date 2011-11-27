/*
 * File:        jquery.dataTables.js
 * Version:     1.8.3.dev
 * Description: Paginate, search and sort HTML tables
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Created:     28/3/2008
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point style
 * Project:     Mtaala
 * Contact:     allan.jardine@sprymedia.co.uk
 * 
 * Copyright 2008-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 * 
 * For details please refer to: http://www.datatables.net
 */

/*
 * When considering jsLint, we need to allow eval() as it it is used for reading cookies
 */
/*jslint evil: true, undef: true, browser: true */
/*globals $, jQuery,_fnExternApiFunc,_fnInitialise,_fnInitComplete,_fnLanguageProcess,_fnAddColumn,_fnColumnOptions,_fnAddData,_fnCreateTr,_fnGatherData,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnServerParams,_fnAddOptionsHtml,_fnFeatureHtmlTable,_fnScrollDraw,_fnAdjustColumnSizing,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnBuildSearchArray,_fnBuildSearchRow,_fnFilterCreateSearch,_fnDataToSearch,_fnSort,_fnSortAttachListener,_fnSortingClasses,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnFeatureHtmlLength,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnNodeToDataIndex,_fnVisbleColumns,_fnCalculateEnd,_fnConvertToWidth,_fnCalculateColumnWidths,_fnScrollingWidthAdjust,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnArrayCmp,_fnDetectType,_fnSettingsFromNode,_fnGetDataMaster,_fnGetTrNodes,_fnGetTdNodes,_fnEscapeRegex,_fnDeleteIndex,_fnReOrderIndex,_fnColumnOrdering,_fnLog,_fnClearTable,_fnSaveState,_fnLoadState,_fnCreateCookie,_fnReadCookie,_fnDetectHeader,_fnGetUniqueThs,_fnScrollBarWidth,_fnApplyToChildren,_fnMap,_fnGetRowData,_fnGetCellData,_fnSetCellData,_fnGetObjectDataFn,_fnSetObjectDataFn*/

(function($, window, document) {
	require('ext.js');
	require('ext.classes.js');
	require('ext.paging.js');
	require('ext.sorting.js');
	require('ext.types.js');

	/** 
	 * DataTables is a plug-in for the jQuery Javascript library. It is a 
	 * highly flexible tool, based upon the foundations of progressive 
	 * enhancement, which will add advanced interaction controls to any 
	 * HTML table. For a full list of features please refer to
	 * <a href="http://datatables.net">DataTables.net</a>.
	 *  @class
	 *  @constructor
	 *  @param {object} [oInit={}] Configuration object for DataTables. Options
	 *    are defined by {@link FixedColumns.defaults}
	 *  @requires jQuery 1.3+
	 * 
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *  
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "bPaginate": false,
	 *        "bSort": false 
	 *      } );
	 *    } );
	 */
	var DataTable = function( oInit )
	{
		require('core.columns.js');
		require('core.data.js');
		require('core.draw.js');
		require('core.filter.js');
		require('core.info.js');
		require('core.init.js');
		require('core.length.js');
		require('core.page.js');
		require('core.processing.js');
		require('core.scrolling.js');
		require('core.sizing.js');
		require('core.sort.js');
		require('core.state.js');
		require('core.support.js');

		require('api.methods.js');
		require('api.internal.js');
		
		var _that = this;
		return this.each(function() {
			require('core.constructor.js');
		} );
	};

	DataTable.models = {};
	require('model.search.js');
	require('model.row.js');
	require('model.column.js');
	require('model.init.js');
	require('model.settings.js');

	DataTable.ext = {};

	// jQuery aliases
	$.fn.dataTable = DataTable;
	$.fn.dataTableSettings = _aoSettings;
	$.fn.dataTableExt = _oExt;

})(jQuery, window, document);
