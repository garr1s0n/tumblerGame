(function() { appInit(); }());

var results = {
    name: '',
    result: false,
    prize: ''
}

function appInit() {

    var winLoseOpt = document.getElementsByClassName('wlLabel');
    for (var i = 0; i < winLoseOpt.length; i++) {
        winLoseOpt[i].addEventListener('click', getWinLose);
    }

    document.getElementById("gameSetup").addEventListener('submit',  gameSetup)
}

var resultSelect = '';
function getWinLose() {
    var winLoseVal = document.getElementsByName('result');

    for (var i = 0; i < winLoseVal.length; i++) {
     if (winLoseVal[i].checked) {
        var prizeHolder = document.getElementById('prizeHolder');
        if (winLoseVal[i].value == "win") {
            prizeHolder.classList.add('active');
            resultSelect = true;
        } else {
            prizeHolder.classList.remove('active');
            resultSelect = false;
            setTimeout(function() {
                var dropDown = document.getElementById("prize");
                dropDown.selectedIndex = 0;
            }, 350);
        }
        break;
     }
    }
}

var displayConsoleLogs = true;
// console logging
function logToConsole(message) {
    if (typeof (console) != "undefined" && typeof (console.log) == "function" && typeof (displayConsoleLogs) != undefined && displayConsoleLogs != null && displayConsoleLogs) {
        console.log("logToConsole: " + message);
    }
}

function fader(proc) {
    if (proc == "show") { $('#dialog').before('<div id="overlay" class="clearfix"></div>'); $("#overlay").css("opacity", 0); $("#overlay").fadeTo(400, .5); } else if (proc == "hide") { $("#overlay").fadeOut(400, function () { $("#overlay").remove(); }); }
}

var win, prizeDesc;

function gameSetup() {
    results.name = document.getElementById('name').value;
    results.result = resultSelect
    results.prize = document.getElementById('prize').value;
    
    goGame();
}


function goGame() {
    loadGame();
    $('#gameSpinBtn').unbind('click').bind('click', function () { spinSlots(); });
}

/* ----- Slot Machine IW - Jan 2018 ------ */

// User Variables
var setImages = 5; // Total Number of Images per Set
var totSets = 25; // Total number of set repeats
// var winImg = 5; // Single Winning image
//var winImg = Math.floor(Math.random() * (setImages - 1)) + 1; // Random Winning image from set 
var winImg; 

var winImgSelect = '';
function getWinImg() {
    var winImgVal = document.getElementsByName('winImage');
    var winImgHolder = document.getElementById('winImgPrev');
    var winImgDisplay = document.getElementById('winImgPreview');

    for (var i = 0; i < winImgVal.length; i++) {    
        if (resultSelect == true) {
            if (winImgVal[i].checked) {
                winImg = winImgVal[i].value;
                winImgDisplay.src = 'images/game/slotImg-' + winImgVal[i].value + '.jpg';
                winImgHolder.classList.add('active');
                break;
            } else { 
                var randWinImage = Math.floor(Math.random() * (setImages - 1)) + 1;
                winImg = randWinImage;
                winImgDisplay.src = 'images/game/slotImg-' + randWinImage + '.jpg';
                winImgHolder.classList.add('active');
            }
        }
    }
}

// Game Variables
var win, prizeDesc;
var totImgs = totSets * setImages;
var setHeight = (setImages / totImgs) * 100; // % height of one set to translateY
var imgHeight = (1 / totImgs) * 100; // % height of one image to translateY


function loadGame() {
    
    win = results.result;
    prizeDesc = results.prize;
    getWinImg();

    if (win) { logToConsole("Game Win: img" + winImg); };

    var colHTML = buildSet();

    // Build Columns
    $('#colA').html(colHTML).css("transform", "translateY(-" + setHeight + "%)");
    $('#colB').html(colHTML).css("transform", "translateY(-" + setHeight + "%)");
    $('#colC').html(colHTML).css("transform", "translateY(-" + setHeight + "%)");

    $('#slotArea').fadeIn(350, 'easeInQuad', function() {
        setupSets();
    });


}

