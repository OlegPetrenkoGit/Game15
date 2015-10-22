
const eventNameTileClick = "TileClick";
const eventNameBoardSideOptionClick = "BoardSideOptionClick";
const eventNameBoardSideChange = "BoardSideChange";

const zeroTileId = "tile-zero";
const moveAbleTileClass = "tile-moveable";

enum MoveDirections { Left, Right, Up, Down };
enum TilePositions { Side, Corner, Inside };
enum TileHighlights { MoveableTile };
enum KeyboardCodes {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    S = 83
}

class ResponsiveSizesManager {
    static windowContentHeight: number;
    static tileFontSizePixels: number;

    private static safeHeightOffset: number = 70;
    private static safeWidthOffset: number = 20;

    private static tileSidePercentage: number;
    private static boardSidePercentage: number;

    public static tileSidePixels: number;
    public static boardSidePixels: number;

    static ResizePage() {
        var pageHeight = innerHeight;
        var pageWidth = innerWidth;

        if (pageHeight < pageWidth) {
            var bodyHeightUsefulPixels = (document.body.clientHeight - document.querySelector('footer').clientHeight - this.safeHeightOffset);
            var bodyHeightUsefulPercentage = bodyHeightUsefulPixels / pageHeight;

            var gameContentHeightPercentage = pageHeight / pageHeight * 100 * bodyHeightUsefulPercentage;
            var gameContentWidthPercentage = pageHeight / pageWidth * 100 * bodyHeightUsefulPercentage;

            this.tileSidePercentage = gameContentHeightPercentage / BoardSideManager.boardSideTiles;
            this.tileSidePixels = this.tileSidePercentage / 100 * pageHeight;
            this.tileFontSizePixels = this.tileSidePixels * 0.33;

            this.boardSidePercentage = BoardSideManager.boardSideTiles * this.tileSidePercentage;
            this.boardSidePixels = gameContentWidthPercentage / 100 * pageWidth;
        }
        else {
            var bodyWidthUsefulPixels = (document.body.clientWidth - this.safeWidthOffset);
            var bodyWidthUsefulPercentage = bodyWidthUsefulPixels / pageWidth;

            var gameContentWidthPercentage = pageWidth / pageWidth * 100 * bodyWidthUsefulPercentage;
            var gameContentHeightPercentage = pageWidth / pageHeight * 100 * bodyWidthUsefulPercentage;

            this.tileSidePercentage = gameContentHeightPercentage / BoardSideManager.boardSideTiles;
            this.tileSidePixels = this.tileSidePercentage / 100 * pageHeight;
            this.tileFontSizePixels = this.tileSidePixels * 0.33;

            this.boardSidePercentage = BoardSideManager.boardSideTiles * this.tileSidePercentage;
            this.boardSidePixels = gameContentWidthPercentage / 100 * pageWidth;
        }

        //resize board
        document.getElementById("board-bottom-panel").style.width = this.boardSidePixels.toString();

        document.getElementById("board").style.width = this.boardSidePixels.toString();
        document.getElementById("board").style.height = this.boardSidePixels.toString();
    }
}

class PixelCoords {
    public left: number;
    public top: number;

    public constructor(left: number, top: number) {
        this.left = left;
        this.top = top;
    }
}

class HtmlBoardTileCoords {
    public static GetPixelCoords(boardIndexX: number, boardIndexY: number): PixelCoords {
        var left = boardIndexX * ResponsiveSizesManager.tileSidePixels;
        var top = boardIndexY * ResponsiveSizesManager.tileSidePixels;
        return new PixelCoords(left, top);
    }
}

class Tile {
    public htmlTile: HtmlTile;

    get Digit(): number {
        return this.htmlTile.Digit;
    }
    set Digit(digit: number) {
        this.htmlTile.Digit = digit;
    }

    get Id(): string {
        return this.htmlTile.Id;
    }
    set Id(id: string) {
        this.htmlTile.Id = id;
    }

    public constructor(digit: number) {
        this.htmlTile = new HtmlTile();
        this.htmlTile.Digit = digit;
    }

    public SetCoords(x: number, y: number) {
        var tileCoords = HtmlBoardTileCoords.GetPixelCoords(x, y);
        this.htmlTile.Left = tileCoords.left;
        this.htmlTile.Top = tileCoords.top;
    }

    public AddClass(name: string) {
        this.htmlTile.element.classList.add(name);
    }

    public RemoveClass(name: string) {
        this.htmlTile.element.classList.remove(name);
    }

