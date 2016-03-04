var viz = function($element, layout, self, qlik) {

var app = qlik.currApp();

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Metric1":d[1].qNum
	}
});

var myData = [];
$.each(data, function(index, value) {
	var myObject = new Object();
	myObject.x = data[index].Dim1;
	myObject.value = data[index].Metric1;
	myData.push(myObject);
});

var dataSet = anychart.data.set(myData);

// create pie chart
window['chart' + layout.qInfo.qId] = anychart.pie(dataSet);

//set chart palette
window['chart' + layout.qInfo.qId].palette(layout.theme);

window['chart' + layout.qInfo.qId].innerRadius("50%");

// turn on chart animation
if(layout.chartanimate) {window['chart' + layout.qInfo.qId].animation(true);}
else {window['chart' + layout.qInfo.qId].animation(false);}

// set container id for the chart
window['chart' + layout.qInfo.qId].container('container_' + layout.qInfo.qId);

//console.log(layout.charttitle);
// set chart title
if(layout.charttitleshow) {window['chart' + layout.qInfo.qId].title(layout.charttitle)};

// Crosshair Y/N 
if(layout.crosshair) {var crosshair = window['chart' + layout.qInfo.qId].crosshair(); crosshair.enabled(true); crosshair.xStroke(null);}

//set labels on data points
if(layout.dataonpoints) {window['chart' + layout.qInfo.qId].labels().position('outside')};

// initiate chart drawing
window['chart' + layout.qInfo.qId].draw();

// add a listener
window['chart' + layout.qInfo.qId].listen("pointClick", function(e) {

	var index = e.point.getIndex();
	var row = dataSet.row(index);
	
	
	selvalues.push(row.x);
	selvalues = $.unique(selvalues);
	
	if(row.fillOld) {
		row.fill = row.fillOld;
		delete row.fillOld;
		//console.log(row.x);
		selvalues = jQuery.grep(selvalues, function(value) {
		  return value != row.x;
		});
		console.log(selvalues);
		window['chart' + layout.qInfo.qId].explodeSlice(row,false);
	}
	else {
		row.fillOld = row.fill;
		row.fill = anychart.color.darken(row.fill, 0.4); 
		window['chart' + layout.qInfo.qId].explodeSlice(row,true);
	}
	//dataSet.row(index, row);
	
		var selBoxName = "selectBox_" + layout.qInfo.qId;
		var confSelName = "confirmSelect_" + layout.qInfo.qId;	
		var canSelName = "cancelSelect_" + layout.qInfo.qId;		
	
	if (document.getElementById(selBoxName)) {
	}
	else {
		$("#container_" + layout.qInfo.qId).append("<div id='"+selBoxName+"' style='display:block;position:absolute;top:20px;right:20px;height:30px;width:90px;z-index:10000;border:1px;'></div>");
		
		 $("#" + selBoxName).append(
		"<button id='"+confSelName+"' style='float:left;display:inline-block;' tid='selection-toolbar.refresh' qva-activate='buttonAction($event, button)' q-title-translation='Tooltip.ConfirmSelections' ng-disabled='buttonIsDisabled(button)' class='sel-toolbar-btn sel-toolbar-confirm' ng-class='[button.buttonClass, button.isIcon ? 'sel-toolbar-icon' : '', button.isActive(this) ? 'menu-active' : '']' title='Confirm selection'>" +
			"<span class='sel-toolbar-span-icon icon-tick' ng-class='button.iconClass'></span>" +
		"</button>"
		);
		$("#"+confSelName).click(function(){
			if(layout.qHyperCube.qDimensionInfo[0].qDimensionType=="N") {
				
				var lookupArray = [];
				var linkArray = [];
				
				$.each(layout.qHyperCube.qDataPages[0].qMatrix, function(index) {
					if($.inArray(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qElemNumber, lookupArray) === -1 ){
						lookupArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qElemNumber);
						linkArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qText);
					}
				});
				
				var selectionValues = [];
				$.each(selvalues, function(index, value) {
					//console.log(value);
					var a = linkArray.indexOf(value);
					//console.log(a);
					if(a >=0) {
						selectionValues.push(lookupArray[a]);
					}
				});
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).select(selectionValues, false, false);
			}
			else {
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).selectValues(selvalues, false, false);
			}

			$("#container_" + layout.qInfo.qId).remove();
		});
	}
	
	if (document.getElementById(canSelName)) {
	}
	else {

		
		$("#" + selBoxName).append(
		"<button id='"+canSelName+"' style='float:left;display:inline-block;' tid='selection-toolbar.undo' qva-activate='buttonAction($event, button)' q-title-translation='Tooltip.CancelSelections' ng-disabled='buttonIsDisabled(button)' class='sel-toolbar-btn sel-toolbar-cancel' ng-class='[button.buttonClass, button.isIcon ? 'sel-toolbar-icon' : '', button.isActive(this) ? 'menu-active' : '']' title='Cancel selection'>" +
			"<span class='sel-toolbar-span-icon icon-cancel' ng-class='button.iconClass'></span>" +
		"</button>"
		);
		$("#" + canSelName).click(function(){
			selvalues = [];
			
			qlik.resize();
			//viz($element, layout, self, app);
			
			// console.log(dataSet.row.length);
			
			// for(i=0;i<=dataSet.row.length;i++) {
				// if(dataSet.row(i))
				// {
					// //dataSet.row(i).fill = (layout.dim1color);
					// delete dataSet.row(i).fillOld;
					// dataSet.row(i, dataSet.row(i));
				// }
			// }

			
		});
	}
	
});

};