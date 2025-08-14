<template>
    <div class="home">
        <div class="statisticsBox">
            <div class="card" v-for="(item, index) in cardList" :key="item.label">
                <div class="name">{{ item.label }}</div>
                <el-statistic :value="item.value" />
            </div>
        </div>
        <div class="minChartBox">
            <div style="flex: 1;" class="chart" ref="pieChartRef"></div>
            <div style="flex: 2;" class="chart" ref="barChartRef"></div>
        </div>
        <div class="mainChartBox">
            <div class="chart" ref="lineChartRef"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, reactive } from "vue"
import * as echarts from "echarts"
import $bus from "@/bus"
import useStore from "@/store"
import { useRouter } from "vue-router"

const store = useStore()

const cardList = reactive([{
    label: "销售额",
    value: 484616
}, {
    label: "库存数",
    value: 88888
}, {
    label: "成交量",
    value: 5123
}, {
    label: "订单数",
    value: 6541
}])

onMounted(() => {
    //由于弹性盒问题，需要延迟渲染
    setTimeout(() => {
        renderAllChart()
    }, 300);
    window.addEventListener("resize", resizeAllChart)
})

onUnmounted(() => {
    $bus.off(["themeChange", "primaryColorChange"], renderAllChart)
    window.removeEventListener("resize", resizeAllChart)
})
$bus.on(["themeChange", "primaryColorChange"], renderAllChart)

const chartMaps = new Map<string, echarts.ECharts>()

//饼图
const pieChartRef = ref()
function renderPieChart() {
    const pieChart = echarts.init(pieChartRef.value)
    const option = {
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: window.getComputedStyle(document.documentElement).color
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ],
    };
    pieChart.setOption(option)

    //
    if (!chartMaps.has("pieChart")) {
        chartMaps.set("pieChart", pieChart)
    }
}

//柱状图
const barChartRef = ref()
function renderBarChart() {
    const barChart = echarts.init(barChartRef.value)
    const option = {
        tooltip: {
            trigger: "axis"
        },
        grid: {
            bottom: "10%",
            right: "5%",
            left: "8%"
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
                color: window.getComputedStyle(document.documentElement).color
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: window.getComputedStyle(document.documentElement).color
            },
            splitLine: {
                lineStyle: {
                    color: store.isDarkTheme ? "#333" : "#ddd"
                }
            },
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: store.primaryColor },
                            { offset: 1, color: window.getComputedStyle(barChartRef.value).backgroundColor }
                        ]
                    }
                }
            }
        ],
    };
    barChart.setOption(option)

    //
    if (!chartMaps.has("barChart")) {
        chartMaps.set("barChart", barChart)
    }
}


//折线图
const lineChartRef = ref()
function renderLineChart() {
    const lineChart = echarts.init(lineChartRef.value)
    const option = {
        tooltip: {
            trigger: "axis"
        },
        grid: {
            left: "5%",
            right: "5%",
            bottom: "10%"
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
                color: window.getComputedStyle(document.documentElement).color
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: store.isDarkTheme ? "#333" : "#ddd"
                }
            },
            axisLabel: {
                color: window.getComputedStyle(document.documentElement).color
            }
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                lineStyle: {
                    color: store.primaryColor
                },
                itemStyle: {
                    color: store.primaryColor
                },
                areaStyle: {
                    opacity: 1,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: store.primaryColor },
                            { offset: 1, color: window.getComputedStyle(barChartRef.value).backgroundColor }
                        ]
                    }
                },
                smooth: true
            }
        ]
    };
    lineChart.setOption(option)

    //
    if (!chartMaps.has("lineChart")) {
        chartMaps.set("lineChart", lineChart)
    }
}

function renderAllChart() {
    renderPieChart()
    renderBarChart()
    renderLineChart()
}

function resizeAllChart() {
    chartMaps.forEach((chart) => {
        chart.resize()
    })
}


</script>
<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    overflow: auto;

    .statisticsBox {
        width: 100%;
        display: flex;
        gap: 20px;

        .card {
            flex: 1 0;
            text-align: center;
            padding: 10px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background-color: var(--box-bg-color);
            box-shadow: var(--box-shadow);
        }
    }

    .minChartBox {
        width: 100%;
        display: flex;
        gap: 20px;
        height: 260px;
        flex-shrink: 0;
        overflow: hidden;

        .chart {
            flex: 1;
            border-radius: 4px;
            background-color: var(--box-bg-color);
            box-shadow: var(--box-shadow);
            overflow: hidden;
        }
    }

    .mainChartBox {
        width: 100%;
        flex: 1;

        .chart {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background-color: var(--box-bg-color);
            box-shadow: var(--box-shadow);
            overflow: hidden;
        }
    }
}
</style>