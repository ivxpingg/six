const axisLine_color = '#FFF';
const axisLabel_color = '#FFF';

export default {
    // color: ['#3bc9e8', '#ffd366','#ade5ae','#fe9685','#f67199','#6be0df','#e26eb6','#8378ea','#e691d1','#e1baf3','#9f98f4','#38a5db','#97b8fc'],
    color: ['#0f6fc5', '#00a2d0', '#06d2dd', '#10cf9c', '#76cd65', '#f59000'],
    grid: {
        top: 30,
        left: 30,
        right: 20,
        bottom: 20,
    },
    xAxis: {
        axisLine: {
            lineStyle: {
               // color: axisLine_color
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
           // color: axisLabel_color
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
              //  color: axisLine_color
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
           // color: axisLabel_color
        },
        splitLine: {
            show: false
        }
    }
};