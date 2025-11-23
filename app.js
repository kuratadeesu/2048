$(function () {

    const SIZE = 4;
    let board = [];
    let score = 0;

    // 初期化
    function init() {
        board = [];
        for (let y = 0; y < SIZE; y++) {
            board[y] = [];
            for (let x = 0; x < SIZE; x++) {
                board[y][x] = 0;
            }
        }
        score = 0;
        addRandom();
        addRandom();
        draw();
    }

    // 空きマスにランダム追加
    function addRandom() {
        let empty = [];
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                if (board[y][x] === 0) empty.push({x, y});
            }
        }
        if (empty.length === 0) return;
        let r = empty[Math.floor(Math.random() * empty.length)];
        board[r.y][r.x] = Math.random() < 0.9 ? 2 : 4;
    }

    // 盤描画
    function draw() {
        const $g = $("#game");
        $g.empty();
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                let v = board[y][x];
                let $c = $("<div>").addClass("cell");
                if (v !== 0) {
                    $c.text(v).addClass("n" + v);
                }
                $g.append($c);
            }
        }
        $("#score").text("Score: " + score);
    }

    // 1行スライド処理
    function slide(row) {
        row = row.filter(v => v !== 0);

        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
                i++;
            }
        }

        row = row.filter(v => v !== 0);
        while (row.length < SIZE) row.push(0);
        return row;
    }

    // 移動処理
    function move(dir) {
        let moved = false;

        if (dir === "left") {
            for (let y = 0; y < SIZE; y++) {
                let row = board[y];
                let newRow = slide(row);
                if (row.toString() !== newRow.toString()) moved = true;
                board[y] = newRow;
            }
        }

        if (dir === "right") {
            for (let y = 0; y < SIZE; y++) {
                let row = board[y].slice().reverse();
                let newRow = slide(row).reverse();
                if (board[y].toString() !== newRow.toString()) moved = true;
                board[y] = newRow;
            }
        }

        if (dir === "up") {
            for (let x = 0; x < SIZE; x++) {
                let col = [];
                for (let y = 0; y < SIZE; y++) col.push(board[y][x]);
                let newCol = slide(col);
                for (let y = 0; y < SIZE; y++) {
                    if (board[y][x] !== newCol[y]) moved = true;
                    board[y][x] = newCol[y];
                }
            }
        }

        if (dir === "down") {
            for (let x = 0; x < SIZE; x++) {
                let col = [];
                for (let y = 0; y < SIZE; y++) col.push(board[y][x]);
                col.reverse();
                let newCol = slide(col).reverse();
                for (let y = 0; y < SIZE; y++) {
                    if (board[y][x] !== newCol[y]) moved = true;
                    board[y][x] = newCol[y];
                }
            }
        }

        if (moved) {
            addRandom();
            draw();
            checkGameOver();
        }
    }

    // ゲームオーバー判定
    function checkGameOver() {
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                if (board[y][x] === 0) return;
                if (x < SIZE - 1 && board[y][x] === board[y][x + 1]) return;
                if (y < SIZE - 1 && board[y][x] === board[y + 1][x]) return;
            }
        }
        alert("Game Over! Score: " + score);
        init();
    }

    // キー操作
    $(document).on("keydown", function (e) {
        if (e.key === "ArrowLeft") move("left");
        if (e.key === "ArrowRight") move("right");
        if (e.key === "ArrowUp") move("up");
        if (e.key === "ArrowDown") move("down");
    });

    // スワイプ（スマホ対応）
    let sx, sy;
    $("#game").on("touchstart", function (e) {
        sx = e.originalEvent.touches[0].clientX;
        sy = e.originalEvent.touches[0].clientY;
    });

    $("#game").on("touchend", function (e) {
        let ex = e.originalEvent.changedTouches[0].clientX;
        let ey = e.originalEvent.changedTouches[0].clientY;
        let dx = ex - sx;
        let dy = ey - sy;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) move("right");
            if (dx < -30) move("left");
        } else {
            if (dy > 30) move("down");
            if (dy < -30) move("up");
        }
    });

    init();

});
