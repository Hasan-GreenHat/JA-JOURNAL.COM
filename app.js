/* ==========================================
   JA DL Trading Journal
   Part 1 - Initialization
========================================== */

// ==========================================
// Local Storage
// ==========================================

let trades = JSON.parse(localStorage.getItem("jaTrades")) || [];

let startingBalance =
Number(localStorage.getItem("startingBalance")) || 1000;

let currentBalance =
Number(localStorage.getItem("currentBalance")) || startingBalance;

// ==========================================
// Constants
// ==========================================

const GOAL = 300000;

const TARGET_DATE = new Date("2027-08-18");

// ==========================================
// Dashboard Elements
// ==========================================

const startingBalanceEl =
document.getElementById("startingBalance");

const currentBalanceEl =
document.getElementById("currentBalance");

const totalTradesEl =
document.getElementById("totalTrades");

const winsEl =
document.getElementById("wins");

const lossesEl =
document.getElementById("losses");

const winRateEl =
document.getElementById("winRate");

const todayTradesEl =
document.getElementById("todayTrades");

const weeklyRiskEl =
document.getElementById("weeklyRisk");

const goalPercentEl =
document.getElementById("goalPercent");

const goalBar =
document.getElementById("goalBar");

const countdownEl =
document.getElementById("countdownDays");

const bufferStatusEl =
document.getElementById("bufferStatus");

const bufferTextEl =
document.getElementById("bufferText");

// ==========================================
// Save Data
// ==========================================

function saveData(){

    localStorage.setItem(
        "jaTrades",
        JSON.stringify(trades)
    );

    localStorage.setItem(
        "startingBalance",
        startingBalance
    );

    localStorage.setItem(
        "currentBalance",
        currentBalance
    );

}

// ==========================================
// Countdown
// ==========================================

function updateCountdown(){

    const today = new Date();

    const diff = TARGET_DATE - today;

    const days = Math.max(
        0,
        Math.ceil(diff / (1000 * 60 * 60 * 24))
    );

    countdownEl.textContent = days;

}

// ==========================================
// Weekly Risk
// ==========================================

function updateWeeklyRisk(){

    const start = new Date("2026-08-18");

    let weeks = Math.floor(

        (new Date() - start) /

        (1000*60*60*24*7)

    );

    if(weeks < 0){

        weeks = 0;

    }

    const risk = 50 + (weeks * 25);

    weeklyRiskEl.textContent = "₹" + risk;

}

// ==========================================
// Goal Progress
// ==========================================

function updateGoal(){

    let percent =
    (currentBalance / GOAL) * 100;

    if(percent > 100){

        percent = 100;

    }

    goalPercentEl.textContent =
    percent.toFixed(2) + "%";

    goalBar.style.width =
    percent + "%";

}

// ==========================================
// Buffer Zone
// ==========================================

function updateBuffer(){

    if(startingBalance <= 500){

        bufferStatusEl.textContent =
        "NO BUFFER";

        bufferStatusEl.className =
        "safe";

        bufferTextEl.textContent =
        "Starting balance ₹500";

        return;

    }

    const buffer = startingBalance / 2;

    if(currentBalance >= buffer){

        bufferStatusEl.textContent =
        "SAFE";

        bufferStatusEl.className =
        "safe";

    }

    else{

        bufferStatusEl.textContent =
        "BUFFER BREACHED";

        bufferStatusEl.className =
        "danger";

    }

    bufferTextEl.textContent =
    "Buffer ₹" + buffer;

}

// ==========================================
// Dashboard
// ==========================================

function updateDashboard(){

    startingBalanceEl.textContent =
    "₹" + startingBalance.toFixed(2);

    currentBalanceEl.textContent =
    "₹" + currentBalance.toFixed(2);

    totalTradesEl.textContent =
    trades.length;

    const wins =
    trades.filter(t=>t.result==="WIN").length;

    const losses =
    trades.filter(t=>t.result==="LOSS").length;

    winsEl.textContent = wins;

    lossesEl.textContent = losses;

    const winRate =
    trades.length===0

    ?0

    :(wins/trades.length)*100;

    winRateEl.textContent =
    winRate.toFixed(1)+"%";

    const today =
    new Date().toISOString().split("T")[0];

    const todayTrades =
    trades.filter(t=>t.date===today).length;

    todayTradesEl.textContent =
    todayTrades;

    updateGoal();

    updateCountdown();

    updateWeeklyRisk();

    updateBuffer();

}

// ==========================================
// Reset Journal
// ==========================================

function resetJournal(){

    const ok = confirm(

        "Delete all trades?\n\nThis cannot be undone."

    );

    if(!ok) return;

    trades = [];

    currentBalance = startingBalance;

    saveData();

    updateDashboard();

    renderTrades();

}

