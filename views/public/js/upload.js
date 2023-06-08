let menuControls = document.querySelectorAll('#menu-controls div');
let contentSections = document.querySelectorAll('section');

let fetchButton = document.querySelector('#fetch-button');
let postIngredientButton = document.querySelector('#post-ingredient-button');
let submitNewGroupButton = document.querySelector('#submit-new-group-button');
let addIngredientButtons = document.querySelectorAll('.ingredient-add-button');

let ingredientIds = [];

submitNewGroupButton.addEventListener('click', (e)=>{
    let data = {
        ingredients: ingredientIds,
        name: document.querySelector('#new-group-name').value
    }
    postIngredient('/upload/newGroup', data).then(response=>{
        console.log(response)
    })
})
addIngredientButtons.forEach(ingredientButton=>{
    ingredientButton.addEventListener('click', (e)=>{
        if(ingredientIds.indexOf(e.target.getAttribute('attr-id')) < 0){
            ingredientIds.push(e.target.getAttribute('attr-id'));
            let div = document.createElement('div');
            div.classList.add('selected-ingredient', 'flex', 'space-between', 'gap');
            let span = document.createElement('span');
            span.textContent = e.target.getAttribute('attr-name');
            let button = document.createElement('button');
            button.textContent = 'remove';
            button.setAttribute('attr-id', e.target.getAttribute('attr-id'));
            button.addEventListener('click', e=>{
                ingredientIds.splice(ingredientIds.indexOf(e.target.getAttribute('attr-id')), 1);
                e.target.parentElement.remove();
            })
            div.appendChild(span);
            div.appendChild(button);
            document.querySelector('#group-container').appendChild(div)
            console.log(ingredientIds)
        }else{
            console.log('item on list')
        }
        
    });
});


fetchButton.addEventListener('click', (e)=>{
    let searchFor = document.querySelector('#search-input').value;
    let searchStatus = document.querySelector('#search-status');
    searchStatus.textContent = `Searching ${searchFor}...`;
    fetch(`/usdaFetch?search=${searchFor}`)
    .then((response) => response.json())
    .then((data) => {
        if(data.totalHits == 0){
            searchStatus.textContent = 'No results';
        }else{
            // console.log(data);
            searchStatus.textContent = 'Found!';

            document.querySelector('#manual-input-item-name').value = data.foods[0].description;
            document.querySelector('#manual-input-item-ingredients').value=data.foods[0].ingredients;
        }
    }
    );
});

postIngredientButton.addEventListener('click', (e)=>{
    let data = {
        name: document.querySelector('#manual-input-item-name').value,
        ingredientString: document.querySelector('#manual-input-item-ingredients').value,
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
        displayManager(e.target.getAttribute("attr"));
        e.target.classList.add('selected');

    });
})


function displayManager(showElement){
    document.querySelectorAll('section').forEach(element => {
        element.classList.add('hide');
    });
    menuControls.forEach(el=>{
        el.classList.remove('selected');
    })

    document.querySelector('section#' + showElement).classList.remove('hide');
}