    public delete() {
        this.htmlTile.element.remove;
    }
}

class HtmlTile {
    static htmlTileClassName = "tile";

    public element: HTMLDivElement;

    constructor() {
        this.element = this.CreateTileDivElement();
    }

    get Left() {
        var left = this.element.style.left;
        var leftNumber = parseInt(left);
        return leftNumber;
    }
    set Left(left: number) {
        var value = left.toString();
        this.element.style.left = value;
    }

    get Top() {
        var top = this.element.style.top;
        var topNumber = parseInt(top);
        return topNumber;
    }
    set Top(top: number) {
        var value = top.toString();
        this.element.style.top = value;
    }

    get Digit(): number {
        var digit = this.element.textContent;
        var digitNumber = parseInt(digit);
        return digitNumber;
    }
    set Digit(digit: number) {
        var value = digit.toString();
        this.element.textContent = value;
    }

    get Id(): string {
        return this.element.id;
    }
    set Id(id: string) {
        this.element.id = id;
    }

    private CreateTileDivElement(): HTMLDivElement {
        var newDivElement: HTMLDivElement = document.createElement('div');
        newDivElement.classList.add(HtmlTile.htmlTileClassName);

        newDivElement.style.height = ResponsiveSizesManager.tileSidePixels.toString();
        newDivElement.style.width = ResponsiveSizesManager.tileSidePixels.toString();
        newDivElement.style.lineHeight = ResponsiveSizesManager.tileSidePixels.toString() + "px";
        newDivElement.style.fontSize = ResponsiveSizesManager.tileFontSizePixels.toString() + "px";

        return newDivElement;
    }
}

class BoardCell {
    public x: number;
    public y: number;
    private holdingTile: Tile;

    get HoldingTile(): Tile {
        return this.holdingTile;
    }

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public SetHoldingTile(tile: Tile) {
        this.holdingTile = tile;
        this.holdingTile.SetCoords(this.x, this.y);
    }

    public AddTileToToBoard(boardId: string) {
        var htmlBoard = document.getElementById(boardId);
        var htmlTile = this.holdingTile.htmlTile;
        htmlBoard.appendChild(htmlTile.element);

        this.AddOnClickNotifyBoard();
    }

    public AddOnClickNotifyBoard() {
        var htmlBoard = document.getElementById(Board.boardId);
        var eventTarget = htmlBoard;
        var event = new CustomEvent(eventNameTileClick, { detail: this.holdingTile.Digit });

        this.holdingTile.htmlTile.element.onclick = () => { eventTarget.dispatchEvent(event); };
    }

    public RemoveOnClickNotifyBoard() {
        this.holdingTile.htmlTile.element.onclick = null;
    }

    public delete() {
        this.holdingTile.delete();
    }
}

class Board {
    static boardId = "board";

    public element: HTMLElement;
    public cells: BoardCell[][];
    public boardCellHoldingZeroTile: BoardCell;

