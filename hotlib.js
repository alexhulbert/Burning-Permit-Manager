function getStates() {
	return ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','MA','ME','MD','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];	
}

var tpl = [rules.defaults.address, rules.defaults.city, rules.defaults.state, rules.defaults.name, rules.defaults.phone];


function isEmptyRow(instance, row) {
  var rowData = instance.getData()[row];
  for (var i = 0, ilen = rowData.length; i < ilen; i++) {
    if (rowData[i] !== null) {
      return false;
    }
  }
  return true;
}

function defaultValueRenderer(instance, td, row, col, prop, value, cellProperties) {
  var args = $.extend(true, [], arguments);
  if (args[5] === null && isEmptyRow(instance, row)) {
    args[5] = tpl[col];
    td.style.color = '#999';
  }
  else {
    td.style.color = '';
  }
  Handsontable.renderers.TextRenderer.apply(this, args);
}


var _beforeChange = function(changes) {
    var instance = $('#table').data('handsontable');
    var i;
    var ilen = changes.length;
    var c;
    var clen = instance.colCount;
    var rowColumnSeen = {};
    var rowsToFill = {};
		
    for (i = 0; i < ilen; i++) {
      	if (changes[i][2] === null && changes[i][3] !== null) {
        	if (isEmptyRow(instance, changes[i][0])) {
          		rowColumnSeen[changes[i][0] + '/' + changes[i][1]] = true;
          		rowsToFill[changes[i][0]] = true;
       		}
      	}
    }
	
    for (var r in rowsToFill) {
      	if (rowsToFill.hasOwnProperty(r)) {
        	for (c = 0; c < clen; c++) {
          		if (!rowColumnSeen[r + '/' + c]) {
            		changes.push([r, c, null, tpl[c]]);
          		}
        	}
    	}
  	}
}

var _cells = function (row, col, prop) {
	var cellProperties = {};
	cellProperties.renderer = defaultValueRenderer;
	return cellProperties;
}
