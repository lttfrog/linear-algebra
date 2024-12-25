interface BenchmarkResult {
    size: number;
    luTime: number;
    recursiveTime: number;
}

import quickchart from 'quickchart-js';

const gen =async  (data : BenchmarkResult[]) => {
    // const labels = data.map((d) => d.size);
    // const luTimes = data.map((d) => d.luTime);
    // const recursiveTimes = data.map((d) => d.recursiveTime);
    data.forEach((d) => {
        console.log(`N=${d.size} LU分解行列式: ${d.luTime}ms 遞歸行列式: ${d.recursiveTime}ms`);
        // d.size = Math.pow(d.size, 2);
    });

    const chart = new quickchart();
    chart
        .setConfig({
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'LU分解行列式',
                        data: data.map((d) => ({ x: d.size, y: d.luTime })),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0,
                        showLine: true,
                    },
                    {
                        label: '遞歸行列式',
                        data: data.map((d) => ({ x: d.size, y: d.recursiveTime })),
                        fill: false,
                        borderColor: 'rgb(192, 75, 192)',
                        tension: 0,
                        showLine: true,
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'N'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '毫秒'
                        }
                    }
                }
            }
        })
        .setWidth(800)
        .setHeight(400);

    await chart.toFile('chart.png');
};

import fs from 'fs';
gen(JSON.parse(fs.readFileSync('benchmark.txt').toString()));

export default gen;