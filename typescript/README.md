# some matrix implement

## Matrix.ts

高效的矩陣運算，還用typescript重寫避免了javascript的很多錯誤

實作了：

- 行列式（高斯消去and遞迴）
- LU分解
- QR分解
- SVD分解
- 逆矩陣
- 矩陣間的互相運算

另外用這個來實作了最小平方法

## Benchmark

不同方式求行列式的benchmark比較

| N | LU(毫秒) | 遞迴(毫秒) |
| - | - | - |
| 2 | 0.0029171421247236075 | 0.000007632713330019172 |
| 3 | 0.0037997739728276463 | 0.004244192833258973 |
| 4 | 0.004921889663510917 | 0.023539922387692012 |
| 5 | 0.0061906745802179745 | 0.1337852567499391 |
| 6 | 0.00758440148953409 | 0.8749421158370209 |
| 7 | 0.009571861461672734 | 6.067440099715099 |
| 8 | 0.013070184949912645 | 80.14186000000002 |
| 9 | 0.021360106468322825 | 766.961775 |
| 10 | 0.02557818046744955 | 6014.96386 |
| 11 | 0.0230992370947312 | 55084.224700000006 |

![image-20241225194425098](https://files.catbox.moe/gcx5eu.png)

證明LU方式跟 N^3 成正比（時間複雜度 O(N^3)）

![image-20241225194811473](https://files.catbox.moe/0l6bfc.png)

證明遞迴方式跟 N! 成正比（時間複雜度 O(N!)）

![image-20241225194659136](https://files.catbox.moe/6qhyu9.png)

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
