var viz = function($element, layout, self, qlik) {

var app = qlik.currApp();

$("#container_" + layout.qInfo.qId).empty();

var selvalues = [];

var data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
	return {
		"Dim1":d[0].qText,
		"Dim2":d[1].qText,
		"Metric1":d[2].qNum
	}
});

var testTable = [];
var arrayWidth;
$.each(data, function(index, value) {
	
	var testData = [];
	testData[0] = data[index].Dim1;
	testData[1] = data[index].Dim2;
	testData[2] = data[index].Metric1;
	
	testTable.push(testData);
});

//Pivot table to fit AnyChart format
var newdata = getPivotArray(testTable, 0, 1, 2);

//Extract labels for columns
var barlabels = newdata[0];

//Purge label row from pivoted data array.
newdata.shift();
//Load data into AnyChart dataset
var dataSet = anychart.data.set(newdata);


arrayWidth = newdata[0].length;

var seriesData = [];

for(i=1; i<arrayWidth; i++) {
	seriesData[i] = dataSet.mapAs({x: [0], value: [i]});
} 
  

// create bar chart
window['chart' + layout.qInfo.qId] = anychart.column();

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

// set chart title
if(layout.charttitleshow) {window['chart' + layout.qInfo.qId].title(layout.charttitle)};


// set scale minimum
window['chart' + layout.qInfo.qId].yScale().minimum(0);

// force chart to stack values by Y scale.
window['chart' + layout.qInfo.qId].yScale().stackMode('value');

// set yAxis labels formatter
window['chart' + layout.qInfo.qId].yAxis().labels().textFormatter(function(){
    return this.value.toLocaleString();
});


  // helper function to setup label settings for all series
  var setupSeriesLabels = function(series, name) {
    series.name(name);
    series.tooltip().valuePrefix('$');
    //series.stroke('3 #fff 1');
	series.stroke(series.color(),.5);
    series.hoverStroke('0 #fff .5');
  };

  // temp variable to store series instance
  var series;


for(index = 1; index<seriesData.length;index++) {

	  series = window['chart' + layout.qInfo.qId].column(seriesData[index]);
	  series.stroke(series.color(),2);
	  series.baseColor = series.color();
	  //console.log(series.baseColor);
	  setupSeriesLabels(series, barlabels[index]);
  }


// Axis titles - Picked from Dimension titles in Qlik
if(layout.ylabelshow) {window['chart' + layout.qInfo.qId].yAxis().title(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);}
if(layout.xlabelshow) {window['chart' + layout.qInfo.qId].xAxis().title(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);}

  // turn on legend
  window['chart' + layout.qInfo.qId].legend().enabled(true).fontSize(13).padding([0,0,20,0]);
// Crosshair Y/N 
if(layout.crosshair) {var crosshair = window['chart' + layout.qInfo.qId].crosshair(); crosshair.enabled(true); crosshair.xStroke(null);}
// initiate chart drawing
window['chart' + layout.qInfo.qId].draw();

// add a listener
window['chart' + layout.qInfo.qId].listen("pointClick", function(e) {
	
	var clickedSeries = e.series;
	var clickedColor = anychart.color.darken(clickedSeries.color(), 0.4); 

	
	selvalues.push(e.series.name());
	selvalues = $.unique(selvalues);
	console.log(selvalues);
	
	if(clickedSeries.fillOld) {
		console.log("Triggered");
		clickedSeries.color(clickedSeries.fillOld);
		delete clickedSeries.fillOld;
		clickedSeries.stroke("#222222",0);

		selvalues = jQuery.grep(selvalues, function(value) {
		  return value != e.series.name();
		});
	}
	else {
		console.log("This one triggered");
		clickedSeries.fillOld = clickedSeries.color();
		clickedSeries.stroke("#222222", .5);

		clickedSeries.color(clickedColor); 		
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
			//console.log(layout.qHyperCube);
			if(layout.qHyperCube.qDimensionInfo[1].qDimensionType=="N") {
				
				var lookupArray = [];
				var linkArray = [];
				//console.log(layout.qHyperCube.qDataPages[0].qMatrix);
				$.each(layout.qHyperCube.qDataPages[0].qMatrix, function(index) {
					if($.inArray(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qElemNumber, lookupArray) === -1 ){
						lookupArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qElemNumber);
						linkArray.push(layout.qHyperCube.qDataPages[0].qMatrix[index][1].qText);
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
				
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).select(selectionValues, false, false);
			}
			else {
				app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).selectValues(selvalues, false, false);
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
			
			//viz($element, layout, self, app);
			
			qlik.resize();
			
			// for(i=0;i<=window['chart' + layout.qInfo.qId].column.length;i++) {
				// console.log("this happened");

					// console.log("and this " + i);
					// var mySeries = window['chart' + layout.qInfo.qId].getSeriesAt(i);
					// mySeries.color(mySeries.baseColor);
					// mySeries.stroke("#222222", 0);
					// delete mySeries.fillOld;
			// }
			
		});
	}
	
});

};


function getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {
        //Code from http://techbrij.com
        var result = {}, ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {
 
            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
            //To get column names
            if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }
 
        newCols.sort();
        var item = [];
 
        //Add Header Row
        item.push('Item');
        item.push.apply(item, newCols);
        ret.push(item);
 
        //Add content 
        for (var key in result) {
            item = [];
            item.push(key);
            for (var i = 0; i < newCols.length; i++) {
                item.push(result[key][newCols[i]] || "-");
            }
            ret.push(item);
        }
        return ret;
    }