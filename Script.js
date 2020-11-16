
var colors = [
'rgb(255 208 7)', 
'rgb(247 147 29)', 
'rgb(186 188 190)',
'rgb(219 219 219)', 
'rgb(129 116 180)', 
'rgb(162 44 51)', 
'rgb(1237 99 40)', 
'rgb(219 30 39)', 
'rgb(48 41 106)', 
'rgb(209 199 226)' 
];
var cont = document.querySelector("#container");
var resultGotoMoon = [];
var is_mobile = check_is_mobile();
var BtcPosition = 0;
var EthPosition = 0;
var LtcPosition = 0;
var game_volume = 0;
var game_count = 0;
var game_id = 0;
var orderData = {};
var loadingState = true;
var orderState = false;
var startState = false;
var isOrder = false;
var connected = false;
var initGames = false;
var bet_fee = 1.5; 
const socket = io.connect('https://gae.network:8443');



function getGameId(){
return game_id;
}

function setGameId(gameId){
game_id = gameId;	
}
function getVolume(){
return game_volume;
}
function setVolume(volume){
game_volume = volume;	
}
function getBetCount(){
return game_count;
}
function setBetCount(count){
game_count = count;	
}
function setEthPosition(position){
EthPosition	= position;
}

function setBtcPosition(position){
BtcPosition	= position;
}
function setEthPosition(position){
EthPosition	= position;
}
function setLtcPosition(position){
LtcPosition	= position;
}
function getBtcPosition(position){
return BtcPosition;
}
function getEthPosition(position){
return EthPosition;
}
function getLtcPosition(position){
return LtcPosition;
}
function setWinner(amount){
var winAmount = amount * 1 * bet_fee * 1;
var fee = winAmount * 5 /100; 
winAmount = winAmount * 1 - fee * 1; 
amount  = amount * 1 + winAmount * 1; 
$("#winAmount").text(betFormatter(amount,3));		
$("body").addClass("win");	
$(".winner").hide().fadeIn();	
setTimeout(function(){
$(".winner").hide().fadeOut();		
$("body").removeClass("win");	
}, 5000);	
}
function setLoser(amount){

$("#loseAmount").text(betFormatter(amount,3));	
$("body").addClass("lose");	
$(".loser").hide().fadeIn();	
setTimeout(function(){
$(".loser").hide().fadeOut();		
$("body").removeClass("lose");	
}, 5000);	
}
$( document ).ready(function() {
initLuckyCrypto();
});
socket.on('STATE', (e) => {
  if(e.CURRENT_STATE == "PLAYSTATE" && initGames){
  if(e.ROCKET_BTC * 1 >= getBtcPosition() * 1 + 5){
   pump("btc");
  }
  if(e.ROCKET_LTC * 1  >= getLtcPosition() * 1 + 5){
   pump("ltc");
  }  	
  if(e.ROCKET_ETH * 1 >= getEthPosition() * 1 + 5){
   pump("eth");
  }  	  
  setBtcPosition(e.ROCKET_BTC);
  setEthPosition(e.ROCKET_ETH);
  setLtcPosition(e.ROCKET_LTC);
  setVolume(e.INFO.VOLUME);
  setBetCount(e.INFO.BET_COUNT);  

 
  }  
  if(e.CURRENT_STATE == "OPENORDER" && initGames){
  setGameId(e.GAME_ID);
  }  
  if(e.CURRENT_STATE == "OPENORDER" && orderState  && initGames && e.SECONDS > 0 ){	
  removeOldOrder(e.GAME_ID - 1)
  openOrderState(e.SECONDS);	  
  $("#gameLoading").hide();
  }else 
  if(e.CURRENT_STATE == "PLAYSTATE" && startState   && initGames && e.SECONDS > 2){
  startGameState(e.SECONDS,e.GAME_ID);	  
  setTimeout(function(){ $("#gameLoading").hide();}, 1000);
  }

});

