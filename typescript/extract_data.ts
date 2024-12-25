import { parse } from 'csv';
import fs from 'fs';
import iconv from 'iconv-lite';
import Matrix from './matrix';

const extractTableFromTime = async (year: number, month: number) => {
    if (
        year < 2020 ||
        (year === 2020 && month < 10) ||
        year > 2024 ||
        (year === 2024 && month > 9)
    ) {
        throw new Error('年份和月份不在有效範圍內');
    }
    const filePath = `./台鐵數據csv/${year}-${String(month).padStart(
        2,
        '0'
    )}.csv`;
    const file = fs.readFileSync(filePath);
    const table = parse(iconv.decode(file, 'Big5'));
    return table;
};

const a = [];
const b = [];
for (let year = 2020; year <= 2024; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
        try {
            const table = await extractTableFromTime(year, month);
            console.log(`處理 ${year}-${month} 完成`);
            const numberData = await table
                .map((element) => Number(String(element[3]).replace(/,/g, '')))
                .toArray();
            a.push([1, ...numberData.slice(3, 10)]);
            b.push(numberData[10]);
        } catch (err) {
            console.error(`處理 ${year}-${month} 出錯\n${err}`);
        }
    }
}

const A = Matrix(a);
const B = Matrix(b);

export { A, B };
