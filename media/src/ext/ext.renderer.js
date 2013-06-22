

$.extend( true, DataTable.ext.renderer, {
	header: {
		_: function ( settings, cell, column, idx, classes ) {
			// No additional mark-up required

			// Attach a sort listener to update on sort
			$(settings.nTable).on( 'sort', function ( e, settings, sorting, columns ) {
				cell
					.removeClass(
						column.sSortingClass +' '+
						classes.sSortAsc +' '+
						classes.sSortDesc
					)
					.addClass( columns[ idx ] == 'asc' ?
						classes.sSortAsc : columns[ idx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);
			} );
		},

		jqueryui: function ( settings, cell, column, idx, classes ) {
			$('<div/>')
				.addClass( classes.sSortJUIWrapper )
				.append( cell.contents() )
				.append( $('<span/>')
					.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
				)
				.appendTo( cell );

			// Attach a sort listener to update on sort
			$(settings.nTable).on( 'sort', function ( e, settings, sorting, columns ) {
				cell
					.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
					.addClass( columns[ idx ] == 'asc' ?
						classes.sSortAsc : columns[ idx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);

				cell
					.find( 'span' )
					.removeClass(
						classes.sSortJUIAsc +" "+
						classes.sSortJUIDesc +" "+
						classes.sSortJUI +" "+
						classes.sSortJUIAscAllowed +" "+
						classes.sSortJUIDescAllowed
					)
					.addClass( columns[ idx ] == 'asc' ?
						classes.sSortJUIAsc : columns[ idx ] == 'desc' ?
							classes.sSortJUIDesc :
							column.sSortingClassJUI
					);
			} );
		}
	}
} );

