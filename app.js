/*=========================================
 JA FUNDED JOURNAL
 app.js - Part 1
=========================================*/

// ---------- Elements ----------
const progressMoney = document.getElementById("progressMoney");

const profitEl = document.getElementById("profit");
const balanceEl = document.getElementById("balance");
const payoutPercent = document.getElementById("payoutPercent");
const progressFill = document.getElementById("progressFill");
const bigProgress = document.getElementById("bigProgress");
const payoutText = document.getElementById("payoutText");

const reviewProfit = document.getElementById("reviewProfit");
const reviewTrades = document.getElementById("reviewTrades");
const reviewWins = document.getElementById("reviewWins");
const reviewLosses = document.getElementById("reviewLosses");

const totalTradesCard = document.getElementById("totalTrades");
const winRateCard = document.getElementById("winRate");

const remainingGoal = document.getElementById("remainingGoal");
const avgNeeded = document.getElementById("avgNeeded");
const daysCompleted = document.getElementById("daysCompleted");

const consistency = document.getElementById("consistency");
const largestDay = document.getElementById("largestDay");
const largestWin = document.getElementById("largestWin");

const trailDD = document.getElementById("trailDD");
const dailyDD = document.getElementById("dailyDD");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");


// ---------- Inputs ----------

const profitInputs =
document.querySelectorAll(".profit");

const winsInputs =
document.querySelectorAll(".wins");

const lossesInputs =
document.querySelectorAll(".losses");

const tradeInputs =
document.querySelectorAll(".trades");

const endBalanceInputs =
document.querySelectorAll(".endBalance");

const ruleChecks =
document.querySelectorAll(".rule");


// ---------- Account ----------

const START_BALANCE = 1000;
const PAYOUT_TARGET = 100;
const DAILY_DD = 30;
const TRAILING_DD = 50;


// ---------- Main Calculator ----------

function calculateJournal(){

let totalProfit = 0;
let wins = 0;
let losses = 0;
let trades = 0;
let highestBalance = START_BALANCE;
let biggestWinningDay = 0;
let validTradingDays = 0;


// Loop every row

profitInputs.forEach((input,index)=>{

let p = parseFloat(input.value);

if(isNaN(p)) p = 0;

totalProfit += p;


// Biggest Winning Day

if(p > biggestWinningDay){

biggestWinningDay = p;

}


// Trading Days

if(p >= 5){

validTradingDays++;

}


// Wins

let w = parseInt(winsInputs[index].value);

if(isNaN(w)) w = 0;

wins += w;


// Losses

let l = parseInt(lossesInputs[index].value);

if(isNaN(l)) l = 0;

losses += l;


// Trades

let t = parseInt(tradeInputs[index].value);

if(isNaN(t)) t = 0;

trades += t;


// Highest Balance

let endBal = parseFloat(endBalanceInputs[index].value);

if(!isNaN(endBal)){

if(endBal > highestBalance){

highestBalance = endBal;

}

}

});


// ---------- Dashboard ----------

balanceEl.textContent =
"$" + (START_BALANCE + totalProfit).toFixed(2);

profitEl.textContent =
"$" + totalProfit.toFixed(2);

reviewProfit.textContent =
"$" + totalProfit.toFixed(2);

reviewTrades.textContent = trades;

reviewWins.textContent = wins;

reviewLosses.textContent = losses;

totalTradesCard.textContent = trades;

daysCompleted.textContent = validTradingDays;

// ===============================
// APP.JS - PART 2
// ===============================

// ---------- Win Rate ----------

let totalClosedTrades = wins + losses;
let winRate = 0;

if(totalClosedTrades > 0){

    winRate = (wins / totalClosedTrades) * 100;

}

winRateCard.textContent = winRate.toFixed(1) + "%";


// ---------- Payout Progress ----------

let payoutPercentValue = (totalProfit / PAYOUT_TARGET) * 100;

if(payoutPercentValue < 0)
    payoutPercentValue = 0;

if(payoutPercentValue > 100)
    payoutPercentValue = 100;
progressFill.style.width = payoutPercentValue + "%";
bigProgress.style.width = payoutPercentValue + "%";

payoutPercent.textContent =
payoutPercentValue.toFixed(1) + "%";

const payoutString =
"$" + totalProfit.toFixed(2) + " / $" + PAYOUT_TARGET;

payoutText.textContent = payoutString;

progressMoney.textContent = payoutString;

// ---------- Remaining Goal ----------

let remain = PAYOUT_TARGET - totalProfit;

if(remain < 0)
remain = 0;

remainingGoal.textContent =
"$" + remain.toFixed(2);


// ---------- Average Needed ----------

let daysLeft = 20 - validTradingDays;

if(daysLeft <= 0)
daysLeft = 1;

avgNeeded.textContent =
"$" + (remain / daysLeft).toFixed(2);


// ---------- Highest Balance ----------

let currentBalance =
START_BALANCE + totalProfit;

if(currentBalance > highestBalance){

highestBalance = currentBalance;

}


// ---------- Trailing Drawdown ----------

let trailingLevel =
highestBalance - TRAILING_DD;

trailDD.textContent =
"$" + trailingLevel.toFixed(2);


// ---------- Daily Drawdown Left ----------

let todayLoss = 0;

profitInputs.forEach(input=>{

let p = parseFloat(input.value);

if(!isNaN(p) && p < 0){

todayLoss += Math.abs(p);

}

});

let ddLeft =
DAILY_DD - todayLoss;

if(ddLeft < 0)
ddLeft = 0;

dailyDD.textContent =
"$" + ddLeft.toFixed(2);


// ---------- Consistency Rule ----------

let consistencyPercent = 0;

if(totalProfit > 0){

consistencyPercent =
(biggestWinningDay / totalProfit) * 100;

}

consistency.textContent =
consistencyPercent.toFixed(1) + "%";

largestDay.textContent =
"$" + biggestWinningDay.toFixed(2);

largestWin.textContent =
"$" + biggestWinningDay.toFixed(2);


// ---------- Status ----------

const status =
document.getElementById("status");


if(consistencyPercent <= 15){

status.innerHTML =
"Safe ✅";

status.style.color =
"#22c55e";

}else{

status.innerHTML =
"Above 15% ⚠️";

status.style.color =
"#ef4444";

}
} // end calculateJournal()


