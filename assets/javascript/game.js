$(document).ready(function() {
    var Game = {
    	mainPlayer : [],
    	defender: [],
    	enemies : [],
    	mainPlayerIsSelected: false,
    	defenderIsSelected: false,
    	playGame: function() {
    		hideRestartBtn();
    		createPlayers(playerImgList);
    		loadPlayers(playerList,"characters");
      }
    }

    var playerImgList = ["han-solo","yoda","boba-fett","darth-vader"];
    var playerList = [];

    Game.playGame();

    $(document).on ("click", ".character", function(){
    	
    	if (!Game.mainPlayerIsSelected){

    		for(var i = 0; i<playerList.length; i++){
    			if (playerList[i].name === $(this).attr('value')){
    				Game.mainPlayer.push(playerList[i]);
    			}
    			else{
    				Game.enemies.push(playerList[i]);
    			}
    		}

    		Game.mainPlayerIsSelected = true;

    		loadPlayers(Game.mainPlayer,"my-character");
    		loadPlayers(Game.enemies,"enemies");
    		clearContainer("characters");

    	}

    });

    $(document).on ("click", ".enemies", function(){
    	if (Game.mainPlayerIsSelected && !Game.defenderIsSelected){

    		clearContainer("message");

    		for(var i = 0; i<Game.enemies.length; i++){
    			if (Game.enemies[i].name === $(this).attr('value')){
    				Game.defender.push(Game.enemies[i]);
    				Game.enemies.splice(i,1);
    			}
    		}

    		Game.defenderIsSelected = true;

    		clearContainer("enemies")
    		loadPlayers(Game.enemies,"enemies");
    		loadPlayers(Game.defender,"defender");
    	}
    });

        $(document).on ("click", "#attack", function(){
    	if (Game.mainPlayerIsSelected && Game.defenderIsSelected && !Game.mainPlayer.isDefeated && !Game.mainPlayer.isDefeated){

    		var message = ''

    		console.log(Game);

    		message = "<p>You attacked " + Game.defender[0].name + " for " + Game.mainPlayer[0].attackPower + " damage.</p>";
    		message = message + '<p>' + Game.defender[0].name + " attacked you back for " + Game.defender[0].attackPower + " damage.</p>"

    		Game.defender[0].HP -= Game.mainPlayer[0].attackPower;
    		Game.mainPlayer[0].attackPower += Game.mainPlayer[0].initialAttackPower;
    		Game.mainPlayer[0].HP -= Game.defender[0].attackPower;

    		if (defeated(Game.mainPlayer[0])){
    			Game.mainPlayer[0].HP = 0;
    			Game.mainPlayer[0].isDefeated = true;
    			message = "<p>You've been defeated...GAME OVER!!!</p>"
    			$("#message").html(message);
    			clearContainer("my-character");
    			loadPlayers(Game.mainPlayer,"my-character");
    			showRestartBtn();
    		}

    		else if (defeated(Game.defender[0])){

    			clearContainer("defender");

    			if(Game.enemies.length > 0){
    				message = "<p>You have defeated " + Game.defender[0].name + ", you can choose to fight another enemy.</p>";
    			}
    			else{
    				message = "<p>You Won!!!! GAME OVER!!!</p>"
    				showRestartBtn();
    			}

    			Game.defender.splice(0,1);
    			Game.defenderIsSelected = false;

    			$("#message").html(message);
    		}


    		if(!Game.mainPlayer.isDefeated){
    			clearContainer("my-character");
    			loadPlayers(Game.mainPlayer,"my-character");
    		}

    		clearContainer("defender");
    		loadPlayers(Game.defender,"defender");

    		$("#message").html(message);

    	}
    	else if(!Game.defenderIsSelected){
    		$("#message").html("<p>No enemy here.</p>");
    	}
    });

    $(document).on("click", "#restart", function(){

    	Game.mainPlayer = [];
    	Game.defender = [];
    	Game.enemies = [];
    	Game.mainPlayerIsSelected = false;
    	Game.defenderIsSelected = false;

    	playerList = [];

    	clearContainer("characters");
    	clearContainer("my-character");
    	clearContainer("enemies");
    	clearContainer("defender");
    	clearContainer("message");

    	Game.playGame();

    });

    function createPlayers (playerImgList){

    	for(var i = 0; i < playerImgList.length; i++){
    		setPlayer(playerImgList[i]);
    	}
    }

    function setPlayer (value){

    	var player = {
    		name: "",
    		HP: 1,
    		initialAttackPower:0,
    		attackPower:0,
    		isDefeated: false,
    		pic:""
    	}

    	player.name = getPlayerName(value);
    	player.HP = getHealthPoints();
    	player.initialAttackPower = getAttackPoints();
    	player.attackPower = player.initialAttackPower;
    	player.isDefeated = false;
    	player.pic = value;
    	playerList.push(player)
    }

    function loadPlayers (playerList,containerId){

    	var playerHtml =""

    	for(var i = 0; i < playerList.length; i++){

    	 if (containerId !== "my-character" && containerId !== "characters"){
    	 	playerHtml = ' <div class="character ' + containerId + '" value="'
    	 }
    	 else{
    	 	playerHtml = ' <div class="character" value="'
    	 }
    	 
    	 playerHtml = playerHtml + playerList[i].name + '">' +
   									'   <div class="row">' +
									'    <p class="name character-text">'+ playerList[i].name +'</p>' +
   									'   </div>' + 
   									'   <div class="row">' +
    								'    <img class="pic character-content" src="assets/images/' + playerList[i].pic + '.jpg">' +
   									'   </div>' +
   									'   <div class="row">' +
									'    <p class="hp character-text character-content">' + playerList[i].HP +'</p>' +
   									'   </div>' +
									' </div>'
		$("#" + containerId).append(playerHtml);
		}
    }

    function clearContainer(containerId){
    	$("#" + containerId).empty();
    }

    function getPlayerName(imgName){
    	var name = "";

    	if(imgName === "han-solo"){
    		name = "Han Solo";
    	}

    	if(imgName === "yoda"){
    		name = "Yoda";
    	}

    	if(imgName === "boba-fett"){
    		name = "Boba Fett";
    	}

    	if(imgName === "darth-vader"){
    		name = "Darth Vader";
    	}

    	return name;
    }

    function getHealthPoints (){
    	return Math.floor(Math.random() * 100) + 100;
    }

    function getAttackPoints (){
    	return Math.floor(Math.random() * 25) + 5;
    }

    function defeated (player) {
    	var result = false;

    	if(player.HP <=0){
    		result = true;
    	}

    	return result;
    }

    function showRestartBtn() {
    	$("#restart").show();
	}

	function hideRestartBtn(){
		$("#restart").hide();
	}

});