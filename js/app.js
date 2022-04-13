const search = document.getElementById("search")
const submit = document.getElementById("submit")
const random = document.getElementById("random")
const mealsEL= document.getElementById("meals")
const mealsHeader = document.getElementById("result-heading")
const single_mealEl = document.getElementById("single-meal")


// add the Events Listeners

submit.addEventListener('submit',searchMeal)
random.addEventListener('click',getRandomMeal)

//TODO Create a function to search the meal
async function searchMeal(e){
    e.preventDefault();
    single_mealEl.innerText = "";
    const phaseToSearch = search.value
    //console.log(phaseToSearch)
    // to trim is just removing the spaces from right and left
    if(phaseToSearch.trim()){
       // fetch(`https://www.themealdb.com//api/json/v1/1/search.php?s=${phaseToSearch}`).then(resp => resp.json()).then(data=>console.log(data)).catch((err)=> console.log(err.message))
       try{
       const req = await fetch(`https://www.themealdb.com//api/json/v1/1/search.php?s=${phaseToSearch}`)
       const data = await req.json();
       console.log(data)
       mealsHeader.innerHTML = `<h2>Search Results for ${phaseToSearch}</h2>`
       mealsEL.innerHTML = data.meals.map(meal=>(
           `<div class="meal">
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
           <div class="meal-info" data-mealID="${meal.idMeal}"><h3>${meal.strMeal}</h3></div> 
           </div>`
       )).join("")


       }catch(err){
           console.log(err.message)
       }
    }else{
        mealsHeader.innerHTML = "<h2>Seach Results Not found</h2>"
    }
}

// function will add the meal to the DOM after we click the imga

mealsEL.addEventListener('click',async (e)=>{
    const mealInformation = e.path.find(item=> {
        if(item.classList){
            return item.classList.contains("meal-info")
        }
    })
    if(mealInformation){
        const mealId = mealInformation.getAttribute("data-mealID")
        const meal = await getMealById(mealId)
        addMealToDom(meal.meals[0])
        
    }
})


// this function will get the meal by id

 async function getMealById(id){
     const req = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
     const data = await req.json()
     return  data
}

function addMealToDom(meal){
        //meal
      //  console.log(meal)
    const ingridients = []
    for(let i = 1 ; i < 21 ; i++){
        if(meal[`strIngredient${i}`]){
            ingridients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        }
    }
  //  console.log(ingridients)
  single_mealEl.innerHTML =`
  <div class="single-meal">
  <h1> ${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
  <div class="single-meal-info">
  ${meal.strCategory}
  </div>
  <div class="main">
  ${meal.strInstructions}
<h2>Ingridients</h2>
<ul>
${ingridients.map(el =>{
    return( `<li> ${el}</li>`)}).join('')}
   
</ul> 
 
  </div>
  </div>
  `

}

async function getRandomMeal(){
    mealsHeader.innerHTML= "";
    mealsEL.innerHTML = '';
    const req = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await req.json();
    addMealToDom(data.meals[0]);
}
















