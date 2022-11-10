import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function PortfolioOverview() {

    const  [data,setData]:any=useState([]);
    const  [title,setTitle]= useState('');
    const [option,setOption]=useState({});
    const  [loading,setLoading]= useState(true);

    const chartRef = useRef(null);

    useEffect(()=>{
        // const config = {
        //   headers:{
        //     "x-xsrf-token": "870fd9de-8ba0-41d7-ba6f-eba087e92bc4"
        //   }
        // };
        // /dashboards/essentiality/portfolio-overview
         axios.post('dashboards/essentiality/portfolio-overview').then((resp)=>
         {
          setData(resp.data);
          console.log(resp.data);

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
                text:title,
                left:'center',
                top:'center',
                textStyle:{
                    width:150,
                    color: 'rgb(255,255,255)'
                },
                subtext:'of patent portfolio',
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
                            name: 'Portfolio Overview',
                            type: 'pie',
                            radius: ['60%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            color: [
                              'rgb(236,126,60)',
                              'rgb(167,181,191)'
                            ],
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
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
          console.log(option);
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
  
  export default PortfolioOverview;