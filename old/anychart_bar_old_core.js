define( ["jquery", "./anychart-bundle.min", "js/qlik", "./library/contents"], function ( $, anychart, qlik ) {'use strict';

	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 4,
					qHeight: 200
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
					max: 2
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 3
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items:{
						ChartDropDown: {
							type: "string",
							component: "dropdown",
							label: "Chart",
							ref: "chart",
							options: content_options,
							defaultValue: 1
						}		
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {

			var dim_count = layout.qHyperCube.qDimensionInfo.length;
			var measure_count = layout.qHyperCube.qMeasureInfo.length;
		
			console.log(layout.qHyperCube.qDimensionInfo);
			console.log(layout.qHyperCube.qMeasureInfo);
		
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			
			//console.log(qMatrix);
			
			console.log(layout.qHyperCube.qDataPages[0]);
			
			// Create a new array for our extension with a row for each row in the qMatrix
			var data = qMatrix.map(function(d) {
				// for each element in the matrix, create a new object that has a property
				// for the grouping dimension, the first metric, and the second metric
				
				//console.log(d);
				
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
			//console.log(layout);
			viz(app,data,dimensions,layout);

			//console.log(dimensions);
		}
	};

} );


