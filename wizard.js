function addMap() {
	wizard = '\
	<div>\
		<div class="vex-custom-field-wrapper">\
			<div class="input-group input-group-lg date vex-custom-input-wrapper" data-date-format="mm-dd-yyyy" id="wizard">\
				<span class="input-group-btn add-on" id="wizardBtn">\
					<button class="btn btn-default" type="button">\
						<i class="glyphicon glyphicon-calendar"></i>\
					</button>\
				</span>\
				<input class="form-control" type="text" value="" name="date" id="vexDate" readonly>\
			</div>\
		</div>\
	';
	vex.defaultOptions.className = 'vex-theme-os';
	vex.dialog.open({
		message: 'Please select the dates you wish to add:',
		input: wizard,
		callback: function(data) {
			if (data !== false) {
				save_table();
				var b64json = '[["","","","",""]]';
				b64json = btoa(b64json).replace(/=/, '.').replace(/\//, '_');
				for (var i = 0; i < data.date.split(',').length; i++) {
					$.ajax({
						type: 'get',
						url: 'arch.php',
						data: { 
							'data': b64json,
							'date': data.date.split(', ')[i]
						},
						success: flush
					});
				}
			}
		},
		afterOpen: function(data) {
			setTimeout(function() {
				$('#dateForm').datepicker('hide');
				
			},1);
			var tomorrow = new Date(+new Date() + 86.4e6);
			var wiz = $('#wizard');
			wiz.datepicker({
				multidate: true,
				startDate: tomorrow,
				multidateSeparator: ', ',
				beforeShowDay: function(c) {return !dateCheck(c);}
			}).on('changeDate', function(ev) {
				$('#vexDate').attr('value', day(ev.date));
			});
			$('#vexDate').attr('value', day(tomorrow));
			wiz.datepicker('setValue', day(tomorrow));
			wiz.datepicker('hide');
		}
	});
}
