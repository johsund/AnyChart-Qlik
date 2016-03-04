define( ["jquery", "./js/anychart.min", "js/qlik","./js/senseUtils", "./library/contents", "./library/themes"], function ( $, anychart, qlik ) {'use strict';

	var lastUsedChart = -1;
	
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 5,
					qHeight: 2000
				}]
			}
		},
		//property panel
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min:0
				},
				measures : {
					uses : "measures",
					min:0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items:{
						ChartDropDown: {
							type: "string",
							component: "dropdown",
							label: "Chart",
							ref: "chart",
							options: content_options,
							defaultValue: 1
						},
						ThemeDropDown: {
							type: "string",
							component: "dropdown",
							label: "Theme",
							ref: "theme",
							options: chart_theme,
							defaultValue: 1
						},
						labels: {
							type: "items",
							label: "Label and Chart Settings",
							items: {							
								ylabelshow: {
									type: "boolean",
									label: "Show Measure Label",
									ref: "ylabelshow",
									defaultValue: false
								},
								xlabelshow: {
									type: "boolean",
									label: "Show Dimension Label",
									ref: "xlabelshow",
									defaultValue: false
								},
								chartanimate: {
									type: "boolean",
									label: "Animate Chart",
									ref: "chartanimate",
									defaultValue: false
								},
								dataonpoints: {
									type: "boolean",
									label: "Values on data points",
									ref: "dataonpoints",
									defaultValue: false
								},
								crosshair: {
									type: "boolean",
									label: "Enable crosshair",
									ref: "crosshair",
									defaultValue: false
								},								
								datascroll: {
									type: "boolean",
									label: "Enable scrollbar",
									ref: "datascroll",
									defaultValue: false
								},								
								scrollaftermax: {
									type: "string",
									label: "Number of values to show before scrolling",
									ref: "scrollaftermax",
									defaultValue: 10
								}
							}
						},
						title: {
							type: "items",
							label: "AnyChart Title",
							items: {							
								charttitleshow: {
									type: "boolean",
									label: "Show Chart Title",
									ref: "charttitleshow",
									defaultValue: false
								},
								titleshow: {
									ref : "charttitle",
									type : "string",
									label : "Chart Title",
									defaultValue : "This is my Chart Title"
								}
							}
						}						
					}

				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ($element,layout) {

			var self = this;
			senseUtils.extendLayout(layout,self);
			var dim_count = layout.qHyperCube.qDimensionInfo.length;
			var measure_count = layout.qHyperCube.qMeasureInfo.length;

			
			
			if ((dim_count < charts.filter(function(d) {return d.id === layout.chart})[0].min_dims || dim_count > charts.filter(function(d) {return d.id === layout.chart})[0].max_dims) || measure_count < charts.filter(function(d) {return d.id === layout.chart})[0].measures) {

				$element.empty();
				$element.html('<div style="background-color:rgb(238,243,250);margin:auto;position:absolute;top: 0; left: 0; bottom: 0; right: 0;height:auto;">'+
				'<div style="margin-left:30%;margin-top:20%;margin-right:30%;font-family:calibri;">'+
				'<img src='+document.location.origin + '/extensions/anychart-qlik/images/add_items.png><br><b>Incomplete Visualization</b>'+
				'<p style="font-family:calibri;">Chart type selected: <b>'+charts.filter(function(d) {return d.id === layout.chart})[0].name+'</b><br><br>Data required:<br>'+
				'<table style="margin-top:5px; margin-left:0px;"><tr><td>Dimensions:</td><td><b>' + dim_count + ' of '+charts.filter(function(d) {return d.id === layout.chart})[0].min_dims+'</b> added</td></tr><tr><td>Measures:</td><td><b>'+measure_count+' of '+charts.filter(function(d) {return d.id === layout.chart})[0].measures+'</b> added</td></tr></table>'+
				'<br>Complete data selection to finalize visualization.</p></div></div>');
				
			}
			else {
				//console.log("this one triggered")
				$element.html("");
				$element.html("<style>svg{overflow:hidden;}</style>");
			
			
			
				//console.log(layout.theme);
				
				// Chart object width
				var width = $element.width();
				// Chart object height
				var height = $element.height();
				// Chart ID
				var id = "container_" + layout.qInfo.qId;
				
				//var app = qlik.currApp();
				
				if (document.getElementById(id)) {
					// if it has been created, empty it's contents so we can redraw it
					$("#" + id).empty().width(width).height(height);
				}
				else {
					// if it hasn't been created, create it with the appropriate id and size
					$element.append($('<div />').attr("id", "container_" + layout.qInfo.qId).width(width).height(height).attr("class", "containerviz"));
				}				
					
					
				//var viz = window['viz' + layout.qInfo.qId]();
					
				if (layout.chart != lastUsedChart) {
					// Determine URL based on chart selection
					var src = charts.filter(function(d) {return d.id === layout.chart})[0].src;
					var url = document.location.origin + "/extensions/anychart-qlik/library/" + src;
					// Load in the appropriate script and viz					
					jQuery.getScript(url,function() {
						viz($element,layout,self, qlik);
						lastUsedChart = layout.chart;
					});
				
					
				}
				else {
					//console.log("test");
					viz($element,layout,self, qlik);
				}
			}
			

		}
		
			
	};
	//};

} );


