function tutorial() {
	
	if (ie()) {
		alert(
			'Sorry, the interactive tutorial is not supported in Internet Explorer.\n' +
			'To view it, please open this page again in either Firefox or Chrome.'
		);
		return;
	}
	$('.htCore thead tr th:nth-child(1)').attr('id', 'h_address');
	$('.htCore thead tr th:nth-child(2)').attr('id', 'h_city');
	$('.htCore thead tr th:nth-child(3)').attr('id', 'h_state');
	$('.htCore thead tr th:nth-child(4)').attr('id', 'h_name');
	$('.htCore thead tr th:nth-child(5)').attr('id', 'h_phone');
	
	$('#tutorial').button('loading');
	var tour = new Shepherd.Tour({
		defaults: {
			classes: 'shepherd-theme-arrows',
			scrollTo: true
		}
	});
	
	var buttons = [
		{
			text: 'Cancel',
			action: function() {
				tour.cancel();
				$('#tutorial').button('reset');
			}
		},
		{
			text: 'Back',
			action: function() {
				tour.back();
				if (!$(tour.getCurrentStep().el).hasClass('shepherd-open shepherd-enabled')) {
					$('#tutorial').button('reset');
				}
			}
		},
		{
			text: 'Next',
			action: tour.next
		}
	];
	
	var buttons_done = [
		{
			text: 'Done',
			action: function() {
				tour.next();
				$('#tutorial').button('reset');
			}
		}
	];

	tour.addStep('welcome', {
		title: 'Welcome!',
		text: 'Welcome to the burning permit manager!<br>Click "Next" to continue the tutorial, or "Cancel" to exit.',
		attachTo: {
			element: '#title',
			on: 'bottom'
		},
		buttons: buttons
	});
	
	tour.addStep('table', {
		title: 'The table',
		text: 'This is where you\'ll be entering your data.<br>All data gets autosaved as you type, so you don\'t need to worry about saving.',
		attachTo: {
			element: '.htCore',
			on: 'bottom'
		},
		buttons: buttons
	});
	
	tour.addStep('address', {
		title: 'Your Address',
		text: 'The first thing you\'ll want to enter is the address. This field is required.<br>Addresses can be in the form of "Agawam Fire Department" or "800 Main St."',
		attachTo: {
			element: '#h_address',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('city', {
		title: 'Your City',
		text: 'Next is the city. This is optional, but highly reccomended.',
		attachTo: {
			element: '#h_city',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('state', {
		title: 'Your State',
		text: 'This is the state of your location.<br>This defaults to Massachusetts, so you can leave it blank if you want.',
		attachTo: {
			element: '#h_state',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('name', {
		title: 'Name',
		text: 'This is used to distinguish each entry on the table.<br>It\'s not required, but very useful.',
		attachTo: {
			element: '#h_name',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('name', {
		title: 'Phone Number',
		text: 'Whether or not you want to include this field is entirely up to you.<br>All phone numbers should be in the form of 413-123-4567 or (413)123-4567.',
		attachTo: {
			element: '#h_phone',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('makemap', {
		title: 'Generate Map',
		text: 'After adding your locations, you will need to plot your map.<br>This button geolocates the data in the table.',
		attachTo: {
			element: '#mapGen',
			on: 'top'
		},
		buttons: buttons
	});
	
	tour.addStep('print', {
		title: 'Print Map',
		text: 'This opens a dialog for printing your map.<br>Be sure to click "Generate Map"' + (rules.experimentalPrint ? ' and allow popups' : '') +  ' before using this.<br>This works best in Chrome.',
		attachTo: {
			element: '#mapPrint',
			on: 'top'
		},
		buttons: buttons
	});
	
	tour.addStep('map', {
		title: 'Map',
		text: 'After clicking "Generate Map," all of your data will appear here.',
		attachTo: {
			element: '#mapCanvas',
			on: 'left'
		},
		buttons: buttons
	});
	
	tour.addStep('fullscreen', {
		title: 'Expand Map',
		text: 'To view your map in fullscreen, click this button.',
		attachTo: {
			element: '#fullScreen',
			on: 'left'
		},
		buttons: buttons
	});
	
	tour.addStep('resetbounds', {
		title: 'Reset Map',
		text: 'This button will reset the orientation of the map so that all the pins are visible.',
		attachTo: {
			element: '#resetBounds',
			on: 'right'
		},
		buttons: buttons
	});
	
	tour.addStep('date', {
		title: 'Load Saved Map',
		text: 'This lets you load previous burning permits.<br>Click the calandar button (left) to pick a date.',
		attachTo: {
			element: '#dateForm',
			on: 'bottom'
		},
		buttons: buttons
	});
	
	tour.addStep('load', {
		title: 'Load Saved Map',
		text: 'Once you\'ve selected a date, click this to load it onto the table.<br>Note: Tables from previous dates are not saved.',
		attachTo: {
			element: '#mapLoad',
			on: 'bottom'
		},
		buttons: buttons
	});
	
	tour.addStep('add', {
		title: 'Add Map',
		text: 'To add a future burning permit record, click here. Today\'s date has already been added for you',
		attachTo: {
			element: '#dateForm .btn-success',
			on: 'left'
		},
		buttons: buttons
	});
	
	tour.addStep('end', {
		title: 'Done',
		text: 'That\'s all there is to it!<br>You can click this button at any time to replay the tutorial',
		attachTo: {
			element: '#tutorial i',
			on: 'bottom'
		},
		buttons: buttons_done
	});
	
	tour.start();
}
