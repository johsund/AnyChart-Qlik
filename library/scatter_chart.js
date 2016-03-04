var viz = function($element, layout, self, qlik) {

var app = qlik.currApp();

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];
var lineIndexArray = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Metric1":d[1].qNum,
		"Metric2":d[2].qNum
	}
});

// create column chart
window['chart' + layout.qInfo.qId] = anychart.scatterChart();

//set chart palette
window['chart' + layout.qInfo.qId].palette(layout.theme);

// turn on chart animation
if(layout.chartanimate) {window['chart' + layout.qInfo.qId].animation(true);}
else {window['chart' + layout.qInfo.qId].animation(false);}

// set container id for the chart
window['chart' + layout.qInfo.qId].container('container_' + layout.qInfo.qId);

//console.log(layout.charttitle);
// set chart title
if(layout.charttitleshow) {window['chart' + layout.qInfo.qId].title(layout.charttitle)};

  window['chart' + layout.qInfo.qId].interactivity().hoverMode('bySpot');
  //window['chart' + layout.qInfo.qId].interactivity().spotRadius(1);
  window['chart' + layout.qInfo.qId].tooltip().displayMode('union');
  window['chart' + layout.qInfo.qId].tooltip().positionMode('point');

var myTestData = [];

//console.log(data.length);

for(i=0;i<data.length;i++) {
	var dataRow = [];
	//console.log(data[i].Metric1);
	dataRow[0] = data[i].Metric1;
	dataRow[1] = data[i].Metric2;
	dataRow[2] = data[i].Dim1;
	myTestData.push(dataRow);
}

//console.log(myTestData);

var dataSet = anychart.data.set(myTestData);

var map_data = dataSet.mapAs({x: [0], value: [1], dimvalue:[2]});

var marker = window['chart' + layout.qInfo.qId].marker(map_data).type('circle').size(4).hoverSize(7).hoverFill('gold').hoverStroke(anychart.color.darken('gold'));

  marker.tooltip().hAlign('start');
  marker.tooltip().textFormatter(function() {
    return 'Value: ' + this['value'] + " " + this['x'];
  });


marker.color(layout.theme[0]);



//chart.interactivity().hoverMode('byX');

// Axis titles - Picked from Dimension titles in Qlik
if(layout.ylabelshow) {window['chart' + layout.qInfo.qId].yAxis().title(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);}
if(layout.xlabelshow) {window['chart' + layout.qInfo.qId].xAxis().title(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);}

// Crosshair Y/N 
if(layout.crosshair) {var crosshair = window['chart' + layout.qInfo.qId].crosshair(); crosshair.enabled(true);}

// initiate chart drawing
window['chart' + layout.qInfo.qId].draw();


// add a listener
window['chart' + layout.qInfo.qId].listen("pointsSelect", function(e) {
//	console.log(e.point);
	var index = e.point.getIndex();
	var row = dataSet.row(index);

	var series = window['chart' + layout.qInfo.qId].getSeriesAt(0);
	//series.select(row);
	
	series.selectStroke("black");
	series.selectFill('gold');
	
	//console.log(row[2]);
	
	selvalues.push(row[2]);
	selvalues = $.unique(selvalues);
	
	//console.log(selvalues);
	
	lineIndexArray.push(index);
	lineIndexArray = $.unique(lineIndexArray);
	//console.log(lineIndexArray);
	//chart.select(row);
	series.select(lineIndexArray);
	

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
			lineIndexArray = [];
			
			qlik.resize();
			//viz($element, layout, self, app);
			
			// window['chart' + layout.qInfo.qId].removeSeriesAt(0);
			// window['chart' + layout.qInfo.qId].marker(map_data).type('circle').size(4).hoverSize(7).hoverFill('gold').hoverStroke(anychart.color.darken('gold'));

			
		});
	}
	
});

};