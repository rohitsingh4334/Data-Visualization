
    function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    };

        

    queue()
        .defer(d3.json,"/mydb/mycollection")    
        .await(makeGraph);

    function makeGraph(error,Starbucks_data){
        var ndx = crossfilter(Starbucks_data);
        
        var CountryDim = ndx.dimension(function(d){return d.Country;});
            top_Country = CountryDim.top(10);
        var Stores = CountryDim.group().reduceCount(function(d){return d.Store;});

        //Total Data
        var number_of_Stores = dc.numberDisplay("#total-data");


        var total_Records = ndx.groupAll();
        number_of_Stores
            .group(total_Records)
            .valueAccessor(x => x);

        //group for top 10 countries
        function getTops(source_group) {
        return {
                all: function () {
                    return source_group.top(10);
                }
            };
        }
        var top_CountryGroup = getTops(Stores);

        //bar chart 
        var StoreLineChart = dc.barChart('#chart-line-Stores');
        StoreLineChart
            .width(1350).height(200)
            .dimension(CountryDim)
            .group(Stores)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('COUNTRIES')
            .yAxisLabel('Stores')
            .elasticX(true)
            .brushOn(true);

        //Top 20 bar chart 
        var StoreLineChart = dc.barChart('#chart-line-Top20');
        StoreLineChart
            .width(600).height(200)
            .dimension(top_Country)
            .group(top_CountryGroup)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('COUNTRIES')
            .yAxisLabel('Stores')
            .elasticX(true)
            .brushOn(true);


            

        var CityDim = ndx.dimension(function(d){return d.City;});
            top_City = CityDim.top(10);
        var StoreCityWise = CityDim.group().reduceCount(function(d){return d.Store;});    
        //bar chart for city
        
        var top_CityGroup = getTops(StoreCityWise);


        /*var CityLineChart = dc.barChart('#chart-line-Citywise');
        CityLineChart
            .width(1350).height(200)
            .dimension(CityDim)
            .group(StoreCityWise)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('Cities')
            .yAxisLabel('Stores')
            .brushOn(true);
        */
        //Top 20 Cities    
        var CityLineChart = dc.barChart('#chart-line-Top20Cities');
        CityLineChart
            .width(600).height(200)
            .dimension(top_City)
            .group(top_CityGroup)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel('Cities')
            .yAxisLabel('Stores')
            .brushOn(true)
            ;
                
        //pie chart country wise
        var OwnershipDim = ndx.dimension(function(d){return d.Ownership_Type;});
        var OwnershipDimGroup = OwnershipDim.group().reduceCount(function(d){return d.Ownership_Type;})
        var Ownership_Type_rowChart = dc.rowChart('#chart-ring-Country');
        Ownership_Type_rowChart
            .width(600).height(250)
            .dimension(OwnershipDim)
            .group(OwnershipDimGroup)
            .transitionDuration(5000)
            .legend(dc.legend().x(110).y(120).itemHeight(13).gap(5))
            .elasticX(true)
            .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"]);
            //.slicesCap(5)
            //.drawPaths(true)
            //.externalRadiusPadding(0)
            //.innerRadius(70);    

        //data table 
        var datatble = dc.dataTable('#dc-data-table');
        datatble
            .dimension(CountryDim)
            .group(function(d){return d;
            })
            .columns([
                        {label: 'Country',
                        format:function(d){return d.Country;}},
                        {label: 'City',
                        format:function(d){return d.City;}},

                        {label: 'Brand',
                        format:function(d){return d.Brand;}},
                   
                        {label: 'Ownership Type',
                        format:function(d){return d.Ownership_Type;}},
                   
                        {label: 'Store Name',
                        format:function(d){return d.Store_Name;}},
                   
                        {label: 'Longitude',
                        format:function(d){return d.Longitude;}},
                   
                        {label: 'Latitude',
                        format:function(d){return d.Latitude;}}  
                ])
                    .size(1500)
                    .on('renderlet', function() {
                        datatble.select('tr.dc-table-group').remove(); // remove unneccesary row dc.js adds beneath the header)
                    });
        
        //pie chart country wise
        var BrandDim = ndx.dimension(function(d){return d.Brand;});
        var BrandDimGroup = BrandDim.group().reduceCount(function(d){return d.Brand;})
        var Brand_rowChart = dc.rowChart('#chart-row-chart');
        Brand_rowChart
            .width(600).height(250)
            .dimension(BrandDim)
            .group(BrandDimGroup)
            .transitionDuration(5000)
            .legend(dc.legend().x(110).y(120).itemHeight(13).gap(5))
            .elasticX(true)
            .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"]);
            //.slicesCap(4)
            //.drawPaths(true)
            //.externalRadiusPadding(20)
            //.innerRadius(0);    

        dc.renderAll();  
        };  
