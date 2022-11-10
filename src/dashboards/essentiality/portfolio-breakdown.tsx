import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function PortfolioBreakdown() {

    const jsonData=[
        {"name":"Declared & High SES","value":900},
        {"name":"Declared & Low SES","value":2250},
        {"name":"Not Declared & High SES","value":1426},
        {"name":"Declared but No SES","value":300}
    ];
    const  [data,setData]:any=useState([]);
    const  [categories,setCategories]:any=useState([]);
    const  [title,setTitle]= useState('');
    const [option,setOption]=useState({});
    const  [loading,setLoading]= useState(true);

    const chartRef = useRef(null);

    useEffect(()=>{
         axios.post('/dashboards/essentiality/portfolio-overview').then((resp)=>
         {
          setData(jsonData.map((d)=> d.value));
          setCategories(jsonData.map((d)=> d.name));
          setTitle((resp.data[0].value/resp.data[1].value).toFixed(2) + ' %');
        }).catch((err)=>{
          console.log(err);
        });

    },[]);

    useEffect(()=>{
      if(data.length>0){
        setOption({
            xAxis: {
              type: 'category',
              data: categories
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                color: [
                    'rgb(236,126,60)'
                  ],
                data: data,
                type: 'bar'
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

    return (
        <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
    );
  }
  
  export default PortfolioBreakdown;