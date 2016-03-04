define( ["jquery", "./anychart-bundle.min", "js/qlik"], function ( $, anychart, qlik ) {'use strict';

	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		//property panel
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {

		
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			// Create a new array for our extension with a row for each row in the qMatrix
			var data = qMatrix.map(function(d) {
				// for each element in the matrix, create a new object that has a property
				// for the grouping dimension, the first metric, and the second metric
				return {
					"Dim1":d[0].qText,
					"Metric1":d[1].qNum
				}
			});
			
			var dimensions = layout.qHyperCube.qDimensionInfo;
			
			// Chart object width
			var width = $element.width();
			// Chart object height
			var height = $element.height();
			//console.log(height);
			//console.log($("#container").height());
			// Chart object id
			var id = "container";//"container_" + layout.qInfo.qId;
			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty().width(width).height(height);
			}
			else {
				// if it hasn't been created, create it with the appropriate id and size
				//$element.append($('<div />').attr("id", id).width(width).height(height));
				$element.append($('<div />').attr("id", "container").width(width).height(height));
			}
			
			var app = qlik.currApp();
			// Call our visualization function
			console.log(layout);
			viz(app,data,dimensions,layout);

			//console.log(dimensions);
		}
	};

} );


var viz = function(app,data,dimensions,layout) {

var selvalues = [];

// var seriesObj = {};
// seriesObj.point = [];
// $.each(data, function(index, value) {
	// seriesObj.point.push('{x: ' + data[index].Dim1 + ', value: ' + data[index].Metric1 + '}');
// });

var myData = [];
$.each(data, function(index, value) {
	var myObject = new Object();
	myObject.x = data[index].Dim1;
	myObject.value = data[index].Metric1;
	myData.push(myObject);
});

console.log(myData);

var dataSet = anychart.data.set(myData);


var dataSetOLD = anychart.data.set([
    {x: "Twix", value: 100, url:"//www.google.com/search?q=Twix"},
    {x: "Bounty", value: 200, url:"//www.google.com/search?q=Bounty"},
    {x: "Picnic", value: 15, url:"//www.google.com/search?q=Picnic"},
    {x: "Mars", value: 130, url:"//www.google.com/search?q=Mars"},
    {x: "Snickers", value: 153, url:"//www.google.com/search?q=Snickers"},
    {x: "KitKat", value: 120, url:"//www.google.com/search?q=KitKat"},
    {x: "Oreo", value: 151, url:"//www.google.com/search?q=Oreo"}
]);

console.log(dataSet);
console.log(dataSetOLD);

// set chart type
var chart = anychart.column();

chart.title("Confectionery Sales in April");

// set data
chart.column(dataSet).name('Boxes');

// set container and draw chart
chart.container("container");
chart.draw();
console.log(chart);

// add a listener
chart.listen("pointClick", function(e){
   var index = e.point.getIndex();
   var row = dataSet.row(index);
   if (row.fillOld){
       row.fill = row.fillOld;
       delete row.fillOld;
  } else{
       row.fillOld = row.fill;
       row.fill = "green";
   }
   dataSet.row(index, row);
	console.log(chart);
});

};