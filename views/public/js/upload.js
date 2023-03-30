let menuControls = document.querySelectorAll('#menu-controls div');
let contentSections = document.querySelectorAll('section');

let fetchButton = document.querySelector('#fetch-button');
let ingredientTextarea = document.querySelector('#ingredient-textarea')

fetchButton.addEventListener('click', (e)=>{
    console.log('sending...')
    let searchFor = document.querySelector('#search-input').value
    ingredientTextarea.value = `Searching ${searchFor}...`;
    fetch(`/usdaFetch?search=${searchFor}`)
    .then((response) => response.json())
    .then((data) => {
        if(data.totalHits == 0){
            ingredientTextarea.value = 'No results';
        }else{
            console.log(data);
            document.querySelector('#brand-name').innerHTML = data.foods[0].brandName;
            document.querySelector('#brand-description').innerHTML = data.foods[0].description;

            ingredientTextarea.value=data.foods[0].ingredients;
        }
    }
    );
})


menuControls.forEach(ele=>{
    ele.addEventListener('click', (e)=>{
        displayManager(e.target.getAttribute("attr"))
    });
})


function displayManager(showElement){
    document.querySelectorAll('section').forEach(element => {
        element.classList.add('hide');
    });
    console.log('section#' + showElement);
    document.querySelector('section#' + showElement).classList.remove('hide');
}

