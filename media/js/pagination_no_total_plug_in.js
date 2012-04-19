

jQuery.fn.dataTableExt.oPagination.no_total = 
    {
		/*
         * Variable: no_total
         * Purpose:  Pagination with first/previous/next buttons without previous knowledge of the total number of entries
         * Scope:    jQuery.fn.dataTableExt
         */
		"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
		{

			nFirst = document.createElement( 'span' );
			nPrevious = document.createElement( 'span' );
			nNext = document.createElement( 'span' );

			cl = oSettings.oClasses;

			nFirst.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sFirst ) );
			nPrevious.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sPrevious ) );
			nNext.appendChild( document.createTextNode( oSettings.oLanguage.oPaginate.sNext ) );
			
			nFirst.className = cl.sPageButton + " " + cl.sPageFirst;
			nPrevious.className = cl.sPageButton + " "+ cl.sPagePrevious;
			nNext.className= cl.sPageButton + " " +  cl.sPageNext;
			
			nPaging.appendChild( nFirst );
			nPaging.appendChild( nPrevious );
			nPaging.appendChild( nNext );
			
			$(nFirst).click( function () {
				if($(this).hasClass(cl.sPageButtonActive))
				{
					oSettings.oApi._fnPageChange( oSettings, "first" );
					fnCallbackDraw( oSettings );
				}
			});
			
			$(nPrevious).click( function() {
				if($(this).hasClass(cl.sPageButtonActive))
				{
					oSettings.oApi._fnPageChange( oSettings, "previous" );
					fnCallbackDraw( oSettings );
				}
			} );
			
			$(nNext).click( function() {
				if($(this).hasClass(cl.sPageButtonActive))
				{
					oSettings.oApi._fnPageChange( oSettings, "next" );
					fnCallbackDraw( oSettings );
				}
			} );
			
			/* Disallow text selection */
			$(nFirst).bind( 'selectstart', function () { return false; } );
			$(nPrevious).bind( 'selectstart', function () { return false; } );
			$(nNext).bind( 'selectstart', function () { return false; } );
		},
		
		
	    "fnUpdate": function ( oSettings, fnCallbackDraw )
	    {
			if ( !oSettings.aanFeatures.p )
			{
				return;
			}
			
			oClasses = oSettings.oClasses;

			/* Loop over each instance of the pager */
			var an = oSettings.aanFeatures.p;
			for ( var i=0, iLen=an.length ; i<iLen ; i++ )
			{
				var buttons = an[i].getElementsByTagName('span');
				if ( oSettings._iDisplayStart === 0 )
				{
					buttons[0].className = oClasses.sPageButtonStaticDisabled + " " + oClasses.sPageFirst;
					buttons[1].className = oClasses.sPageButtonStaticDisabled + " " + oClasses.sPagePrevious;	
				}
				else
				{
					buttons[0].className = oClasses.sPageButton + " " + oClasses.sPageButtonActive + " " + oClasses.sPageFirst;
					buttons[1].className = oClasses.sPageButton + " " + oClasses.sPageButtonActive + " " + oClasses.sPagePrevious;
				}
				
				if ( isNaN(oSettings.fnRecordsDisplay()) || !(oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay()))
				{
					buttons[2].className = oClasses.sPageButton + " " + oClasses.sPageButtonActive + " " + oClasses.sPageNext
				}
				else
				{
					buttons[2].className = oClasses.sPageButtonStaticDisabled + " " + oClasses.sPageNext;
				}
			}
		}
    }