const dishes = [
 {id:1,name:"The Truffle Room",dish:"Wild mushroom risotto",category:"Fine Dining",cuisine:"European · Contemporary",price:890,rating:4.9,time:"30–40 min",tag:"MAISON SELECT",image:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=85",desc:"Slow-cooked arborio, aged parmesan and black truffle."},
 {id:2,name:"Casa Bellini",dish:"Burrata & heirloom tomato",category:"Italian",cuisine:"Italian · Seasonal",price:720,rating:4.8,time:"25–35 min",tag:"EDITOR'S PICK",image:"https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=85",desc:"Creamy burrata, ripe tomatoes and basil oil."},
 {id:3,name:"Koi Atelier",dish:"Miso-glazed salmon",category:"Asian",cuisine:"Japanese · Modern",price:1150,rating:4.9,time:"35–45 min",tag:"SIGNATURE",image:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85",desc:"Silky miso glaze, sesame greens and fragrant rice."},
 {id:4,name:"Maison Sucré",dish:"Vanilla bean mille-feuille",category:"Patisserie",cuisine:"French · Patisserie",price:540,rating:4.8,time:"20–30 min",tag:"SWEET FINISH",image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",desc:"Delicate layers, Madagascan vanilla and crisp pastry."},
 {id:5,name:"The Ember Table",dish:"Charred tenderloin",category:"Fine Dining",cuisine:"Modern grill · European",price:1490,rating:4.9,time:"40–50 min",tag:"HOUSE FAVOURITE",image:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",desc:"Fire-kissed tenderloin with rosemary jus."},
 {id:6,name:"Oliva & Co.",dish:"Handmade rigatoni",category:"Italian",cuisine:"Italian · Artisan",price:780,rating:4.7,time:"25–35 min",tag:"HANDMADE DAILY",image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85",desc:"Slow tomato sugo, basil and freshly shaved pecorino."},
 {id:7,name:"Sora House",dish:"Crispy sushi selection",category:"Asian",cuisine:"Japanese · Sushi",price:990,rating:4.8,time:"30–40 min",tag:"CHEF'S SELECTION",image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",desc:"A refined selection of the chef's favourite rolls."},
 {id:8,name:"Pâtisserie No. 8",dish:"Raspberry rose tart",category:"Patisserie",cuisine:"French · Dessert",price:460,rating:4.7,time:"20–30 min",tag:"LIMITED BATCH",image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=85",desc:"Tart raspberries, rose cream and a crisp almond shell."},
 {id:9,name:"Aurum Dining",dish:"Golden garden salad",category:"Fine Dining",cuisine:"Modern · Plant-forward",price:650,rating:4.6,time:"20–30 min",tag:"SEASONAL",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",desc:"Market greens, citrus, toasted seeds and herb dressing."}
];
const grid=document.getElementById("menuGrid"), filters=document.getElementById("filters"), sortSelect=document.getElementById("sortSelect");
let activeCategory="All", searchTerm="", cart={};
const money=n=>"₹"+n.toLocaleString("en-IN");
function visibleDishes(){
 let list=dishes.filter(d=>(activeCategory==="All"||d.category===activeCategory)&&(`${d.name} ${d.dish} ${d.category} ${d.cuisine} ${d.desc}`).toLowerCase().includes(searchTerm));
 const s=sortSelect.value;
 if(s==="rating")list.sort((a,b)=>b.rating-a.rating);
 if(s==="price-low")list.sort((a,b)=>a.price-b.price);
 if(s==="price-high")list.sort((a,b)=>b.price-a.price);
 return list;
}
function renderDishes(){
 const list=visibleDishes();
 grid.innerHTML=list.length?list.map(d=>`<article class="dish-card">
  <div class="dish-image-wrap"><img class="dish-image" src="${d.image}" alt="${d.dish}" loading="lazy"><span class="dish-tag">${d.tag}</span><button class="quick-add" data-add="${d.id}" aria-label="Add ${d.dish} to bag">+</button></div>
  <div class="dish-meta"><span class="dish-name">${d.name}</span><span class="dish-price">${money(d.price)}</span></div>
  <p class="dish-desc">${d.desc}</p><div class="dish-bottom"><span>${d.cuisine.toUpperCase()}</span><span class="rating">★ ${d.rating} &nbsp;·&nbsp; ${d.time}</span></div>
 </article>`).join(""):`<p class="no-results">Nothing found in this collection. Try another search.</p>`;
}
filters.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;filters.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));renderDishes()});
sortSelect.addEventListener("change",renderDishes);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add))});
function addToCart(id){cart[id]=(cart[id]||0)+1;updateCart();openCart()}
function updateCart(){
 const entries=Object.entries(cart).filter(([,q])=>q>0), count=entries.reduce((s,[,q])=>s+q,0);
 document.getElementById("bagCount").textContent=count;
 document.getElementById("cartEmpty").style.display=count?"none":"block";
 document.getElementById("cartFooter").style.display=count?"block":"none";
 document.getElementById("cartItems").innerHTML=entries.map(([id,q])=>{const d=dishes.find(x=>x.id===Number(id));return `<div class="cart-row"><img src="${d.image}" alt=""><div><h4>${d.dish}</h4><p>${d.name}</p><div class="qty"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${q}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><strong>${money(d.price*q)}</strong></div>`}).join("");
 const total=entries.reduce((s,[id,q])=>s+dishes.find(x=>x.id===Number(id)).price*q,0);
 document.getElementById("subtotal").textContent=money(total);
}
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const id=b.dataset.qty;cart[id]=(cart[id]||0)+Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];updateCart()});
const overlay=document.getElementById("overlay"),drawer=document.getElementById("cartDrawer");
function openCart(){overlay.classList.add("show");drawer.classList.add("open");drawer.setAttribute("aria-hidden","false")}
function closeCart(){overlay.classList.remove("show");drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true")}
document.getElementById("bagButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
document.getElementById("placeOrder").addEventListener("click",()=>{
 if(!Object.keys(cart).length)return;
 const ref="MR-"+Math.random().toString(36).slice(2,8).toUpperCase();
 document.getElementById("orderReference").textContent="REFERENCE  /  "+ref;
 cart={};updateCart();closeCart();document.getElementById("orderModal").classList.add("show");overlay.classList.add("show");
});
function closeOrder(){document.getElementById("orderModal").classList.remove("show");overlay.classList.remove("show")}
document.getElementById("closeOrder").addEventListener("click",closeOrder);
document.getElementById("finishOrder").addEventListener("click",closeOrder);
const searchPanel=document.getElementById("searchPanel"),searchInput=document.getElementById("searchInput");
function openSearch(){searchPanel.classList.add("open");setTimeout(()=>searchInput.focus(),200)}
document.querySelector(".search-open").addEventListener("click",openSearch);
document.getElementById("closeSearch").addEventListener("click",()=>searchPanel.classList.remove("open"));
searchInput.addEventListener("input",()=>{searchTerm=searchInput.value.trim().toLowerCase();activeCategory="All";filters.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));renderDishes()});
document.getElementById("menuToggle").addEventListener("click",()=>{document.querySelector(".desktop-nav").classList.toggle("mobile-open")});
renderDishes();updateCart();
