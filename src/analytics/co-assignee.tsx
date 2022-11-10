import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface nodeStructure{
    id:string,
    name:string,
    source:string,
    value:number,
    target:string
    }

function CoAssignee() {

    const  [data,setData]:any=useState([]);
    const [option,setOption]=useState({});
    const  [loading,setLoading]= useState(true);

    const chartRef = useRef(null);

    useEffect(()=>{
        var originalData = [{
            "name": "Genentech, Inc.",
            "values": [{
                "source": "Genentech, Inc.",
                "target": "Biogen Inc.",
                "count": 51
            }, {
                "source": "Genentech, Inc.",
                "target": "CuraGen Corporation",
                "count": 72
            }, {
                "source": "Genentech, Inc.",
                "target": "Roche Holding Ltd.",
                "count": 656
            }, {
                "source": "Genentech, Inc.",
                "target": "Hoffmann-La Roche Inc.",
                "count": 46
            }, {
                "source": "Genentech, Inc.",
                "target": "Novartis AG",
                "count": 108
            }, {
                "source": "Genentech, Inc.",
                "target": "Constellation Pharmaceuticals, Inc.",
                "count": 45
            }, {
                "source": "Genentech, Inc.",
                "target": "Curis, Inc.",
                "count": 206
            }, {
                "source": "Genentech, Inc.",
                "target": "AC Immune SA",
                "count": 123
            }, {
                "source": "Genentech, Inc.",
                "target": "Foundation Medicine, Inc.",
                "count": 43
            }]
        }, {
            "name": "Roche Holding Ltd.",
            "values": [{
                "source": "Roche Holding Ltd.",
                "target": "Roche Glycart AG",
                "count": 45
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Genentech, Inc.",
                "count": 656
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Hoffmann-La Roche Inc.",
                "count": 604
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Morphosys AG",
                "count": 46
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Siena Biotech S.p.A.",
                "count": 231
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Chugai Pharmaceuticals Co Ltd",
                "count": 75
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Chugai Pharmaceutical Co. Ltd.",
                "count": 45
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Roche Diagnostics GmbH",
                "count": 594
            }, {
                "source": "Roche Holding Ltd.",
                "target": "Commissariat à l'Energie Atomique SA",
                "count": 35
            }]
        }];

        var tmpData:any=[];

        originalData.forEach((item)=>{
            item.values.forEach((node,index)=>{
                if(tmpData.find((n:nodeStructure)=>n.id==node.target))
                    {}else{
                      tmpData.push(
                    {
                        id:node.target,
                        source:node.source,
                        name:node.target,
                        value:node.count,
                        target:node.target
                    });
                    }
            });
        });

        setData(tmpData);
    },[]);

    useEffect(()=>{
      if(data.length>0){
        setOption({
            title:{
                text:'Co-Assignee',
                left:'left',
                top:'top',
                textStyle:{
                    width:150,
                    color: 'rgb(255,255,255)'
                },
                subtext:'Network Chart',
                subtextStyle:{
                  color:'#d1dee7'
                }
            },
            toolbox:{
              show:true,
              orient:'horizontal',
              left:'center',
              feature:{
                saveAsImage:{
                  backgroundColor:'auto'
                }
              }
            },
            series: [
                        {
                            name: 'Co-Assignee',
                            type: 'graph',
                            layout: 'force',
                            data: data,
                            links: data,
                            roam: true,
                            label: {
                              show: true,
                              position:'bottom',
                              formatter: '{b}',
                              fontFamily:'Fira Sans'
                            },
                            force: {
                                repulsion: 500,
                                edgeLength: 100
                            },
                            symbolSize: 30,
                            itemStyle:{
                              fontFamily:'Fira Sans'
                            },
                            edgeSymbol: ['arrow', 'arrow'],
                            edgeSymbolSize: [5, 5],
                            edgeLabel: {
                                //show: true,
                                fontSize: 10,
                                formatter:'{c} patents'
                            },
                            lineStyle: {
                                color: 'rgb(72,221,180)'
                            },
                            scaleLimit: {
                                min: 0.4,
                                max: 10
                            },
                            color: [
                              'rgb(72,221,180)'
                            ],
                            emphasis: {
                                focus: 'adjacency',
                                edgeLabel:{
                                    show: true
                                }
                            },
                            draggable:true
                }
            ]
        });
      }
    },[data]);

    useEffect(() => {
        // Initialize chart
        let chart:echarts.ECharts;
        if (chartRef.current !== null) {
          chart = echarts.init(chartRef.current);
        }
    
        // Add chart resize listener
        // ResizeObserver is leading to a bit janky UX
        function resizeChart() {
          chart.resize();
        }
        window.addEventListener("resize", resizeChart);
    
        // Return cleanup function
        return () => {
          chart.dispose();
          window.removeEventListener("resize", resizeChart);
        };
      });
    
      function suppressSelection(chart:any, params:any) {
        chart.setOption({ animation: false });
      
        // Re-select what the user unselected
        chart.dispatchAction({
          type: 'legendSelect',
          name: params.name
        });   
      
        chart.setOption({ animation: true });
        alert(data.find((i:any)=>i.name===params.name).value);
      }

      useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
          const chart = echarts.getInstanceByDom(chartRef.current);
          chart?.setOption(option!);

          chart?.on('click', 'series', (params)=> 
          {
            alert('hi '+params.value);
        }
          );
          

          chart?.on('legendselectchanged', (params)=> 
          {
            suppressSelection(chart, params);  
           
        });

          setLoading(false);
        }
      }, [option]);
    
      useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
          const chart = echarts.getInstanceByDom(chartRef.current);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
      }, [loading]);

    return (
        <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
);
  }
  
  export default CoAssignee;