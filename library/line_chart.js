var viz = function($element, layout, self, qlik) {

var app = qlik.currApp();

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];
var lineIndexArray = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Metric1":d[1].qNum
	}
});

// create column chart
window['chart' + layout.qInfo.qId] = anychart.line();

//set chart palette
window['chart' + layout.qInfo.qId].palette(layout.theme);

//Enable scrollbar
if(layout.datascroll) {
	
	//console.log(parseInt(layout.scrollaftermax));
    var xZoom = window['chart' + layout.qInfo.qId].xZoom(); //works

    // Zooms series by defined points count.
    xZoom.setToPointsCount(parseInt(layout.scrollaftermax)); //causes the overflow (works fine in IE)

	xZoom.continuous(true); //works
		
	if(parseInt(layout.scrollaftermax)<=data.length) {	
	
		// // enable the scroller
		window['chart' + layout.qInfo.qId].xScroller(true); //works

		// // autoHide the scroller
		 window['chart' + layout.qInfo.qId].xScroller().autoHide(true); //doesn't work
		
		 window['chart' + layout.qInfo.qId].xScroller().position("beforeAxes"); //works
		
		 window['chart' + layout.qInfo.qId].xScroller().fill("#cccccc"); //works
		 window['chart' + layout.qInfo.qId].xScroller().selectedFill("#666666"); //doesn't work (chrome) works in (IE)
	}
}

// turn on chart animation
if(layout.chartanimate) {window['chart' + layout.qInfo.qId].animation(true);}
else {window['chart' + layout.qInfo.qId].animation(false);}

// set container id for the chart
window['chart' + layout.qInfo.qId].container('container_' + layout.qInfo.qId);

//console.log(layout.charttitle);
// set chart title
if(layout.charttitleshow) {window['chart' + layout.qInfo.qId].title(layout.charttitle)};

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

var series = window['chart' + layout.qInfo.qId].line(dataSet);
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
series.color(layout.theme[0]);

series.tooltip().titleFormatter(function() {
    return this.x
});
series.tooltip().textFormatter(function() {
    return '$' + parseInt(this.value).toLocaleString()
});
series.tooltip().position('top').anchor('bottom').offsetX(0).offsetY(5);

// set scale minimum
window['chart' + layout.qInfo.qId].yScale().minimum(0);

// set yAxis labels formatter
window['chart' + layout.qInfo.qId].yAxis().labels().textFormatter(function(){
    return this.value.toLocaleString();
});

window['chart' + layout.qInfo.qId].tooltip().positionMode('point');
window['chart' + layout.qInfo.qId].interactivity().hoverMode('byX');

// Axis titles - Picked from Dimension titles in Qlik
if(layout.ylabelshow) {window['chart' + layout.qInfo.qId].yAxis().title(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);}
if(layout.xlabelshow) {window['chart' + layout.qInfo.qId].xAxis().title(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);}

series.markers(true);

var markers = series.markers();
markers.size(2);
//series.selectFill("black");

// Crosshair Y/N 
if(layout.crosshair) {var crosshair = window['chart' + layout.qInfo.qId].crosshair(); crosshair.enabled(true); crosshair.xStroke(null);}

// initiate chart drawing
window['chart' + layout.qInfo.qId].draw();


// add a listener
window['chart' + layout.qInfo.qId].listen("pointsSelect", function(e) {
	console.log(e.point);
	var index = e.point.getIndex();
	var row = dataSet.row(index);
	
	selvalues.push(row.x);
	selvalues = $.unique(selvalues);
	
	console.log(selvalues);
	
	lineIndexArray.push(index);
	lineIndexArray = $.unique(lineIndexArray);
	
	series.select(lineIndexArray);
	
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
			
			// console.log(dataSet.row.length);
			
			// for(i=0;i<=dataSet.row.length;i++) {
				// if(dataSet.row(i))
				// {
					// dataSet.row(i).fill = (layout.theme[0]);
					// delete dataSet.row(i).fillOld;
					// dataSet.row(i, dataSet.row(i));
				// }
			// }
			
			// series.select();
			
			
		});
	}
	
});

};