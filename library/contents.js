var charts = [
	{
		name:"Column Chart",
		id:1,
		src:"column_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Bar Chart",
		id:2,
		src:"bar_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Stacked Bar Chart",
		id:3,
		src:"stacked_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Stacked Column Chart",
		id:4,
		src:"stacked_column_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Grouped Bar Chart",
		id:39,
		src:"grouped_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Grouped Column Chart",
		id:49,
		src:"grouped_column_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},	
	{
		name:"Line Chart",
		id:5,
		src:"line_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Multi-Series Line Chart",
		id:6,
		src:"multi_series_line_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Stepline Chart",
		id:66,
		src:"stepline_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},	
	{
		name:"Area Chart",
		id:7,
		src:"area_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Stacked Stepline Chart",
		id:8,
		src:"stacked_stepline_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"100 Stacked Area Chart",
		id:9,
		src:"100_stacked_area_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Stacked Area Chart",
		id:10,
		src:"stacked_area_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Streamgraph",
		id:11,
		src:"stream_graph.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Pie Chart",
		id:12,
		src:"pie_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Donut Chart",
		id:13,
		src:"donut_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},

	{
		name:"Donut Multiples",
		id:14,
		src:"donut_multiples_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Scatter Chart",
		id:15,
		src:"scatter_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"XXXMulti-Series Bubble Chart",
		id:16,
		src:"multi_series_bubble_chart.js",
		min_dims:1,
		max_dims:2,
		measures:2
	},
	{
		name:"Range Column Chart",
		id:17,
		src:"range_column_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"XXXCluster Dendogram",
		id:18,
		src:"cluster_dendogram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXRadial Tree",
		id:19,
		src:"radial_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXBubble Chart",
		id:20,
		src:"bubble_chart.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXZoomable Circle Packing",
		id:21,
		src:"zoomable_circle_packing.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXTreemap",
		id:22,
		src:"treemap.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXZoomable Tree Map",
		id:23,
		src:"zoomable_tree_map.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXZoomable Partition Layout",
		id:24,
		src:"zoomable_partition_layout.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXZoomable Sunburst",
		id:25,
		src:"zoomable_sunburst.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXCollapsible Indented Tree",
		id:26,
		src:"collapsible_indented_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"XXXCollapsible Force Diagram",
		id:27,
		src:"collapsible_force_diagram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Heatmap",
		id:28,
		src:"heatmap.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Radar Chart",
		id:29,
		src:"radar_chart.js",
		min_dims:1,
		max_dims:2,
		measures:1
	},
	{
		name:"Box Plot",
		id:30,
		src:"box_plot.js",
		min_dims:2,
		max_dims:2,
		measures:1
	}	
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});