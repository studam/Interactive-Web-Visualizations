function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var divMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    divMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      divMetadata.append("div").text(`${key}: ${value}`);
    });
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  var url = "/samples/" + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];
    
    var layout = {
      xaxis: { title: 'OTU ID'}
    };
    
    Plotly.newPlot('bubble', trace1, layout);
    // @TODO: Build a Pie Chart
    var trace2 = [{
      labels: data.otu_ids.slice(0, 10),
      values: data.sample_values.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: 'pie'
    }];

    var layout = {
    };

    Plotly.newPlot("pie", trace2, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();