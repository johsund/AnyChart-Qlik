var viz = function($element, layout, self, app) {

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Metric1":d[1].qNum
	}
});

// create column chart
chart = anychart.column();

 window['chart' + layout.qInfo.qId] = "variable test";
console.log(window['chart' + layout.qInfo.qId]);

//set chart palette
chart.palette(layout.theme);

// turn on chart animation
if(layout.chartanimate) {chart.animation(true);}
else {chart.animation(false);}

// set container id for the chart
chart.container('container_' + layout.qInfo.qId);

//console.log(layout.charttitle);
// set chart title
if(layout.charttitleshow) {chart.title(layout.charttitle)};

var myData = [];
$.each(data, function(index, value) {
	var myObject = new Object();
	myObject.x = data[index].Dim1;
	myObject.value = data[index].Metric1;
	myData.push(myObject);
});

//console.log(seriesObj.point);

//console.log(myData);

var dataSet = anychart.data.set(myData);

for(i=0;i<=dataSet.row.length;i++) {
	if(dataSet.row(i))
	{
		dataSet.row(i).fill = layout.theme[0];
	}
}

var series = chart.column(dataSet);
series.tooltip().enabled(false);
series.tooltip().enabled(true);

  // var labels = series.labels();
  // labels.enabled(true);
  // labels.position("top");
  // labels.rotation(0);
  // labels.anchor("top");
  // labels.fontColor("#444");
  // labels.fontWeight(200);


//series.hoverStroke("#031c31", 2);
//series.color(layout.theme[0]);

series.tooltip().titleFormatter(function() {
    return this.x
});
series.tooltip().textFormatter(function() {
    return '$' + parseInt(this.value).toLocaleString()
});
series.tooltip().position('top').anchor('bottom').offsetX(0).offsetY(5);

// set scale minimum
chart.yScale().minimum(0);

// set yAxis labels formatter
chart.yAxis().labels().textFormatter(function(){
    return this.value.toLocaleString();
});

chart.tooltip().positionMode('point');
chart.interactivity().hoverMode('byX');

// Axis titles - Picked from Dimension titles in Qlik
if(layout.ylabelshow) {chart.yAxis().title(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);}
if(layout.xlabelshow) {chart.xAxis().title(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);}


// initiate chart drawing
chart.draw();

// add a listener
chart.listen("pointClick", function(e) {

	var index = e.point.getIndex();
	var row = dataSet.row(index);
	
	
	selvalues.push(row.x);
	selvalues = $.unique(selvalues);
	
	if(row.fillOld) {
		row.fill = row.fillOld;
		delete row.fillOld;
		console.log(row.x);
		selvalues = jQuery.grep(selvalues, function(value) {
		  return value != row.x;
		});
		console.log(selvalues);
	}
	else {
		row.fillOld = row.fill;
		row.fill = anychart.color.darken(layout.theme[0], 0.4); 
	}
	dataSet.row(index, row);
	
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
			app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).selectValues(selvalues, false, false);
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
			
			//console.log(dataSet.row.length);
			
			for(i=0;i<=dataSet.row.length;i++) {
				if(dataSet.row(i))
				{
					dataSet.row(i).fill = (layout.theme[0]);
					delete dataSet.row(i).fillOld;
					dataSet.row(i, dataSet.row(i));
				}
			}
			
			chart.removeSeriesAt(0);
			series = chart.column(dataSet);
			//series.hoverStroke("#031c31", 2);
			series.color(layout.theme[0]);
			$("#"+selBoxName).remove();
			
		});
	}
	
});

};