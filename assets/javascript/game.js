$(document).ready(function(){

// Create jQuery object reference to HTML elements we'll use through the game
var $playerHP = $("#playerHP");
var $opponenHP = $("#opponentHP");
var $displayDiv = $("#display");
var $character = $(".character");

var audioPlayer;
var jabbaPlayer;


// Create character objects
var annakin = {
    name : "Annakin",
    $div : $("#annakin"),
    $img : $("#annakin-img"),
    health : 100,
    attack : 10,
    isPlayer : false,
    isOpponent : false,
    audioFile : "assets/audio/lightsaber.mp3"
};

var yoda = {
    name : "Yoda",
    $div : $("#yoda"),
    $img : $("#yoda-img"),
    health:150,
    attack:20,
    isPlayer : false,
    isOpponent: false,
    audioFile : "assets/audio/lightsaber.mp3"
};

var darth = {
    name : "Darth Vader",
    $div : $("#darth"),
    $img : $("#darth-img"),
    health: 200,
    attack: 50,
    isPlayer : false,
    isOpponent: false,
    audioFile : "assets/audio/lightsaber.mp3"
};

var jabba = {
    name : "Jabba the Hutt",
    $div : $("#jabba"),
    $img : $("#jabba-img"),
    health : 120,
    attack : 10,
    isPlayer : false,
    isOpponent: false,
    audioFile : "assets/audio/jabba.mp3"
};

var characters = [annakin, yoda, darth, jabba];

$character.on("click", function(){

    if(!game.isPlayerSelected){
        playerSelection($(this));
    } else if (!game.isOpponentSelected){
        opponentSelection($(this));
    }
});

$("#attackButton").on("click", playerAttack);


var game = {
    isPlayerSelected : false,
    isOpponentSelected : false,
    playerAttackTimes : 0,
    didPlayerWin : false,
    player : null,
    comp : null,
    wins :0,
    compStartingHealth : 0,
    playerStartingHealth :0

};

function init(){
    //Setup up game display and field
    $displayDiv.text("Select your character!")
    //Await for user to select character

audioPlayer = document.createElement("audio");
   audioPlayer.setAttribute("src", annakin.audioFile);

   jabbaPlayer = document.createElement("audio");
   jabbaPlayer.setAttribute("src", jabba.audioFile);
};



function startGame(){

};

function playerSelection($player){
    characters.forEach(function(character){
        if(character.$div.attr("id") === $player.attr("id")){
            console.log("player ID = " + character.id);
            character.isPlayer = true;
            game.player = character;
            // game.player.$div = $player;
        }
    });
    $player.css("pointer-events", "none");
    console.log($player);
    $player.animate({left: "10px", top: "-75px"});
    $player.removeClass("selectionPosition1 selectionPosition2 selectionPosition3 selectionPosition4");
    // $player.addClass("playerPosition");
    //$player.animate({height: "200px"});
    game.player.$img.animate({height: "180px"});
    // game.player.$div.addClass("green-bg");
    game.player.$div.addClass("green-bg");
    game.player.$img.addClass("green-bg");
    game.isPlayerSelected = true;
    $displayDiv.html("<em>Select your opponent</em>");
    
    game.playerStartingHealth = game.player.health;

    $("#playerHPSVG").css("width", 100);
    $("#playerHPNum").text(game.player.health);
    $
    
};

function opponentSelection($opponent){
    console.log("opponentselection =" + $opponent);
    console.log("opponentSelection");
    $opponent.animate({left: "800px", top: "-75px"});
    $opponent.removeClass("selectionPosition1 selectionPosition2 selectionPosition3 selectionPosition4 opponentBench1 opponentBench2");
    // $opponent.addClass("opponentPosition");
  
    game.isOpponentSelected = true;
    

    characters.forEach(function(character){
        if(character.$div.attr("id") === $opponent.attr("id")){
            console.log("opponent ID =" + character.$div.attr("id"));
            character.isOpponent = true;
            game.comp = character;
        }
    });
    game.compStartingHealth = game.comp.health;
    game.comp.$img.animate({height: "180px"});
    game.comp.$div.addClass("red-bg");
    game.comp.$img.addClass("red-bg");
    // move unselect characters to the bench
    var count = 0;
    characters.forEach(function(character){
        console.log(character);
        if(character.isOpponent === false && character.isPlayer === false ){
            console.log(character.name);
            if(count === 0){
                character.$div.animate({left: "500px", top: "200px"});
                // character.$div.animate({top: "20px"});
                character.$div.removeClass("selectionPosition1 selectionPosition2 selectionPosition3 selectionPosition4");
              //  character.$div.addClass("opponentBench1");
            } else {
                character.$div.removeClass("selectionPosition1 selectionPosition2 selectionPosition3 selectionPosition4");
                // character.$div.addClass("opponentBench2");
                character.$div.animate({left: "725px", top: "200px"});
            }
            count++;
        }
    });

    $("#compHPSVG").css("width", 100);
    $("#compHPNum").text(game.comp.health);

    //update display
    $displayDiv.html("<em>Click Attack Button!</em>");
    $("#attackButton").removeClass("hidden");
};

function playerAttack(){
    audioPlayer.play();
    $displayDiv.html(game.player.name + " attacked " + game.comp.name + ", reducing HP by " + game.player.attack);
    game.comp.health -= game.player.attack;
    var currentHP = $("#compHPSVG").css("width");
    console.log(currentHP);
    var tempDisplayHP = parseInt(currentHP)-((game.player.attack/game.compStartingHealth)*100);

    $("#compHPSVG").animate({width: tempDisplayHP});
    $("#compHPNum").text(game.comp.health);
    game.player.attack *=2;

    if(!checkWin()){
        $("#attackButton").css("pointer-events", "none");
    // $game.player.$div.css("pointer-events", "none");
    setTimeout(opponentAttack, 500);
    };
};

function opponentAttack(){
    $("#attackButton").css("pointer-events", "auto");
    $displayDiv.append("<br>" + game.comp.name + " attacked " + game.player.name + " back, reducing your HP by " + game.comp.attack);
    game.player.health -= game.comp.attack;
    var currentHP = $("#playerHPSVG").css("width");

    var tempDisplayHP = parseInt(currentHP)-((game.comp.attack/game.playerStartingHealth)*100);
    $("#playerHPSVG").animate({width: tempDisplayHP});
    $("#playerHPNum").text(game.player.health);

    // $game.player.$div.css("pointer-events", "auto");
  checkLost();
};



function checkWin(){
    if(game.comp.health <= 0){
        //you won
        $("#attackButton").addClass("hidden");
        game.wins++;
        if(game.wins < 3){
            game.isOpponentSelected = false;
            game.comp.$div.addClass("hidden");
            $displayDiv.append("<p>You defeated " + game.comp.name) + "</p>";
            $displayDiv.append("<p><em>Select your next opponent</em></p>");
        } else {
            $displayDiv.append("<p><strong>Congratulation! You're a true hero!</strong></p>");
        }
        return true;
    } else{
        return false;
    }
}

function checkLost(){
 if(game.player.health <= 0){
     //lost 

     $("#attackButton").addClass("hidden");
    jabbaPlayer.play();
    $displayDiv.append("<p><strong>Arghh, you were defeated by " + game.comp.name + ".</p>");

 }
}


init();
});
