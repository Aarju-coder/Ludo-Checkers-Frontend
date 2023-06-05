//global variables for the game
var global = {
  dbId: null,
  avatar: null,
  oppAvatar: null,
  userName: null,
  opponentName: null,
  points: 1000,
  lobbyPlayers: [],
  players: [{}, {}],
  myself: {},
  gameCards: [],
  player1Id: null,
  player2ID: null,
  playercount: 0,
  mySessionID: "",
  myPiece: 0,
  otherPiece: 0,
  client: null,
  router: null,
  gameRoom: null,
  lobbyRoom: null,
  gameType: null,
  roomID: "",
  lastRound: false,
  gameOver: false,
};
var canvas;
var $;
var Board;
var tieCount = 0;
var tournyOnePlayerWinner = false;
var newRoundStart = false;
// used for popups from checkers.component.ts
// var popup;
//var WinnerPopup ;
var gameBoard = [];
var myPiece;
var pieces = [];
var tiles = [];
var popupFail;
var PWFroomId; // play with friends room id
var createRoom = false;
var soundService1;
var langModel;
var rewardAmount;
var playerTurn;
var popup;
var WinnerPopup;
var globalClass;
var TournamentEnded = false;
var gameOver = false;
var successJoining = false;
setDefault = function () {
  global = {
    dbId: null,
    avatar: null,
    oppAvatar: null,
    userName: null,
    opponentName: null,
    points: 1000,
    lobbyPlayers: [],
    players: [{}, {}],
    myself: {},
    gameCards: [],
    player1Id: null,
    player2ID: null,
    playercount: 0,
    mySessionID: "",
    myPiece: 0,
    otherPiece: 0,
    client: null,
    router: null,
    gameRoom: null,
    lobbyRoom: null,
    gameType: null,
    roomID: "",
    lastRound: false,
    gameOver: false,
  };
  Board = null;
  createRoom = false;
  tiles = [];
  pieces = [];
  gameBoard = [];
  myPiece = 0;
  WinnerPopup = null;
  popup = null;
  playerTurn = null;
  rewardAmount = null;
  langModel = null;
  soundService1 = null;
  PWFroomId = null;
  popupFail = null;
  tieCount = 0;
  TournamentEnded = false;
  canvas = null;
  tournyOnePlayerWinner = false;
  newRoundStart = false;
  gameOver = false;
  successJoining = false;
};
class Piece {
  constructor(element, position) {
    this.allowedtomove = true;
    //linked DOM element
    this.element = element;
    //positions on gameBoard array in format row, column
    this.position = position;
    //which player's piece i it
    this.player = "";
    //figure out player by piece id
    if (this.element.attr("id") < 12) this.player = 1;
    else this.player = 2;
    //makes object a king
    this.king = false;
  }
  // when jump exist, regular move is not allowed
  // since there is no jump at round 1, all pieces are allowed to move initially
  makeKing = function () {
    this.element.css(
      "backgroundImage",
      "url('assets/king" + this.player + ".png')"
    );
    this.king = true;
  };
  //moves the piece
  move = function (tile) {
    soundService1.playAudio("piece_move");
    this.element.removeClass("selected");
    if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1]))
      return false;
    //make sure piece doesn't go backwards if it's not a king
    console.log(
      "tileposition---------->",
      tile.position[0],
      " ",
      tile.position[1]
    );
    if (this.player == 1 && this.king == false) {
      if (tile.position[0] < this.position[0]) return false;
    } else if (this.player == 2 && this.king == false) {
      if (tile.position[0] > this.position[0]) return false;
    }
    //remove the mark from Board.board and put it in the new spot
    console.log("position---------->", this.position[0], " ", this.position[1]);
    Board.board[this.position[0]][this.position[1]] = 0;
    Board.board[tile.position[0]][tile.position[1]] = this.player;

    if (global.gameType == "AI") {
      if (Board.playerTurn == 2) {
        global.gameRoom.send("boardUpdate", {
          position: this.position,
          tilePosition: tile.position,
          player: this.player,
          element: this.element,
        });
      }
    } else {
      global.gameRoom.send("boardUpdate", {
        position: this.position,
        tilePosition: tile.position,
        player: this.player,
        element: this.element,
      });
    }

    //console.log("position---------->",this.position);
    //console.log("tileposition---------->",tile.position);
    console.log("playerposition---------->", this.player);
    //console.log("element---------->",this.element);
    this.position = [tile.position[0], tile.position[1]];

    //change the css using board's dictionary
    this.element.css("top", Board.dictionary[this.position[0]]);
    this.element.css("left", Board.dictionary[this.position[1]]);
    //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
    if (!this.king && (this.position[0] == 0 || this.position[0] == 7))
      this.makeKing();

    return true;
  };

  //tests if normal piece can jump anywhere
  canJumpAny = function () {
    return (
      this.canOpponentJump(
        [this.position[0] + 2, this.position[1] + 2],
        false
      ) ||
      this.canOpponentJump(
        [this.position[0] + 2, this.position[1] - 2],
        false
      ) ||
      this.canOpponentJump(
        [this.position[0] - 2, this.position[1] + 2],
        false
      ) ||
      this.canOpponentJump([this.position[0] - 2, this.position[1] - 2], false)
    );
  };
  //tests if an opponent jump can be made to a specific place
  canOpponentJump = function (newPosition, bool) {
    //find what the displacement is
    //console.log("playerTurn -> ", Board.playerTurn)
    var dx = newPosition[1] - this.position[1];
    //console.log("displacementx -> ", dx, "newPosition-> ", newPosition[1], "position-> ", this.position[1])
    var dy = newPosition[0] - this.position[0];
    //console.log("displacementy -> ", dx, "newPosition-> ", newPosition[0], "position-> ", this.position[0])
    //make sure object doesn't go backwards if not a king
    if (this.player == 1 && this.king == false) {
      if (newPosition[0] < this.position[0]) return false;
    } else if (this.player == 2 && this.king == false) {
      if (newPosition[0] > this.position[0]) return false;
    }
    //must be in bounds
    if (
      newPosition[0] > 7 ||
      newPosition[1] > 7 ||
      newPosition[0] < 0 ||
      newPosition[1] < 0
    )
      return false;
    if (
      this.position[0] > 7 ||
      this.position[1] > 7 ||
      this.position[0] < 0 ||
      this.position[1] < 0
    )
      return false;
    if (this.king == true && bool == true) {
      //check if row increase or decrease
      if (this.position[0] > newPosition[0]) {
        //row decrease
        //check if column increase or decrease
        //console.log("row decrease");
        if (this.position[1] > newPosition[1]) {
          //column decrease // left upper
          //console.log("row decrease column decrease");
          for (
            var i = this.position[0] - 1, j = this.position[1] - 1;
            i >= newPosition[0];
            i--, j--
          ) {
            var tempRow = i;
            var tempColumn = j;
            //console.log("Row: ", tempRow, "Column: ", tempColumn);
            if (Board.board[tempRow][tempColumn] == Board.playerTurn) {
              //if found your own piece
              //console.log("Found your own piece");
              return false;
            } else if (
              Board.board[tempRow][tempColumn] != Board.playerTurn &&
              Board.board[tempRow][tempColumn] != 0
            ) {
              //if found your opp. piece check if it's in bounds
              //console.log("found your opp. piece check if it's in bounds");
              if (tempRow == 0 || tempColumn == 0) {
                return false;
              } else if (
                tempRow - 1 == newPosition[0] &&
                tempColumn - 1 == newPosition[1]
              ) {
                if (Board.board[tempRow - 1][tempColumn - 1] == 0) {
                  ////console.log("Found your opp piece check if next piece is empty");
                  //console.log("Row & column to match -> ", tempRow - 1," ", tempColumn - 1);
                  // if (Board.board[tempRow - 1][tempColumn - 1])
                  for (let pieceIndex in pieces) {
                    //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                    if (
                      pieces[pieceIndex].position[0] == tempRow &&
                      pieces[pieceIndex].position[1] == tempColumn
                    ) {
                      //return the piece sitting there
                      //console.log("returning piece to be cut");
                      return pieces[pieceIndex];
                    }
                  }
                } else return false;
              } else {
                //console.log("Found your opp piece but next piece is not empty");
                for (
                  var i = tempRow - 1, j = tempColumn - 1;
                  i >= newPosition[0];
                  i--, j--
                ) {
                  if (Board.board[i][j] != 0) {
                    return false;
                  } else {
                    if (i == newPosition[0] && j == newPosition[1]) {
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                        if (
                          pieces[pieceIndex].position[0] == tempRow &&
                          pieces[pieceIndex].position[1] == tempColumn
                        ) {
                          //return the piece sitting there
                          //console.log("returning piece to be cut");
                          return pieces[pieceIndex];
                        }
                      }
                    } else if (i == 0 || j == 0) return false;
                  }
                }
              }
            } else {
              //console.log("No piece found on Path");
              if (i == newPosition[0] && j == newPosition[1]) {
                return "moveWithoutRestriction";
              } else if (i == 0 || j == 0) {
                return false;
              }
            }
          }
          // var tileToChecky = newPosition[0] + 1 //row
          // var tileToCheckx = newPosition[1] + 1 // column
        } else if (this.position[1] < newPosition[1]) {
          //column increase // right upper
          //console.log("row decrease column increase");
          for (
            var i = this.position[0] - 1, j = this.position[1] + 1;
            i >= newPosition[0];
            i--, j++
          ) {
            var tempRow = i;
            var tempColumn = j;
            //console.log("Row: ", tempRow, "Column: ", tempColumn);
            if (Board.board[tempRow][tempColumn] == Board.playerTurn) {
              //if found your own piece
              //console.log("Found your own piece");
              return false;
            } else if (
              Board.board[tempRow][tempColumn] != Board.playerTurn &&
              Board.board[tempRow][tempColumn] != 0
            ) {
              //if found your opp. piece check if it's in bounds
              //console.log("found your opp. piece check if it's in bounds");
              if (tempRow == 0 || tempColumn == 7) {
                return false;
              } else if (
                tempRow - 1 == newPosition[0] &&
                tempColumn + 1 == newPosition[1]
              ) {
                if (Board.board[tempRow - 1][tempColumn + 1] == 0) {
                  ////console.log("Found your opp piece check if next piece is empty");
                  //console.log("Row & column to match -> ", tempRow - 1," ", tempColumn +1);
                  for (let pieceIndex in pieces) {
                    //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                    if (
                      pieces[pieceIndex].position[0] == tempRow &&
                      pieces[pieceIndex].position[1] == tempColumn
                    ) {
                      //console.log("returning piece to be cut");
                      if (this.player != pieces[pieceIndex].player) {
                        //return the piece sitting there
                        return pieces[pieceIndex];
                      }
                    } else {
                      //console.log("no piece found to cut");
                    }
                  }
                } else return false;
              } else {
                //console.log("Found your opp piece but next piece is not empty");
                for (
                  var i = tempRow - 1, j = tempColumn + 1;
                  i >= newPosition[0];
                  i--, j++
                ) {
                  if (Board.board[i][j] != 0) {
                    return false;
                  } else {
                    if (i == newPosition[0] && j == newPosition[1]) {
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                        if (
                          pieces[pieceIndex].position[0] == tempRow &&
                          pieces[pieceIndex].position[1] == tempColumn
                        ) {
                          //return the piece sitting there
                          //console.log("returning piece to be cut");
                          return pieces[pieceIndex];
                        }
                      }
                    } else if (i == 0 || j == 7) return false;
                  }
                }
              }
            } else {
              //console.log("No piece found on Path");
              if (i == newPosition[0] && j == newPosition[1]) {
                return "moveWithoutRestriction";
              } else if (i == 0 || j == 7) {
                return false;
              }
            }
          }
          // var tileToChecky = newPosition[0] + 1 //row
          // var tileToCheckx = newPosition[1] - 1 // column
        }
      } else if (this.position[0] < newPosition[0]) {
        //row increase
        //check if column increase or decrease
        //console.log("row increase");
        if (this.position[1] > newPosition[1]) {
          //column decrease // left lower
          //console.log("row increase column decrease");
          for (
            var i = this.position[0] + 1, j = this.position[1] - 1;
            i <= newPosition[0];
            i++, j--
          ) {
            var tempRow = i;
            var tempColumn = j;
            //console.log("Row: ", tempRow, "Column: ", tempColumn);
            if (Board.board[tempRow][tempColumn] == Board.playerTurn) {
              //if found your own piece
              //console.log("Found your own piece");
              return false;
            } else if (
              Board.board[tempRow][tempColumn] != Board.playerTurn &&
              Board.board[tempRow][tempColumn] != 0
            ) {
              //if found your opp. piece check if it's in bounds
              //console.log("found your opp. piece check if it's in bounds");
              if (tempRow == 7 || tempColumn == 0) {
                return false;
              } else if (
                tempRow + 1 == newPosition[0] &&
                tempColumn - 1 == newPosition[1]
              ) {
                if (Board.board[tempRow + 1][tempColumn - 1] == 0) {
                  ////console.log("Found your opp piece check if next piece is empty");
                  //console.log("Row & column to match -> ", tempRow + 1," ", tempColumn  - 1);
                  for (let pieceIndex in pieces) {
                    //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                    if (
                      pieces[pieceIndex].position[0] == tempRow &&
                      pieces[pieceIndex].position[1] == tempColumn
                    ) {
                      //console.log("returning piece to be cut");
                      if (this.player != pieces[pieceIndex].player) {
                        //return the piece sitting there
                        return pieces[pieceIndex];
                      }
                    } else {
                      //console.log("no piece found to cut");
                    }
                  }
                } else return false;
              } else {
                //console.log("Found your opp piece but next piece is not empty");
                for (
                  var i = tempRow + 1, j = tempColumn - 1;
                  i <= newPosition[0];
                  i++, j--
                ) {
                  if (Board.board[i][j] != 0) {
                    return false;
                  } else {
                    if (i == newPosition[0] && j == newPosition[1]) {
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                        if (
                          pieces[pieceIndex].position[0] == tempRow &&
                          pieces[pieceIndex].position[1] == tempColumn
                        ) {
                          //return the piece sitting there
                          //console.log("returning piece to be cut");
                          return pieces[pieceIndex];
                        }
                      }
                    } else if (i == 7 || j == 0) return false;
                  }
                }
              }
            } else {
              //console.log("No piece found on Path");
              if (i == newPosition[0] && j == newPosition[1]) {
                return "moveWithoutRestriction";
              } else if (i == 7 || j == 0) {
                return false;
              }
            }
          }
          // var tileToChecky = newPosition[0] + 1 //row
          // var tileToCheckx = newPosition[1] - 1 // column
        } else if (this.position[1] < newPosition[1]) {
          //column increase //right lower
          //console.log("row increase column increase");
          for (
            var i = this.position[0] + 1, j = this.position[1] + 1;
            i <= newPosition[0];
            i++, j++
          ) {
            var tempRow = i;
            var tempColumn = j;
            //console.log("Row: ", tempRow, "Column: ", tempColumn);
            if (Board.board[tempRow][tempColumn] == Board.playerTurn) {
              //if found your own piece
              //console.log("Found your own piece");
              return false;
            } else if (
              Board.board[tempRow][tempColumn] != Board.playerTurn &&
              Board.board[tempRow][tempColumn] != 0
            ) {
              //if found your opp. piece check if it's in bounds
              //console.log("found your opp. piece check if it's in bounds");
              if (tempRow == 7 || tempColumn == 7) {
                return false;
              } else if (
                tempRow + 1 == newPosition[0] &&
                tempColumn + 1 == newPosition[1]
              ) {
                if (Board.board[tempRow + 1][tempColumn + 1] == 0) {
                  // //console.log("Found your opp piece check if next piece is empty");
                  //console.log("Row & column to match -> ", tempRow + 1," ", tempColumn +1);
                  for (let pieceIndex in pieces) {
                    //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );

                    if (
                      pieces[pieceIndex].position[0] == tempRow &&
                      pieces[pieceIndex].position[1] == tempColumn
                    ) {
                      if (this.player != pieces[pieceIndex].player) {
                        //console.log("returning piece to be cut");
                        //return the piece sitting there
                        return pieces[pieceIndex];
                      }
                    }
                    // else {
                    //   //console.log("no piece found to cut");
                    // }
                  }
                } else return false;
              } else {
                //console.log("Found your opp piece but next piece is not empty");
                for (
                  var i = tempRow + 1, j = tempColumn + 1;
                  i <= newPosition[0];
                  i++, j++
                ) {
                  if (Board.board[i][j] != 0) {
                    return false;
                  } else {
                    if (i == newPosition[0] && j == newPosition[1]) {
                      for (let pieceIndex in pieces) {
                        //console.log("Row & column matching -> ", pieces[pieceIndex].position[0]," ", pieces[pieceIndex].position[1] );
                        if (
                          pieces[pieceIndex].position[0] == tempRow &&
                          pieces[pieceIndex].position[1] == tempColumn
                        ) {
                          //return the piece sitting there
                          //console.log("returning piece to be cut");
                          return pieces[pieceIndex];
                        }
                      }
                    } else if (i == 7 || j == 7) return false;
                  }
                }
              }
            } else {
              //console.log("No piece found on Path");
              if (i == newPosition[0] && j == newPosition[1])
                return "moveWithoutRestriction";
              else if (i == 7 || j == 7) return false;
            }
          }
          // var tileToChecky = newPosition[0] - 1 //row
          // var tileToCheckx = newPosition[1] - 1 // column
        }
      }
    } else {
      //middle tile where the piece to be conquered sits
      var tileToCheckx = this.position[1] + dx / 2;
      //console.log("tileToCheckx -> ", tileToCheckx)
      var tileToChecky = this.position[0] + dy / 2;
      //console.log("tileToChecky -> ", tileToChecky)

      if (
        tileToCheckx > 7 ||
        tileToChecky > 7 ||
        tileToCheckx < 0 ||
        tileToChecky < 0
      )
        return false;
      //if there is a piece there and there is no piece in the space after that
      if (
        !Board.isValidPlacetoMove(tileToChecky, tileToCheckx) &&
        Board.isValidPlacetoMove(newPosition[0], newPosition[1])
      ) {
        //find which object instance is sitting thereopponentJump
        for (let pieceIndex in pieces) {
          if (
            pieces[pieceIndex].position[0] == tileToChecky &&
            pieces[pieceIndex].position[1] == tileToCheckx
          ) {
            if (this.player != pieces[pieceIndex].player) {
              //return the piece sitting there
              //console.log("piece to remove - ", pieces[pieceIndex]);

              return pieces[pieceIndex]; //.removepieceToRemove
            }
          }
        }
      }
      return false;
    }
  };

  opponentJump = function (tile) {
    var pieceToRemove = this.canOpponentJump(tile.position, true);
    //if there is a piece to be removed, remove it
    console.log("pieceToRemove: " + pieceToRemove);
    if (pieceToRemove == "moveWithoutRestriction") {
      tieCount++;
      console.log("tiecount 1 -> ", tieCount);
      return "moveWithoutRestriction";
    } else if (pieceToRemove) {
      try {
        if (global.gameType == "AI" && Board.playerTurn == 2) {
          global.gameRoom.send("pieceToRemove", {
            pieceToRemove: [
              pieceToRemove.position[0],
              pieceToRemove.position[1],
            ],
          });
        }
      } catch (e) {
        console.log("e -. ", e);
      }

      pieceToRemove.remove();
      tieCount = 0;
      console.log("tiecount 2 -> ", tieCount);
      //global.gameRoom.send("pieceToRemove", { pieceToRemove: pieceToRemove});
      return "removePieceAndMove";
    }
    return false;
  };
  remove = function () {
    //remove it and delete it from the gameboard
    this.element.css("display", "none");
    if (this.player == 1) {
      $("#player2").append("<div class='capturedPiece'></div>");
      Board.score.player2 += 1;
    }
    if (this.player == 2) {
      $("#player1").append("<div class='capturedPiece'></div>");
      Board.score.player1 += 1;
    }
    Board.board[this.position[0]][this.position[1]] = 0;
    console.log("deleting player piece here");

    // //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
    this.position = [];
    // // var playerWon = Board.checkifAnybodyWon();
    // // if (playerWon) {
    // //   if (playerWon == 1) {
    // //     document.getElementsByClassName("player1name")[0].textContent =
    // //       "Winner";
    // //     document.getElementsByClassName("player2name")[0].textContent = "Loser";
    // //     document.getElementsByClassName("player2")[0].id = "none";
    // //     document.getElementsByClassName("player1")[0].id = "none";
    // //   } else {
    // //     document.getElementsByClassName("player2name")[0].textContent =
    // //       "Winner";
    // //     document.getElementsByClassName("player1name")[0].textContent = "Loser";
    // //     document.getElementsByClassName("player2")[0].id = "none";
    // //     document.getElementsByClassName("player1")[0].id = "none";
    // //   }
    // // }
  };
}
class Tile {
  constructor(element, position) {
    //linked DOM element
    this.element = element;
    //position in gameboard
    this.position = position;
  }
  //if tile is in range from the piece
  inRange = function (piece) {
    for (let k of pieces) {
      if (
        k.position[0] == this.position[0] &&
        k.position[1] == this.position[1]
      )
        return "wrong";
      //console.log("k of pieces - > ", k);
    }

    if (
      !piece.king &&
      piece.player == 1 &&
      this.position[0] < piece.position[0]
    )
      return "wrong";
    if (
      !piece.king &&
      piece.player == 2 &&
      this.position[0] > piece.position[0]
    )
      return "wrong";

    console.log(
      "positions of tile and piece inRange1 - > ",
      this.position[0],
      piece.position[0]
    );
    //if king move different

    var distance = dist(
      this.position[0],
      this.position[1],
      piece.position[0],
      piece.position[1]
    );
    console.log("distance -> ", distance);
    if (piece.king) {
      if (distance == Math.sqrt(2).dist) {
        //jump move
        console.log(
          "positions of tile and piece when king inRange2 - > ",
          this.position[1],
          " ",
          piece.position[1],
          " ",
          Math.sqrt(2)
        );
        return "regular";
      } else {
        console.log(
          "positions of tile and piece when king inRange3 - > ",
          this.position[1],
          " ",
          piece.position[1],
          " ",
          2 * Math.sqrt(2)
        );
        return "jump";
      }
    } else if (distance == Math.sqrt(2)) {
      //regular move
      console.log(
        "positions of tile and piece inRange2 - > ",
        this.position[1],
        " ",
        piece.position[1],
        " ",
        Math.sqrt(2)
      );
      return "regular";
    } else if (distance == 2 * Math.sqrt(2)) {
      //jump move
      console.log(
        "positions of tile and piece inRange3 - > ",
        this.position[1],
        " ",
        piece.position[1],
        " ",
        2 * Math.sqrt(2)
      );
      return "jump";
    }
  };
}
class BoardClass {
  board = gameBoard;
  score = {
    player1: 0,
    player2: 0,
  };
  playerTurn = 2;
  jumpexist = false;
  continuousjump = false;
  tilesElement = $("div.tiles");
  //dictionary to convert position in Board.board to the viewport units
  dictionary = [
    "0vmin",
    "12vmin",
    "24vmin",
    "36vmin",
    "48vmin",
    "60vmin",
    "72vmin",
    "84vmin",
    "96vmin",
    "108vmin",
  ];
  //initialize the 8x8 board
  constructor() {
    this.board = gameBoard;
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.playerTurn = 2;
    this.jumpexist = false;
    this.continuousjump = false;
    this.tilesElement = $("div.tiles");
    var countPieces = 0;
    var countTiles = 0;
    for (let row in this.board) {
      //row is the index
      for (let column in this.board[row]) {
        //column is the index
        //whole set of if statements control where the tiles and pieces should be placed on the board
        if (row % 2 == 1) {
          if (column % 2 == 0) {
            countTiles = this.tileRender(row, column, countTiles);
          }
        } else {
          if (column % 2 == 1) {
            countTiles = this.tileRender(row, column, countTiles);
          }
        }
        if (this.board[row][column] == 1) {
          countPieces = this.playerPiecesRender(1, row, column, countPieces);
        } else if (this.board[row][column] == 2) {
          countPieces = this.playerPiecesRender(2, row, column, countPieces);
        }
      }
    }
    //rotate the board 180* for the first player
    if (myPiece == 1) {
      //document.getElementsById("board").style.transform = 'rotate(20deg)';
      document.getElementById("board").style.transform = "rotate(180deg)";
    }
  }