function pump (rocket){
$(".rocket-"+rocket).addClass("pump_small");
setTimeout(function(){ 
$(".rocket-"+rocket).removeClass("pump_small");
}, 1000);	
}
socket.on('FINAL_RESULT', (e) => {
  // flyAnimation();
  setBtcPosition(e.ROCKET_BTC);
  setEthPosition(e.ROCKET_ETH);
  setLtcPosition(e.ROCKET_LTC);  

$('.count-btc').text(e.ROCKET_BTC * 2.5 + "/100");
$('.count-eth').text(e.ROCKET_ETH * 2.5  + "/100");
$('.count-ltc').text(e.ROCKET_LTC * 2.5 + "/100");	
setWinloseRocket(e.GAME_ID);

if(e.ROCKET_BTC >  e.ROCKET_LTC && e.ROCKET_BTC > e.ROCKET_ETH){
$(".rocket-btc").css("transform","translate(0vw,-200vh)");
$(".rocket-btc").removeClass("pump_small");
$(".rocket-btc").addClass("pump");
setTimeout(function(){ 
$(".rocket-btc").css("transform","translate(0vw,200%)");
$(".rocket-btc").hide();
}, 300);
setTimeout(function(){ 
$(".rocket-btc").removeClass("pump");
}, 5000);
}

if(e.ROCKET_LTC >  e.ROCKET_BTC && e.ROCKET_LTC > e.ROCKET_ETH){
$(".rocket-ltc").css("transform","translate(25vw,-200vh)");
$(".rocket-ltc").removeClass("pump_small");
$(".rocket-ltc").addClass("pump");
setTimeout(function(){ 
$(".rocket-ltc").css("transform","translate(25vw,200%)");
$(".rocket-ltc").hide();
}, 300);
setTimeout(function(){ 
$(".rocket-ltc").removeClass("pump");
}, 5000);
}

if(e.ROCKET_ETH >  e.ROCKET_BTC && e.ROCKET_ETH > e.ROCKET_LTC){
$(".rocket-eth").css("transform","translate(-25vw, -200vh)");
$(".rocket-eth").removeClass("pump_small");
$(".rocket-eth").addClass("pump");
setTimeout(function(){ 
$(".rocket-eth").css("transform","translate(-25vw,200%)");
$(".rocket-eth").hide();
}, 300);
setTimeout(function(){ 
$(".rocket-eth").removeClass("pump");
}, 5000);
}



 // setWinloseRocket(e.GAME_ID) 
   if(isLogined && isOrder){
	 getBalance(); 
     orderData = JSON.parse(orderData);
  } 
  if(isLogined && isOrder && orderData.game_id == e.GAME_ID){
    setTimeout(function(){ getLuckyCryptoOrders(); }, 3000); 
	if(isFollow){
    setTimeout(function(){ getcopyOrders(); }, 3000); 
	}
	 if((e.FINAL_BTC  == 1 &&  orderData.btc_win == 1) || (e.FINAL_ETH  == 1 &&  orderData.eth_win == 1) || (e.FINAL_LTC  == 1 &&  orderData.ltc_win == 1)){
		setWinner(orderData.amount.toString()); 
	 }else
	 if((e.FINAL_BTC  == 0 &&  orderData.btc_win == 1) || (e.FINAL_ETH  == 0 &&  orderData.eth_win == 1) || (e.FINAL_LTC  == 0 &&  orderData.ltc_win == 1)){
		setLoser(orderData.amount.toString()); 
	 }		 
   orderData = {};
   isOrder = false; 
  }
   setOrder(false);
   prependLuckyCryptoHistory(JSON.parse('{"id":'+e.GAME_ID+',"btc_win":"'+e.FINAL_BTC+'","ltc_win":"'+e.FINAL_LTC+'","eth_win":"'+e.FINAL_ETH+'","bet_volume":'+getVolume()+',"bet_count":'+getBetCount()+',"ended":"1"}'));	
   removeOldOrder(e.GAME_ID); 
   
});
socket.on('getBetOrder', (e) => {
	 for(var i = 0 ; i < e.length; i++){ 
	 	e[i].amount = e[i].amount * 1 / e[i].count;
	 
	 prependBetHistory(e[i],false);

	 }

});
socket.on('getGameHistory', (e) => {
	 setdataGameInfo(e.dataGameInfo);
	 $("#bodyGameHistory").empty();
	 $(".historyNumb").empty();
     e.dataPlayGame.reverse();
	 for(var i = 0 ; i < e.dataPlayGame.length ; i++){
	 prependLuckyCryptoHistory(e.dataPlayGame[i]);	
	 }
});

