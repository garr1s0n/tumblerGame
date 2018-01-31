(function() { appInit(); }());

var results = {
    name: '',
    result: false,
    prize: ''
}
var pinata = document.getElementById('pinataTarget');
var div_moving = document.getElementById('stick');
var parent_div = 'swingArea';

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

// Slot Machine IW - 2017
var fullShape, halfShape, fullTurn;
var colSpun = 0;
//Random Win Image
var winImgRandom = true;
var rndTime = Math.ceil(Math.random() * 1100 + 1100); //random timer multiplier (1100-2200)
var fillArrays = 9; // amount of fill arrays
var slotImg = [];
var rndSpin = Math.floor(Math.random() * 3 + 3);
var totImages = 5;
//var rndWinNum = winImgRandom ? Math.floor(Math.random() * (totImages - 1)) + 1 : 4; 
var rndWinNum = 3;

var win, prizeDesc;

function loadGame() {
    
    win = results.result;
    prizeDesc = results.prize;

    if (win) { logToConsole("Game Win: img" + rndWinNum); };

    //minimum of at least 5 images per slot column
    slotImg[0] = win && rndWinNum == 3 ? '<img src="images/game/slotImg-3.jpg" class="img-responsive" />' : '<img src="images/game/slotImg-1.jpg" class="img-responsive" />';
    slotImg[1] = win && rndWinNum == 5 ? '<img src="images/game/slotImg-5.jpg" class="img-responsive" />' : '<img src="images/game/slotImg-2.jpg" class="img-responsive" />';
    slotImg[2] = win && rndWinNum == 3 ? '<img src="images/game/slotImg-1.jpg" class="img-responsive" />' : '<img src="images/game/slotImg-3.jpg" class="img-responsive" />';
    slotImg[3] = win ? '<img src="images/game/slotImg-' + rndWinNum + '.jpg" class="img-responsive winImg" />' : '<img src="images/game/slotImg-4.jpg" class="img-responsive" />';
    slotImg[4] = win && rndWinNum == 5 ? '<img src="images/game/slotImg-2.jpg" class="img-responsive" />' : '<img src="images/game/slotImg-5.jpg" class="img-responsive" />';
    // If more images past the initial six exist, use the following for additionals
    // slotImg[5] = '<img src="images/game/slotImg-6.jpg" class="img-responsive" />';

    $('.gameColumn').empty().attr('style', '');
    popImg('colA');
    popImg('colB');
    popImg('colC');
    popImg('colA');
    popImg('colB');
    popImg('colC');
    popImg('colA');
    popImg('colB');
    popImg('colC');

    $('.gameColumn img').first().imagesLoaded(function () {
        fullShape = $(".gameColumn img").first().outerHeight(true); //full shape height + top bot margin
        halfShape = fullShape / 2;
        fullTurn = fullShape * slotImg.length // full turn of dial (img height + margins * number of images)

        //Have spin load and move to start (use css margin-top without easing to load them without movement)
        $('#colA').animate({ marginTop: '+=' + fullShape + 'px' }, 800, 'easeInOutBack');
        $('#colB').animate({ marginTop: '-=' + fullShape + 'px' }, 800, 'easeInOutBack');
        $('#colC').animate({ marginTop: '+=' + fullShape + 'px' }, 800, 'easeInOutBack', function () {
            //fade in in spin box after columns are done inital move
            $('#slotDialogue').fadeIn();
        });
    });

};

function popImg(columnID) {
    for (var i = 0; i <= 5; i++) {
        $('#' + columnID).append(slotImg[i]);
    }
}

function shuffleArray(d) {
    for (var c = d.length - 1; c > 0; c--) {
        var b = Math.floor(Math.random() * (c + 1));
        var a = d[c];
        d[c] = d[b];
        d[b] = a;
    }
    return d
}

function spinCol(columnID) {
    for (var i = 0; i <= fillArrays; i++) {
        $('#' + columnID).prepend(slotImg);
        $('#' + columnID).css('margin-top', '-=' + fullTurn + 'px');
    }
    if (win == true || win == "true") {
        spinAmount = (columnID == 'colB') ? (fullTurn * rndSpin) + fullShape : (fullTurn * rndSpin) - fullShape;
    } else {
        // Test win/lose conditions. If center column image gives false win, multiply first mention of fullShape below by 2
        spinAmount = (columnID == 'colB') ? (fullTurn * rndSpin) - fullShape : (fullTurn * rndSpin) + fullShape * rndSpin;
    }
    //have columns stop one after each other
    if (columnID == 'colB') { rndTime = rndTime + 800 }
    if (columnID == 'colC') { rndTime = rndTime + 800 }

    $('#' + columnID).animate({ marginTop: '+=' + spinAmount + 'px' }, rndTime, 'easeOutSine', function () {
        colSpun++;
        console.log('colspun: ' + colSpun);
        if (colSpun >= 3) {
            gameEnd();
        }
    });
}

function spinSlots() {
    $('#slotDialogue').fadeOut('fast');
    spinCol('colA');
    spinCol('colB');
    spinCol('colC');
}


function gameEnd() {
    $('.wrapper').append('<div id="dialog" class="postGame"></div>');
    fader('show');

    if (win == true || win == "true") {
        endCopy = '<h2 class="heavy">Woohoo!<br />Your adventure starts now.</h2>'
            + '<p class="red bold">You just won <span class="prizeDesc"></span>!</p>'
            + '<a href="javascript:void(0)" id="thanksBtn" class="btn gameContinueBtn">Continue</a>';
    }
    else {
        endCopy = '<h2 class="heavy">Aw man!</h2>'
            + '<p class="red bold">You are not a winner today, but come back tomorrow and try your luck again.</p>'
            + '<a href="javascript:void(0)" id="thanksBtn" class="btn gameContinueBtn">Continue</a>';
    }
    $('#dialog').html(endCopy).hide().fadeTo(400, '1').css('top', $('#gameArea').offset().top + 100);

    $(".prizeDesc").html(prizeDesc)

    $('#thanksBtn').unbind('click').bind('click', function () { goThanks(); });
}

function goThanks() {
    logToConsole('Go To Thanks');
    setTimeout(function() { location.reload(); }, 500);
}