  tileRender(row, column, countTiles) {
    this.tilesElement.append(
      "<div class='tile' id='tile" +
        countTiles +
        "' style='top:" +
        this.dictionary[row] +
        ";left:" +
        this.dictionary[column] +
        ";'></div>"
    );
    tiles[countTiles] = new Tile($("#tile" + countTiles), [
      parseInt(row),
      parseInt(column),
    ]);
    return countTiles + 1;
  }

  playerPiecesRender(playerNumber, row, column, countPieces) {
    $(`.player${playerNumber}pieces`).append(
      "<div class='piece' id='" +
        countPieces +
        "' style='top:" +
        this.dictionary[row] +
        ";left:" +
        this.dictionary[column] +
        ";'></div>"
    );
    pieces[countPieces] = new Piece($("#" + countPieces), [
      parseInt(row),
      parseInt(column),
    ]);
    console.log("countPieces======", countPieces);
    return countPieces + 1;
  }
  //check if the location has an object
  isValidPlacetoMove(row, column) {
    // console.log(row); console.log(column); console.log(this.board);
    console.log("Row - > ", row, " column ", column);
    if (row < 0 || row > 7 || column < 0 || column > 7) return false;
    if (this.board[row][column] == 0) {
      return true;
    }
    return false;
  }
  //change the active player - also changes div.turn's CSS
  changePlayerTurn(timerOrPlayed) {
    if (!gameOver) {
      var playerTimer2 = document.getElementById("playerTimer2");
      playerTimer2.src = "";
      document.getElementById("playerTimer2").style.display = "none";
      var playerTimer1 = document.getElementById("playerTimer1");
      playerTimer1.src = "";
      document.getElementById("playerTimer1").style.display = "none";
      var image = new Image();
      image.src = "assets/images/Timer_30sec.gif" + "?a=" + Math.random();
      if (this.playerTurn == 1) {
        this.checkNoWin();
        this.playerTurn = 2;
        this.checkNoWin();
        if (myPiece == 2) {
          document.getElementsByClassName("player2")[0].id = "";
          document.getElementsByClassName("player1")[0].id = "";
          var playerTimer = document.getElementById("playerTimer2");
          playerTimer.src = image.src;
          document.getElementById("playerTimer2").style.display = "block";
        } else if (myPiece == 1) {
          document.getElementsByClassName("player1")[0].id = "";
          document.getElementsByClassName("player2")[0].id = "";
          var playerTimer = document.getElementById("playerTimer1");
          playerTimer.src = image.src;
          document.getElementById("playerTimer1").style.display = "block";
        }
      } else {
        this.checkNoWin();
        this.playerTurn = 1;
        this.checkNoWin();

        if (myPiece == 1) {
          document.getElementsByClassName("player2")[0].id = "blink";
          document.getElementsByClassName("player1")[0].id = "";
          var playerTimer = document.getElementById("playerTimer2");
          playerTimer.src = image.src;
          document.getElementById("playerTimer2").style.display = "block";
        } else if (myPiece == 2) {
          document.getElementsByClassName("player1")[0].id = "blink";
          document.getElementsByClassName("player2")[0].id = "";
          var playerTimer = document.getElementById("playerTimer1");
          playerTimer.src = image.src;
          document.getElementById("playerTimer1").style.display = "block";
        }
      }
      this.check_if_jump_exist();
      console.log(gameOver);
      if (global.gameType == "AI") {
        global.gameRoom.send("playerTurnChange", {
          playerTurn: this.playerTurn,
          timerOrPlayed: timerOrPlayed,
          myPiece: myPiece,
        });
      } else if (this.playerTurn == myPiece)
        global.gameRoom.send("playerTurnChange", {
          playerTurn: this.playerTurn,
          timerOrPlayed: timerOrPlayed,
          myPiece: myPiece,
        });
    }
    console.log("playerTurn senttoroom-------->", this.playerTurn, gameOver);

    //return;
  }
  checkNoWin() {
    if (!gameOver) {
      var noWin = true;
      for (var i = 0; i < 8; i++) {
        for (var j = i % 2 == 0 ? 1 : 0; j < 8; j += 2) {
          if (this.board[i][j] == this.playerTurn) {
            if (this.playerTurn == 1 && this.board[i + 1] != undefined) {
              if (
                this.board[i + 1][j + 1] != 0 &&
                this.board[i + 1][j - 1] != 0
              ) {
              } else {
                noWin = false;
              }
            } else if (this.playerTurn == 2 && this.board[i - 1] != undefined) {
              if (
                this.board[i - 1][j + 1] != 0 &&
                this.board[i - 1][j - 1] != 0
              ) {
              } else {
                noWin = false;
              }
            } else {
              noWin = false;
            }
          }
        }
      }

      if (noWin) {
        gameOver = true;
        console.log("playerTurn afterwIn-------", this.playerTurn);
        var playerTimer2 = document.getElementById("playerTimer2");
        playerTimer2.src = "";
        document.getElementById("playerTimer2").style.display = "none";
        var playerTimer1 = document.getElementById("playerTimer1");
        playerTimer1.src = "";
        document.getElementById("playerTimer1").style.display = "none";

        if (this.playerTurn == 2) {
          if (myPiece == 2) {
            //if (global.gameType == "Tourny") WinnerPopup.isTourney = false;
            document.getElementsByClassName("player1name")[0].textContent =
              "Winner";
            document.getElementsByClassName("player2name")[0].textContent =
              "Loser";
            document.getElementsByClassName("player2")[0].id = "none";
            document.getElementsByClassName("player1")[0].id = "none";

            global.gameRoom.send("Winner", {
              winner: global.opponentName,
              userid: global.oppopnentId,
            });
            console.log("last Round full game -> ", global.lastRound);
            if (!global.lastRound) {
              WinnerPopup.langModel = langModel;
              WinnerPopup.isVisible = true;
              if (global.gameType == "Tourny") {
                WinnerPopup.isTourney = true;
                WinnerPopup.tourEnded = false;
              }
              if (global.gameType == "AI") {
                WinnerPopup.winnerName = "MoJo";
                WinnerPopup.winnerAmt = "0";
                WinnerPopup.winnerAvatar =
                  "assets/img/profile/Avatar" + "1" + ".png";
                console.log("hereAIII 1");
                // global.gameRoom.send("Winner",{winner: "AI", userid: 0});
              } else {
                WinnerPopup.winnerName = global.opponentName;
                WinnerPopup.winnerAmt = rewardAmount;
                WinnerPopup.winnerAvatar =
                  "assets/img/profile/Avatar" + global.oppAvatar + ".png";
              }
            }
            //soundService1.playAudio("winner");
            // popup.isVisible= true;
            // popup.popupMessage = "The winner is " + global.opponentName + " in this game";
            // popupFail = 2;
            soundService1.playAudio("Loose");
            console.log("here01", global.opponentName);
            //this.leaveGameRoom();
          } else if (myPiece == 1) {
            document.getElementsByClassName("player2name")[0].textContent =
              "Winner";
            document.getElementsByClassName("player1name")[0].textContent =
              "Loser";
            document.querySelector("div").removeAttribute("id");
            document.getElementsByClassName("player2")[0].id = "none";
            document.getElementsByClassName("player1")[0].id = "none";
            // popup.isVisible= true;
            // popup.popupMessage = "The winner is " + global.userName + " in this game";
            // popupFail = 2;

            console.log("here02");
            if (!global.lastRound) {
              if (global.gameType == "AI") {
                WinnerPopup.langModel = langModel;
                WinnerPopup.isVisible = true;
                WinnerPopup.winnerName = "MoJo";
                WinnerPopup.winnerAmt = "0";
                soundService1.playAudio("winner");
                console.log("hereAIII");
                WinnerPopup.winnerAvatar =
                  "assets/img/profile/Avatar" + "1" + ".png";
                // global.gameRoom.send("Winner",{winner: "AI", userid: 0});
              } else {
                WinnerPopup.langModel = langModel;
                WinnerPopup.isVisible = true;
                if (global.gameType == "Tourny") {
                  WinnerPopup.isTourney = true;
                  WinnerPopup.tourEnded = false;
                }
                WinnerPopup.winnerName = global.userName;
                WinnerPopup.winnerAmt = rewardAmount;
                WinnerPopup.winnerAvatar =
                  "assets/img/profile/Avatar" + global.avatar + ".png";
                soundService1.playAudio("winner");
                console.log("here03", global.userName);
              }
            }
            global.gameRoom.send("Winner", {
              winner: global.userName,
              userid: global.dbId,
            });

            //this.leaveGameRoom();
          }
        } else {
          if (myPiece == 2) {
            document.getElementsByClassName("player2name")[0].textContent =
              "Winner";
            document.getElementsByClassName("player1name")[0].textContent =
              "Loser";
            document.querySelector("div").removeAttribute("id");
            document.getElementsByClassName("player2")[0].id = "none";
            document.getElementsByClassName("player1")[0].id = "none";
            // popup.isVisible= true;
            // popup.popupMessage = "The winner is " + global.userName + " in this game";
            // popupFail = 2;
            global.gameRoom.send("Winner", {
              winner: global.userName,
              userid: global.dbId,
            });
            console.log("here03");
            WinnerPopup.langModel = langModel;
            WinnerPopup.isVisible = true;
            if (global.gameType == "Tourny") {
              WinnerPopup.isTourney = true;
              WinnerPopup.tourEnded = false;
            }
            WinnerPopup.winnerName = global.userName;
            WinnerPopup.winnerAmt = rewardAmount;
            WinnerPopup.winnerAvatar =
              "assets/img/profile/Avatar" + global.avatar + ".png";
            console.log("here04", global.userName);
            soundService1.playAudio("winner");
            //this.leaveGameRoom();
          } else if (myPiece == 1) {
            //if (global.gameType == "Tourny") WinnerPopup.isTourney = false;
            document.getElementsByClassName("player1name")[0].textContent =
              "Winner";
            document.getElementsByClassName("player2name")[0].textContent =
              "Loser";
            document.getElementsByClassName("player2")[0].id = "none";
            document.getElementsByClassName("player1")[0].id = "none";
            // popup.isVisible= true;
            // popup.popupMessage = "The winner is " + global.opponentName + " in this game";
            // popupFail = 2;
            global.gameRoom.send("Winner", {
              winner: global.opponentName,
              userid: global.oppopnentId,
            });
            WinnerPopup.langModel = langModel;
            WinnerPopup.isVisible = true;
            if (global.gameType == "Tourny") {
              WinnerPopup.isTourney = true;
              WinnerPopup.tourEnded = false;
            }
            WinnerPopup.winnerName = global.opponentName;
            WinnerPopup.winnerAmt = rewardAmount;
            WinnerPopup.winnerAvatar =
              "assets/img/profile/Avatar" + global.oppAvatar + ".png";
            console.log("here04", global.opponentName);
            soundService1.playAudio("Loose");
            // this.leaveGameRoom();
          }
        }
        for (let k of pieces) {
          k.position = [];
        }
        // if(global.gameType == "Tourny" && !lastRound)
        // global.gameRoom.leave();
        //room.leave();
        console.log("roomLeft");
      }
    }
  }
  checkifAnybodyWon() {
    if (this.score.player1 == 12) {
      return 1;
    } else if (this.score.player2 == 12) {
      return 2;
    }
    return false;
  }
  //reset the game
  clear() {
    location.reload();
  }
  //when player turm change check if it can cut any piece
  check_if_jump_exist() {
    this.jumpexist = false;
    this.continuousjump = false;
    for (let k of pieces) {
      k.allowedtomove = false;
      // if jump exist, only set those "jump" pieces "allowed to move"
      if (
        k.position.length != 0 &&
        k.player == this.playerTurn &&
        k.canJumpAny() &&
        k.king == false
      ) {
        this.jumpexist = true;
        k.allowedtomove = true;
      } else if (
        k.position.length != 0 &&
        k.player == this.playerTurn &&
        k.king == true
      ) {
        for (
          var i = k.position[0] - 1, j = k.position[1] - 1;
          i > 0 && j > 0;
          i--, j--
        ) {
          var tempRow = i;
          var tempColumn = j;
          console.log("Row: ", tempRow, "Column: ", tempColumn);
          if (this.board[tempRow][tempColumn] == this.playerTurn) {
            //if found your own piece
            console.log("Found your own piece");
            break;
          } else if (
            this.board[tempRow][tempColumn] != this.playerTurn &&
            this.board[tempRow][tempColumn] != 0
          ) {
            //if found your opp. piece check if it's in bounds
            if (this.board[tempRow - 1][tempColumn - 1] == 0) {
              this.jumpexist = true;
              k.allowedtomove = true;
              console.log("Found your opp piece and next tile is empty");
              break;
            } else {
              console.log("Found your opp piece but next piece is not empty");
              break;
            }
          } else {
            console.log("No piece found on Path");
          }
        }
        for (
          var i = k.position[0] - 1, j = k.position[1] + 1;
          i > 0 && j < 7;
          i--, j++
        ) {
          var tempRow = i;
          var tempColumn = j;
          console.log("Row: ", tempRow, "Column: ", tempColumn);
          if (this.board[tempRow][tempColumn] == this.playerTurn) {
            //if found your own piece
            console.log("Found your own piece");
            break;
          } else if (
            this.board[tempRow][tempColumn] != this.playerTurn &&
            this.board[tempRow][tempColumn] != 0
          ) {
            //if found your opp. piece check if it's in bounds
            if (this.board[tempRow - 1][tempColumn + 1] == 0) {
              this.jumpexist = true;
              k.allowedtomove = true;
              console.log("Found your opp piece and next tile is empty");
              break;
            } else {
              console.log("Found your opp piece but next piece is not empty");
              break;
            }
          } else {
            console.log("No piece found on Path");
          }
        }
        for (
          var i = k.position[0] + 1, j = k.position[1] - 1;
          i < 7 && j > 0;
          i++, j--
        ) {
          var tempRow = i;
          var tempColumn = j;
          console.log("Row: ", tempRow, "Column: ", tempColumn);
          if (this.board[tempRow][tempColumn] == this.playerTurn) {
            //if found your own piece
            console.log("Found your own piece");
            break;
          } else if (
            this.board[tempRow][tempColumn] != this.playerTurn &&
            this.board[tempRow][tempColumn] != 0
          ) {
            //if found your opp. piece check if it's in bounds
            if (this.board[tempRow + 1][tempColumn - 1] == 0) {
              this.jumpexist = true;
              k.allowedtomove = true;
              console.log("Found your opp piece and next tile is empty");
              break;
            } else {
              console.log("Found your opp piece but next piece is not empty");
              break;
            }
          } else {
            console.log("No piece found on Path");
          }
        }
        for (
          var i = k.position[0] + 1, j = k.position[1] + 1;
          i < 7 && j < 7;
          i++, j++
        ) {
          var tempRow = i;
          var tempColumn = j;
          console.log("Row: ", tempRow, "Column: ", tempColumn);
          if (this.board[tempRow][tempColumn] == this.playerTurn) {
            //if found your own piece
            console.log("Found your own piece");
            break;
          } else if (
            this.board[tempRow][tempColumn] != this.playerTurn &&
            this.board[tempRow][tempColumn] != 0
          ) {
            //if found your opp. piece check if it's in bounds
            if (this.board[tempRow + 1][tempColumn + 1] == 0) {
              this.jumpexist = true;
              k.allowedtomove = true;
              console.log("Found your opp piece and next tile is empty");
              break;
            } else {
              console.log("Found your opp piece but next piece is not empty");
              break;
            }
          } else {
            console.log("No piece found on Path");
          }
        }
      }
    }
    // if jump doesn't exist, all pieces are allowed to move
    if (!this.jumpexist) {
      for (let k of pieces) k.allowedtomove = true;
    }
  }
  //check if king can jump continuously after jumping one piece
  kingCanJumpAny(k) {
    this.continuousjump = false;

    for (
      var i = k.position[0] - 1, j = k.position[1] - 1;
      i > 0 && j > 0;
      i--, j--
    ) {
      var tempRow = i;
      var tempColumn = j;
      console.log("Row: ", tempRow, "Column: ", tempColumn);
      if (this.board[tempRow][tempColumn] == this.playerTurn) {
        //if found your own piece
        console.log("Found your own piece");
        break;
      } else if (
        this.board[tempRow][tempColumn] != this.playerTurn &&
        this.board[tempRow][tempColumn] != 0
      ) {
        //if found your opp. piece check if it's in bounds
        if (this.board[tempRow - 1][tempColumn - 1] == 0) {
          this.continuousjump = true;

          console.log("Found your opp piece and next tile is empty");
          break;
        } else {
          console.log("Found your opp piece but next piece is not empty");
          break;
        }
      } else {
        console.log("No piece found on Path");
      }
    }
    for (
      var i = k.position[0] - 1, j = k.position[1] + 1;
      i > 0 && j < 7;
      i--, j++
    ) {
      var tempRow = i;
      var tempColumn = j;
      console.log("Row: ", tempRow, "Column: ", tempColumn);
      if (this.board[tempRow][tempColumn] == this.playerTurn) {
        //if found your own piece
        console.log("Found your own piece");
        break;
      } else if (
        this.board[tempRow][tempColumn] != this.playerTurn &&
        this.board[tempRow][tempColumn] != 0
      ) {
        //if found your opp. piece check if it's in bounds
        if (this.board[tempRow - 1][tempColumn + 1] == 0) {
          this.continuousjump = true;

          console.log("Found your opp piece and next tile is empty");
          break;
        } else {
          console.log("Found your opp piece but next piece is not empty");
          break;
        }
      } else {
        console.log("No piece found on Path");
      }
    }
    for (
      var i = k.position[0] + 1, j = k.position[1] - 1;
      i < 7 && j > 0;
      i++, j--
    ) {
      var tempRow = i;
      var tempColumn = j;
      console.log("Row: ", tempRow, "Column: ", tempColumn);
      if (this.board[tempRow][tempColumn] == this.playerTurn) {
        //if found your own piece
        console.log("Found your own piece");
        break;
      } else if (
        this.board[tempRow][tempColumn] != this.playerTurn &&
        this.board[tempRow][tempColumn] != 0
      ) {
        //if found your opp. piece check if it's in bounds
        if (this.board[tempRow + 1][tempColumn - 1] == 0) {
          this.continuousjump = true;

          console.log("Found your opp piece and next tile is empty");
          break;
        } else {
          console.log("Found your opp piece but next piece is not empty");
          break;
        }
      } else {
        console.log("No piece found on Path");
      }
    }
    for (
      var i = k.position[0] + 1, j = k.position[1] + 1;
      i < 7 && j < 7;
      i++, j++
    ) {
      var tempRow = i;
      var tempColumn = j;
      console.log("Row: ", tempRow, "Column: ", tempColumn);
      if (this.board[tempRow][tempColumn] == this.playerTurn) {
        //if found your own piece
        console.log("Found your own piece");
        break;
      } else if (
        this.board[tempRow][tempColumn] != this.playerTurn &&
        this.board[tempRow][tempColumn] != 0
      ) {
        //if found your opp. piece check if it's in bounds
        if (this.board[tempRow + 1][tempColumn + 1] == 0) {
          this.continuousjump = true;

          console.log("Found your opp piece and next tile is empty");
          break;
        } else {
          console.log("Found your opp piece but next piece is not empty");
          break;
        }
      } else {
        console.log("No piece found on Path");
      }
    }
    return this.continuousjump;
  }