/*=========================================
 JA FUNDED JOURNAL
 app.js - PART 3
=========================================*/


// ---------- SAVE TO LOCAL STORAGE ----------

function saveJournal(){

const data = {};

document.querySelectorAll("input, textarea").forEach((input,index)=>{

if(input.type==="checkbox"){

data[index]=input.checked;

}else{

data[index]=input.value;

}

});

localStorage.setItem(
"jaFundedJournal",
JSON.stringify(data)
);

}


// ---------- LOAD FROM LOCAL STORAGE ----------

function loadJournal(){

const saved =
localStorage.getItem("jaFundedJournal");

if(!saved) return;

const data =
JSON.parse(saved);

document.querySelectorAll("input, textarea").forEach((input,index)=>{

if(data[index]===undefined) return;

if(input.type==="checkbox"){

input.checked=data[index];

}else{

input.value=data[index];

}

});

calculateJournal();

}


// ---------- AUTO SAVE ----------

document
.querySelectorAll("input, textarea")
.forEach(input=>{

input.addEventListener("input",()=>{

calculateJournal();

saveJournal();

});

input.addEventListener("change",()=>{

calculateJournal();

saveJournal();

});

});


// ---------- SAVE BUTTON ----------

saveBtn.addEventListener("click",()=>{

saveJournal();

alert("✅ Journal Saved Successfully!");

});


// ---------- RESET BUTTON ----------

resetBtn.addEventListener("click",()=>{

const confirmReset =
confirm("Reset Complete Journal?");

if(!confirmReset) return;

localStorage.removeItem("jaFundedJournal");

document
.querySelectorAll("input, textarea")
.forEach(input=>{

if(input.type==="checkbox"){

input.checked=false;

}else{

input.value="";

}

});


// Restore First Row Start Balance

const firstStart =
document.querySelector(".startBalance");

if(firstStart){

firstStart.value=START_BALANCE;

}

calculateJournal();

alert("Journal Reset Successfully.");

});


// ---------- AUTO LOAD ----------

window.addEventListener("load",()=>{

loadJournal();

calculateJournal();

});


// ---------- LIVE DASHBOARD ----------

setInterval(()=>{

calculateJournal();

},1000);


// ---------- CONSOLE ----------

console.log(
"JA Funded Journal Loaded Successfully."
);