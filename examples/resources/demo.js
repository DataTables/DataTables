
/*global SyntaxHighlighter*/

$(document).ready( function () {
	// Work around for WebKit bug 55740
	var info = $('div.info');

	if ( info.height() < 142 ) {
		info.css( 'height', '10em' );
	}

	var escapeHtml = function ( str ) {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	};

	// css
	var cssContainer = $('div.tabs div.css');
	if ( $.trim( cssContainer.find('pre').text() ) === '' ) {
		cssContainer.find('pre, p:eq(0), div').css('display', 'none');
	}

	// init html
	var table = $('<p/>').append( $('table').clone() ).html();
	$('div.tabs div.table').append(
		'<pre class="brush: html;">\t\t\t'+
			escapeHtml( table )+
		'</pre>'
	);
	//SyntaxHighlighter.highlight({}, $('#display-init-html')[0]);

	// json
	var ajaxTab = $('ul.tabs li').eq(3).css('display', 'none');

	$(document).on( 'init.dt', function ( e, settings ) {
		var api = new $.fn.dataTable.Api( settings );

		var show = function ( str ) {
			ajaxTab.css( 'display', 'block' );
			$('div.tabs div.ajax pre').remove();

			// Old IE :-|
			try {
				str = JSON.stringify( str, null, 2 );
			} catch ( e ) {}

			$('div.tabs div.ajax').append(
				'<pre class="brush: js;">'+str+'</pre>'
			);
			SyntaxHighlighter.highlight( {}, $('div.tabs div.ajax pre')[0] );
		};

		// First draw
		var json = api.ajax.json();
		if ( json ) {
			show( json );
		}

		// Subsequent draws
		api.on( 'xhr.dt', function ( e, settings, json ) {
			show( json );
		} );
	} );

	// Tabs
	$('ul.tabs li').click( function () {
		$('ul.tabs li.active').removeClass('active');
		$(this).addClass('active');

		$('div.tabs>div')
			.css('display', 'none')
			.eq( $(this).index() ).css('display', 'block');
	} );
	$('ul.tabs li.active').click();
} );



