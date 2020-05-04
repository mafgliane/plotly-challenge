var jsonData = "samples.json"

// Initialize the dashboard
init();

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");
    
  // Use the list of sample names to populate the select options
  d3.json(jsonData).then((data) => {
    var sampleNames=data.names
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

function buildMetadata(sample) {
//Display the sample metadata, i.e., an individual's demographic information.
  d3.json(jsonData).then(function(response){
    var metadata = response.metadata;
    var sampleData = metadata.filter(sampleObject=>sampleObject.id==sample)
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleData[0]).forEach(([key, value]) => {
      panel.append("h3")
      .text(`${key} : ${value}`);
    });
          
    // BONUS: Build the Gauge Chart
    var selectwFreq = sampleData[0].wfreq;
    buildGauge(selectwFreq);

    });
  }
  
  
function buildGauge(wfreq){
// Adding a gauge chart to plot the weekly washing frequency of an individual
var data = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreq,
    title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 9] },
      steps: [
        { range: [0, 1], color: "F1F8E9" },
        { range: [1, 2], color: "DCEDC8" },
        { range: [2, 3], color: "C5E1A5" },
        { range: [3, 4], color: "AED581" },
        { range: [4, 5], color: "7CB342" },
        { range: [5, 6], color: "689F38" },
        { range: [6, 7], color: "558B2F" },
        { range: [7, 8], color: "33691E" },
        { range: [8, 9], color: "1B5E20" }
      ],
    }
  }
];
    
  var layout = { width: 500, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", data, layout);
}

  
function buildCharts(sample) {
// Use `d3.json` to fetch the sample data for the plots
  d3.json(jsonData).then(function (response){
    var sampleData = response.samples.filter(sampleObject=>sampleObject.id==sample)
    var select_otu_ids = sampleData[0].otu_ids;
    var otu_id_tags = sampleData[0].otu_ids.map(data => "OTU " + data)
    var select_sample_values = sampleData[0].sample_values;
    var select_otu_labels = sampleData[0].otu_labels;
 
  // Create a horizontal bar chart to display the top 10 OTUs found in that individual. 
    var trace1={
        x : select_sample_values.slice(0,10).reverse(),
        y : otu_id_tags.slice(0,10).reverse(),    
        text : select_otu_labels.slice(0,10).reverse(),
        type : "bar",
        orientation : "h"
    }
    var data1 = [trace1];
    var layout = {title : "<b>Top Ten OTUs</b>", width:400, height:500};
      
    Plotly.newPlot('bar', data1, layout);


    //Create a bubble chart that displays each sample.
    var trace2 = {
      x: select_otu_ids,
      y: select_sample_values,
      mode:"markers", 
      marker:{
        size: select_sample_values,
        color: select_otu_ids,
        colorscale: "Rainbow",
        labels: select_otu_labels,
        type: 'scatter',
        opacity: 0.3
      }
    };

    var data2 = [trace2];
    var layout = {
      title: '<b>Microbe Samples</b>',
      xaxis: { title: 'OTU ID' },
    };

    Plotly.newPlot("bubble", data2, layout); 
  });
}
  
  
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample)
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}
  