socket.on('ORDER', (e) => {
	e.amount = e.amount * 1 / e.count;
	if(isLogined && e.user_id == user_id)
	{  
        prependLuckyCryptoOrders(e);
		setOrder(true,e.rocket,e.amount);
	}
	 prependBetHistory(e,true); 

});
socket.on('disconnect', function() {
	showLoading();
});
socket.on('connect', () => {
  if(connected){
   window.location.reload();
  }else{	  
  connected = true;
  socket.emit("getBetOrder");
  $("#historyLoading").hide();
  }
});	


function showLoading(){
$("#gameLoading").show();
$("#historyLoading").show();
}
function initLuckyCrypto(){
luckyCryptoLoadingState();	
getLuckyCryptoHistory();	
if(isLogined){
getLuckyCryptoOrders();
getcopyOrders();

}else{
setOrder(false);
}
orderState = true;
startState = true; 
initGames = true;

}

document.getElementById('betAmount').addEventListener('keypress', test_fn);

function test_fn(e){

if(isNaN(e.key)) { 
  e.preventDefault();
}
}


function setdataGameInfo(data){
	$("#game_total_game").text(nFormatter(data[0].total_game,2));
	$("#game_total_volume").text(nFormatter(data[0].bet_volume,2));
	$("#game_total_bet").text(nFormatter(data[0].bet_count,2));
	var __totalBet = data[0].btc_win * 1 + data[0].eth_win * 1 + data[0].ltc_win  * 1;
	$(".game_total_btc_time").text(data[0].btc_win);
	$(".game_total_ltc_time").text(data[0].ltc_win);
	$(".game_total_eth_time").text(data[0].eth_win);
	$(".game_total_btc").text(Number(data[0].btc_win / __totalBet * 100).toFixed(2)  );
	$(".game_total_eth").text(Number(data[0].eth_win/ __totalBet * 100 ).toFixed(2) );
	$(".game_total_ltc").text(Number(data[0].ltc_win/ __totalBet * 100 ).toFixed(2) );
}
function setOrder(hasOrder,rocket="",amount=0){

$("#betTable").show();	
$(".noOrder").hide();	
$(".hasOrder").hide();	
$("#hideBet_btc").hide();		
$("#hideBet_ltc").hide();		
$("#hideBet_eth").hide();	
if(hasOrder){	
var __rocket = rocket;
if(rocket.btc_win == 1){
__rocket = "btc";
}
else
if(rocket.eth_win == 1){
__rocket = "eth";
}	
else
if(rocket.ltc_win == 1){
__rocket = "ltc";
}		

$("#hideBetAmount_"+__rocket).text(comcom(amount));		
$("#hideBet_"+__rocket).show();		
$(".hasOrder").show();		
}else{
$(".noOrder").show();			
}
}

if(is_mobile){
$(".caters").removeClass("cater2");
$(".caters").removeClass("cater3");
$(".caters").removeClass("cater4");
$(".caters").removeClass("cater5");
$(".caters").removeClass("cater6");
}
function resetRocketInfo(){

setElementVolumeRocket("btc",0);
setElementVolumeRocket("eth",0);
setElementVolumeRocket("ltc",0);
setElementCountRocket("btc",0);
setElementCountRocket("eth",0);
setElementCountRocket("ltc",0);
}
function setRocketInfo(e,effect){
	 setElementVolumeRocket("btc",e.BTC_VOLUME);
	 setElementCountRocket("btc",e.BTC_COUNT);
	 setElementVolumeRocket("eth",e.ETH_VOLUME);
	 setElementCountRocket("eth",e.ETH_COUNT);
	 setElementVolumeRocket("ltc",e.LTC_VOLUME);
	 setElementCountRocket("ltc",e.LTC_COUNT);		 
}

function setElementVolumeRocket(rocket,volume){
$("#"+rocket+"_volume").text(comcom(volume)); 
return false;
}
function setElementCountRocket(rocket,count,effect){
$("#"+rocket+"_bet_count").text(count); 
return false;
}

