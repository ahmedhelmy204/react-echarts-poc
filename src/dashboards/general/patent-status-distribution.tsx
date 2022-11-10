import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function PatentStatusDistribution() {

    const  [data,setData]:any=useState([]);
    // const  [legendData,setLegendData]:any=useState([]);
    const  [title,setTitle]= useState('');
    const [option,setOption]=useState({});
    const  [loading,setLoading]= useState(true);

    const chartRef = useRef(null);

    useEffect(()=>{
         axios.post('dashboards/general/patent-status-distribution').then((resp)=>
         {
          setData(resp.data);

          // var legendTempData:{}[]=[];
          // resp.data.map((item:any)=> legendTempData.push({name:item.name,icon:'circle'}) );
          // setLegendData(legendTempData);

          setTitle((resp.data[0].value/resp.data[1].value).toFixed(2) + ' %');
        }).catch((err)=>{
          console.log(err);
        });



    },[]);

    useEffect(()=>{
      if(data.length>0){
        setOption({
            tooltip: {
                trigger: 'item'
            },
            title:{
                text:'Patents Status Distribution',
                left:'left',
                top:'center',
                textStyle:{
                    width:150,
                    color: 'rgb(255,255,255)'
                },
                subtext:'in Portfolio',
                subtextStyle:{
                  color:'#d1dee7'
                }
            },
            legend: {
              orient: 'vertical',
              left: 'right',
              icon:'circle',
              formatter: function(name:string){
                return name + ' - ' + data.find((i:any)=>i.name===name).value;
              },
              // data:legendData,
              textStyle:{
                color: [
                  'rgb(72,221,180)',
                  'rgb(70,156,221)',
                  'rgb(226,152,170)',
                  'rgb(237,97,98)'
                ],
              }
              // selectedMode: false
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
                            name: 'Patents',
                            type: 'pie',
                            radius: '50%',
                            avoidLabelOverlap: false,
                            label: {
                              show: true,
                              position:'outer',
                              formatter: '{d} %',
                              fontFamily:'Fira Sans'
                            },
                            labelLine: {
                              show: true
                            },
                            itemStyle:{
                              fontFamily:'Fira Sans'
                            },
                            color: [
                              'rgb(72,221,180)',
                              'rgb(70,156,221)',
                              'rgb(226,152,170)',
                              'rgb(237,97,98)'
                            ],
                            emphasis: {
                              itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                            },
                            data: data
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

  //   const  exportChart=()=>{
  //     if (chartRef.current !== null) {
  //       const chart = echarts.getInstanceByDom(chartRef.current);
  //     var baseImage = chart?.getDataURL({type:"png"});
  //   }
  // };

    return (
      <div>
      {/* <button onClick={exportChart}>Export</button> */}
        <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
    </div>);
  }
  
  export default PatentStatusDistribution;