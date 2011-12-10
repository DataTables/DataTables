
/*
 * Variable: oPagination
 * Purpose:  
 * Scope:    jQuery.fn.dataTableExt
 */
$.extend( DataTable.ext.oPagination, {
	/*
	 * Variable: two_button
	 * Purpose:  Standard two button (forward/back) pagination
	 * Scope:    jQuery.fn.dataTableExt.oPagination
	 */
	"two_button": {
		/*
		 * Function: oPagination.two_button.fnInit
		 * Purpose:  Initialise dom elements required for pagination with forward/back buttons only
		 * Returns:  -
		 * Inputs:   object:oSettings - dataTables settings object
		 *           node:nPaging - the DIV which contains this pagination control
		 *           function:fnCallbackDraw - draw function which must be called on update
		 */
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
		{
			var oLang = oSettings.oLanguage.oPaginate;
			var oClasses = oSettings.oClasses;
			var fnClickHandler = function ( e ) {
				if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
				{
					fnCallbackDraw( oSettings );
				}
			};

			var sAppend = (!oSettings.bJUI) ?
				'<div title="'+oLang.sPrevious+'" class="'+oSettings.oClasses.sPagePrevDisabled+'" tabindex="0" role="button">'+oLang.sPrevious+'</div>'+
				'<div title="'+oLang.sNext+'"     class="'+oSettings.oClasses.sPageNextDisabled+'" tabindex="0" role="button">'+oLang.sNext+'</div>'
				:
				'<div tabindex="0" title="'+oLang.sPrevious+'" class="'+oSettings.oClasses.sPagePrevDisabled+'"><span class="'+oSettings.oClasses.sPageJUIPrev+'"></span></div>'+
				'<div tabindex="0" title="'+oLang.sNext+'"     class="'+oSettings.oClasses.sPageNextDisabled+'"><span class="'+oSettings.oClasses.sPageJUINext+'"></span></div>';
			$(nPaging).append( sAppend );
			
			var els = $('div', nPaging);
			var nPrevious = els[0],
				nNext = els[1]
			
			$(nPrevious)
				.bind( 'click.DT', { action: "previous" }, fnClickHandler )
				.bind( 'keypress.DT', { action: "previous" }, function (e){
					if ( e.which === 13 ) {
						fnClickHandler(e);
					} } )
				.bind( 'selectstart.DT', function () { return false; } ); /* Take the brutal approach to cancelling text selection */
			$(nNext)
				.bind( 'click.DT', { action: "next" }, fnClickHandler )
				.bind( 'keypress.DT', { action: "next" }, function (e){
					if ( e.which === 13 ) {
						fnClickHandler(e);
					} } )
				.bind( 'selectstart.DT', function () { return false; } );
			
			/* ID the first elements only */
			if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.p == "undefined" )
			{
				nPaging.id = oSettings.sTableId+'_paginate';
				nPrevious.id = oSettings.sTableId+'_previous';
				nNext.id = oSettings.sTableId+'_next';

				nPrevious.setAttribute('aria-controls', oSettings.sTableId);
				nNext.setAttribute('aria-controls', oSettings.sTableId);
			}
		},
		
		/*
		 * Function: oPagination.two_button.fnUpdate
		 * Purpose:  Update the two button pagination at the end of the draw
		 * Returns:  -
		 * Inputs:   object:oSettings - dataTables settings object
		 *           function:fnCallbackDraw - draw function to call on page change
		 */
		"fnUpdate": function ( oSettings, fnCallbackDraw )
		{
			if ( !oSettings.aanFeatures.p )
			{
				return;
			}
			
			var oClasses = oSettings.oClasses;
			var an = oSettings.aanFeatures.p;

			/* Loop over each instance of the pager */
			for ( var i=0, iLen=an.length ; i<iLen ; i++ )
			{
				if ( an[i].childNodes.length !== 0 )
				{
					an[i].childNodes[0].className = ( oSettings._iDisplayStart === 0 ) ? 
						oClasses.sPagePrevDisabled : oClasses.sPagePrevEnabled;
					
					an[i].childNodes[1].className = ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() ) ? 
						oClasses.sPageNextDisabled : oClasses.sPageNextEnabled;
				}
			}
		}
	},
	
	
	/*
	 * Variable: iFullNumbersShowPages
	 * Purpose:  Change the number of pages which can be seen
	 * Scope:    jQuery.fn.dataTableExt.oPagination
	 */
	"iFullNumbersShowPages": 5,
	
	/*
	 * Variable: full_numbers
	 * Purpose:  Full numbers pagination
	 * Scope:    jQuery.fn.dataTableExt.oPagination
	 */
	"full_numbers": {
		/*
		 * Function: oPagination.full_numbers.fnInit
		 * Purpose:  Initialise dom elements required for pagination with a list of the pages
		 * Returns:  -
		 * Inputs:   object:oSettings - dataTables settings object
		 *           node:nPaging - the DIV which contains this pagination control
		 *           function:fnCallbackDraw - draw function which must be called on update
		 */
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
		{
			var oLang = oSettings.oLanguage.oPaginate;
			var oClasses = oSettings.oClasses;
			var fnClickHandler = function ( e ) {
				if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
				{
					fnCallbackDraw( oSettings );
				}
			};

			$(nPaging).append(
				'<a class="'+oClasses.sPageButton+" "+oClasses.sPageFirst+'">'+oLang.sFirst+'</a>'+
				'<a class="'+oClasses.sPageButton+" "+oClasses.sPagePrevious+'">'+oLang.sPrevious+'</a>'+
				'<span></span>'+
				'<a class="'+oClasses.sPageButton+" "+oClasses.sPageNext+'">'+oLang.sNext+'</a>'+
				'<a class="'+oClasses.sPageButton+" "+oClasses.sPageLast+'">'+oLang.sLast+'</a>'
			);
			var els = $('a', nPaging);
			var nFirst = els[0],
				nPrev = els[1],
				nNext = els[2],
				nLast = els[3];
			
			$(nFirst).bind( 'click.DT', { action: "first" }, fnClickHandler );
			$(nPrev).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(nNext).bind( 'click.DT', { action: "next" }, fnClickHandler );
			$(nLast).bind( 'click.DT', { action: "last" }, fnClickHandler );
			
			/* Take the brutal approach to cancelling text selection */
			$('span', nPaging)
				.bind( 'mousedown.DT', function () { return false; } )
				.bind( 'selectstart.DT', function () { return false; } );
			
			/* ID the first elements only */
			if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.p == "undefined" )
			{
				nPaging.id = oSettings.sTableId+'_paginate';
				nFirst.id =oSettings.sTableId+'_first';
				nPrev.id =oSettings.sTableId+'_previous';
				nNext.id =oSettings.sTableId+'_next';
				nLast.id =oSettings.sTableId+'_last';
			}
		},
		
		/*
		 * Function: oPagination.full_numbers.fnUpdate
		 * Purpose:  Update the list of page buttons shows
		 * Returns:  -
		 * Inputs:   object:oSettings - dataTables settings object
		 *           function:fnCallbackDraw - draw function to call on page change
		 */
		"fnUpdate": function ( oSettings, fnCallbackDraw )
		{
			if ( !oSettings.aanFeatures.p )
			{
				return;
			}
			
			var iPageCount = DataTable.ext.oPagination.iFullNumbersShowPages;
			var iPageCountHalf = Math.floor(iPageCount / 2);
			var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
			var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
			var sList = "";
			var iStartButton, iEndButton, i, iLen;
			var oClasses = oSettings.oClasses;
			
			/* Pages calculation */
			if (iPages < iPageCount)
			{
				iStartButton = 1;
				iEndButton = iPages;
			}
			else if (iCurrentPage <= iPageCountHalf)
			{
				iStartButton = 1;
				iEndButton = iPageCount;
			}
			else if (iCurrentPage >= (iPages - iPageCountHalf))
			{
				iStartButton = iPages - iPageCount + 1;
				iEndButton = iPages;
			}
			else
			{
				iStartButton = iCurrentPage - Math.ceil(iPageCount / 2) + 1;
				iEndButton = iStartButton + iPageCount - 1;
			}
			
			/* Build the dynamic list */
			for ( i=iStartButton ; i<=iEndButton ; i++ )
			{
				sList += (iCurrentPage !== i) ?
					'<a class="'+oClasses.sPageButton+'">'+oSettings.fnFormatNumber(i)+'</a>' :
					'<a class="'+oClasses.sPageButtonActive+'">'+oSettings.fnFormatNumber(i)+'</a>';
			}
			
			/* Loop over each instance of the pager */
			var an = oSettings.aanFeatures.p;
			var anButtons, anStatic, nPaginateList;
			var fnClick = function(e) {
				/* Use the information in the element to jump to the required page */
				var iTarget = (this.innerHTML * 1) - 1;
				oSettings._iDisplayStart = iTarget * oSettings._iDisplayLength;
				fnCallbackDraw( oSettings );
				e.preventDefault();
			};
			var fnFalse = function () { return false; };
			
			for ( i=0, iLen=an.length ; i<iLen ; i++ )
			{
				if ( an[i].childNodes.length === 0 )
				{
					continue;
				}
				
				/* Build up the dynamic list forst - html and listeners */
				var qjPaginateList = $('span:eq(0)', an[i]);
				qjPaginateList.html( sList );
				$('a', qjPaginateList)
					.bind( 'click.DT', fnClick )
					.bind( 'mousedown.DT', fnFalse )
					.bind( 'selectstart.DT', fnFalse );
				
				/* Update the 'premanent botton's classes */
				anButtons = an[i].getElementsByTagName('a');
				anStatic = [
					anButtons[0], anButtons[1], 
					anButtons[anButtons.length-2], anButtons[anButtons.length-1]
				];
				$(anStatic).removeClass( oClasses.sPageButton+" "+oClasses.sPageButtonActive+" "+oClasses.sPageButtonStaticDisabled );
				if ( iCurrentPage == 1 )
				{
					anStatic[0].className += " "+oClasses.sPageButtonStaticDisabled;
					anStatic[1].className += " "+oClasses.sPageButtonStaticDisabled;
				}
				else
				{
					anStatic[0].className += " "+oClasses.sPageButton;
					anStatic[1].className += " "+oClasses.sPageButton;
				}
				
				if ( iPages === 0 || iCurrentPage == iPages || oSettings._iDisplayLength == -1 )
				{
					anStatic[2].className += " "+oClasses.sPageButtonStaticDisabled;
					anStatic[3].className += " "+oClasses.sPageButtonStaticDisabled;
				}
				else
				{
					anStatic[2].className += " "+oClasses.sPageButton;
					anStatic[3].className += " "+oClasses.sPageButton;
				}
			}
		}
	}
} );
