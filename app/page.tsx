"use client";
import React, { useRef, useState } from "react";

interface Matrix {
	power: number;
	matrix: number[][];
}

const MatrixCalculator: React.FC = () => {
	const matrixFromTextRef = useRef<HTMLTextAreaElement>(null);
	const [rows, setRows] = useState<string>("2");
	const [power, setPower] = useState<string>("2");
	const [columns, setColumns] = useState<string>("2");
	const [results, setResults] = useState<Matrix[]>([]);
	const [finalResult, setFinalResult] = useState<number[][] | null>(null);
	const [matrix, setMatrix] = useState<number[][]>(createEmptyMatrix("2", "2"));

	function createEmptyMatrix(rows: string, columns: string): number[][] {
		const r = parseInt(rows, 10);
		const c = parseInt(columns, 10);
		return Array.from({ length: r }, () => Array(c).fill(0));
	}

	const findHamiltonianCycle = (graph: number[][]): number[] | null => {
		const vertices = graph.length;

		const path: number[] = [];
		const visited: boolean[] = Array(vertices).fill(false);

		const hamiltonianCycleUtil = (pos: number): boolean => {
			if (pos === vertices) {
				// All vertices are visited
				return graph[path[pos - 1]][path[0]] === 1;
			}

			for (let v = 1; v < vertices; v++) {
				if (isSafe(v, pos)) {
					path[pos] = v;

					if (hamiltonianCycleUtil(pos + 1)) {
						return true;
					}

					path[pos] = -1; // Backtrack
				}
			}

			return false;
		};

		const isSafe = (v: number, pos: number): boolean => {
			if (graph[path[pos - 1]][v] === 0) {
				return false;
			}

			if (visited[v]) {
				return false;
			}

			return true;
		};

		path[0] = 0;

		if (!hamiltonianCycleUtil(1)) {
			return null;
		}

		return path;
	};
	const handleMatrixInputChange = () => {
		if (!matrixFromTextRef.current) {
			return;
		}
		const inputValue = matrixFromTextRef.current.value;
		if (!inputValue || inputValue.length <= 0) {
			return;
		}
		const rows = inputValue
			.split("/")
			.map((rowStr) =>
				rowStr.split(",").map((element) => parseFloat(element.trim()) || 0)
			);
		const rowCount = rows.length.toString();
		const colCount = rows.length > 0 ? rows[0].length.toString() : "0";
		const updatedMatrix = createEmptyMatrix(rowCount, colCount);
		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j < rows[i].length; j++) {
				updatedMatrix[i][j] = rows[i][j];
			}
		}
		setResults([]);
		setRows(rowCount);
		setFinalResult(null);
		setColumns(colCount);
		setMatrix(updatedMatrix);
		// RECALCULATE THE MATRIX
		calculateMatrixPower();
	};

	const handleChangePower = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			let val = e.target.value;
			let number = parseInt(val, 10);
			if (isNaN(number)) {
				setPower("");
				return;
			}
			if (number <= 0 || number > 10) {
				number = 2;
			}
			setResults([]);
			setFinalResult(null);
			setPower(number + "");
			// RECALCULATE THE MATRIX
			calculateMatrixPower();
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangeRows = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			let val = e.target.value;
			let number = parseInt(val, 10);
			///////////////////////////////
			if (isNaN(number)) {
				setRows("");
				return;
			}
			if (number <= 0 || number > 10) {
				number = 2;
			}
			const res = createEmptyMatrix(number + "", columns);
			setResults([]);
			setMatrix(res);
			setRows(number + "");
			setFinalResult(null);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangeColumns = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			let val = e.target.value;
			let number = parseInt(val, 10);
			if (isNaN(number)) {
				setColumns("");
				return;
			}
			if (number <= 0 || number > 10) {
				number = 2;
			}
			let res = createEmptyMatrix(rows, number + "");
			setResults([]);
			setFinalResult(null);
			setColumns(number + "");
			setMatrix(res);
		} catch (e) {
			console.log(e);
		}
	};

	const handleMatrixElementChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		rowIndex: number,
		colIndex: number
	) => {
		const val = e.target.value;
		const number = parseFloat(val);
		const newMatrix = [...matrix];
		newMatrix[rowIndex][colIndex] = isNaN(number) ? 0 : number;
		setMatrix(newMatrix);
		setResults([]);
		setFinalResult(null);
		// RECALCULATE THE MATRIX
		calculateMatrixPower();
	};

	const multiplyMatrices = (a: number[][], b: number[][]): number[][] => {
		const rowsA = a.length;
		const rowsB = b.length;
		const colsA = a[0].length;
		const colsB = b[0].length;
		if (colsA !== rowsB) {
			throw new Error("Incompatible matrix dimensions for multiplication.");
		}
		const result: number[][] = createEmptyMatrix(rowsA + "", colsB + "");
		for (let i = 0; i < rowsA; i++) {
			for (let j = 0; j < colsB; j++) {
				for (let k = 0; k < colsA; k++) {
					result[i][j] += a[i][k] * b[k][j];
				}
			}
		}
		return result;
	};

	const addMatrices = (a: number[][], b: number[][]): number[][] => {
		const rows = a.length;
		const cols = a[0].length;
		if (rows !== b.length || cols !== b[0].length) {
			throw new Error("Incompatible matrix dimensions for addition.");
		}
		const result: number[][] = createEmptyMatrix(rows + "", cols + "");
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				result[i][j] = a[i][j] + b[i][j];
			}
		}
		return result;
	};

	const calculateMatrixPower = () => {
		try {
			let intermediateResults: Matrix[] = [];
			let resultMatrix: number[][] = matrix.map((row) => [...row]);
			const exponent = parseInt(power, 10);
			for (let i = 2; i <= exponent; i++) {
				resultMatrix = multiplyMatrices(resultMatrix, matrix);
				intermediateResults.push({
					power: i,
					matrix: resultMatrix.map((row) => [...row]),
				});
			}
			setResults(intermediateResults);
			const finalResultMatrix = intermediateResults.reduce(
				(accumulator, current) => {
					return addMatrices(accumulator, current.matrix);
				},
				matrix
			);
			setFinalResult(finalResultMatrix);
		} catch (e) {
			console.log(e);
			alert(e);
		}
	};

	return (
		<div className="flex flex-col max-w-xl mx-auto min-h-screen p-2 gap-4">
			<div className="flex flex-row gap-2 flex-wrap w-full">
				<div className="flex flex-col gap-2 flex-1 w-1/3">
					<label htmlFor="rowChange">Randuri:</label>
					<input
						name="rowChange"
						type="text"
						className="w-full"
						value={rows}
						onChange={handleChangeRows}
					/>
				</div>
				<div className="flex flex-col gap-2 flex-1 w-1/3">
					<label htmlFor="colChange">Coloane:</label>
					<input
						type="text"
						name="colChange"
						className="w-full"
						value={columns}
						onChange={handleChangeColumns}
					/>
				</div>
				<div className="flex flex-col gap-2 flex-1 w-1/3">
					<label htmlFor="pwrChange">Puterea:</label>
					<input
						name="pwrChange"
						type="text"
						className="w-full"
						value={power}
						onChange={handleChangePower}
					/>
				</div>
			</div>
			<div>
				<p>Foloseste , ca sa separi valorile si / pt o linie noua.</p>
				<div className="flex flex-col gap-2 flex-1">
					<label htmlFor="inputText">
						Introduce valorile matrici prin text:
					</label>
					<textarea
						name="inputText"
						className="min-h-40"
						placeholder="Ex: 1,2,3/1,2,3"
						ref={matrixFromTextRef}
					/>
					<button
						className="bg-black shadow-md text-white"
						onClick={handleMatrixInputChange}
					>
						Convert
					</button>
				</div>
			</div>
			<div className="flex justify-center flex-col min-w-full">
				<p className="text-center">Matricea A:</p>
				{matrix.map((row, rowIndex) => (
					<div key={rowIndex} className="flex justify-center flex-row">
						{row.map((value, colIndex) => (
							<input
								key={colIndex}
								type="text"
								value={value}
								className="w-10 text-center"
								onChange={(e) =>
									handleMatrixElementChange(e, rowIndex, colIndex)
								}
							/>
						))}
					</div>
				))}
			</div>
			<div className="flex justify-center">
				<button
					className="bg-green-600 rounded-lg shadow-md px-4 my-2"
					onClick={() => calculateMatrixPower()}
				>
					<span className="text-sm text-white">CALCULATI</span>
				</button>
			</div>
			{results.length > 0 ? (
				<>
					<hr className="bg-black py-1" />
					<div className="my-2">
						<div className="py-2">
							<p className="underline">Matricea drumurilor D:</p>
							{finalResult &&
								finalResult.map((row, rowIndex) => (
									<div
										key={rowIndex}
										className="text-center flex flex-row gap-1 justify-center"
									>
										{row.map((element, colIndex) => (
											<input
												disabled
												key={colIndex}
												value={element}
												className="w-14 text-center bg-gray-100"
											/>
										))}
									</div>
								))}
						</div>
						<div className="my-2">
							<p className="underline font-bold">Drum hamiltonean:</p>{" "}
							{findHamiltonianCycle(finalResult ?? []) != null
								? "{" + findHamiltonianCycle(finalResult ?? []) + "}"
								: "Nu are drum hamiltonean."}
						</div>
						<p className="underline">Rezultate intermediare:</p>
						{results.map((result, index) => (
							<div key={index} className="text-center flex flex-col gap-1">
								<p className="underline font-bold">A{result.power}:</p>
								{result.matrix.map((row, rowIndex) => (
									<div
										key={rowIndex}
										className="text-center flex flex-row gap-1 justify-center"
									>
										{row.map((element, colIndex) => (
											<input
												disabled
												key={colIndex}
												value={element}
												className="w-14 text-center bg-gray-100"
											/>
										))}
									</div>
								))}
							</div>
						))}
					</div>
				</>
			) : null}
		</div>
	);
};

export default MatrixCalculator;
