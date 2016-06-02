
function xyHeatmap(data,stylename,media,plotpadding,legAlign,yAlign,breaks){

    var titleYoffset = d3.select("#"+media+"Title").node().getBBox().height
    var subtitleYoffset=d3.select("#"+media+"Subtitle").node().getBBox().height;

    // return the series names from the first row of the spreadsheet
    var seriesNames = Object.keys(data[0]).filter(function(d){ return d != 'date'; });
    //Select the plot space in the frame from which to take measurements
    var frame=d3.select("#"+media+"chart")
    var plot=d3.select("#"+media+"plot")

    var yOffset=d3.select("#"+media+"Subtitle").style("font-size");
    yOffset=Number(yOffset.replace(/[^\d.-]/g, ''));
    
    //Get the width,height and the marginins unique to this chart
    var w=plot.node().getBBox().width;
    var h=plot.node().getBBox().height;
    var margin=plotpadding.filter(function(d){
        return (d.name === media);
      });
    margin=margin[0].margin[0]

    var colours=stylename.fillcolours;
    var plotWidth = w-(margin.left+margin.right);
    var plotHeight = h-(margin.top+margin.bottom);

    //roll up the data by category
    var catData = d3.nest()
        .key(function(d){return d.category;})
        .entries(data);

    //Work out the height of each cell
    var cellHeight=plotHeight/catData.length
    //Add a group for the labels
    var cats=plot.append("g")
        .attr("id","catLabels")
        .attr("transform",function(d,i){
            return "translate("+margin.left+","+(margin.top)+")";
        });
    //Add the labels
    var labels = cats.selectAll("g")
        .data(catData)
        .enter()
        .append("g")
        .attr("id",function(d){
            return d.key;  
        })
        .attr("transform",function(d,i){
            return "translate("+margin.left+","+(margin.top+(cellHeight*i))+")";
        });  
    labels.append("text")
    .attr("class",media+"subtitle")
    .text(function(d){return d.key})
    
    //Work out the cell width of each cell now that the lables are added
    var labelWidth=25+d3.select("#catLabels").node().getBBox().width
    var cellWidth=(plotWidth-labelWidth)/catData[0].values.length
    
    //Noww add the groups for each set of rectangles
    var squares=plot.append("g")
        .attr("id","squares")
    var groups = squares.selectAll("g")
            .data(catData)
            .enter()
            .append("g")
            .attr("id",function(d){
                return "group"+d.key;  
            })
            .attr("transform",function(d,i){
                return "translate("+(labelWidth+margin.left)+","+(margin.top+(i*cellHeight))+")";
            });

    //Add and colour the rectangles
    var rects = groups.selectAll("rect")
            .data(function(d){
                return d.values;
            })
            .enter()
            .append("rect")
            .attr("id",function(d) {return d.value})
            .attr("width",cellWidth)
            .attr("height",cellHeight)
            .attr("y",0)
            .attr("x",function(d,i){
                return cellWidth*i;
            })
            .attr("fill",function(d,j){
                if (d.value<breaks[0]) {
                    return colours[0];
                }
                for (i=0;i<breaks.length+1;i++){
                    if (d.value>=breaks[i]&&d.value<breaks[i+1]){
                        return colours[i];
                    }
                }
                if (d.value>breaks.length-1){
                    return colours[breaks.length]   
                }   
            })



    

}