import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { useEffect, useRef, useState } from 'react';

function WordCloud() {

    const  [data,setData]:any=useState([]);
    const [option,setOption]=useState({});
    const  [loading,setLoading]= useState(true);

    const chartRef = useRef(null);

    useEffect(()=>{
       setData([{
        name: 'Sam S Club',
        value: 10000,
        textStyle: {
            color: 'black'
        },
        emphasis: {
            textStyle: {
                color: 'red'
            }
        }
    },
    {
        name: 'Macys',
        value: 6181
    },
    {
        name: 'Amy Schumer',
        value: 4386
    },
    {
        name: 'Jurassic World',
        value: 4055
    },
    {
        name: 'Charter Communications',
        value: 2467
    },
    {
        name: 'Chick Fil A',
        value: 2244
    },
    {
        name: 'Planet Fitness',
        value: 1898
    },
    {
        name: 'Pitch Perfect',
        value: 1484
    },
    {
        name: 'Express',
        value: 1112
    },
    {
        name: 'Home',
        value: 965
    },
    {
        name: 'Johnny Depp',
        value: 847
    },
    {
        name: 'Lena Dunham',
        value: 582
    },
    {
        name: 'Lewis Hamilton',
        value: 555
    },
    {
        name: 'KXAN',
        value: 550
    },
    {
        name: 'Mary Ellen Mark',
        value: 462
    },
    {
        name: 'Farrah Abraham',
        value: 366
    },
    {
        name: 'Rita Ora',
        value: 360
    },
    {
        name: 'Serena Williams',
        value: 282
    },
    {
        name: 'NCAA baseball tournament',
        value: 273
    },
    {
        name: 'Point Break',
        value: 265
    }
]);
    },[]);

    useEffect(()=>{
        setOption({
            tooltip: {},
            series: [{
                type: 'wordCloud',
        
                // The shape of the "cloud" to draw. Can be any polar equation represented as a
                // callback function, or a keyword present. Available presents are circle (default),
                // cardioid (apple or heart shape curve, the most known polar equation), diamond (
                // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.
        
                shape: 'pentagon',
        
                // Keep aspect ratio of maskImage or 1:1 for shapes
                // This option is supported from echarts-wordcloud@2.1.0
                keepAspect: false,
        
                // A silhouette image which the white area will be excluded from drawing texts.
                // The shape option will continue to apply as the shape of the cloud to grow.
        
               // maskImage: maskImage,
        
                // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
                // Default to be put in the center and has 75% x 80% size.
        
                left: 'center',
                top: 'center',
                width: '70%',
                height: '80%',
                right: null,
                bottom: null,
        
                // Text size range which the value in data will be mapped to.
                // Default to have minimum 12px and maximum 60px size.
        
                sizeRange: [12, 60],
        
                // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
        
                rotationRange: [-90, 90],
                rotationStep: 45,
        
                // size of the grid in pixels for marking the availability of the canvas
                // the larger the grid size, the bigger the gap between words.
        
                gridSize: 8,
        
                // set to true to allow word being draw partly outside of the canvas.
                // Allow word bigger than the size of the canvas to be drawn
                drawOutOfBound: true,
        
                // If perform layout animation.
                // NOTE disable it will lead to UI blocking when there is lots of words.
                layoutAnimation: true,
        
                // Global text style
                textStyle: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    // Color can be a callback function or a color string
                    color: function () {
                        // Random color
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    focus: 'self',
        
                    textStyle: {
                        textShadowBlur: 10,
                        textShadowColor: '#333'
                    }
                },
        
                // Data is an array. Each array item must have name and value property.
                data: data
        }]
        });
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

return (<div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>);

}

export default WordCloud;