const createZeroArray = (rowCount: number, colCount: number) => {
    return Array(rowCount)
        .fill(0)
        .map(() => Array(colCount).fill(0));
};

const Matrix = (givenArray: number[][]) => {
    if (givenArray.length === 0 || givenArray[0].length === 0) {
        throw new Error('矩陣應該至少要有長跟寬');
    }
    givenArray.forEach((row) => {
        if (row.length !== givenArray[0].length) {
            throw new Error('矩陣的每一個row應該要有相同的長度');
        }
    });

    const rowCount = givenArray.length;
    const colCount = givenArray[0].length;
    const array = structuredClone(givenArray);

    const matrix = () => array;

    matrix.row = (rowIndex: number) => {
        return array[rowIndex];
    };
    matrix.col = (colIndex: number) => {
        return array.map((row) => row[colIndex]);
    };
    matrix.rowCount = () => rowCount;
    matrix.colCount = () => colCount;
    matrix.get = (rowIndex: number, colIndex: number) => {
        if (
            rowIndex < 0 ||
            rowIndex >= rowCount ||
            colIndex < 0 ||
            colIndex >= colCount
        ) {
            throw new Error('超出矩陣範圍');
        }
        return array[rowIndex][colIndex];
    };
    matrix.set = (rowIndex: number, colIndex: number, value: number) => {
        if (
            rowIndex < 0 ||
            rowIndex >= rowCount ||
            colIndex < 0 ||
            colIndex >= colCount
        ) {
            throw new Error('超出矩陣範圍');
        }
        array[rowIndex][colIndex] = value;
    };
    matrix.getRow = (rowIndex: number) => {
        return Matrix([array[rowIndex]]);
    };
    matrix.getCol = (colIndex: number) => {
        return Matrix(array.map((row) => [row[colIndex]]));
    };
    matrix.setRow = (rowIndex: number, row: number[]) => {
        if (row.length !== colCount) {
            throw new Error('row的長度不符合矩陣的colCount');
        }
        if (rowIndex < 0 || rowIndex >= rowCount) {
            throw new Error('超出矩陣範圍');
        }
        array[rowIndex] = row;
    };
    matrix.setCol = (colIndex: number, col: number[]) => {
        if (col.length !== rowCount) {
            throw new Error('col的長度不符合矩陣的rowCount');
        }
        if (colIndex < 0 || colIndex >= colCount) {
            throw new Error('超出矩陣範圍');
        }
        array.forEach((row, index) => {
            row[colIndex] = col[index];
        });
    };
    matrix.add = (anotherMatrix: ReturnType<typeof Matrix>) => {
        if (
            rowCount !== anotherMatrix.rowCount() ||
            colCount !== anotherMatrix.colCount()
        ) {
            throw new Error('兩個矩陣的大小不一樣');
        }
        const result = Array(rowCount)
            .fill(0)
            .map(() => Array(colCount).fill(0));
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                result[i][j] = array[i][j] + anotherMatrix.get(i, j);
            }
        }
        return Matrix(result);
    };
    matrix.sub = (anotherMatrix: ReturnType<typeof Matrix>) => {
        if (
            rowCount !== anotherMatrix.rowCount() ||
            colCount !== anotherMatrix.colCount()
        ) {
            throw new Error('兩個矩陣的大小不一樣');
        }
        const result = Array(rowCount)
            .fill(0)
            .map(() => Array(colCount).fill(0));
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                result[i][j] = array[i][j] - anotherMatrix.get(i, j);
            }
        }
        return Matrix(result);
    };
    matrix.dot = (anotherMatrix: ReturnType<typeof Matrix>) => {
        if (colCount !== anotherMatrix.rowCount()) {
            throw new Error('前者矩陣的colCount跟後者矩陣的rowCount不一樣');
        }
        const result = createZeroArray(rowCount, anotherMatrix.colCount());
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < anotherMatrix.colCount(); j++) {
                for (let k = 0; k < colCount; k++) {
                    result[i][j] += array[i][k] * anotherMatrix.get(k, j);
                }
            }
        }
        return Matrix(result);
    };
    matrix.transpose = () => {
        const result = createZeroArray(colCount, rowCount);
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                result[j][i] = array[i][j];
            }
        }
        return Matrix(result);
    };
    matrix.clone = () => {
        return Matrix(array);
    };
    matrix.toArray = () => {
        return structuredClone(array);
    };
    matrix.invert = () => {
        if (rowCount !== colCount) throw new Error('只有方陣才可以被反轉');

        const n = rowCount;
        const augmented: number[][] = array.map((row, i) => [
            ...row,
            ...createZeroArray(1, n)[0].map((_, j) => (i === j ? 1 : 0)),
        ]);

        for (let row = 0; row < n; row++) {
            let pivotRow = row;
            for (let k = row + 1; k < n; k++) {
                if (
                    Math.abs(augmented[k][row]) >
                    Math.abs(augmented[pivotRow][row])
                ) {
                    pivotRow = k;
                }
            }
            [augmented[row], augmented[pivotRow]] = [
                augmented[pivotRow],
                augmented[row],
            ];

            if (augmented[row][row] === 0) throw new Error('矩陣不可逆');

            const divisor = augmented[row][row];
            for (let j = 0; j < 2 * n; j++) {
                augmented[row][j] /= divisor;
            }
            for (let k = 0; k < n; k++) {
                if (k === row) continue;
                const multi = augmented[k][row];
                for (let j = 0; j < 2 * n; j++) {
                    augmented[k][j] -= multi * augmented[row][j];
                }
            }
        }
        return Matrix(augmented.map((row) => row.slice(n)));
    };
    matrix.qrDecomposition = () => {
        const Q = createZeroArray(rowCount, colCount);
        const R = createZeroArray(rowCount, colCount);
        const v = createZeroArray(rowCount, colCount);

        for (let col = 0; col < colCount; col++) {
            for (let i = 0; i < col; i++) {
                let sum = 0;
                for (let k = 0; k < rowCount; k++) {
                    sum += array[k][col] * Q[k][i];
                }
                R[i][col] = sum;
                for (let j = 0; j < rowCount; j++) {
                    v[j][col] = array[j][col] - sum * Q[j][i];
                }
            }
            let norm = 0;
            for (let i = 0; i < rowCount; i++) {
                norm += v[i][col] ** 2;
            }
            norm = Math.sqrt(norm);
            R[col][col] = norm;
            for (let i = 0; i < rowCount; i++) {
                Q[i][col] = v[i][col] / norm;
            }
        }
        return { Q: Matrix(Q), R: Matrix(R) };
    };
    matrix.svdDecomposition = () => {
        const U = createZeroArray(rowCount, rowCount);
        const S = createZeroArray(rowCount, colCount);
        const V = createZeroArray(colCount, colCount);

        const AtA = Matrix(array).transpose().dot(Matrix(array));
        const AAt = Matrix(array).dot(Matrix(array).transpose());

        const { Q: UQ, R: UR } = AtA.qrDecomposition();
        const { Q: VQ } = AAt.qrDecomposition();

        for (let i = 0; i < rowCount; i++) {
            S[i][i] = Math.sqrt(UR.get(i, i));
        }

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < rowCount; j++) {
                U[i][j] = UQ.get(i, j);
            }
        }

        for (let i = 0; i < colCount; i++) {
            for (let j = 0; j < colCount; j++) {
                V[i][j] = VQ.get(i, j);
            }
        }

        return { U: Matrix(U), S: Matrix(S), V: Matrix(V) };
    };
    matrix.luDecomposition = () => {
        if (rowCount !== colCount) throw new Error('只有方陣才可以被分解');

        const L = createZeroArray(rowCount, colCount);
        const U = createZeroArray(rowCount, colCount);

        for (let i = 0; i < rowCount; i++) {
            L[i][i] = 1;
        }

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < rowCount; j++) {
                if (j < i) {
                    L[j][i] = array[j][i];
                    for (let k = 0; k < j; k++) {
                        L[j][i] -= L[j][k] * U[k][i];
                    }
                    L[j][i] /= U[j][j];
                } else {
                    U[j][i] = array[j][i];
                    for (let k = 0; k < i; k++) {
                        U[j][i] -= L[j][k] * U[k][i];
                    }
                }
            }
        }

        return { L: Matrix(L), U: Matrix(U) };
    };
    matrix.determinant_lu = () => {
        if (rowCount !== colCount) throw new Error('只有方陣才有行列式');

        const { U } = matrix.luDecomposition();

        let det = 1;
        for (let i = 0; i < rowCount; i++) {
            det *= U.get(i, i);
        }

        return det;
    };
    matrix.determinant_recursive = () => {
        if (rowCount !== colCount) throw new Error('只有方陣才有行列式');

        if (rowCount === 1) return array[0][0];
        if (rowCount === 2)
            return array[0][0] * array[1][1] - array[0][1] * array[1][0];

        let det = 0;
        for (let i = 0; i < rowCount; i++) {
            const subMatrix = array
                .slice(1)
                .map((row) => row.filter((_, j) => j !== i));
            det += array[0][i] * Matrix(subMatrix).determinant_recursive();
        }

        return det;
    };
    return matrix;
};

export default Matrix;
