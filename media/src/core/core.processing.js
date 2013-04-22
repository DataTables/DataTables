

/**
 * Generate the node required for the processing node
 *  @param {object} settings dataTables settings object
 *  @returns {node} Processing element
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlProcessing ( settings )
{
	return $('<div/>', {
			'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
			'class': settings.oClasses.sProcessing
		} )
		.html( settings.oLanguage.sProcessing )
		.insertBefore( settings.nTable )[0];
}


/**
 * Display or hide the processing indicator
 *  @param {object} settings dataTables settings object
 *  @param {bool} show Show the processing indicator (true) or not (false)
 *  @memberof DataTable#oApi
 */
function _fnProcessingDisplay ( settings, show )
{
	if ( settings.oFeatures.bProcessing ) {
		$(settings.aanFeatures.r).css( 'visibility', show ? 'visible' : 'hidden' );
	}

	$(settings.oInstance).trigger('processing', [settings, show]);
}

