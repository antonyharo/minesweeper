# 📄 Geração das Matrizes do Jogo

Este módulo é responsável por gerar a **matriz inicial** do jogo **Campo Minado** com bombas aleatórias e contagem de bombas adjacentes. Ele também permite a criação de uma matriz segura em torno de uma célula inicial.

---

## 🧩 Visão Geral

A matriz do campo minado é representada por uma grade bidimensional onde:

* `"x"` indica uma **bomba**;
* Números (`0` a `8`) indicam a **quantidade de bombas adjacentes** àquela célula;
* A célula inicial (e vizinhança) pode ser garantida como **segura**.

```js
const matrix = [
    [0, 0, 0, 0, 0, 1, "x", 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 2, 1],
    [0, 0, 1, 1, 0, 0, 0, "x", 1],
    [0, 0, 2, "x", 1, 0, 1, 2, 2],
    [0, 0, 2, 2, 2, 1, 2, "x", "x"],
    [0, 0, 1, "x", 2, "x", 3, 3, 3],
    [0, 0, 1, 2, 3, 2, "x", 2, "x"],
    [0, 0, 0, 0, 1, "x", 2, 2, 1],
    [0, 0, 0, 0, 1, 1, 1, "x", 1],
]
```

---

## 🔁 Fluxo de Geração

### 1. Criar matriz vazia

> `createEmptyMatrix(rows, cols)`

Gera uma matriz `rows x cols` preenchida com `0`, indicando ausência de bombas ou contadores.

---

### 2. Adicionar bombas

> `addBombs(matrix, bombs)`

* Insere `bombs` bombas aleatoriamente na matriz.
* Após inserir cada bomba (`"x"`), chama `updateAdjacentCells` para atualizar os contadores ao redor.

---

### 3. Atualizar vizinhos

> `updateAdjacentCells(matrix, row, col)`

Incrementa o valor das células adjacentes (horizontal, vertical e diagonal) à bomba, **desde que não sejam bombas**.

---

### 4. Criar matriz com segurança inicial

> `createSafeMatrix(rows, cols, bombs, safeRow, safeCol)`

Cria uma matriz onde a célula `(safeRow, safeCol)` **e suas vizinhas** estão livres de bombas. Tenta até 10 vezes gerar uma configuração segura.

---

### 5. Verificar segurança de uma célula

> `isUnsafe(matrix, row, col)`

Retorna `true` se a célula `(row, col)` ou **qualquer célula ao redor** for uma bomba.

---

### 6. Gerar matriz sem restrições de segurança

> `createMatrix(rows, cols, bombs)`

Cria uma matriz básica com bombas e contagem, **sem verificar se há bombas na posição inicial**.

---

## 📌 Funções Exportadas

| Função                                                  | Descrição                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| `createMatrix(rows, cols, bombs)`                       | Gera uma matriz com bombas aleatórias.                            |
| `createSafeMatrix(rows, cols, bombs, safeRow, safeCol)` | Gera uma matriz com uma célula inicial garantida como segura.     |
| `isInBounds(matrix, row, col)`                          | Verifica se uma célula está dentro dos limites da matriz.         |
| `directions`                                            | Lista de deslocamentos para as 8 direções ao redor de uma célula. |

---

## 🔧 Funções Internas

| Função                                  | Descrição                                             |
| --------------------------------------- | ----------------------------------------------------- |
| `createEmptyMatrix(rows, cols)`         | Cria a matriz base preenchida com `0`.                |
| `addBombs(matrix, bombs)`               | Posiciona bombas aleatórias na matriz.                |
| `updateAdjacentCells(matrix, row, col)` | Incrementa o número nas células vizinhas a uma bomba. |
| `isUnsafe(matrix, row, col)`            | Verifica se a célula ou suas vizinhas contêm bombas.  |

---

## 🧠 Integração entre funções

