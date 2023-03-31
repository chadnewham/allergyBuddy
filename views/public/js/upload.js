let menuControls = document.querySelectorAll('#menu-controls div');
let contentSections = document.querySelectorAll('section');

let fetchButton = document.querySelector('#fetch-button');
let addIngredientButton = document.querySelector('#add-ingredient-button');


fetchButton.addEventListener('click', (e)=>{
    let searchFor = document.querySelector('#search-input').value;
    let ingredientTextarea = document.querySelector('#ingredient-textarea');
    ingredientTextarea.value = `Searching ${searchFor}...`;
    fetch(`/usdaFetch?search=${searchFor}`)
    .then((response) => response.json())
    .then((data) => {
        if(data.totalHits == 0){
            ingredientTextarea.value = 'No results';
        }else{
            // console.log(data);
            document.querySelector('#brand-name').innerHTML = data.foods[0].brandName;
            document.querySelector('#brand-description').innerHTML = data.foods[0].description;

            ingredientTextarea.value=data.foods[0].ingredients;
        }
    }
    );
});

addIngredientButton.addEventListener('click', (e)=>{
    let data = {
        name: document.querySelector('#manualInputItemName').value,
        ingredientString: document.querySelector('#manualInputItemIngredients').value,
    }
    e.target.classList.add('wait-post');
    postIngredient('/upload/addIngredient', data).then((data)=>{
        console.log(data)
        e.target.classList.remove('wait-post');
    });
});

async function postIngredient(url='', data={}){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        mode: 'cors',
        body: JSON.stringify(data)
    });
    return response.json();
}

menuControls.forEach(ele=>{
    ele.addEventListener('click', (e)=>{
        displayManager(e.target.getAttribute("attr"))
    });
})


function displayManager(showElement){
    document.querySelectorAll('section').forEach(element => {
        element.classList.add('hide');
    });
    document.querySelector('section#' + showElement).classList.remove('hide');
}

