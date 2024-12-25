import Matrix from './matrix';
import {A, B} from './extract_data';
// import chalk from 'chalk';
import benchmark_self from 'benchmark';
import fs from 'fs';

console.log(A.get(2, 2));
const A_transpose = A.transpose();

const X = A_transpose.dot(A).invert().dot(A_transpose).dot(B);
console.log(A.toArray(), B.toArray(), X.toArray());

// const K = Matrix([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);

const generateRandomMatrix = (rowCount: number, colCount: number) => {
    const result = [];
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < colCount; j++) {
            row.push(Math.random());
        }
        result.push(row);
    }
    return Matrix(result);
};

interface BenchmarkResult {
    size: number;
    luTime: number;
    recursiveTime: number;
}

const results: BenchmarkResult[] = [];

for (let size = 2; size <= 20; size++){
    const result: BenchmarkResult = {
        size,
        luTime: 0,
        recursiveTime: 0
    };
    const K = generateRandomMatrix(size, size);

    const suite = new benchmark_self.Suite();

    suite
        .add(`LU分解行列式 - N=${size}`, () => {
            K.determinant_lu();
        })
        .add(`遞歸行列式 - N=${size}`, () => {
            K.determinant_recursive();
        })
        .on('cycle', (event: Event) => {
            console.log(String(event.target));
            // @ts-expect-error times is a property of event
            console.log(event.target.times.period);
            // @ts-expect-error name is a property of event
            if (event.target.name.includes('LU')) {
                // @ts-expect-error times is a property of event
                result.luTime = event.target.times.period * 1000;
            } else {
                // @ts-expect-error times is a property of event
                result.recursiveTime = event.target.times.period * 1000;
            }
        })
        .run({ async: false });
    results.push(result);

    const file = fs.createWriteStream('benchmark.txt');
    file.write(JSON.stringify(results, null, 4));
}

// import chartgen from './chartgen';

// await chartgen(results);