function buildSet() {
    var setHTML = '';
    var colHTML = '';
    
    for (j=1; j <= setImages; j++) {
        if (win && j == winImg) {
            setHTML += '<img src="images/game/slotImg-' + j + '.jpg" class="img-responsive winnerImg" />'
        } else {
            setHTML += '<img src="images/game/slotImg-' + j + '.jpg" class="img-responsive" />'
        }
    } 

    for (i = 0; i < totSets; i++) {
        colHTML += setHTML;
    }

    return colHTML;
}

function setupSets() {
    var moveHeight1 = setHeight + ( (imgHeight * 3) + (.5 * imgHeight) );
    var moveHeight2 = setHeight - ( (imgHeight * 3) + (.5 * imgHeight) );
    var moveHeight3 = setHeight + ( (imgHeight * 2) + (.5 * imgHeight) );

    $('#colA').css("transform", "translateY(-" + moveHeight1 + "%)");
    $('#colB').css("transform", "translateY(-" + moveHeight2 + "%)");
    $('#colC').css("transform", "translateY(-" + moveHeight3 + "%)");

    setTimeout( function() { $('#slotmachine').addClass('gameSet'); }, 350);
    
    $('#slotDialogue').fadeIn();
}

var moveHeight1, moveHeight2, moveHeight3;
function spinSlots() {
    
    $('#slotDialogue').fadeOut();

    if (win) {
        console.log('set height: ' + setHeight + '%');
        console.log('set movement: ' + setHeight * (totSets - 1) + '%');
        console.log('Image height: ' + imgHeight + '%');
        console.log('image offset: ' + imgHeight * winImg + '%');
        console.log('image alignment: ' + .5 * imgHeight + '%');
        console.log('All sets height - 2 (' + (setHeight * (totSets - 2)) + '%) + win image offset (' + (imgHeight * (winImg - 1)) + '%) - alignment height (' + (.5 * imgHeight) + '%) = total movement (' +  ((setHeight * (totSets - 1)) + (imgHeight * (winImg - 1)) - (.5 * imgHeight)) + '%)' );

        var winCalc = (setHeight * (totSets - 2)) + (imgHeight * (winImg - 1)) - (.5 * imgHeight);

        moveHeight1 = winCalc;
        moveHeight2 = winCalc;
        moveHeight3 = winCalc;
    } else { 
        setupLoseImg(); 

        moveHeight1 = loseArr[0];
        moveHeight2 = loseArr[1];
        moveHeight3 = loseArr[2];
    }

    $('#colA').css("transform", "translateY(-" + moveHeight1 + "%)");
    setTimeout( function() { $('#colB').css("transform", "translateY(-" + moveHeight2 + "%)"); }, 350 );
    setTimeout( function() { $('#colC').css("transform", "translateY(-" + moveHeight3 + "%)"); }, 700 );

    setTimeout(function() { gameEnd(); }, 5750);

}

var loseArr = [];
function setupLoseImg() {
    while (loseArr.length < 3) {
        var loseRandom = Math.floor(Math.random() * (setImages - 1)) + 1;
        var loseCalc = (setHeight * (totSets - 2)) + (imgHeight * (loseRandom - 1)) - (.5 * imgHeight)

        if (loseArr.indexOf(loseCalc) > -1) continue;
        loseArr[loseArr.length] = loseCalc;
    }
}

function gameEnd() {
    $('.wrapper').append('<div id="dialog" class="postGame"></div>');
    fader('show');

    if (win == true || win == "true") {
        endCopy = '<h2 class="heavy">Congrats, ' + results.name + '!</h2>'
            + '<p class="red bold">You just won ' + results.prize + '!</p>'
            + '<a href="javascript:void(0)" id="thanksBtn" class="button gameContinueBtn">Continue</a>';
    }
    else {
        endCopy = '<h2 class="heavy">Aw man!</h2>'
            + '<p class="red bold">You are not a winner today, but come back tomorrow and try your luck again.</p>'
            + '<a href="javascript:void(0)" id="thanksBtn" class="button gameContinueBtn">Continue</a>';
    }
    $('#dialog').html(endCopy).hide().fadeTo(400, '1').css('top', $('#gameArea').offset().top + 100);


    $('#thanksBtn').unbind('click').bind('click', function () { goThanks(); });
}

function goThanks() {
    logToConsole('Go To Thanks');
    setTimeout(function() { location.reload(); }, 500);
}