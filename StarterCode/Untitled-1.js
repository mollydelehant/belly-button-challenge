const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Function to create dropdown options
const createDropdown = (data) => {
    const dropDown = d3.select("#selDataset");
    data.names.forEach(sample => {
        dropDown.append("option")
            .text(sample)
            .property("value", sample);
    });
};

// Function to initialize dropdown and charts
function init() {
    d3.json(url).then(data => {
        createDropdown(data);
        const initSample = data.names[0];
        buildDemo(initSample);
        buildCharts(initSample);
    });
};

function buildCharts(sample) {
    d3.json(url).then(function (data) {
        // variables for charts
        var allSamples = data.samples;
        var sampleInfo = allSamples.filter(row => row.id == sample);
        var sampleValues = sampleInfo[0].sample_values;
        var sampleValuesSlice = sampleValues.slice(0,10).reverse();
        var otuIds = sampleInfo[0].otu_ids;
        var otuIdsSlice = otuIds.slice(0,10).reverse();
        var otuLabels = sampleInfo[0].otu_labels;
        var otuLabelsSlice = otuLabels.slice(0,10).reverse();
        

        // build chart 1
        var trace1 = {
            x: sampleValuesSlice,
            y: otuIdsSlice.map(item => `OTU ${item}`),
            type: "bar",
            orientation: "h",
            text: otuLabelsSlice,
        };
        var data = [trace1];
        Plotly.newPlot("bar", data)

        // build chart 2 
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuIds
        };
        var data2 = [trace2];
        var layout = {
            showlegend: false
        };

        Plotly.newPlot("bubble", data2, layout);
    })};
// Function to display metadata for a sample
function buildDemo(sample) {
    d3.json(url).then(function (data) {
        var metaData = data.metadata;
        var metaDataSample = metaData.find(row => row.id == sample) || {};

        var demo = d3.select("#sample-metadata");
        demo.selectAll("p").remove();

        Object.entries(metaDataSample).forEach(([key, value]) => {
            demo.append("p").text(`${key}: ${value}`);
        });
    });
};

// Function triggered on dropdown selection change
function optionChanged(sample) {
    buildDemo(sample);
    buildCharts(sample);
};

// Initialize the application
init();