function luckyCryptoLoadingState(){
if(!loadingState) return false;
loadingState = false;
setBtcPosition(0);
setEthPosition(0);
setLtcPosition(0);
$(".rocket-wrap").removeClass("fly");
$(".rocket").show();
$(".rocket-eth").show();
$(".rocket-ltc").show();
$(".rocket").css("transform","translate(0vw, 0%)");
$(".rocket-eth").css("transform","translate(-25vw, 0%)");
$(".rocket-ltc").css("transform","translate(25vw, 0%)");
// $(".rocket-wrap").css("animation-play-state","paused");
// $(".caters").css("animation-play-state","paused");
disabledBetAction();
return false;
}
function openOrderState(seconds){
if(!orderState) return false;	
orderState = false;
startState = false;
loadingState = true;
luckyCryptoLoadingState();	
enabledBetAction();
var placeBetSecondsLeft = seconds;
var placeBetSeconds = 0;
placeBet();
var placeBetInterval = setInterval(placeBet, 1000);
function placeBet(){
$(".text-counter-center").removeClass("counterClose");	
$(".text-counter-center").addClass("counterOpen");
$(".text-counter-center span").text(Numbers(placeBetSecondsLeft , placeBetSeconds));
if(placeBetSecondsLeft <= placeBetSeconds){
clearInterval(placeBetInterval);
startState = true;
}
placeBetSeconds++;
}
return false;

}
function startGameState(seconds,_gameId){
if(!startState) return false;
startState = false;
orderState = false;
disabledBetAction()	;
var PlaySecondsLeft = seconds;
var PlaySeconds = 0;
PlayState();
var PlaySateInterVal = setInterval(PlayState, 1000);
function PlayState (){ 
$(".text-counter-center span").text(Numbers (PlaySecondsLeft , PlaySeconds ));	

if(PlaySeconds == PlaySecondsLeft ){
  clearInterval(PlaySateInterVal); 
  orderState = true;
}else{
	setWinloseRocket(_gameId);
	flyAnimation();

}
PlaySeconds++;
}
return false;
}
function setWinloseRocket(_gameId){
if(getBtcPosition() * 1 > getEthPosition() * 1 && getBtcPosition() * 1 > getLtcPosition() * 1){
resultGotoMoon["btc"] = true;
}else{
resultGotoMoon["btc"] = false;
}
if(getEthPosition() * 1 > getBtcPosition() * 1 && getEthPosition() * 1 > getLtcPosition() * 1){
resultGotoMoon["eth"] = true;
}else{
resultGotoMoon["eth"] = false;
}
if(getLtcPosition() * 1 > getBtcPosition() * 1 && getLtcPosition() * 1 > getEthPosition() * 1){
resultGotoMoon["ltc"] = true;
}else{
resultGotoMoon["ltc"] = false;
}
if(getBtcPosition() * 1 == getEthPosition() * 1 && getBtcPosition() * 1 > getLtcPosition() * 1){
resultGotoMoon["btc"] = true;
resultGotoMoon["eth"] = true;
}
if(getBtcPosition() * 1 == getLtcPosition() * 1 && getBtcPosition() * 1 > getEthPosition() * 1){
resultGotoMoon["btc"] = true;
resultGotoMoon["ltc"] = true;
}
if(getLtcPosition() * 1 == getEthPosition() * 1 && getLtcPosition() * 1 > getBtcPosition() * 1){
resultGotoMoon["ltc"] = true;
resultGotoMoon["eth"] = true;
}
if(getLtcPosition() * 1 == getEthPosition() * 1 && getLtcPosition() * 1 > getBtcPosition() * 1){
resultGotoMoon["ltc"] = true;
resultGotoMoon["eth"] = true;
}
if(getLtcPosition() * 1 == getEthPosition() * 1 && getLtcPosition() * 1 == getBtcPosition() * 1){
resultGotoMoon["btc"] = true;
resultGotoMoon["eth"] = true;
resultGotoMoon["ltc"] = true;
}
setUserWinLose(resultGotoMoon,_gameId);
return false;	
}
function flyAnimation(){
$(".rocket-wrap").css("animation-play-state","running");
$(".caters").css("animation-play-state","running");
$(".rocket-wrap").addClass("fly");	
$(".text-counter-center").removeClass("counterOpen");
$(".text-counter-center").addClass("counterClose");
$(".fly .rocket").css("transform","translate(0vw, -"+ getBtcPosition() * 10 / 10+"vh)");
$(".fly .rocket-eth").css("transform","translate(-25vw, -"+getEthPosition() * 10 / 10+"vh)");
$(".fly .rocket-ltc").css("transform","translate(25vw, -"+getLtcPosition() * 10 / 10+"vh)");
$('.count-btc').text(getBtcPosition() * 2.5 + "/100");
$('.count-eth').text(getEthPosition() * 2.5  + "/100");
$('.count-ltc').text(getLtcPosition() * 2.5 + "/100");	
return false;
}
function removeOldOrder(_gameId){
  $('.order_id_'+_gameId).fadeOut(500, function() {
	 $(this).remove();
  });  	
	return false;
}
function setUserWinLose(_resultGotoMoon,_gameId){
removeWinLose("btc",_gameId);
removeWinLose("ltc",_gameId);
removeWinLose("eth",_gameId);
if(_resultGotoMoon["eth"]){
effectWin("eth",_gameId);
}else{
effectLose("eth",_gameId);
}
if(_resultGotoMoon["btc"]){
effectWin("btc",_gameId);
}else{
effectLose("btc",_gameId);
}
if(_resultGotoMoon["ltc"]){
effectWin("ltc",_gameId);
}else{
effectLose("ltc",_gameId);
}	
return false;
	
}
function effectWin(rocket,_gameId){
$(".order_"+_gameId+"_"+rocket).addClass("orderWin");	
$('.count-'+rocket).addClass("count-highest");	
comets(rocket);
return false;

}
function effectLose(rocket,_gameId){
$(".order_"+_gameId+"_"+rocket).addClass("orderLose");	
$('.count-'+rocket).removeClass("count-highest");	
return false;

}
function removeWinLose(crypto,_gameId){
$(".order_"+_gameId+"_"+crypto).removeClass("orderLose");
$(".order_"+_gameId+"_"+crypto).removeClass("orderWin");
$(".count-"+crypto).removeClass("count-highest");
return false;

}
function disabledBetAction(){
// disabled("#betAmount");
disabled("#actionButtonChoose button");	
disabled("#actionAmount button");	
return false;

}
function enabledBetAction(){
// enabled("#betAmount");
enabled("#actionButtonChoose button");	
enabled("#actionAmount button");	
return false;

}
function setAmount(action){
if(action == "min"){
$("#betAmount").val("1");	

}
else
if(action == "max"){
$("#betAmount").val(gaeBalance);	
}
else
if(action == "x2"){
if($("#betAmount").val() >= 1){
$("#betAmount").val($("#betAmount").val() * 2);	
}else{
$("#betAmount").val("1");	
}
}
if(action == "1/2"){
if($("#betAmount").val() >= 2){
$("#betAmount").val($("#betAmount").val() / 2);	
}else{
$("#betAmount").val("1");	
}
}
return false;

}	
function comets(crypto,prefix=".count-") {
if(!is_mobile){
// comet(crypto,prefix)
}      
return false;

}
function getTypeWinLuckyCryptoHistory(btc,eth,ltc){
if(btc == 1 && eth == 1){
return "eth_btc";
}
else
if(btc == 1 && ltc == 1){
return "btc_ltc";
}	
else
if(ltc == 1 && eth == 1){
return "ltc_eth";
}	
else
if(btc == 1){
return "btc";
}
else
if(eth == 1){
return "eth";
}
else
if(ltc == 1){
return "ltc";
}
return "uknown";
}
function setProfitInfo(data){

	$("#today_game").text(Number(data.total_game_1day).toFixed(2));
	$("#today_profit").text(Number(data.profit).toFixed(2));
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function getcopyOrders(){

$.ajax({
url: "history/copyOrder.php",
type: 'post',
dataType: 'json',
success: function(data) {
var history_orders = data.orders;

var gameOrderData = "";
var listRocket = {};

for(var i = 0 ; i < history_orders.length ; i++){
var game_win_style= "";	
if(history_orders[i].ended == 0 ){
listRocket.btc_win = history_orders[i].btc_win; 
listRocket.eth_win = history_orders[i].eth_win; 
listRocket.ltc_win = history_orders[i].ltc_win; 
}

if(history_orders[i].ended == 0 ){
continue;
}else{
if(history_orders[i].game_win == 0 ){
history_orders[i].game_win = "Lose";
game_win_style = "orderLose";
}else{
history_orders[i].game_win = "Win";
game_win_style = "orderWin";
history_orders[i].amount = (history_orders[i].amount * 1.5) - (history_orders[i].amount * 1.5) * 5 /100;

}
}
history_orders[i].amount = comcom(history_orders[i].amount);
	
gameOrderData += 	'<tr class="'+game_win_style+'"> <th scope="row">#'+history_orders[i].game_id+'</th><td scope="row">'+history_orders[i].copy_user_id+'</td><td><img src="../images/'+getTypeWinLuckyCryptoHistory(history_orders[i].btc_win,history_orders[i].eth_win,history_orders[i].ltc_win)+'.png" style="height:22px"></td> <td>'+history_orders[i].amount+'</td> <td class="'+game_win_style+'">'+history_orders[i].game_win+'</td><td>'+history_orders[i].created+'</td></tr>';
}
$("#copyHistory").html(gameOrderData);
}
});
return false;
}
function getLuckyCryptoOrders(){
$.ajax({
url: "history/order.php",
type: 'post',
dataType: 'json',
success: function(data) {
var history_orders = data.orders;
var history_profit = data.profitInfo;
if(!isEmpty(history_profit)){
setProfitInfo(history_profit);
}
var gameOrderData = "";
var _hasOrder = false;
var listRocket = {};
if(history_orders.length <= 0){
	setOrder(false);
}
for(var i = 0 ; i < history_orders.length ; i++){
var game_win_style= "";	
if(history_orders[i].ended == 0 ){
_hasOrder = true;	
listRocket.btc_win = history_orders[i].btc_win; 
listRocket.eth_win = history_orders[i].eth_win; 
listRocket.ltc_win = history_orders[i].ltc_win; 
}
if(i == 0){
setOrder(_hasOrder,listRocket,history_orders[i].amount);
}
if(history_orders[i].ended == 0 ){
history_orders[i].game_win = "Open";
isOrder = true;
orderData  =  JSON.stringify(history_orders[i]);
}else{
if(history_orders[i].game_win == 0 ){
history_orders[i].game_win = "Lose";
game_win_style = "orderLose";
}else{
history_orders[i].game_win = "Win";
game_win_style = "orderWin";
history_orders[i].amount = (history_orders[i].amount * 1.5) - (history_orders[i].amount * 1.5) * 5 /100;
}
}
history_orders[i].amount = comcom(history_orders[i].amount);
	
gameOrderData += 	'<tr class="'+game_win_style+'"> <th scope="row">#'+history_orders[i].game_id+'</th><td><img src="../images/'+getTypeWinLuckyCryptoHistory(history_orders[i].btc_win,history_orders[i].eth_win,history_orders[i].ltc_win)+'.png" style="height:22px"></td> <td>'+history_orders[i].amount+'</td> <td class="'+game_win_style+'">'+history_orders[i].game_win+'</td><td>'+history_orders[i].created+'</td></tr>';
}
$("#bodyOrderHistory").html(gameOrderData);
}
});
return false;
}
function prependLuckyCryptoOrders(data){
isOrder = true;	
orderData = JSON.stringify(data);
var prependOrderData = "";
var game_win_style= "";	
data.game_win = "Open";
data.amount = comcom(data.amount);
prependOrderData += '<tr class=""> <th scope="row">#'+data.game_id+'</th><td><img src="../images/'+data.rocket+'.png" style="height:22px"></td> <td>'+data.amount+'</td> <td class="'+game_win_style+'">Open</td><td>Just now</td></tr>';
$("#bodyOrderHistory").prepend(prependOrderData);
return false;
}
function prependcopyOrders(data){
isOrder = true;	
orderData = JSON.stringify(data);
var prependOrderData = "";
var game_win_style= "";	
data.game_win = "Open";
data.amount = comcom(data.amount);
prependOrderData += '<tr class=""> <th scope="row">#'+data.game_id+'</th> <td scope="row">'+data.user_id+'</td><td><img src="../images/'+data.rocket+'.png" style="height:22px"></td> <td>'+data.amount+'</td> <td class="'+game_win_style+'">Open</td><td>Just now</td></tr>';
$("#copyHistory").prepend(prependOrderData);
return false;
}
function prependLuckyCryptoHistory(data){
var prependHistoryData = "";
var prependHistoryDataNumb = "";

	data.bet_volume = comcom(data.bet_volume);
	data.bet_count = Number(data.bet_count).toFixed(0);

prependHistoryData = '<tr class=""> <th scope="row">#'+data.id+'</th><td><img src="../images/'+getTypeWinLuckyCryptoHistory(data.btc_win,data.eth_win,data.ltc_win)+'.png" style="height:22px"></td> <td>'+data.bet_volume+' '+getGaeImage('GAE')+'</td> <td>'+data.bet_count+' User</td></tr>';
prependHistoryDataNumb = '<li><img src="../images/'+getTypeWinLuckyCryptoHistory(data.btc_win,data.eth_win,data.ltc_win)+'.png"></li>';

$("#bodyGameHistory").prepend(prependHistoryData);
$(".historyNumb").append(prependHistoryDataNumb);
if($('.historyNumb li').length > 30){
$('.historyNumb li:first-child').remove();
}
if($('#bodyGameHistory tr').length > 30){
$('#bodyGameHistory tr:last-child').remove();
}
return false;

}
function getLuckyCryptoHistory(){
$.ajax({
url: "history/game.php",
type: 'post',
dataType: 'json',
success: function(data) {
var gameHistoryData = "";
var gameHistoryDataNumb = "";
var getGameHistory = data.getGameHistory;
var getGameInfo = data.getGameInfo;
setdataGameInfo([getGameInfo]);
for(var i = 0 ; i < getGameHistory.length ; i++){
getGameHistory[i].bet_count = Number(getGameHistory[i].bet_count).toFixed(0);
getGameHistory[i].bet_volume = comcom(getGameHistory[i].bet_volume);
gameHistoryData += 	'<tr class=""> <th scope="row">#'+getGameHistory[i].id+'</th><td><img src="../images/'+getTypeWinLuckyCryptoHistory(getGameHistory[i].btc_win,getGameHistory[i].eth_win,getGameHistory[i].ltc_win)+'.png" style="height:22px"></td> <td>'+getGameHistory[i].bet_volume+' '+getGaeImage('GAE')+'</td> <td>'+getGameHistory[i].bet_count+' User</td></tr>';

}
var _getGameHistory = getGameHistory.reverse();
for(var i = 0 ; i < _getGameHistory.length ; i++){
getGameHistory[i].bet_count = Number(getGameHistory[i].bet_count).toFixed(0);
getGameHistory[i].bet_volume = comcom(getGameHistory[i].bet_volume);
gameHistoryDataNumb += '<li><img src="../images/'+getTypeWinLuckyCryptoHistory(getGameHistory[i].btc_win,getGameHistory[i].eth_win,getGameHistory[i].ltc_win)+'.png"></li>';
}
$("#bodyGameHistory").html(gameHistoryData);
$(".historyNumb").html(gameHistoryDataNumb);
}
});
return false;

}


function getFullHistory(){
$.ajax({
url: "history/full_game.php",
type: 'post',
dataType: 'json',
success: function(data) {
var gameHistoryData = "";
var getGameHistory = data.getGameHistory;
getGameHistory = getGameHistory.reverse();
for(var i = 0 ; i < getGameHistory.length ; i++){
gameHistoryData += 	'<li><img src="../images/'+getTypeWinLuckyCryptoHistory(getGameHistory[i].btc_win,getGameHistory[i].eth_win,getGameHistory[i].ltc_win)+'.png"> </li>';
}
$(".fullHistory").html(gameHistoryData);
}
});
return false;

}


function prependBetHistory(data,effect){
var myOrder = "";
if(isLogined && (data.user_id == user_id || data.user_id == isFollow) ){
myOrder = "myOrder";
if(data.user_id == isFollow){
orderData  =  JSON.stringify(data);
isOrder = true;

prependcopyOrders(data);
}
}	
data.amount = comcom(data.amount);
$("#placeBetHistory").prepend('<tr class="order_'+data.game_id+'_'+data.rocket+' '+myOrder+' order_id_'+data.game_id+'"><th scope="row">#'+data.game_id+'</th><td>USR_'+(data.user_id).toString().substring(0,4)+'...</td><td>'+data.amount+'</td><td><img src="../images/'+data.rocket+'.png" style="height:22px"></td></tr>');
if(effect){
}
return false;

}


function betAction(rocket){

var betAmount = $("#betAmount").val();
if(!isLogined){
$('#modalForm').modal({ backdrop: 'static', keyboard: true, show: true })	
modalForm('login');
}else
if(betAmount <= 0 )	{
$.notify("Amount must be greater than 0", "error"); 
}else
if(betAmount < 1 )	{
$.notify("The minimum quantity must be greater than or equal to 1", "error"); 
}	
else{
$("#orderLoading").show();		
$.ajax({
url: "auth/order.php",
type: 'post',
dataType: 'json',
data: {rocket , betAmount },
success: function(data) {
	
if(data.success){
notifySuccess("Order Successfully!!!"); 
var listRocket = {};
listRocket.btc_win = data.orders.btc_win; 
listRocket.eth_win = data.orders.eth_win; 
listRocket.ltc_win = data.orders.ltc_win; 
setOrder(isOrder,listRocket,data.orders.amount);

getBalance();
$("#orderLoading").hide();	

}else{
notifyAlert(data.message); 
$("#orderLoading").hide();	

}
}

});

}
return false;

}


function actionCopyPlayer(){
var txt;
var r = confirm("Are you sure you want to do this?!");
if (r == true) {
$.ajax({
url: "auth/on_bet.php",
type: 'post',
dataType: 'json',
success: function(data) {
if(data.success){	
if(data.on_bet == 1){
notifySuccess("Stop Follow Success . You can bet now"); 
$("#copyPlayerEnbet").show();
$("#copyPlayerStopFollow").hide();
}else{
notifySuccess("End bet Player Successfully!!!"); 
$("#copyPlayerEnbet").hide();
$("#copyPlayerStopFollow").show();
	
}
}else{
notifyAlert(data.message); 
}
}
});
} 
	

return false;	
	
}
function followPlayer(copy_player_id){
$.ajax({
url: "auth/follow.php",
type: 'post',
dataType: 'json',
data : {copy_player_id: copy_player_id},
success: function(data) {
if(data.success){	
isFollow = data.copy_user_id;
notifySuccess("Follow Successfully!!!"); 
$("#copyOrderTab").show();
getBalance();
copyPlayer(false);
}else{
notifyAlert(data.message); 
}
}
});
return false;
}

function unFollowPlayer(copy_player_id){
$.ajax({
url: "auth/unfollow.php",
type: 'post',
dataType: 'json',
data : {copy_player_id: copy_player_id},
success: function(data) {
if(data.success){	
isFollow = data.copy_user_id;
notifySuccess("Unfollow Successfully!!!"); 
$("#copyOrderTab").hide();
getBalance();
copyPlayer(false);
}else{
notifyAlert(data.message); 
}
}
});
return false;
}



function removeAllChooseBtn(){
	$(".btn-choose-eth").hide();
	$(".btn-choose-btc").hide();
	$(".btn-choose-ltc").hide();
}


function comet(rocket,prefix)
{
var offset = $(prefix+rocket).offset();
var x = offset.left + 50;
var y = offset.top - 40;
rnd = random(10, 90, true);

for(var i = 0; i < 50; i++)
{
var pp = document.createElement("div");
pp.className = 'particle';

var d = random(10, 60);
pp.style.width = d + "px";
pp.style.height = d + "px";
pp.style["z-index"]= 2;

pp.style.left = (x + random(-15, 15) - (d/2))+"px";
pp.style.top = (y + random(-15, 15) - (d/2))+"px";

which_color = random(0, colors.length-1, true);
pp.style.background = colors[which_color];
pp.style.borderRadius = random(10, 50)+"%";

shiftX = random(-200, 200);
shiftY = random(-200, 200);

delay = ( random(10, 40) / 1000) + 's'; 

pp.style.setProperty( '--i', delay ); 
pp.style.setProperty( '--shiftX', shiftX + 'px' ); 
pp.style.setProperty( '--shiftY', shiftY + 'px' ); 

pp.addEventListener('animationend', function(){ 
this.outerHTML = "";
});

pp.addEventListener('webkitAnimationEnd', function(){ 
this.outerHTML = "";
});

cont.appendChild(pp);
}
return false;

}


function betFormatter(num, digits) {
 if(num <= 9999){
	return  comcom(num);
 }
 return  nFormatter(num, digits);
}


   
	
function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function comcom(number, decimals = 2, dec_point, thousands_sep){
	

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function getRocketBoard(){
$.ajax({
url: "../history/rocket_board.php",
type: 'post',
dataType: 'json',
success: function(data) {
var rocket_board = "";	
for(var i= 0 ; i <  data.length ; i++){
rocket_board += '<tr> <th scope="row">'+Number(i+1)+'</th> <td>'+data[i].user_id+'</td> <td>'+Number(data[i].profit).toFixed(2)+' <img src="../images/gae.png" style="height:25px"></td> </tr>';
}	
$("#rocketBoard").html(rocket_board);
}
});	
}
