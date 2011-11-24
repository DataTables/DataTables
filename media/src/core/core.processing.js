

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - Feature: Processing incidator
 */

/*
 * Function: _fnFeatureHtmlProcessing
 * Purpose:  Generate the node required for the processing node
 * Returns:  node
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnFeatureHtmlProcessing ( oSettings )
{
	var nProcessing = document.createElement( 'div' );
	
	if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.r == "undefined" )
	{
		nProcessing.setAttribute( 'id', oSettings.sTableId+'_processing' );
	}
	nProcessing.innerHTML = oSettings.oLanguage.sProcessing;
	nProcessing.className = oSettings.oClasses.sProcessing;
	oSettings.nTable.parentNode.insertBefore( nProcessing, oSettings.nTable );
	
	return nProcessing;
}

/*
 * Function: _fnProcessingDisplay
 * Purpose:  Display or hide the processing indicator
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 *           bool:
 *   true - show the processing indicator
 *   false - don't show
 */
function _fnProcessingDisplay ( oSettings, bShow )
{
	if ( oSettings.oFeatures.bProcessing )
	{
		var an = oSettings.aanFeatures.r;
		for ( var i=0, iLen=an.length ; i<iLen ; i++ )
		{
			an[i].style.visibility = bShow ? "visible" : "hidden";
		}
	}
}