```text
createSafeMatrix()
 ├─ createEmptyMatrix()
 ├─ addBombs()
 │    └─ updateAdjacentCells()
 └─ isUnsafe()
      └─ isInBounds()
```

---

## 📌 Exemplo de uso

```js
const rows = 10;
const cols = 10;
const bombs = 15;
const safeRow = 4;
const safeCol = 4;

const matrix = await createSafeMatrix(rows, cols, bombs, safeRow, safeCol);

console.table(matrix);
```

---

## ✅ Garantias

* Células com número `n` sempre têm exatamente `n` bombas ao seu redor.
* `createSafeMatrix` garante que nenhuma bomba será colocada na coordenada `(safeRow, safeCol)` nem em suas 8 células vizinhas.
* Nunca haverá bombas duplicadas na mesma célula.

---

# Código das Funções

### Direções auxiliares

```js
export const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0], [1, 1],
];
```

**Descrição:**
Lista com os deslocamentos das 8 direções ao redor de uma célula (diagonais e ortogonais), usada para verificar vizinhos.

---

### Função `createSafeMatrix`

```js
export const createSafeMatrix = async (rows, cols, bombs, safeRow, safeCol) => {
    let matrix;
    let attempts = 0;

    do {
        matrix = createEmptyMatrix(rows, cols);
        addBombs(matrix, bombs);
        attempts++;
    } while (isUnsafe(matrix, safeRow, safeCol) && attempts < 10);

    return matrix;
};
```

**Descrição:**
Cria uma matriz onde a célula `(safeRow, safeCol)` e seus vizinhos **não contêm bombas**.
Ela tenta gerar a matriz até no máximo 10 vezes, caso a posição não seja segura.

---

### Função `isUnsafe`

```js
const isUnsafe = (matrix, row, col) => {
    for (let [dr, dc] of directions) {
        const r = row + dr;
        const c = col + dc;
        if (isInBounds(matrix, r, c) && matrix[r][c] === "x") return true;
    }
    return matrix[row][col] === "x";
};
```

**Descrição:**
Verifica se a posição `(row, col)` ou **alguma de suas 8 vizinhas** contém uma bomba (`"x"`).
Retorna `true` se for uma célula insegura.

---

### Função `createMatrix`

```js
export const createMatrix = async (rows, cols, bombs) => {
    const matrix = createEmptyMatrix(rows, cols);
    addBombs(matrix, bombs);
    return matrix;
};
```

**Descrição:**
Cria uma matriz com as dimensões e número de bombas fornecidos, **sem garantia de posição segura inicial**.

---

### Função `createEmptyMatrix`

```js
const createEmptyMatrix = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
};
```

**Descrição:**
Gera uma matriz 2D de `rows` x `cols` preenchida com `0` (sem bombas e sem contagem de vizinhos ainda).

---

### Função `addBombs`

```js
const addBombs = (matrix, bombs) => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    let bombsPlaced = 0;
    while (bombsPlaced < bombs) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (matrix[row][col] !== "x") {
            matrix[row][col] = "x";
            updateAdjacentCells(matrix, row, col);
            bombsPlaced++;
        }
    }
};
```

**Descrição:**
Insere bombas (`"x"`) aleatoriamente na matriz, evitando duplicatas.
Após cada inserção, incrementa os contadores dos vizinhos com `updateAdjacentCells`.

---

### Função `updateAdjacentCells`

```js
const updateAdjacentCells = (matrix, row, col) => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (const [dl, dc] of directions) {
        const newRow = row + dl;
        const newCol = col + dc;

        if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            matrix[newRow][newCol] !== "x"
        ) {
            matrix[newRow][newCol] += 1;
        }
    }
};
```

**Descrição:**
Incrementa em 1 o valor das células vizinhas a uma bomba, **representando o número de bombas adjacentes**.

---

### Função `isInBounds`

```js
export const isInBounds = (matrix, row, col) =>
    row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
```

**Descrição:**
Verifica se a posição `(row, col)` está **dentro dos limites válidos** da matriz.

