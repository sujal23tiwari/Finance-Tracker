const defaultTransactions=[
  {merchant:'Monthly salary',category:'Salary',amount:82500,type:'income',date:'2026-09-01',icon:'✦'},
  {merchant:'Swiggy',category:'Food & Dining',amount:642,type:'expense',date:'2026-09-08',icon:'🍜'},
  {merchant:'Uber',category:'Transport',amount:289,type:'expense',date:'2026-09-07',icon:'🚕'},
  {merchant:'Spotify',category:'Entertainment',amount:119,type:'expense',date:'2026-09-05',icon:'♫'},
  {merchant:'Zara',category:'Shopping',amount:2499,type:'expense',date:'2026-09-03',icon:'Z'}
];
const budgets={'Food & Dining':8000,Shopping:10000,Transport:5000,'Bills & Utilities':7000,Entertainment:3000};
const colors=['#b7f36b','#f393a5','#bbadff','#6db9d4','#e6bd73'];
let transactions=JSON.parse(localStorage.getItem('pennywise-txns')||'null')||defaultTransactions;
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n).replace('₹','₹ ');
function render(){
 const income=transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),expenses=transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),balance=income-expenses,rate=income?Math.round((income-expenses)/income*100):0;
 document.querySelector('#totalBalance').textContent=money(balance);document.querySelector('#income').textContent=money(income);document.querySelector('#expenses').textContent=money(expenses);document.querySelector('#savingsRate').textContent=rate+'%';document.querySelector('#rateBar').style.width=Math.max(0,rate)+'%';document.querySelector('#spendCenter').textContent=money(expenses);
 const categoryTotals={};transactions.filter(t=>t.type==='expense').forEach(t=>categoryTotals[t.category]=(categoryTotals[t.category]||0)+t.amount);
 document.querySelector('#categories').innerHTML=Object.entries(categoryTotals).slice(0,6).map(([c,v],i)=>`<li><i style="background:${colors[i]}"></i>${c} <b>${Math.round(v/expenses*100)}%</b></li>`).join('')||'<li>No expenses yet.</li>';
 document.querySelector('#transactionList').innerHTML=transactions.filter(t=>t.merchant.toLowerCase().includes(document.querySelector('#search').value.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(t=>`<div class="txn"><span class="txn-icon">${t.icon||'●'}</span><div><b>${t.merchant}</b><small>${t.category} · ${new Date(t.date+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</small></div><span class="amount ${t.type}">${t.type==='income'?'+':'−'}${money(t.amount)}</span></div>`).join('')||'<p style="color:#929b98">No transactions found.</p>';
 document.querySelector('#budgetList').innerHTML=Object.entries(budgets).slice(0,4).map(([c,max],i)=>{let spent=categoryTotals[c]||0,p=Math.min(100,spent/max);return `<div class="budget"><div class="budget-head"><b>${c}</b><span>${money(spent)} / ${money(max)}</span></div><div class="budget-bar"><i style="width:${p}%;background:${colors[i]}"></i></div></div>`}).join('');
 localStorage.setItem('pennywise-txns',JSON.stringify(transactions));
}
const modal=document.querySelector('#modal');document.querySelector('#openModal').onclick=()=>modal.classList.add('open');document.querySelector('#closeModal').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};document.querySelector('form').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);transactions.push({merchant:f.get('merchant'),category:f.get('category'),amount:Number(f.get('amount')),type:f.get('type'),date:f.get('date'),icon:f.get('type')==='income'?'✦':'●'});e.target.reset();modal.classList.remove('open');render()};document.querySelector('#search').oninput=render;render();
