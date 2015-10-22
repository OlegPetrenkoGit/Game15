var eventNameTileClick = "TileClick";
var eventNameBoardSideOptionClick = "BoardSideOptionClick";
var eventNameBoardSideChange = "BoardSideChange";
var zeroTileId = "tile-zero";
var moveAbleTileClass = "tile-moveable";
var MoveDirections;
(function (MoveDirections) {
    MoveDirections[MoveDirections["Left"] = 0] = "Left";
    MoveDirections[MoveDirections["Right"] = 1] = "Right";
    MoveDirections[MoveDirections["Up"] = 2] = "Up";
    MoveDirections[MoveDirections["Down"] = 3] = "Down";
})(MoveDirections || (MoveDirections = {}));
;
var TilePositions;
(function (TilePositions) {
    TilePositions[TilePositions["Side"] = 0] = "Side";
    TilePositions[TilePositions["Corner"] = 1] = "Corner";
    TilePositions[TilePositions["Inside"] = 2] = "Inside";
})(TilePositions || (TilePositions = {}));
;
var TileHighlights;
(function (TileHighlights) {
    TileHighlights[TileHighlights["MoveableTile"] = 0] = "MoveableTile";
})(TileHighlights || (TileHighlights = {}));
;
var KeyboardCodes;
(function (KeyboardCodes) {
    KeyboardCodes[KeyboardCodes["Left"] = 37] = "Left";
    KeyboardCodes[KeyboardCodes["Up"] = 38] = "Up";
    KeyboardCodes[KeyboardCodes["Right"] = 39] = "Right";
    KeyboardCodes[KeyboardCodes["Down"] = 40] = "Down";
    KeyboardCodes[KeyboardCodes["R"] = 82] = "R";
})(KeyboardCodes || (KeyboardCodes = {}));
var ResponsiveSizesManager = (function () {
    function ResponsiveSizesManager() {
    }
    ResponsiveSizesManager.ResizePage = function () {
        var height = innerHeight;
        var width = innerWidth;
        if (height < width) {
            var gameContentHeightPercentage = height / height * 100 * this.gameContentPercentage;
            var gameContentWidthPercentage = height / width * 100 * this.gameContentPercentage;
            this.tileSidePercentage = gameContentHeightPercentage / BoardSideManager.boardSideTiles;
            this.tileSidePixels = this.tileSidePercentage / 100 * height;
            this.tileFontSizePixels = this.tileSidePixels * 0.33;
            this.boardSidePercentage = BoardSideManager.boardSideTiles * this.tileSidePercentage;
            this.boardSidePixels = gameContentWidthPercentage / 100 * width;
        }
        else {
        }
        //resize board
        document.getElementById("board-bottom-panel").style.width = this.boardSidePixels.toString();
        document.getElementById("board").style.width = this.boardSidePixels.toString();
        document.getElementById("board").style.height = this.boardSidePixels.toString();
    };
    ResponsiveSizesManager.gameContentPercentage = 0.7;
    return ResponsiveSizesManager;
})();
var PixelCoords = (function () {
    function PixelCoords(left, top) {
        this.left = left;
        this.top = top;
    }
    return PixelCoords;
})();
var HtmlBoardTileCoords = (function () {
    function HtmlBoardTileCoords() {
    }
    HtmlBoardTileCoords.GetPixelCoords = function (boardIndexX, boardIndexY) {
        var left = boardIndexX * ResponsiveSizesManager.tileSidePixels;
        var top = boardIndexY * ResponsiveSizesManager.tileSidePixels;
        return new PixelCoords(left, top);
    };
    return HtmlBoardTileCoords;
})();
var Tile = (function () {
    function Tile(digit) {
        this.htmlTile = new HtmlTile();
        this.htmlTile.Digit = digit;
    }
    Object.defineProperty(Tile.prototype, "Digit", {
        get: function () {
            return this.htmlTile.Digit;
        },
        set: function (digit) {
            this.htmlTile.Digit = digit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "Id", {
        get: function () {
            return this.htmlTile.Id;
        },
        set: function (id) {
            this.htmlTile.Id = id;
        },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.SetCoords = function (x, y) {
        var tileCoords = HtmlBoardTileCoords.GetPixelCoords(x, y);
        this.htmlTile.Left = tileCoords.left;
        this.htmlTile.Top = tileCoords.top;
    };
    Tile.prototype.AddClass = function (name) {
        this.htmlTile.element.classList.add(name);
    };
    Tile.prototype.RemoveClass = function (name) {
        this.htmlTile.element.classList.remove(name);
    };
    Tile.prototype.delete = function () {
        this.htmlTile.element.remove;
    };
    return Tile;
})();
var HtmlTile = (function () {
    function HtmlTile() {
        this.element = this.CreateTileDivElement();
    }
    Object.defineProperty(HtmlTile.prototype, "Left", {
        get: function () {
            var left = this.element.style.left;
            var leftNumber = parseInt(left);
            return leftNumber;
        },
        set: function (left) {
            var value = left.toString();
            this.element.style.left = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlTile.prototype, "Top", {
        get: function () {
            var top = this.element.style.top;
            var topNumber = parseInt(top);
            return topNumber;
        },
        set: function (top) {
            var value = top.toString();
            this.element.style.top = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlTile.prototype, "Digit", {
        get: function () {
            var digit = this.element.textContent;
            var digitNumber = parseInt(digit);
            return digitNumber;
        },
        set: function (digit) {
            var value = digit.toString();
            this.element.textContent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlTile.prototype, "Id", {
        get: function () {
            return this.element.id;
        },
        set: function (id) {
            this.element.id = id;
        },
        enumerable: true,
        configurable: true
    });
    HtmlTile.prototype.CreateTileDivElement = function () {
        var newDivElement = document.createElement('div');
        newDivElement.classList.add(HtmlTile.htmlTileClassName);
        newDivElement.style.height = ResponsiveSizesManager.tileSidePixels.toString();
        newDivElement.style.width = ResponsiveSizesManager.tileSidePixels.toString();
        newDivElement.style.lineHeight = ResponsiveSizesManager.tileSidePixels.toString() + "px";
        newDivElement.style.fontSize = ResponsiveSizesManager.tileFontSizePixels.toString() + "px";
        return newDivElement;
    };
    HtmlTile.htmlTileClassName = "tile";
    return HtmlTile;
})();
var BoardCell = (function () {
    function BoardCell(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(BoardCell.prototype, "HoldingTile", {
        get: function () {
            return this.holdingTile;
        },
        enumerable: true,
        configurable: true
    });
    BoardCell.prototype.SetHoldingTile = function (tile) {
        this.holdingTile = tile;
        this.holdingTile.SetCoords(this.x, this.y);
    };
    BoardCell.prototype.AddTileToToBoard = function (boardId) {
        var htmlBoard = document.getElementById(boardId);
        var htmlTile = this.holdingTile.htmlTile;
        htmlBoard.appendChild(htmlTile.element);
        this.AddOnClickNotifyBoard();
    };
    BoardCell.prototype.AddOnClickNotifyBoard = function () {
        var htmlBoard = document.getElementById(Board.boardId);
        var eventTarget = htmlBoard;
        var event = new CustomEvent(eventNameTileClick, { detail: this.holdingTile.Digit });
        this.holdingTile.htmlTile.element.onclick = function () { eventTarget.dispatchEvent(event); };
    };
    BoardCell.prototype.RemoveOnClickNotifyBoard = function () {
        this.holdingTile.htmlTile.element.onclick = null;
    };
    BoardCell.prototype.delete = function () {
        this.holdingTile.delete();
    };
    return BoardCell;
})();
var Board = (function () {
    function Board() {
        this.element = document.getElementById(Board.boardId);
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;
        this.cells = new Array(tilesCount);
        var tileIndex = 0;
        for (var y = 0; y < sideTilesCount; y++) {
            var row = new Array(tilesCount);
            this.cells[y] = row;
            for (var x = 0; x < sideTilesCount; x++) {
                var boardCell = new BoardCell(x, y);
                row[x] = boardCell;
                var tileDigit;
                var tile;
                if (tileIndex == tilesCount - 1) {
                    tileDigit = 0;
                    tile = new Tile(tileDigit);
                    tile.Id = zeroTileId;
                    this.boardCellHoldingZeroTile = boardCell;
                }
                else {
                    tileDigit = tileIndex + 1;
                    tile = new Tile(tileDigit);
                }
                boardCell.SetHoldingTile(tile);
                boardCell.AddTileToToBoard(Board.boardId);
                tileIndex++;
            }
        }
    }
    Board.prototype.delete = function () {
        this.element = null;
        this.cells.forEach(function (e) {
            e.forEach(function (e) {
                e.delete();
            });
        });
        this.boardCellHoldingZeroTile = null;
    };
    Board.boardId = "board";
    return Board;
})();
var BoardManager = (function () {
    function BoardManager() {
        this.board = new Board();
        this.SubscribeToTileClick();
        this.SubscribeToKeyboardButtons();
        this.movesCounter = new MovesCounter();
        this.GameReset();
    }
    Object.defineProperty(BoardManager.prototype, "BoardCellHoldingZeroTile", {
        get: function () {
            return this.board.boardCellHoldingZeroTile;
        },
        enumerable: true,
        configurable: true
    });
    BoardManager.prototype.SubscribeToTileClick = function () {
        var _this = this;
        this.board.element.addEventListener("TileClick", function (eventData) { return _this.OnTileClick(eventData); }, true);
    };
    BoardManager.prototype.SubscribeToKeyboardButtons = function () {
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case KeyboardCodes.Left:
                    {
                        alert(e.keyCode);
                    }
            }
        };
    };
    BoardManager.prototype.OnTileClick = function (data) {
        var clickedTileDigit = data.detail;
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;
        var breakCycle = false;
        for (var y = 0; y < sideTilesCount; y++) {
            for (var x = 0; x < sideTilesCount; x++) {
                var currentBoardCell = this.board.cells[y][x];
                var currentTile = currentBoardCell.HoldingTile;
                if (currentTile.Digit == clickedTileDigit) {
                    this.MoveTile(currentBoardCell);
                    breakCycle = true;
                    break;
                }
            }
            if (breakCycle) {
                break;
            }
        }
    };
    BoardManager.prototype.MoveTile = function (boardCell) {
        var move = false;
        //left
        if (boardCell.x == this.BoardCellHoldingZeroTile.x + 1 &&
            boardCell.y == this.BoardCellHoldingZeroTile.y) {
            move = true;
        }
        else if (boardCell.x == this.BoardCellHoldingZeroTile.x - 1 &&
            boardCell.y == this.BoardCellHoldingZeroTile.y) {
            move = true;
        }
        else if (boardCell.x == this.BoardCellHoldingZeroTile.x &&
            boardCell.y == this.BoardCellHoldingZeroTile.y + 1) {
            move = true;
        }
        else if (boardCell.x == this.BoardCellHoldingZeroTile.x &&
            boardCell.y == this.BoardCellHoldingZeroTile.y - 1) {
            move = true;
        }
        if (move) {
            if (this.movesCounter.IsEnabled) {
                this.movesCounter.CountMove();
            }
            this.HighlightMoveAbleTiles(false);
            this.TileMove(boardCell);
            if (this.movesCounter.IsEnabled && this.IsBoardSolved()) {
                this.movesCounter.IsEnabled = false;
                this.SubscribeForTilesOnClick(false);
            }
            else {
                this.HighlightMoveAbleTiles(true);
            }
        }
    };
    BoardManager.prototype.SubscribeForTilesOnClick = function (subscribe) {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;
        for (var y = 0; y < sideTilesCount; y++) {
            for (var x = 0; x < sideTilesCount; x++) {
                var currentBoardCell = this.board.cells[y][x];
                if (subscribe) {
                    currentBoardCell.AddOnClickNotifyBoard();
                }
                else {
                    currentBoardCell.RemoveOnClickNotifyBoard();
                }
            }
        }
    };
    BoardManager.prototype.IsBoardSolved = function () {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;
        var solvedBoardDigit = 1;
        for (var y = 0; y < sideTilesCount; y++) {
            for (var x = 0; x < sideTilesCount; x++) {
                var currentTileDigit = this.board.cells[y][x].HoldingTile.Digit;
                if (solvedBoardDigit == tilesCount) {
                    if (currentTileDigit == 0) {
                        return true;
                    }
                }
                else if (currentTileDigit == solvedBoardDigit) {
                    solvedBoardDigit++;
                }
                else {
                    return false;
                }
            }
        }
    };
    BoardManager.prototype.HighlightMoveAbleTiles = function (highlight) {
        var moveAbleTiles = TileGetter.GetMoveAbleTiles(this.board);
        var highlightTile = function (boardCell) { return TileHighlighter.SetTileHighlight(boardCell, TileHighlights.MoveableTile, highlight); };
        moveAbleTiles.forEach(highlightTile);
    };
    BoardManager.prototype.TileMove = function (boardCell) {
        var boardCellDigit = boardCell;
        var boardCellZero = this.BoardCellHoldingZeroTile;
        //swap tiles
        var tileDigit = boardCellDigit.HoldingTile;
        boardCellDigit.SetHoldingTile(boardCellZero.HoldingTile);
        boardCellZero.SetHoldingTile(tileDigit);
        //swap reference on cell holding zero tile
        this.board.boardCellHoldingZeroTile = boardCellDigit;
    };
    BoardManager.prototype.GameReset = function () {
        this.SubscribeForTilesOnClick(true);
        this.Shuffle();
    };
    BoardManager.prototype.Shuffle = function () {
        this.movesCounter.Reset();
        this.movesCounter.IsEnabled = false;
        var shuffleTimes = 15;
        for (var i = 0; i < shuffleTimes; i++) {
            var moveAbleTiles = TileGetter.GetMoveAbleTiles(this.board);
            var moveAbleTilesCount = moveAbleTiles.length;
            var random = Math.floor((Math.random() * moveAbleTilesCount));
            var selectedTile = moveAbleTiles[random];
            this.MoveTile(selectedTile);
        }
        this.movesCounter.IsEnabled = true;
        //alert(this.CanBoardBeSolved());
    };
    BoardManager.prototype.CanBoardBeSolved = function () {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;
        var e = 0;
        var tiles = new Array();
        for (var i = 0; i < sideTilesCount; i++) {
            for (var j = 0; j < sideTilesCount; j++) {
                var tile = this.board.cells[i][j].HoldingTile;
                if (tile.Digit == 0) {
                    e = i + 1;
                }
                tiles.push(tile);
            }
        }
        var sum = 0;
        for (var i = 0; i < tilesCount; i++) {
            var current = tiles[i].Digit;
            for (var j = i + 1; j < tilesCount; j++) {
                var compareTo = tiles[j].Digit;
                if (compareTo != 0 && current > compareTo) {
                    sum++;
                }
            }
        }
        sum += e;
        return (sum % 2 == 0);
    };
    BoardManager.prototype.delete = function () {
        this.board.delete();
    };
    return BoardManager;
})();
var MovesCounter = (function () {
    function MovesCounter() {
        this.isEnabled = false;
        this.element = document.getElementById("movescounter-span");
        this.counter = 0;
        this.Counter = this.counter;
    }
    Object.defineProperty(MovesCounter.prototype, "IsEnabled", {
        get: function () {
            return this.isEnabled;
        },
        set: function (value) {
            if (!this.isEnabled == value) {
                this.isEnabled = value;
                if (value) {
                    document.getElementById("movescounter").className = "enabled";
                }
                else {
                    document.getElementById("movescounter").className = "disabled";
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MovesCounter.prototype, "Counter", {
        get: function () {
            return this.counter;
        },
        set: function (value) {
            this.counter = value;
            this.element.textContent = this.counter.toString();
        },
        enumerable: true,
        configurable: true
    });
    MovesCounter.prototype.CountMove = function () {
        this.Counter = ++this.counter;
    };
    MovesCounter.prototype.Reset = function () {
        this.Counter = 0;
    };
    return MovesCounter;
})();
var TileGetter = (function () {
    function TileGetter() {
    }
    TileGetter.GetTilePosition = function (board, boardCell) {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var x = boardCell.x;
        var y = boardCell.y;
        var edgeIndex = sideTilesCount - 1;
        if (x == 0 || x == edgeIndex &&
            y == 0 || y == edgeIndex) {
            return TilePositions.Corner;
        }
        else if (x == 0 || x == edgeIndex || y == 0 || y == edgeIndex) {
            return TilePositions.Side;
        }
        else {
            return TilePositions.Inside;
        }
    };
    TileGetter.GetMoveAbleTiles = function (board) {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var zeroTileBoardCell = board.boardCellHoldingZeroTile;
        var x = zeroTileBoardCell.x;
        var y = zeroTileBoardCell.y;
        var moveAbleTiles = new Array();
        //left tile
        if (0 <= x - 1) {
            var boardCell = board.cells[y][x - 1];
            moveAbleTiles.push(boardCell);
        }
        //right tile
        if (x + 1 < sideTilesCount) {
            var boardCell = board.cells[y][x + 1];
            moveAbleTiles.push(boardCell);
        }
        //top tile
        if (0 <= y - 1) {
            var boardCell = board.cells[y - 1][x];
            moveAbleTiles.push(boardCell);
        }
        //bottom tile
        if (y + 1 < sideTilesCount) {
            var boardCell = board.cells[y + 1][x];
            moveAbleTiles.push(boardCell);
        }
        return moveAbleTiles;
    };
    return TileGetter;
})();
var TileHighlighter = (function () {
    function TileHighlighter() {
    }
    TileHighlighter.SetTileHighlight = function (boardCell, highlight, add) {
        var tileClass;
        switch (highlight) {
            case TileHighlights.MoveableTile:
                {
                    tileClass = moveAbleTileClass;
                    break;
                }
        }
        if (add) {
            boardCell.HoldingTile.htmlTile.element.classList.add(tileClass);
        }
        else {
            boardCell.HoldingTile.htmlTile.element.classList.remove(tileClass);
        }
    };
    return TileHighlighter;
})();
var BoardSideOption = (function () {
    function BoardSideOption(value, element) {
        var _this = this;
        this.value = value;
        this.element = element;
        this.Selected = false;
        this.element.onclick = function () {
            if (!_this.Selected) {
                var event = new CustomEvent(eventNameBoardSideOptionClick, { detail: _this.value });
                document.dispatchEvent(event);
            }
        };
        if (value == BoardSideManager.boardSideTiles) {
            this.Selected = true;
        }
        else {
            this.Selected = false;
        }
    }
    Object.defineProperty(BoardSideOption.prototype, "Selected", {
        get: function () {
            return this.element.classList.contains("selected");
        },
        set: function (value) {
            if (this.Selected != value) {
                if (value) {
                    this.element.classList.add("selected");
                }
                else if (!value) {
                    this.element.classList.remove("selected");
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return BoardSideOption;
})();
var BoardSideManager = (function () {
    function BoardSideManager() {
        this.SubscribeToBoardSideOptionClick();
        var selector = document.getElementById("board-side-selector");
        var count = selector.childNodes.length;
        this.options = new Array();
        for (var i = 0; i < count; i++) {
            if (selector.childNodes[i].localName == "label") {
                var element = selector.childNodes[i];
                var value = parseInt(element.textContent);
                var option = new BoardSideOption(value, element);
                this.options.push(option);
            }
        }
    }
    BoardSideManager.prototype.SubscribeToBoardSideOptionClick = function () {
        var _this = this;
        document.addEventListener(eventNameBoardSideOptionClick, function (e) { return _this.PublishBoardSideChange(e); }, true);
    };
    BoardSideManager.prototype.PublishBoardSideChange = function (value) {
        var newBoardSide = value.detail;
        BoardSideManager.boardSideTiles = newBoardSide;
        this.options.forEach(function (option) { option.Selected = (option.value == newBoardSide); });
        var event = new CustomEvent(eventNameBoardSideChange, { detail: newBoardSide });
        document.dispatchEvent(event);
    };
    BoardSideManager.boardSideTiles = 4;
    return BoardSideManager;
})();
var GameFlow = (function () {
    function GameFlow() {
        this.boardSideManager = new BoardSideManager();
        this.SubscribeToBoardSideChange();
        this.StartNewGame();
    }
    GameFlow.prototype.SubscribeToBoardSideChange = function () {
        var _this = this;
        document.addEventListener(eventNameBoardSideChange, function () { return _this.StartNewGame(); }, true);
    };
    GameFlow.prototype.StartNewGame = function () {
        var _this = this;
        ResponsiveSizesManager.ResizePage();
        if (this.boardManager != null) {
            this.boardManager.delete();
        }
        this.boardManager = new BoardManager;
        document.getElementById("button-shuffle").onclick = function () { return _this.boardManager.GameReset(); };
    };
    return GameFlow;
})();
window.onload = function () {
    var gameFlow = new GameFlow();
};
//# sourceMappingURL=app.js.map