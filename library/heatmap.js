var viz = function($element, layout, self, qlik) {

var app = qlik.currApp();

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];
var lineIndexArray = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Dim2":d[1].qText,
		"Metric1":d[2].qNum
	}
});

var myTestData = [];

//console.log(data.length);

for(i=0;i<data.length;i++) {
	var dataRow = [];
	//console.log(data[i].Metric1);
	dataRow[0] = data[i].Dim1;
	dataRow[1] = data[i].Dim2;
	dataRow[2] = data[i].Metric1;
	myTestData.push(dataRow);
}

//console.log(myTestData);

var myData = anychart.data.set(myTestData);

var dataSet = myData.mapAs({x: [0], y: [1], heat:[2]});  

// create bar chart
window['chart' + layout.qInfo.qId] = anychart.heatMap(dataSet);

//set chart palette
//chart.palette(layout.theme);

// turn on chart animation
if(layout.chartanimate) {window['chart' + layout.qInfo.qId].animation(true);}
else {window['chart' + layout.qInfo.qId].animation(false);}

// set container id for the chart
window['chart' + layout.qInfo.qId].container('container_' + layout.qInfo.qId);

// set chart title
if(layout.charttitleshow) {window['chart' + layout.qInfo.qId].title(layout.charttitle)};

//Define label values to show if have enough size.
//window['chart' + layout.qInfo.qId].labels(true);
//window['chart' + layout.qInfo.qId].labelsDisplayMode("drop");

// set yAxis labels formatter
window['chart' + layout.qInfo.qId].yAxis().labels().textFormatter(function(){
    return this.value.toLocaleString();
});

window['chart' + layout.qInfo.qId].stroke('#fff');
window['chart' + layout.qInfo.qId].hoverStroke('3 #fff');
window['chart' + layout.qInfo.qId].hoverFill('#545f69');

// Axis titles - Picked from Dimension titles in Qlik
if(layout.ylabelshow) {window['chart' + layout.qInfo.qId].yAxis().title(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);}
if(layout.xlabelshow) {window['chart' + layout.qInfo.qId].xAxis().title(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);}

  // turn on legend
  window['chart' + layout.qInfo.qId].legend().enabled(true).fontSize(13).padding([0,0,20,0]);
  
  
// initiate chart drawing
window['chart' + layout.qInfo.qId].draw();



// add a listener
window['chart' + layout.qInfo.qId].listen("pointClick", function(e) {

	var index = e.point.getIndex();
	var row = dataSet.row(index);
	
	selvalues.push([row[0], row[1]]);
	selvalues = $.unique(selvalues);
	
	lineIndexArray.push(index);
	lineIndexArray = $.unique(lineIndexArray);

	window['chart' + layout.qInfo.qId].select(lineIndexArray);
	
	
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
			var dim1list = [];
			var dim2list = [];
			for(i=0;i<selvalues.length;i++) {
				dim1list.push(selvalues[i][0]);
				dim2list.push(selvalues[i][1]);
			}
			dim1list = $.unique(dim1list);
			dim2list = $.unique(dim2list);
			
			var dim1 = 0;
			var dim2 = 0;
			
			var dim1elems = [];
			var dim2elems = [];
			
			if(layout.qHyperCube.qDimensionInfo[0].qDimensionType=="N") {
				
				var lookupArray = [];
				var linkArray = [];
				
				$.each(layout.qHyperCube.qDataPages[0].qMatrix, function(index) {
					if($.inArray(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qElemNumber, lookupArray) === -1 ){
						lookupArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qElemNumber);
						linkArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][0].qText);
					}
				});
				
				//var selectionValues = [];
				$.each(dim1list, function(index, value) {
					//console.log(value);
					var a = linkArray.indexOf(value);
					//console.log(a);
					if(a >=0) {
						dim1elems.push(lookupArray[a]);
					}
				});
				dim1 = 1;
				//app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).select(selectionValues, false, false);
			}
			if(layout.qHyperCube.qDimensionInfo[1].qDimensionType=="N") {
				var lookupArray = [];
				var linkArray = [];
				
				$.each(layout.qHyperCube.qDataPages[0].qMatrix, function(index) {
					if($.inArray(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qElemNumber, lookupArray) === -1 ){
						lookupArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qElemNumber);
						linkArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qText);
					}
				});
				
				var selectionValues = [];
				$.each(dim2list, function(index, value) {
					//console.log(value);
					var a = linkArray.indexOf(value);
					//console.log(a);
					if(a >=0) {
						dim2elems.push(lookupArray[a]);
					}
				});
				dim2 = 1;
				//app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).select(selectionValues, false, false);
			}
			
			if(dim1 === 0 && dim2 ===0 ) {
				console.log("neither dims are numeric");
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).selectValues(dim1list, false, false);
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).selectValues(dim2list, false, false);	
			}
			if(dim1 === 1 && dim2 ===0 ) {
				console.log("dim1 is numeric");
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).select(dim1elems, false, false);
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).selectValues(dim2list, false, false);	
			}
			if(dim1 === 0 && dim2 ===1 ) {
				console.log("dim2 is numeric");
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).selectValues(dim1list, false, false);
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).select(dim2elems, false, false);
			}
			if(dim1 === 1 && dim2 ===1 ) {
				console.log("both dims are numeric");
				app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).select(dim1elems, false, false);
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).select(dim2elems, false, false);
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
					
			
		});
	}
	
});

};