// ==========================================
// Start App
// ==========================================

updateDashboard();




/* ==========================================
   JA DL Trading Journal
   Part 2 - Add Trade
========================================== */

// ==========================================
// Trade Form
// ==========================================

const tradeForm =
document.getElementById("tradeForm");

// ==========================================
// Add Trade
// ==========================================

tradeForm.addEventListener("submit",function(e){

    e.preventDefault();

    const date =
    document.getElementById("tradeDate").value;

    const direction =
    document.getElementById("direction").value;

    const risk =
    Number(document.getElementById("risk").value);

    const rr =
    Number(document.getElementById("rr").value);

    const result =
    document.getElementById("result").value;

    const emotion =
    document.getElementById("emotion").value;

    const notes =
    document.getElementById("notes").value.trim();

    if(!date){

        alert("Select trade date.");

        return;

    }

    if(risk<=0){

        alert("Risk must be greater than 0.");

        return;

    }

    // ==========================
    // Maximum 3 Trades Per Day
    // ==========================

    const todayCount = trades.filter(

        t=>t.date===date

    ).length;

    if(todayCount>=3){

        alert("Maximum 3 trades allowed for this day.");

        return;

    }

    // ==========================
    // Profit Calculation
    // ==========================

    let profit = 0;

    if(result==="WIN"){

        profit = risk * rr;

    }

    else if(result==="LOSS"){

        profit = -risk;

    }

    else{

        profit = 0;

    }

    // ==========================
    // Update Balance
    // ==========================

    currentBalance += profit;

    // Prevent negative balance

    if(currentBalance<0){

        currentBalance = 0;

    }

    // ==========================
    // Create Trade Object
    // ==========================

    const trade={

        id:Date.now(),

        date,

        direction,

        risk,

        rr,

        result,

        profit,

        balance:currentBalance,

        emotion,

        notes

    };

    trades.unshift(trade);

    saveData();

    updateDashboard();

    renderTrades();

    tradeForm.reset();

    // Today's date again

    document.getElementById("tradeDate").value =
    new Date().toISOString().split("T")[0];

});

// ==========================================
// Auto Today's Date
// ==========================================

window.addEventListener("load",()=>{

    document.getElementById("tradeDate").value =
    new Date().toISOString().split("T")[0];

});

// ==========================================
// Reset Button
// ==========================================

const resetBtn =
document.getElementById("resetJournal");

if(resetBtn){

    resetBtn.addEventListener(

        "click",

        resetJournal

    );

}





/* ==========================================
   JA DL Trading Journal
   Part 3 - History & Delete
========================================== */

// ==========================================
// Trade History Table
// ==========================================

const tradeHistory =
document.getElementById("tradeHistory");

// ==========================================
// Render Trades
// ==========================================

function renderTrades(){

    if(trades.length===0){

        tradeHistory.innerHTML=`

        <tr>

            <td colspan="9">

                No trades yet.

            </td>

        </tr>

        `;

        return;

    }

    tradeHistory.innerHTML="";

    trades.forEach((trade,index)=>{

        tradeHistory.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${trade.date}</td>

            <td>${trade.direction}</td>

            <td>₹${trade.risk}</td>

            <td>1:${trade.rr}</td>

            <td>${trade.result}</td>

            <td style="color:${trade.profit>=0?'#00d26a':'#ff3b30'}">

                ₹${trade.profit}

            </td>

            <td>₹${trade.balance.toFixed(2)}</td>

            <td>

                <button onclick="deleteTrade(${trade.id})">

                    🗑

                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Delete Trade
// ==========================================

function deleteTrade(id){

    const ok = confirm(

        "Delete this trade?"

    );

    if(!ok) return;

    trades = trades.filter(

        trade => trade.id !== id

    );

    recalculateBalance();

    saveData();

    updateDashboard();

    renderTrades();

}

// ==========================================
// Recalculate Balance
// ==========================================

function recalculateBalance(){

    currentBalance = startingBalance;

    trades.forEach(trade=>{

        currentBalance += trade.profit;

        trade.balance = currentBalance;

    });

}

// ==========================================
// Reset Journal Button
// ==========================================

const footer = document.querySelector("footer");

if(footer){

    const btn = document.createElement("button");

    btn.id = "resetJournal";

    btn.innerHTML = "🗑 Reset Journal";

    btn.style.marginTop = "20px";

    btn.onclick = resetJournal;

    footer.appendChild(btn);

}

// ==========================================
// Initial Load
// ==========================================

recalculateBalance();

updateDashboard();

renderTrades();

// ==========================================
// Auto Save Before Leaving
// ==========================================

window.addEventListener(

    "beforeunload",

    saveData

);