    public constructor() {
        this.element = document.getElementById(Board.boardId);

        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;

        this.cells = new Array<Array<BoardCell>>(tilesCount);
        var tileIndex: number = 0;
        for (var y = 0; y < sideTilesCount; y++) {
            var row = new Array<BoardCell>(tilesCount);
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

    public delete() {
        this.element = null;

        this.cells.forEach((e) => {
            e.forEach((e) => {
                e.delete();
            });
        });

        this.boardCellHoldingZeroTile = null;
    }
}

class BoardManager {
    private board: Board;
    private movesCounter: MovesCounter;

    get BoardCellHoldingZeroTile(): BoardCell {
        return this.board.boardCellHoldingZeroTile;
    }

    public constructor() {
        this.board = new Board();
        this.SubscribeToTileClick();
        this.SubscribeToKeyboardButtons();

        this.movesCounter = new MovesCounter();

        this.GameReset();
    }

    private SubscribeToTileClick() {
        this.board.element.addEventListener("TileClick", (eventData) => this.OnTileClick(eventData), true);
    }

    private SubscribeToKeyboardButtons() {
        window.onkeydown = (e) => this.OnKeyDown(e);
    }

    private OnKeyDown(e) {
        var x: number;
        var y: number;
        var tileToMove: BoardCell = null;

        switch (e.keyCode) {
            case KeyboardCodes.Left:
                {
                    if (this.TryMoveZeroTile(MoveDirections.Left)) {
                        x = this.BoardCellHoldingZeroTile.x - 1;
                        y = this.BoardCellHoldingZeroTile.y;
                        tileToMove = this.board.cells[y][x];
                    }
                    break;
                }
            case KeyboardCodes.Right:
                {
                    if (this.TryMoveZeroTile(MoveDirections.Right)) {
                        x = this.BoardCellHoldingZeroTile.x + 1;
                        y = this.BoardCellHoldingZeroTile.y;
                        tileToMove = this.board.cells[y][x];
                    }
                    break;
                }
            case KeyboardCodes.Up:
                {
                    if (this.TryMoveZeroTile(MoveDirections.Up)) {
                        x = this.BoardCellHoldingZeroTile.x;
                        y = this.BoardCellHoldingZeroTile.y - 1;
                        tileToMove = this.board.cells[y][x];
                    }
                    break;
                }
            case KeyboardCodes.Down:
                {
                    if (this.TryMoveZeroTile(MoveDirections.Down)) {
                        x = this.BoardCellHoldingZeroTile.x;
                        y = this.BoardCellHoldingZeroTile.y + 1;
                        tileToMove = this.board.cells[y][x];
                    }
                    break;
                }
            case KeyboardCodes.S:
                {
                    this.GameReset();
                    return;
                }
        }

        if (tileToMove != null) {
            this.MoveTile(tileToMove);
        }
    }

    private TryMoveZeroTile(moveDirection: MoveDirections) {
        switch (moveDirection) {
            case MoveDirections.Left:
                {
                    return (0 < this.BoardCellHoldingZeroTile.x);
                }
            case MoveDirections.Right:
                {
                    return (this.BoardCellHoldingZeroTile.x < BoardSideManager.boardSideTiles);
                }
            case MoveDirections.Up:
                {
                    return (0 < this.BoardCellHoldingZeroTile.y);
                }
            case MoveDirections.Down:
                {
                    return (this.BoardCellHoldingZeroTile.y < BoardSideManager.boardSideTiles);
                }
        }
    }

    public OnTileClick(data: any) {
        var clickedTileDigit = data.detail;

        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;

        var breakCycle: boolean = false;
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
    }

    public MoveTile(boardCell: BoardCell) {
        var move: boolean = false;

        //left
        if (boardCell.x == this.BoardCellHoldingZeroTile.x + 1 &&
            boardCell.y == this.BoardCellHoldingZeroTile.y) {
            move = true;
        }
        //right
        else if (boardCell.x == this.BoardCellHoldingZeroTile.x - 1 &&
            boardCell.y == this.BoardCellHoldingZeroTile.y) {
            move = true;
        } 
        //up
        else if (boardCell.x == this.BoardCellHoldingZeroTile.x &&
            boardCell.y == this.BoardCellHoldingZeroTile.y + 1) {
            move = true;
        }
        //down
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
    }

    private SubscribeForTilesOnClick(subscribe: boolean) {
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
    }

    private IsBoardSolved() {
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
    }

    private HighlightMoveAbleTiles(highlight: boolean) {
        var moveAbleTiles = TileGetter.GetMoveAbleTiles(this.board);

        var highlightTile = (boardCell) => TileHighlighter.SetTileHighlight(boardCell, TileHighlights.MoveableTile, highlight);
        moveAbleTiles.forEach(highlightTile);
    }

    public TileMove(boardCell: BoardCell) {
        var boardCellDigit = boardCell;
        var boardCellZero = this.BoardCellHoldingZeroTile;

        //swap tiles
        var tileDigit = boardCellDigit.HoldingTile;
        boardCellDigit.SetHoldingTile(boardCellZero.HoldingTile);
        boardCellZero.SetHoldingTile(tileDigit);

        //swap reference on cell holding zero tile
        this.board.boardCellHoldingZeroTile = boardCellDigit;
    }

    public GameReset() {
        this.SubscribeForTilesOnClick(true);
        this.Shuffle();
    }

    private Shuffle() {
        this.movesCounter.Reset();

        this.movesCounter.IsEnabled = false;
        var shuffleTimes = 200;

        for (var i = 0; i < shuffleTimes; i++) {
            var moveAbleTiles = TileGetter.GetMoveAbleTiles(this.board);
            var moveAbleTilesCount = moveAbleTiles.length;

            var random = Math.floor((Math.random() * moveAbleTilesCount));
            var selectedTile = moveAbleTiles[random];
            this.MoveTile(selectedTile);
        }

        this.movesCounter.IsEnabled = true;

        //alert(this.CanBoardBeSolved());
    }

    private CanBoardBeSolved(): boolean {
        var sideTilesCount = BoardSideManager.boardSideTiles;
        var tilesCount = sideTilesCount * sideTilesCount;

        var e = 0;
        var tiles = new Array<Tile>();
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
    }

    public delete() {
        this.board.delete();
    }
}

class MovesCounter {
    private element: HTMLSpanElement;
    private counter: number;
    private isEnabled: boolean;

    get IsEnabled() {
        return this.isEnabled;
    }
    set IsEnabled(value: boolean) {
        if (!this.isEnabled == value) {
            this.isEnabled = value;

            if (value) {
                document.getElementById("movescounter").className = "enabled";
            }
            else {
                document.getElementById("movescounter").className = "disabled";
            }
        }
    }

    get Counter() {
        return this.counter;
    }
    set Counter(value: number) {
        this.counter = value;
        this.element.textContent = this.counter.toString();
    }

    constructor() {
        this.isEnabled = false;

        this.element = document.getElementById("movescounter-span");
        this.counter = 0;

        this.Counter = this.counter;
    }

    public CountMove() {
        this.Counter = ++this.counter;
    }

    public Reset() {
        this.Counter = 0;
    }
}

class TileGetter {
    private static GetTilePosition(board: Board, boardCell: BoardCell): TilePositions {
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
    }

    static GetMoveAbleTiles(board: Board): Array<BoardCell> {
        var sideTilesCount = BoardSideManager.boardSideTiles;

        var zeroTileBoardCell = board.boardCellHoldingZeroTile;
        var x = zeroTileBoardCell.x;
        var y = zeroTileBoardCell.y;

        var moveAbleTiles = new Array<BoardCell>();

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
    }
}

class TileHighlighter {
    public static SetTileHighlight(boardCell: BoardCell, highlight: TileHighlights, add: boolean) {
        var tileClass: string;

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
    }
}

class BoardSideOption {
    public value: number;
    public element: HTMLLabelElement;

    get Selected(): boolean {
        return this.element.classList.contains("selected");
    }
    set Selected(value: boolean) {
        if (this.Selected != value) {
            if (value) {
                this.element.classList.add("selected");
            }
            else if (!value) {
                this.element.classList.remove("selected");
            }
        }
    }

    constructor(value: number, element: HTMLLabelElement) {
        this.value = value;
        this.element = element;

        this.Selected = false;

        this.element.onclick = () => {
            if (!this.Selected) {
                var event = new CustomEvent(eventNameBoardSideOptionClick, { detail: this.value });
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
}

class BoardSideManager {
    public static boardSideTiles: number = 4;

    public options: BoardSideOption[];

    public constructor() {
        this.SubscribeToBoardSideOptionClick();

        var selector = document.getElementById("board-side-selector");
        var count = selector.childNodes.length;

        this.options = new Array<BoardSideOption>();
        for (var i = 0; i < count; i++) {
            if (selector.childNodes[i].localName == "label") {
                var element = <HTMLLabelElement>selector.childNodes[i];
                var value = parseInt(element.textContent);

                var option = new BoardSideOption(value, element);
                this.options.push(option);
            }
        }
    }

    private SubscribeToBoardSideOptionClick() {
        document.addEventListener(eventNameBoardSideOptionClick, (e) => this.PublishBoardSideChange(e), true);
    }

    public PublishBoardSideChange(value) {
        var newBoardSide = value.detail;
        BoardSideManager.boardSideTiles = newBoardSide;

        this.options.forEach((option) => { option.Selected = (option.value == newBoardSide); });

        var event = new CustomEvent(eventNameBoardSideChange, { detail: newBoardSide });
        document.dispatchEvent(event);
    }
}

class GameFlow {
    private boardManager: BoardManager;
    private boardSideManager: BoardSideManager

    public constructor() {
        this.boardSideManager = new BoardSideManager();
        this.SubscribeToBoardSideChange();

        this.StartNewGame();
    }

    private SubscribeToBoardSideChange() {
        document.addEventListener(eventNameBoardSideChange, () => this.StartNewGame(), true);
    }

    public StartNewGame() {
        ResponsiveSizesManager.ResizePage();

        if (this.boardManager != null) {
            this.boardManager.delete();
        }

        this.boardManager = new BoardManager;
        document.getElementById("button-shuffle").onclick = () => this.boardManager.GameReset();
    }
}

window.onload = () => {
    var gameFlow = new GameFlow();
};