  // Possibly helpful for communication with back-end.
  str_board() {
    ret = "";
    for (let i in this.board) {
      for (let j in this.board[i]) {
        var found = false;
        for (let k of pieces) {
          if (k.position[0] == i && k.position[1] == j) {
            if (k.king) ret += this.board[i][j] + 2;
            else ret += this.board[i][j];
            found = true;
            break;
          }
        }
        if (!found) ret += "0";
      }
    }
    return ret;
  }
}
// to leave game room

leaveGameRoom = function () {
  if (global.gameRoom != null) {
    global.gameRoom.leave((code) => {
      console.log(client.id, "left", room.name);
    });
  } else {
    this.leaveLobbyRoom();
    console.log("lobbyleft");
  }
};
//to leave lobby room
leaveLobbyRoom = function () {
  if (global.lobbyRoom != null) {
    global.lobbyRoom.leave((code) => {
      console.log(client.id, "left", room.name);
    });
  }
  if (global.gameRoom != null) {
    global.gameRoom.leave((code) => {
      console.log(client.id, "left", room.name);
    });
  }
};
//var client = new Colyseus.Client("ws://localhost:3001");
// to join lobby room in colyseus
joinLobby = async function (
  jquery,
  client,
  router,
  popup1,
  userName,
  gameType,
  roomCodeonJoin,
  createOrJoin,
  myAvatar,
  userId,
  soundService,
  ludoWinnerPopup,
  langModel1,
  entryAmt,
  rewardAmt,
  tournamentData,
  globalDetails
) {
  try {
    setDefault();
    $ = jquery;
    popup = popup1;
    WinnerPopup = ludoWinnerPopup;
    // all the values for sending to the colyseus room while joining
    console.log("client----->", client);
    global.client = client;
    global.userName = userName;
    //global.dbId = this.getRndInteger(1000,100000);
    global.dbId = userId;
    global.lobbyRoom = null;
    global.router = router;
    global.avatar = myAvatar;
    global.gameType = gameType;
    // WinnerPopup = ludoWinnerPopup;
    soundService1 = soundService;
    langModel = langModel1;
    rewardAmount = rewardAmt;
    globalClass = globalDetails;
    // Random play room join
    if (gameType == "RP") {
      console.log(entryAmt);
      await client
        .joinOrCreate("lobby", {
          userName: global.userName,
          dbId: global.dbId,
          avatar: myAvatar,
          coin: entryAmt,
        })
        .then((room) => {
          // alert("here");
          global.lobbyRoom = room;
          room.onMessage("rooms", (message) => {
            console.log("got rooms now , let us see ", message, room);
          });
          room.onMessage("DuplicateUserForceQuit", () => {
            room.leave();
            popup.isVisible = true;
            popup.popupMessage =
              langModel.componentLang.popups.duplicateUser[langModel.lang];
            popup.closetxt =
              langModel.componentLang.popups.close[langModel.lang];
            popupFail = 1;
          });
          room.onMessage("ROOMCONNECT", (message) => {
            //gamePlay();
            var roomid = message.roomId;
            console.log("room Id ------->", roomid);
            var oppopnentName = message.oppName;
            console.log("oppopnentName ------->", oppopnentName);
            global.opponentName = oppopnentName;
            document.getElementById("oppTwo").textContent = global.opponentName;
            var oppAvatar = parseInt(message.oppAvatar);
            console.log("oppopnentAvatar ------->", oppAvatar);
            global.oppAvatar = oppAvatar;
            document.getElementById("oppTwoAvatar").src =
              "assets/img/profile/Avatar" + global.oppAvatar + ".png";
            var oppopnentId = parseInt(message.oppdbId);
            console.log("oppopnentId ------->", oppopnentId);
            var sessionId = message.oppSessionId;
            console.log("sessionId ------->", sessionId);
            const timer = setTimeout(() => {
              clearTimeout(timer);
              room.leave();
              global.lobbyRoom = null;
              console.log("global client---->", global.client);
              this.joinGameRoom(message, global.client);
            }, 1000);

            //this.display(gameScreen, true);
            //GamePlay.joinGameRoom(message);
          });
        })
        .catch((err) =>
          console.log(
            "---" +
              JSON.stringify(err) +
              JSON.stringify(err, ["message", "arguments", "type", "name"])
          )
        );
    } else if (gameType == "PWF") {
      //  play with friends ' create room
      console.log("Inside playwith friends");
      if (createOrJoin == "create") {
        createRoom = true;
        console.log(
          "Inside playwith friends",
          globalClass.checkerRewardAmt,
          globalClass.checkerEntryAmt
        );

        await client
          .create("playWithFriends", {
            userName: global.userName,
            dbId: global.dbId,
            avatar: myAvatar,
            coin: entryAmt,
            entry: globalClass.checkerEntryAmt,
            reward: globalClass.checkerRewardAmt,
            roomCode: roomCodeonJoin,
          })
          .then((room) => {
            global.lobbyRoom = room;
            global.lobbyRoom.onMessage("roomId", (message) => {
              PWFroomId = message.roomCode;
              document.getElementById("roomCode").textContent = PWFroomId;
              console.log("Room Id -> ", PWFroomId);
              globalClass.pwfcode = PWFroomId;
            });
            global.lobbyRoom.onMessage("ROOMCONNECT", (message) => {
              //gamePlay();
              var roomid = message.roomId;
              console.log("room Id ------->", roomid);
              var oppopnentName = message.oppName;
              console.log("oppopnentName ------->", oppopnentName);
              global.opponentName = oppopnentName;
              var oppAvatar = parseInt(message.oppAvatar);
              console.log("oppopnentAvatar ------->", oppAvatar);
              global.oppAvatar = oppAvatar;
              var oppopnentId = parseInt(message.oppdbId);
              console.log("oppopnentId ------->", oppopnentId);
              var sessionId = message.oppSessionId;
              console.log("sessionId ------->", sessionId);

              console.log("global client---->", global.client);
              document.getElementById("gameScreen").style.display = "none";
              document.getElementById("searchingPlayers").style.display =
                "block";
              document.getElementById("PWFcreate").style.display = "none";
              document.getElementById("oppTwo").textContent =
                global.opponentName;
              document.getElementById("oppTwoAvatar").src =
                "assets/img/profile/Avatar" + global.oppAvatar + ".png";

              const timer = setTimeout(() => {
                clearTimeout(timer);
                room.leave(true);
                global.lobbyRoom = null;
                this.joinGameRoom(message, global.client);
              }, 1000);
              //this.display(gameScreen, true);
              //GamePlay.joinGameRoom(message);
            });
          });
      } else {
        try {
          // play with friends ' create room
          const room = await client.joinById(roomCodeonJoin, {
            userName: global.userName,
            dbId: global.dbId,
            avatar: myAvatar,
            coin: globalClass.coins,
            roomCode: roomCodeonJoin,
          });
          room.onMessage("roomId", (message) => {
            PWFroomId = JSON.stringify(message.roomCode);
            entryAmt = message.entry;
            rewardAmount = message.rewards;
            globalClass.checkerRewardAmt = message.rewards;
            globalClass.checkerEntryAmt = message.entry;
            // document.getElementById('waiting').textContent = "Room Code - " + PWFroomId;
            console.log("Room Id -> ", PWFroomId, message);
          });
          room.onMessage("lessAmount", () => {
            console.log("lessAmount");
            popup.isVisible = true;
            popup.popupMessage =
              this.langModel.componentLang.popups.lowBal[this.langModel.lang];
            popup.closetxt =
              this.langModel.componentLang.popups.close[this.langModel.lang];
            popupFail = 1;
            room.leave();
          });
          room.onMessage("ROOMCONNECT", (message) => {
            //gamePlay();
            var roomid = message.roomId;
            console.log("room Id ------->", roomid);
            var oppopnentName = message.oppName;
            console.log("oppopnentName ------->", oppopnentName);
            global.opponentName = oppopnentName;
            var oppAvatar = parseInt(message.oppAvatar);
            console.log("oppopnentAvatar ------->", oppAvatar);
            global.oppAvatar = oppAvatar;
            var oppopnentId = parseInt(message.oppdbId);
            console.log("oppopnentId ------->", oppopnentId);
            var sessionId = message.oppSessionId;
            console.log("sessionId ------->", sessionId);
            document.getElementById("oppTwo").textContent = global.opponentName;
            document.getElementById("oppTwoAvatar").src =
              "assets/img/profile/Avatar" + global.oppAvatar + ".png";
            const timer = setTimeout(() => {
              clearTimeout(timer);
              room.leave(true);
              global.lobbyRoom = null;
              console.log("global client---->", global.client);
              this.joinGameRoom(message, global.client);
            }, 1000);

            //this.display(gameScreen, true);
            //GamePlay.joinGameRoom(message);
          });
          room.onMessage("DuplicateUserForceQuit", () => {
            room.leave();
            popup.isVisible = true;
            popup.popupMessage =
              langModel.componentLang.popups.duplicateUser[langModel.lang];
            popup.closetxt =
              langModel.componentLang.popups.close[langModel.lang];
            popupFail = 1;
          });
          console.log("joined successfully", room);
        } catch (e) {
          console.error("join Error ", e);
        }
      }
    } else if (gameType == "AI") {
      this.joinGameRoom(null, global.client);
    } else if (gameType == "Tourny") {
      if (tournamentData != []) {
        if (globalClass.tournamentType == "tournament") {
          let lobbyCreated = false;
          let roomIdIfExist = "";
          await client
            .getAvailableRooms("tournamentLobbyRoom")
            .then((rooms) => {
              if (rooms.length) {
                rooms.forEach((room) => {
                  if (
                    room.roomId.startsWith(
                      String(globalClass.TournamentStartObject.tournament_id)
                    )
                  ) {
                    lobbyCreated = true;
                    roomIdIfExist = room.roomId;
                  }
                });
              }
            });
          console.log(
            "enter champion lobby 1 ->",
            lobbyCreated,
            " ",
            roomIdIfExist
          );
          if (lobbyCreated) {
            client
              .joinById(roomIdIfExist, {
                t_id: tournamentData[2],
                userID: global.dbId,
                t_name: tournamentData[1],
                tournamentStartTime: tournamentData[0],
              })
              .then((room) => {
                global.lobbyRoom = room;
                var roomToJoin;
                room.onMessage("waitingForPlayers", (message) => {
                  console.log(
                    "waitingfortournament , lobby sessionId: ",
                    message
                  );
                  global.lastRound = message.lastRound;
                  this.joinGameRoom(message, global.client);
                  roomToJoin = message.roomId;
                });
                global.lobbyRoom.onMessage(
                  "NotInTournamentOrRoundAllreadyStarted",
                  () => {
                    console.log("NotInTournamentOrRoundAllreadyStarted");
                    popup.isVisible = true;
                    popup.popupMessage =
                      langModel.componentLang.popups.tourStarted[
                        langModel.lang
                      ];
                    popup.closetxt =
                      this.langModel.componentLang.popups.close[
                        this.langModel.lang
                      ];
                  }
                );
              });
          } else {
            client
              .create("tournamentLobbyRoom", {
                t_id: tournamentData[2],
                userID: global.dbId,
                t_name: tournamentData[1],
                tournamentStartTime: tournamentData[0],
              })
              .then((room) => {
                global.lobbyRoom = room;
                var roomToJoin;
                room.onMessage("waitingForPlayers", (message) => {
                  console.log(
                    "waitingfortournament , lobby sessionId: ",
                    message
                  );
                  global.lastRound = message.lastRound;
                  this.joinGameRoom(message, global.client);
                  roomToJoin = message.roomId;
                });
                global.lobbyRoom.onMessage(
                  "NotInTournamentOrRoundAllreadyStarted",
                  () => {
                    console.log("NotInTournamentOrRoundAllreadyStarted");
                    popup.isVisible = true;
                    popup.popupMessage =
                      langModel.componentLang.popups.tourStarted[
                        langModel.lang
                      ];
                    popup.closetxt =
                      this.langModel.componentLang.popups.close[
                        this.langModel.lang
                      ];
                  }
                );
              });
          }
        } else if (globalClass.tournamentType == "championship") {
          let lobbyCreated = false;
          let roomIdIfExist = "";
          await client
            .getAvailableRooms("championshipLobbyRoom")
            .then((rooms) => {
              if (rooms.length) {
                rooms.forEach((room) => {
                  if (
                    room.roomId.startsWith(
                      String(globalClass.TournamentStartObject.tournament_id)
                    )
                  ) {
                    lobbyCreated = true;
                    roomIdIfExist = room.roomId;
                  }
                });
              }
            });
          console.log(
            "enter champion lobby 1 ->",
            lobbyCreated,
            " ",
            roomIdIfExist
          );
          if (lobbyCreated) {
            client
              .joinById(roomIdIfExist, {
                t_id: tournamentData[2],
                userID: global.dbId,
                t_name: tournamentData[1],
                tournamentStartTime: tournamentData[0],
              })
              .then((room) => {
                global.lobbyRoom = room;
                var roomToJoin;
                room.onMessage("waitingForPlayers", (message) => {
                  console.log(
                    "waitingfortournament , lobby sessionId: ",
                    message
                  );
                  this.joinGameRoom(message, global.client);
                  roomToJoin = message.roomId;
                });
                global.lobbyRoom.onMessage(
                  "NotInTournamentOrRoundAllreadyStarted",
                  () => {
                    console.log("NotInTournamentOrRoundAllreadyStarted");
                    popup.isVisible = true;
                    popup.popupMessage =
                      langModel.componentLang.popups.tourStarted[
                        langModel.lang
                      ];
                    popup.closetxt =
                      this.langModel.componentLang.popups.close[
                        this.langModel.lang
                      ];
                  }
                );
              });
          } else {
            client
              .create("championshipLobbyRoom", {
                t_id: tournamentData[2],
                userID: global.dbId,
                t_name: tournamentData[1],
                tournamentStartTime: tournamentData[0],
              })
              .then((room) => {
                global.lobbyRoom = room;
                var roomToJoin;
                room.onMessage("waitingForPlayers", (message) => {
                  console.log(
                    "waitingfortournament , lobby sessionId: ",
                    message
                  );
                  this.joinGameRoom(message, global.client);
                  roomToJoin = message.roomId;
                });
                global.lobbyRoom.onMessage(
                  "NotInTournamentOrRoundAllreadyStarted",
                  () => {
                    console.log("NotInTournamentOrRoundAllreadyStarted");
                    popup.isVisible = true;
                    popup.popupMessage =
                      langModel.componentLang.popups.tourStarted[
                        langModel.lang
                      ];
                    popup.closetxt =
                      this.langModel.componentLang.popups.close[
                        this.langModel.lang
                      ];
                  }
                );
              });
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    //alert(e);
    throw e;
  }
};
//generate dbid
getRndInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
// after lobby consume your seat for the game room which is reserved for you after you join other players in lobby room
joinGameRoom = async function (message, client) {
  global.playercount += 1;
  global.gameRoom = null;
  TournamentEnded = false;
  console.log("client----->", client);
  try {
    var room;
    if (global.gameType == "Tourny") {
      console.log("joining", message.roomId);
      if (global.gameRoom) global.gameRoom.leave();
      room = await client.joinById(message.roomId, {
        userName: globalClass.userName,
        dbId: globalClass.userId,
        avatar: globalClass.avatar.toString(),
      });
      console.log("joined successfully", room);
    } else if (global.gameType == "AI") {
      console.log("joining1");
      room = await client.create("AI", {
        userName: global.userName,
        dbId: global.dbId,
        avatar: global.avatar.toString(),
        coin: 0,
      });
      console.log("joined successfully", room);
    } else {
      console.log("joining2");
      room = await client.consumeSeatReservation(message.seat);
      console.log("joined successfully", room);
    }
    global.gameRoom = room;
    global.roomID = room.id;
    this.onGameMessage();

    if (global.gameType == "Tourny") {
      room.onMessage("GameStartTourny", () => {
        this.setGameRoom();
      });
    } else {
      this.setGameRoom();
    }
  } catch (e) {
    console.error("join error", e);
  }
};
onGameMessage = function () {
  if (global.gameType == "Tourny") {
    tieCount = 0;
    TournamentEnded = false;
    myPiece = 0;
    tournyOnePlayerWinner = false;
    newRoundStart = false;
    gameOver = false;
  }
  console.log("global gameRoom Id ", global.gameRoom.id);
  global.gameRoom.onMessage("yourID", (message) => {
    global.mySessionID = message.yourID;
  });
  global.gameRoom.onMessage("gameStart", (message) => {
    console.log("gameType gamestart----> ", global.gameType);
    if (global.gameType == "Tourny") {
      console.log("stats", message.stats);
      if (message.stats.length) {
        message.stats.forEach((stat) => {
          if (stat.dbId != global.dbId) {
            var oppopnentName = stat.userName;
            console.log("oppopnentName ------->", oppopnentName);
            global.opponentName = oppopnentName;
            document.getElementById("oppTwo").textContent = global.opponentName;
            var oppAvatar = parseInt(stat.avatar);
            console.log("oppopnentAvatar ------->", oppAvatar);
            global.oppAvatar = oppAvatar;
          }
        });
      }
    }
    if (message.playercount == 2) {
      console.log("game Started");
      gamePlay(global.gameRoom, popup, WinnerPopup);
    }
  });
  global.gameRoom.onMessage("PlayerTurn", (message) => {
    console.log("onMessage Player Turn", parseInt(message.playerTurn));
  });
  global.gameRoom.onMessage("yourPiece", (message) => {
    console.log("myPiece", message.myPiece);
    global.myPiece = message.myPiece;
    var image = new Image();
    image.src = "assets/images/Timer_30sec.gif" + "?a=" + Math.random();
    if (global.myPiece == 1) {
      var playerTimer = document.getElementById("playerTimer1");
      playerTimer.src = image.src;
      document.getElementById("playerTimer1").style.display = "block";
    } else if (global.myPiece == 2) {
      var playerTimer = document.getElementById("playerTimer2");
      playerTimer.src = image.src;
      document.getElementById("playerTimer2").style.display = "block";
    }

    console.log("myPiece", global.myPiece);
  });
  global.gameRoom.onMessage("boardUpdated", (message) => {
    console.log("boardUpdating");
    // var position = message.position;
    // var tileposition = message.tilePosition;
    // var player = message.player;
    var piece = message.selectedPiece;
    var tileID = message.tileId;
    console.log("piece", piece);
    movetile(tileID, piece);
    //var piece = message.piece;
    //var element = message.element;
  });
  global.gameRoom.onMessage("updateBoardAI", (message) => {
    console.log("Board updated through AI -> ", message);
    movetile(message.tileId, message.pieceId);
  });
  global.gameRoom.onMessage("playerTurn", (message) => {
    console.log("playerTurn---------->", message.playerTurn);
    playerTurn = message.playerTurn;
  });
  global.gameRoom.onMessage("winner", (message) => {
    console.log("winner---------->");
    global.gameRoom.leave();
    // var timer  = setTimeout(()=>{
    //   if(!message.winner){
    //     console.log("Winner's empty");
    //   }else{
    //   // alert("The winner is " + message.winner + " in this game");
    //   popup.isVisible= true;
    //   popup.popupMessage = "The winner is " + message.winner + " in this game";
    // }
    //   clearTimeout(timer);
    // },2000);
    // var timer2 = setTimeout(()=>{
    //   // alert("Game ended. Going back to Home Page");
    //   popup.isVisible= true;
    //   popup.popupMessage = "Game ended. Going back to Home Page";
    //   global.router.navigateByUrl('homePage');
    //   clearTimeout(timer2);
    // },4000);
  });
  global.gameRoom.onMessage("turnChangeAfterTimeUp", () => {
    if (Board) {
      console.log("time up");
      Board.changePlayerTurn(true);
    }
  });
  global.gameRoom.onMessage("MissedThreeTurns", (message) => {
    console.log("MissedThreeTurns");
    if (!gameOver) {
      var playerTimer2 = document.getElementById("playerTimer2");
      playerTimer2.src = "";
      document.getElementById("playerTimer2").style.display = "none";
      var playerTimer1 = document.getElementById("playerTimer1");
      playerTimer1.src = "";
      document.getElementById("playerTimer1").style.display = "none";

      if (!(message.playerTurn == myPiece)) {
        if (!global.lastRound) {
          WinnerPopup.langModel = langModel;
          WinnerPopup.isVisible = true;
          if (global.gameType == "Tourny") {
            WinnerPopup.isTourney = true;
            WinnerPopup.tourEnded = false;
          }
          WinnerPopup.winnerName = global.userName;
          WinnerPopup.winnerAmt = rewardAmount;
          WinnerPopup.winnerAvatar =
            "assets/img/profile/Avatar" + global.avatar + ".png";
          soundService1.playAudio("winner");
          console.log("here05", global.userName);
        }
        gameOver = true;
        global.gameRoom.send("Winner", {
          winner: global.userName,
          userid: global.dbId,
        });
      } else {
        popup.isVisible = true;
        popup.popupMessage =
          langModel.componentLang.popups.lostGame[langModel.lang];
        popup.closetxt =
          this.langModel.componentLang.popups.close[this.langModel.lang];
        popupFail = 1;
      }
    }
  });
  global.gameRoom.onMessage("Disconnect", () => {
    //console.log("playerTurn---------->",message.playerTurn);
    // playerTurn = message.playerTurn;
    console.log("Other Player has left the game1 Disconnect");
    if (!gameOver) {
      var playerTimer2 = document.getElementById("playerTimer2");
      playerTimer2.src = "";
      document.getElementById("playerTimer2").style.display = "none";
      var playerTimer1 = document.getElementById("playerTimer1");
      playerTimer1.src = "";
      document.getElementById("playerTimer1").style.display = "none";
      console.log("last Round Disconnect -> ", global.lastRound);
      if (!global.lastRound) {
        WinnerPopup.langModel = langModel;
        WinnerPopup.isVisible = true;
        if (global.gameType == "Tourny") {
          WinnerPopup.isTourney = true;
          WinnerPopup.tourEnded = false;
        }
        WinnerPopup.winnerName = global.userName;
        WinnerPopup.winnerAmt = rewardAmount;
        console.log("here07", global.userName);

        console.log("setting winner avatar", WinnerPopup);

        WinnerPopup.winnerAvatar =
          "assets/img/profile/Avatar" + global.avatar + ".png";
        WinnerPopup.isVisible = true;
        console.log("setting winner avatar", WinnerPopup);
        soundService1.playAudio("winner");
      }
      gameOver = true;
      global.gameRoom.send("Winner", {
        winner: global.userName,
        userid: global.dbId,
      });
    }
    if (global.gameType == "Tourny") global.gameRoom.leave();
  });
  global.gameRoom.onMessage("playerReconnecting", () => {
    //console.log("playerTurn---------->",message.playerTurn);
    // playerTurn = message.playerTurn;
    var playerTimer2 = document.getElementById("playerTimer2");
    playerTimer2.src = "";
    document.getElementById("playerTimer2").style.display = "none";
    var playerTimer1 = document.getElementById("playerTimer1");
    playerTimer1.src = "";
    document.getElementById("playerTimer1").style.display = "none";

    popup.isVisible = true;
    popup.popupMessage =
      global.opponentName +
      " " +
      langModel.componentLang.popups.reconnect[langModel.lang];
    popup.closetxt = langModel.componentLang.popups.waitChecker[langModel.lang];
    popup.type = "doNotQuit";

    // setTimeout(() => {

    //   // self.model.loadingBar = false;
    // }, 2000);

    console.log("Other Player has left the game2");
  });
  global.gameRoom.onMessage("playerReconnected", (message) => {
    //console.log("playerTurn---------->",message.playerTurn);
    // playerTurn = message.playerTurn;
    if (popup.isVisible) {
      popup.isVisible = false;
    }
    var image = new Image();
    image.src = "assets/images/Timer_30sec.gif" + "?a=" + Math.random();
    Board.playerturn = message.playerTurn;
    if (Board.playerTurn == 1) {
      Board.checkNoWin();
      Board.playerTurn = 2;
      Board.checkNoWin();
      if (myPiece == 2) {
        document.getElementsByClassName("player2")[0].id = "";
        document.getElementsByClassName("player1")[0].id = "";
        var playerTimer = document.getElementById("playerTimer2");
        playerTimer.src = image.src;
        document.getElementById("playerTimer2").style.display = "block";
      } else if (myPiece == 1) {
        document.getElementsByClassName("player1")[0].id = "";
        document.getElementsByClassName("player2")[0].id = "";
        var playerTimer = document.getElementById("playerTimer1");
        playerTimer.src = image.src;
        document.getElementById("playerTimer1").style.display = "block";
      }
    } else {
      Board.checkNoWin();
      Board.playerTurn = 1;
      Board.checkNoWin();

      if (myPiece == 1) {
        document.getElementsByClassName("player2")[0].id = "blink";
        document.getElementsByClassName("player1")[0].id = "";
        var playerTimer = document.getElementById("playerTimer2");
        playerTimer.src = image.src;
        document.getElementById("playerTimer2").style.display = "block";
      } else if (myPiece == 2) {
        document.getElementsByClassName("player1")[0].id = "blink";
        document.getElementsByClassName("player2")[0].id = "";
        var playerTimer = document.getElementById("playerTimer1");
        playerTimer.src = image.src;
        document.getElementById("playerTimer1").style.display = "block";
      }
    }
    popup.isVisible = true;
    popup.popupMessage =
      langModel.componentLang.popups.reconnectDone[langModel.lang];
    popup.closetxt = langModel.componentLang.popups.waitChecker[langModel.lang];
    // document.querySelector("yellow-btn").disabled = false;
    popup.type = "nothing";
    //popup.popupMessage = global.opponentName + " has left the game";
    // setTimeout(() => {

    //   // self.model.loadingBar = false;
    // }, 2000);

    console.log("Other Player has left the game2");
  });
  if (global.gameType == "Tourny") {
    global.gameRoom.onMessage("gameTiedTourny", (message) => {
      //gametied
      var playerTimer2 = document.getElementById("playerTimer2");
      playerTimer2.src = "";
      document.getElementById("playerTimer2").style.display = "none";
      var playerTimer1 = document.getElementById("playerTimer1");
      playerTimer1.src = "";
      document.getElementById("playerTimer1").style.display = "none";

      popup.isVisible = true;
      popup.popupMessage =
        langModel.componentLang.popups.TournamentTieLoss[langModel.lang];
      popup.closetxt = langModel.componentLang.popups.cLose[langModel.lang];
      popup.type = "close";
      popupFail = 1;

      // setTimeout(() => {

      //   // self.model.loadingBar = false;
      // }, 2000);

      console.log("Other Player has won due to tie rule of tourny");
      global.gameRoom.leave();
    });
    global.gameRoom.onMessage("playerData", (message) => {
      console.log("message in player data ", message.stats);
    });
    global.gameRoom.onMessage("onePlayerWinner", (message) => {
      tournyOnePlayerWinner = true;
      console.log("onePlayerWinner >>> ", message);
      popup.isVisible = false;
      WinnerPopup.langModel = langModel;
      WinnerPopup.isVisible = true;
      if (global.gameType == "Tourny") {
        WinnerPopup.isTourney = true;
        WinnerPopup.tourEnded = false;
        if (globalClass.tournamentType != "championship")
          WinnerPopup.heading =
            langModel.componentLang.ingame.tourwinner[langModel.lang];
        else
          WinnerPopup.heading =
            langModel.componentLang.ingame.champwinner[langModel.lang];
      }
      WinnerPopup.winnerName = global.userName;
      WinnerPopup.winnerAmt = globalClass.checkerRewardAmt;
      var avtarPic = setTimeout(() => {
        clearTimeout(avtarPic);
        // WinnerPopup.winnerAvatar = document.getElementById(
        //   'winnerPopupAvatar'
        // )! as HTMLImageElement;
        WinnerPopup.winnerAvatar =
          "../../assets/img/profile/Avatar" + global.avatar + ".png";
      }, 100);
      //WinnerPopup.image = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
      //console.log("winnerPopupAvatar-> ", WinnerPopup.winnerAvatar);
      //this.image
      //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      //WinnerPopup.winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      //WinnerPopup.winnerAvatar.src = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
      global.gameRoom.leave();
      soundService1.playAudio("winner");
    });
    global.lobbyRoom.onMessage("newRoundStart", (message) => {
      console.log("newRoundStart >>> ", message.rooms);
      console.log("newRoundStart1 >>> ", message.lastRound, newRoundStart);
      global.lastRound = message.lastRound;
      if (!newRoundStart) {
        newRoundStart = true;
        console.log("newRoundstart -> ", newRoundStart);
        var newroomIdObj = { roomId: null };

        for (let rooms of message.rooms) {
          console.log(rooms.roomID + " = ", rooms.userID);

          if (rooms.userID == global.dbId) {
            newroomIdObj.roomId = rooms.roomID;
          }
        }
        console.log("joining game rooms tournament", newroomIdObj);
        if (!tournyOnePlayerWinner) {
          if (canvas) {
            const parent = $("div.background");
            canvas.appendTo(parent);
            console.log("child to append ", canvas);
          }
        } else {
          tournyOnePlayerWinner = false;
        }

        if (newroomIdObj.roomId != null)
          joinGameRoom(newroomIdObj, global.client);
      }
      //userid
      ///popup
    });

    global.lobbyRoom.onMessage("waitForNewRoundToStart", (message) => {
      console.log(
        "waitForNewRoundToStart >>> ",
        message,
        "    ",
        TournamentEnded,
        "    ",
        globalClass.userId
      );
      setTimeout(waitForNewRoundToStart, 3000, message);
    });
    function waitForNewRoundToStart(message) {
      if (
        globalClass.userId == message.winner.userId &&
        TournamentEnded == false &&
        !newRoundStart
      ) {
        console.log(
          "here in wait for new round - tournyOnePlayerWinner - > ",
          tournyOnePlayerWinner
        );
        WinnerPopup.isVisible = false;
        popup.isVisible = false;
        if (!tournyOnePlayerWinner) {
          const parent = $("div.innerCheckersGamePage");
          parent.remove();
        }

        // parent.removeChild(child);
        document.getElementById("gameScreen").style.display = "none";
        document.getElementById("searchingPlayers").style.display = "block";
        document.getElementById("oppTwo").textContent =
          "Waiting For Next Round ...";
        document.getElementById("oppTwoAvatar").src =
          "assets/img/profile/Avatar0.png";
      }
    }
    global.gameRoom.onMessage("tournamentEnded", (message) => {
      console.log("tournamentEnded >>> ", message);
      //winner
      TournamentEnded = true;
      WinnerPopup.langModel = langModel;
      WinnerPopup.isVisible = true;
      if (global.gameType == "Tourny") {
        WinnerPopup.isTourney = true;
        WinnerPopup.tourEnded = true;
        TournamenentEnded = true;
        if (globalClass.tournamentType != "championship")
          WinnerPopup.heading =
            langModel.componentLang.ingame.tourwinner[langModel.lang];
        else
          WinnerPopup.heading =
            langModel.componentLang.ingame.champwinner[langModel.lang];
      }
      WinnerPopup.winnerName = message.winner.rank1;
      WinnerPopup.secondRank = message.looser.rank2;
      // WinnerPopup.secondAvatar = message.looser.rank2Avatar;
      WinnerPopup.winnerAmt = globalClass.checkerRewardAmt;
      WinnerPopup.secondAmt = globalClass.checkerSecRewardAmt;
      console.log("here08", message.winner);
      WinnerPopup.winnerAvatar =
        "../../assets/img/profile/Avatar" + message.winner.rank1Avatar + ".png";
      if (message.looser.rank2Avatar)
        WinnerPopup.secondAvatar =
          "../../assets/img/profile/Avatar" +
          message.looser.rank2Avatar +
          ".png";
      // var avtarPic = setTimeout(() => {
      //   clearTimeout(avtarPic);

      // }, 100);
      //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      //WinnerPopup.winnerAvatar.src = '../../../assets/img1/Winner_Screen/Avatar'+ message.rank1Avatar + '.png';

      if (String(message.winner.rank1) == String(globalClass.userName))
        soundService1.playAudio("winner");
      else soundService1.playAudio("Loose");
      if (global.gameRoom) {
        global.gameRoom.leave();
      }
      //userid
      ///popup
    });
    global.lobbyRoom.onMessage("tournamentEndedOnePlayerJoin", (message) => {
      console.log("tournamentEndedOnePlayerJoin >>> ", message);
      //winner
      TournamentEnded = true;
      WinnerPopup.langModel = langModel;
      WinnerPopup.isVisible = true;
      if (global.gameType == "Tourny") {
        WinnerPopup.isTourney = true;
        WinnerPopup.tourEnded = true;
        TournamenentEnded = true;
        if (globalClass.tournamentType != "championship")
          WinnerPopup.heading =
            langModel.componentLang.ingame.tourwinner[langModel.lang];
        else
          WinnerPopup.heading =
            langModel.componentLang.ingame.champwinner[langModel.lang];
      }
      WinnerPopup.winnerName = message.winner.rank1;
      WinnerPopup.secondRank = "";
      WinnerPopup.winnerAmt = globalClass.checkerRewardAmt;
      WinnerPopup.secondAmt = globalClass.checkerSecRewardAmt;
      console.log("here08", message.winner);
      WinnerPopup.winnerAvatar =
        "../../assets/img/profile/Avatar" + message.winner.rank1Avatar + ".png";
      WinnerPopup.secondAvatar =
        "../../assets/img/profile/Avatar" + "0" + ".png";
      // var avtarPic = setTimeout(() => {
      //   clearTimeout(avtarPic);

      // }, 100);
      //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
      //WinnerPopup.winnerAvatar.src = '../../../assets/img1/Winner_Screen/Avatar'+ message.rank1Avatar + '.png';

      if (String(message.winner.rank1) == String(globalClass.userName))
        soundService1.playAudio("winner");
      else soundService1.playAudio("Loose");
      if (global.gameRoom) {
        global.gameRoom.leave();
      }
      //userid
      ///popup
    });
  }
};
setGameRoom = function () {
  //var playerCount = 0;
  global.gameRoom.send("returnMypiece");
  global.gameRoom.state.listen("board", (currentValue, previousValue) => {
    console.log("board", currentValue, previousValue);
  });
  global.gameRoom.state.players.onAdd = (player, key) => {
    //console.log(player, "has been added at", key);
    //playerCount++;
    console.log("myUsername-->", global.userName);
    if (player.index == 1) {
      global.players[0] = player;
      //global.myPiece = player.myPiece;
    } else if (player.index == 2) {
      global.players[1] = player;
      //global.myPiece = player.myPiece;
    }
    console.log(player.id + "--------------" + player.userName);
    console.log("my Session Id", global.players[0].id);
  };
  console.log("returnMypiece");
};
movetile = function (tile, piece) {
  var tile1 = tiles[tile]; //tiles object
  var piece1 = pieces[piece]; //pieces object
  console.log("piece----->", piece);
  var inRange = tile1.inRange(piece1);
  if (inRange != "wrong") {
    //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)

    if (inRange == "jump") {
      var opponentKillormove = piece1.opponentJump(tile1);

      if (opponentKillormove == "moveWithoutRestriction" && !Board.jumpexist) {
        console.log("It can jump but do not check further moves");
        piece1.move(tile1);
        if (tieCount >= 30 && global.gameType != "Tourny") {
          console.log("tiecount is 30 1-> ", tieCount);
          popup.isVisible = true;
          popup.popupMessage = " Game is Tied !";
          popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
          popupFail = 1;
          global.gameRoom.send("gameTie");
          global.gameRoom.leave();
        } else if (tieCount >= 30 && global.gameType == "Tourny") {
          //notify room gameTie
          global.gameRoom.send("gameTie");
        }
        Board.changePlayerTurn(false);
      } else if (
        opponentKillormove == "moveWithoutRestriction" &&
        Board.jumpexist
      ) {
        popup.isVisible = true;
        popup.popupMessage =
          langModel.componentLang.popups.oblige[langModel.lang];
        popup.closetxt =
          langModel.componentLang.popups.closeChecker[langModel.lang];
      } else if (opponentKillormove == "removePieceAndMove") {
        console.log("It can jump");
        let bool = false;
        if (!piece1.king) {
          bool = true;
        }
        piece1.move(tile1);
        if (bool) {
          if (piece1.king) {
            bool = true;
          } else {
            bool = false;
          }
        }
        if (tieCount >= 30 && global.gameType != "Tourny") {
          console.log("tiecount is 30 1-> ", tieCount);
          popup.isVisible = true;
          popup.popupMessage = " Game is Tied !";
          popup.closetxt = langModel.componentLang.popups.close[langModel.lang];
          popupFail = 1;
          global.gameRoom.send("gameTie");
          global.gameRoom.leave();
        } else if (tieCount >= 30 && global.gameType == "Tourny") {
          //notify room gameTie
          global.gameRoom.send("gameTie");
        }
        //soundService1.playAudio('Killed')
        if (!piece1.king) {
          if (piece1.canJumpAny()) {
            // Board.changePlayerTurn(false); //change back to original since another turn can be made
            piece1.element.addClass("selected");
            // exist continuous jump, you are not allowed to de-select this piece or select other pieces
            Board.continuousjump = true;
          } else {
            Board.changePlayerTurn(false);
          }
        } else {
          if (!bool) {
            if (Board.kingCanJumpAny(piece1)) {
              piece1.element.addClass("selected");
              Board.continuousjump = true;
            } else {
              Board.changePlayerTurn(false);
            }
          } else {
            Board.changePlayerTurn(false);
          }
        }
      }

      //if it's regular then move it if no jumping is available
    } else if (inRange == "regular" && !Board.jumpexist) {
      if (Board.jumpexist) {
        popup.isVisible = true;
        popup.popupMessage =
          langModel.componentLang.popups.oblige[langModel.lang];
        popup.closetxt =
          langModel.componentLang.popups.closeChecker[langModel.lang];
      } else {
        if (!piece1.canJumpAny()) {
          piece1.move(tile1);
          tieCount++;
          if (tieCount >= 30 && global.gameType != "Tourny") {
            console.log("tiecount is 30 1-> ", tieCount);
            popup.isVisible = true;
            popup.popupMessage = " Game is Tied !";
            popup.closetxt =
              langModel.componentLang.popups.close[langModel.lang];
            popupFail = 1;
            global.gameRoom.send("gameTie");
            global.gameRoom.leave();
          } else if (tieCount >= 30 && global.gameType == "Tourny") {
            //notify room gameTie
            global.gameRoom.send("gameTie");
          }
          console.log("tiecount3 -> ", tieCount);
          Board.changePlayerTurn(false);
        } else {
          // alert("You must jump when possible!");
          popup.isVisible = true;
          popup.popupMessage =
            langModel.componentLang.popups.jump[langModel.lang];
          popup.closetxt =
            langModel.componentLang.popups.closeChecker[langModel.lang];
        }
      }
    }
  }

  console.log("boardUpdated");
};
dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
gamePlay = function (room, popup, WinnerPopup) {
  // global.router.navigateByUrl('homePage');

  console.log("gamePlay----->", room);
  //document.getElementById("waiting").style.display = 'none';
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("searchingPlayers").style.display = "none";
  if (global.gameType == "Tourny") {
    canvas = $("div.innerCheckersGamePage").clone();
    console.log("canvas", canvas);
  }
  if (createRoom == true) {
    //document.getElementById("waiting1").style.display = 'none';
  }

  document.getElementById("avatar1").style.display = "block";
  document.getElementById("avatar2").style.display = "block";
  // document.getElementById('avatar1').style.border = '3px solid #feff02';
  // document.getElementById('avatar2').style.border = '3px solid #feff02';
  // document.getElementById('avatar1').style.borderRadius = '50px';
  // document.getElementById('avatar2').style.borderRadius = '50px';

  document.getElementById("myUserName").textContent = global.userName;
  if (global.gameType != "AI")
    document.getElementById("otherPlayerUserName").textContent =
      global.opponentName;
  else document.getElementById("otherPlayerUserName").textContent = "MoJo";

  // document.getElementById("myAvatar").src = "./../../../assets/img/profile/Avatar"+global.avatar+".png";
  // document.getElementById("otherPlayerAvatar").src = "./../../../assets/img/profile/Avatar"+global.oppAvatar+".png";
  console.log("global.myPiece inside gamePlay-------------->", global.myPiece);

  if (global.myPiece == 2) {
    // alert("this is your chance");
    // popup.isVisible= true;
    // //popup.popupMessage = "This is your chance";
    // popup.popupMessage = langModel.componentLang.popups.chance[langModel.lang];
    // popup.closetxt = langModel.componentLang.popups.start[langModel.lang];
    document.getElementById("otherPlayerAvatar").src =
      "assets/img/profile/Avatar" + global.avatar + ".png";

    console.log("popup.isVisible ", popup.isVisible);
    if (global.gameType != "AI") {
      document.getElementById("myAvatar1").src =
        "assets/img/profile/Avatar" + global.oppAvatar + ".png";
    } else
      document.getElementById("myAvatar1").src =
        "assets/img/profile/Avatar" + 1 + ".png";

    // document.getElementsByClassName("player2")[0].id = 'blink';
    // document.getElementsByClassName("player1")[0].id = '';
    //document.getElementById()
  } else if (global.myPiece == 1) {
    // alert("this is "+ global.opponentName +"'s chance");

    // popup.isVisible= true;
    // if(langModel.lang == 'en')popup.popupMessage = global.opponentName +"'s chance";
    // else popup.popupMessage = "chance de " +global.opponentName;
    // popup.closetxt = langModel.componentLang.popups.start[langModel.lang];
    console.log("popup.isVisible ", popup.isVisible);
    document.getElementById("otherPlayerAvatar").src =
      "assets/img/profile/Avatar" + global.avatar + ".png";
    document.getElementById("myAvatar1").src =
      "assets/img/profile/Avatar" + global.oppAvatar + ".png";
    // document.getElementsByClassName("player1")[0].id = 'blink';
    //   document.getElementsByClassName("player2")[0].id = '';
  }

  // $x = $('#board').height();
  // $totalHeight = $(window).height() - $x;
  // console.log($totalHeight);
  // if ($totalHeight > 500) {
  //   $('.toppanel').innerHeight(((20 * $totalHeight) / 100));
  //   $('.stats').innerHeight(((40 * $totalHeight) / 100));
  //   $('.stats2').innerHeight(((40 * $totalHeight) / 100));
  // }
  // $('#board').css({"top": ($('.toppanel').height(((20  * $totalHeight)/100)) + $('.stats').height(((40  * $totalHeight)/100))}));

  gameBoard = [];
  tieCount = 0;
  Board = null;
  myPiece = 0;
  tiles = [];
  pieces = [];

  while (global.gameRoom.state.board.length) {
    gameBoard.push(global.gameRoom.state.board.splice(0, 8));
  }
  console.log("gameBoard--------->", gameBoard);

  //arrays to store the instances

  myPiece = global.myPiece;
  playerTurn = 0;
  //distance formula

  //Piece object - there are 24 instances of them in a checkers game

  //Board object - controls logistics of game

  //initialize the board
  Board = new BoardClass();
  /***
      Events
      ***/

  //select the piece on click if it is the player's turn
  $(".piece").on("click", function () {
    var selected;
    var isPlayersTurn =
      $(this).parent().attr("class").split(" ")[0] ==
      "player" + Board.playerTurn + "pieces";
    if (isPlayersTurn) {
      if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
        if ($(this).hasClass("selected")) selected = true;
        $(".piece").each(function (index) {
          $(".piece").eq(index).removeClass("selected");
        });
        if (!selected) {
          $(this).addClass("selected");
        }
      } else {
        let exist = langModel.componentLang.popups.exist[langModel.lang];
        let continuous =
          langModel.componentLang.popups.continuous[langModel.lang];
        let message = !Board.continuousjump ? exist : continuous;
        popup.isVisible = true;
        popup.popupMessage = message;
        console.log(message);
        popup.closetxt =
          langModel.componentLang.popups.closeChecker[langModel.lang];
      }
    }
  });

  //reset game when clear button is pressed
  $("#cleargame").on("click", function () {
    Board.clear();
  });

  //move piece when tile is clicked
  $(".tile").on("click", function () {
    //make sure a piece is selected
    if ($(".selected").length != 0) {
      //find the tile object being clicked
      var tileID = $(this).attr("id").replace(/tile/, "");
      console.log("tile id -> ", tileID);
      var tile = tiles[tileID];
      //find the piece being selected
      var pieceID = $(".selected").attr("id");
      console.log("piece id -> ", pieceID);
      var piece = pieces[pieceID];
      //check if the tile is in range from the object
      global.gameRoom.send("selectedPiece", {
        selectedPiece: pieceID,
        tileId: tileID,
      });
      console.log("piece----->", piece);
      var inRange = tile.inRange(piece);
      console.log("inRange----->", inRange);
      if (piece.player == global.myPiece) {
        if (inRange != "wrong") {
          //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
          if (inRange == "jump") {
            // console.log("opponentJump - > ", piece.opponentJump(tile));
            //console.log("opponentJump - > ", piece.opponentJump(tile));

            var opponentKillormove = piece.opponentJump(tile);

            if (
              opponentKillormove == "moveWithoutRestriction" &&
              Board.jumpexist
            ) {
              popup.isVisible = true;
              popup.popupMessage =
                langModel.componentLang.popups.oblige[langModel.lang];
              popup.closetxt =
                langModel.componentLang.popups.closeChecker[langModel.lang];
            } else if (opponentKillormove == "removePieceAndMove") {
              console.log("It can jump");
              let bool = false;
              if (!piece.king) {
                bool = true;
              }
              piece.move(tile);
              if (bool) {
                if (piece.king) {
                  bool = true;
                } else {
                  bool = false;
                }
              }
              //soundService1.playAudio('Killed')
              if (tieCount >= 30 && global.gameType != "Tourny") {
                console.log("tiecount is 30 1-> ", tieCount);
                popup.isVisible = true;
                popup.popupMessage = " Game is Tied !";
                popup.closetxt =
                  langModel.componentLang.popups.close[langModel.lang];
                popupFail = 1;
                global.gameRoom.send("gameTie");
                global.gameRoom.leave();
              } else if (tieCount >= 30 && global.gameType == "Tourny") {
                //notify room gameTie
                global.gameRoom.send("gameTie");
              }
              if (!piece.king) {
                if (piece.canJumpAny()) {
                  // Board.changePlayerTurn(false); //change back to original since another turn can be made
                  piece.element.addClass("selected");
                  // exist continuous jump, you are not allowed to de-select this piece or select other pieces
                  Board.continuousjump = true;
                } else {
                  Board.changePlayerTurn(false);
                }
              } else {
                if (!bool) {
                  if (Board.kingCanJumpAny(piece)) {
                    piece.element.addClass("selected");
                    Board.continuousjump = true;
                  } else {
                    Board.changePlayerTurn(false);
                  }
                } else {
                  Board.changePlayerTurn(false);
                }
              }
            } else if (
              opponentKillormove == "moveWithoutRestriction" &&
              !Board.jumpexist
            ) {
              console.log("It can jump but do not check further moves2");
              piece.move(tile);
              if (tieCount >= 30 && global.gameType != "Tourny") {
                console.log("tiecount is 30 1-> ", tieCount);
                popup.isVisible = true;
                popup.popupMessage = " Game is Tied !";
                popup.closetxt =
                  langModel.componentLang.popups.close[langModel.lang];
                popupFail = 1;
                global.gameRoom.send("gameTie");
                global.gameRoom.leave();
              } else if (tieCount >= 30 && global.gameType == "Tourny") {
                //notify room gameTie
                global.gameRoom.send("gameTie");
              }
              Board.changePlayerTurn(false);
            } else {
              popup.isVisible = true;
              popup.popupMessage =
                langModel.componentLang.popups.validMove[langModel.lang];
              popup.closetxt =
                langModel.componentLang.popups.closeChecker[langModel.lang];
            }

            //if it's regular then move it if no jumping is available
          } else if (inRange == "regular") {
            if (Board.jumpexist) {
              popup.isVisible = true;
              popup.popupMessage =
                langModel.componentLang.popups.oblige[langModel.lang];
              popup.closetxt =
                langModel.componentLang.popups.closeChecker[langModel.lang];
            } else if (!Board.jumpexist) {
              if (!piece.canJumpAny()) {
                piece.move(tile);
                tieCount++;
                if (tieCount >= 30 && global.gameType != "Tourny") {
                  console.log("tiecount is 30 3-> ", tieCount);
                  popup.isVisible = true;
                  popup.popupMessage = " Game is Tied !";
                  popup.closetxt =
                    langModel.componentLang.popups.close[langModel.lang];
                  popupFail = 1;
                  global.gameRoom.send("gameTie");
                  global.gameRoom.leave();
                } else if (tieCount >= 30 && global.gameType == "Tourny") {
                  //notify room gameTie
                  global.gameRoom.send("gameTie");
                }
                console.log("tiecount 5-> ", tieCount);
                Board.changePlayerTurn(false);
              } else {
                // alert("You must jump when possible!");
                popup.isVisible = true;
                popup.popupMessage =
                  langModel.componentLang.popups.jump[langModel.lang];
                popup.closetxt =
                  langModel.componentLang.popups.closeChecker[langModel.lang];
              }
            }
          }
        }
      } else {
        // alert("This is not your Piece to move");
        popup.isVisible = true;
        popup.popupMessage =
          langModel.componentLang.popups.noMove[langModel.lang];
        popup.closetxt =
          langModel.componentLang.popups.closeChecker[langModel.lang];
      }
    }
  });

  //reciving room messages

  //listens for player state change
  global.gameRoom.state.players.onChange = (player, key) => {
    myPiece = player.myPiece;
    console.log(player, "have changes at", key);
  };
  global.gameRoom.onLeave((code) => {
    // console.log(client.id, "left", room.name);
    console.log("onLeave called");
  });
  // function for recieving other player move and sync the pieces
};
