const $newRecipeForm = document.querySelector('#new-recipe-form');
const $recipeTitle = document.querySelector('#recipe-title');
const $recipePhoto = document.querySelector('#recipe-photo');
const $ingredientList = document.querySelector('#ingredient-list');
const $instructionList = document.querySelector('#instruction-list');
const $savedRecipesView = document.querySelector('#saved-recipes');
const $newRecipeLink = document.querySelector('#new-recipe-link');
const $searchRecipesLink = document.querySelector('#search-recipes-link');
const $savedRecipesLink = document.querySelector('#saved-recipes-link');
const $views = document.querySelectorAll('.view');
const $readRecipeTitle = document.querySelector('#read-recipe-title');
const $readRecipePhoto = document.querySelector('#read-recipe-photo');
const $readRecipeIngredientList = document.querySelector('#read-recipe-ingredient-list');
const $readRecipeInstructionList = document.querySelector('#read-recipe-instruction-list');
const $listCol = document.querySelector('#list-col');
const $searchForm = document.querySelector('#search-form');
const $searchHeader = document.querySelector('#search-header');
const $searchList = document.querySelector('#search-list');
const $copyRecipeButton = document.querySelector('.copy-recipe-button');
const $spinner = document.querySelector('.lds-spinner');
let currentlyEditing = false;
let currentRecipe;
let results;
const recipeRequest = new XMLHttpRequest();
recipeRequest.responseType = 'json';

populateSavedRecipesView();

$copyRecipeButton.addEventListener('click', copyRecipe);
$searchList.addEventListener('click', openRecipeFromSearchList);
$searchForm.elements['search-button'].addEventListener('click', searchRecipes);
recipeRequest.addEventListener('load', getAllResultIngredients);
recipeRequest.onerror = displayError;
$listCol.addEventListener('click', deleteItem);
$listCol.addEventListener('click', saveItemEdit);
$listCol.addEventListener('click', openItemEditor);
$savedRecipesView.addEventListener('click', openEditor);
$savedRecipesView.addEventListener('click', readRecipe);
$newRecipeLink.addEventListener('click', swapView);
$savedRecipesLink.addEventListener('click', swapView);
$searchRecipesLink.addEventListener('click', swapView);
$newRecipeForm.elements['save-button'].addEventListener('click', saveRecipe);
$newRecipeForm.elements['add-instruction-button'].addEventListener('click', addInstruction);
$newRecipeForm.elements['add-ingredient-button'].addEventListener('click', addIngredient);
$newRecipeForm.elements['photo-url'].addEventListener('input', updateRecipePhoto);
$newRecipeForm.elements.title.addEventListener('input', updateRecipeTitle);

function copyRecipe(event) {
  swapView(event);
  $recipeTitle.textContent = currentRecipe.title;
  $recipePhoto.setAttribute('src', currentRecipe.photoUrl);
  $newRecipeForm.elements.title.value = currentRecipe.title;
  $newRecipeForm.elements['photo-url'].value = currentRecipe.photoUrl;
  populateEditList(currentRecipe.ingredients, $ingredientList);
  populateEditList(currentRecipe.instructions, $instructionList);
}

function openRecipeFromSearchList(event) {
  if (!event.target.matches('.fa-info-circle')) {
    return;
  }
  for (let i = 0; i < results.length; i++) {
    if (results[i].id === parseInt(event.target.getAttribute('data-recipe-id'))) {
      currentRecipe = results[i];
    }
  }
  const ingredientRequest = new XMLHttpRequest();
  const requestUrl = 'https://api.spoonacular.com/recipes/' + currentRecipe.id + '/analyzedInstructions/?apiKey=279743e11f664fc380e7ff0f067eb7a3';
  ingredientRequest.open('GET', requestUrl);
  ingredientRequest.addEventListener('load', populateViewWithSearchRecipe);
  ingredientRequest.responseType = 'json';
  ingredientRequest.send();
  swapView(event);
}

function populateViewWithSearchRecipe(event) {
  $readRecipeTitle.textContent = currentRecipe.title;
  $readRecipePhoto.setAttribute('src', currentRecipe.photoUrl);
  $readRecipeIngredientList.innerHTML = '';
  $readRecipeInstructionList.innerHTML = '';
  $copyRecipeButton.className = 'copy-recipe-button';
  populateViewList(currentRecipe.ingredients, $readRecipeIngredientList);
  for (let i = 0; i < event.target.response[0].steps.length; i++) {
    currentRecipe.instructions.push(event.target.response[0].steps[i].step);
  }
  populateViewList(currentRecipe.instructions, $readRecipeInstructionList);
}

function populateSearchList(event) {
  const ingredients = event.target.response;
  const resultsIngredients = [];
  for (let i = 0; i < ingredients.extendedIngredients.length; i++) {
    resultsIngredients.push(ingredients.extendedIngredients[i].original);
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].id === ingredients.id) {
      results[i] = new Recipe(results[i].id, results[i].title, results[i].image, resultsIngredients, []);
      const searchCard = createCard(results[i]);
      $searchList.append(searchCard);
      break;
    }
  }
}

function getIngredients(id) {
  const ingredientRequest = new XMLHttpRequest();
  ingredientRequest.responseType = 'json';
  ingredientRequest.addEventListener('load', populateSearchList);
  const requestUrl = 'https://api.spoonacular.com/recipes/' + id + '/information?includeNutrition=false&apiKey=c475d73092264cd4b28197f6d76d4ce5';
  ingredientRequest.open('GET', requestUrl);
  ingredientRequest.send();
}

function getAllResultIngredients(event) {
  $spinner.className = 'lds-spinner hidden';
  results = recipeRequest.response.results;
  if (results.length === 0) {
    $searchHeader.textContent = 'No results for ' + '\'' + $searchForm.elements.search.value + '\'.';
    return;
  }
  $searchHeader.textContent = 'Results for ' + '\'' + $searchForm.elements.search.value + '\'';
  for (let i = 0; i < results.length; i++) {
    getIngredients(results[i].id);
  }
}

function searchRecipes(event) {
  event.preventDefault();
  $searchForm.className = 'hidden';
  $searchHeader.textContent = '';
  $spinner.className = 'lds-spinner';
  const search = $searchForm.elements.search.value;
  search.replaceAll(' ', '+');
  const requestUrl = 'https://api.spoonacular.com/recipes/complexSearch?query=' + search + '&apiKey=c475d73092264cd4b28197f6d76d4ce5';
  recipeRequest.open('GET', requestUrl);
  recipeRequest.send();
}

function deleteItem(event) {
  if (!event.target.matches('.fa-times-circle')) {
    return;
  }
  event.target.parentNode.parentNode.remove();
}

function openItemEditor(event) {
  if (!event.target.matches('.fa-pencil-alt')) {
    return;
  }
  const $editInput = document.createElement('input');
  const $saveEditButton = document.createElement('i');
  $editInput.className = 'width-100-percent';
  $editInput.value = event.target.parentNode.previousSibling.children[0].textContent;
  $saveEditButton.className = 'fas fa-check-square barn-red margin-left-1rem';
  const $editRow = event.target.closest('.row');
  $editRow.className = 'row margin-bottom-1rem';
  $editRow.innerHTML = '';
  $editRow.append($editInput, $saveEditButton);
}

function saveItemEdit(event) {
  if (!event.target.matches('.fa-check-square')) {
    return;
  }
  const $savedEditRow = event.target.closest('.row');
  $savedEditRow.replaceWith(createEditItemRow(event.target.previousSibling.value));
}

function openEditor(event) {
  if (!event.target.matches('.fa-pencil-alt')) {
    return;
  }
  swapView(event);
  currentlyEditing = true;
  findRecipe(parseInt(event.target.getAttribute('data-recipe-id')));
  $newRecipeForm.elements.title.value = currentRecipe.title;
  $recipeTitle.textContent = currentRecipe.title;
  $newRecipeForm.elements['photo-url'].value = currentRecipe.photoUrl;
  $recipePhoto.setAttribute('src', currentRecipe.photoUrl);
  populateEditList(currentRecipe.ingredients, $ingredientList);
  populateEditList(currentRecipe.instructions, $instructionList);
}

function readRecipe(event) {
  if (!event.target.matches('.fa-info-circle')) {
    return;
  }
  findRecipe(parseInt(event.target.getAttribute('data-recipe-id')));
  $readRecipeTitle.textContent = currentRecipe.title;
  $readRecipePhoto.setAttribute('src', currentRecipe.photoUrl);
  $readRecipeIngredientList.innerHTML = '';
  $readRecipeInstructionList.innerHTML = '';
  populateViewList(currentRecipe.ingredients, $readRecipeIngredientList);
  populateViewList(currentRecipe.instructions, $readRecipeInstructionList);
  swapView(event);
}

function swapView(event) {
  data.view = event.target.getAttribute('data-view');
  if (data.view !== 'search-recipes') {
    $searchForm.reset();
    $searchForm.className = '';
    $searchHeader.textContent = 'What\'s cooking?';
    $searchList.innerHTML = '';
  }
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === event.target.getAttribute('data-view')) {
      $views[i].className = 'view margin-auto width-90-percent';
    } else {
      $views[i].className = 'view margin-auto width-90-percent hidden';
    }
  }
  window.scrollTo(0, 0);
  if (currentlyEditing === true) {
    resetForm();
    currentlyEditing = false;
  }
  $copyRecipeButton.className = 'copy-recipe-button hidden';
}

function findRecipe(id) {
  for (let i = 0; i < data.recipes.length; i++) {
    if (data.recipes[i].id === id) {
      currentRecipe = data.recipes[i];
      break;
    }
  }
}

function populateSavedRecipesView() {
  for (let i = 0; i < data.recipes.length; i++) {
    createAndPrependCard(data.recipes[i]);
  }
}

function createAndPrependCard(recipe) {
  $savedRecipesView.prepend(createCard(recipe));
}

function createCard(recipe) {
  const $card = document.createElement('div');
  $card.className = 'card row bg-white min-height-15rem margin-top-bottom-1rem max-width-900px margin-auto';
  $card.setAttribute('data-recipe-id', recipe.id);
  const $colFull = document.createElement('div');
  $colFull.className = 'col-full';
  const $contentRow = document.createElement('div');
  $contentRow.className = 'row width-100-percent';
  const $titleCol = document.createElement('div');
  $titleCol.className = 'col-one-half';
  const $imgRow = document.createElement('div');
  $imgRow.className = 'row justify-content-center';
  const $img = document.createElement('img');
  $img.className = 'card-img margin-top-p75rem';
  $img.setAttribute('src', recipe.photoUrl);
  $imgRow.append($img);
  const $titleRow = document.createElement('div');
  $titleRow.className = 'row justify-content-center';
  const $title = document.createElement('h2');
  $title.className = 'text-align-center';
  $title.textContent = recipe.title;
  $titleRow.append($title);
  $titleCol.append($imgRow);
  $titleCol.append($titleRow);
  $contentRow.append($titleCol);
  const $ingredientCol = document.createElement('div');
  $ingredientCol.className = 'col-one-half flex align-items-center';
  const $ingredients = document.createElement('ul');
  $ingredients.className = 'card-ingredients';
  populateViewList(recipe.ingredients, $ingredients);
  const $infoRow = document.createElement('div');
  $infoRow.className = 'row justify-content-end';
  const $infoAnchor = document.createElement('a');
  const $infoIcon = document.createElement('i');
  const $editAnchor = document.createElement('a');
  const $editIcon = document.createElement('i');
  $editIcon.className = 'fas fa-pencil-alt margin-right-1rem';
  $editIcon.setAttribute('data-recipe-id', recipe.id);
  $editIcon.setAttribute('data-view', 'new-recipe');
  $editAnchor.append($editIcon);
  $infoRow.append($editAnchor);
  $infoIcon.className = 'fas fa-info-circle margin-right-1rem';
  $infoIcon.setAttribute('data-recipe-id', recipe.id);
  $infoIcon.setAttribute('data-view', 'read-recipe');
  $infoAnchor.append($infoIcon);
  $infoRow.append($infoAnchor);
  $ingredientCol.append($ingredients);
  $contentRow.append($ingredientCol);
  $colFull.append($contentRow);
  $colFull.append($infoRow);
  $card.append($colFull);
  return $card;
}

function populateViewList(array, list) {
  for (let i = 0; i < array.length; i++) {
    createAndAppendElement('li', array[i], list);
  }
}

function populateEditList(array, list) {
  for (let i = 0; i < array.length; i++) {
    list.append(createEditItemRow(array[i]));
  }
}

function createEditItemRow(item) {
  const $itemRow = document.createElement('div');
  $itemRow.className = 'row';
  const $contentCol = document.createElement('div');
  $contentCol.className = 'col-eight-tenths';
  createAndAppendElement('li', item, $contentCol);
  const $iconCol = document.createElement('div');
  $iconCol.className = 'col-two-tenths barn-red';
  const $itemEditIcon = document.createElement('i');
  $itemEditIcon.className = 'fas fa-pencil-alt margin-right-1rem';
  const $itemDeleteIcon = document.createElement('i');
  $itemDeleteIcon.className = 'far fa-times-circle';
  $iconCol.append($itemEditIcon, $itemDeleteIcon);
  $itemRow.append($contentCol, $iconCol);
  return $itemRow;
}

function Recipe(id, title, photoUrl, ingredients, instructions) {
  this.id = id;
  this.title = title;
  this.photoUrl = photoUrl;
  this.ingredients = ingredients;
  this.instructions = instructions;
}

function updateRecipeTitle(event) {
  $recipeTitle.textContent = event.target.value;
}

function updateRecipePhoto(event) {
  $recipePhoto.setAttribute('src', event.target.value);
}

function createAndAppendElement(type, textContent, parent) {
  const newElement = document.createElement(type);
  newElement.textContent = textContent;
  parent.append(newElement);
}

function addIngredient(event) {
  event.preventDefault();
  if ($newRecipeForm.elements['add-ingredient'].value === '') {
    return;
  }
  $ingredientList.append(createEditItemRow($newRecipeForm.elements['add-ingredient'].value));
  $newRecipeForm.elements['add-ingredient'].value = '';
}

function addInstruction(event) {
  event.preventDefault();
  if ($newRecipeForm.elements['add-instruction'].value === '') {
    return;
  }
  $instructionList.append(createEditItemRow($newRecipeForm.elements['add-instruction'].value));
  $newRecipeForm.elements['add-instruction'].value = '';
}

function saveRecipe(event) {
  event.preventDefault();
  const ingredients = [];
  const instructions = [];
  for (let i = 0; i < $ingredientList.children.length; i++) {
    ingredients.push($ingredientList.children[i].textContent);
  }
  for (let i = 0; i < $instructionList.children.length; i++) {
    instructions.push($instructionList.children[i].textContent);
  }
  if (currentlyEditing === true) {
    currentRecipe.title = $recipeTitle.textContent;
    currentRecipe.photoUrl = $newRecipeForm.elements['photo-url'].value;
    currentRecipe.ingredients = ingredients;
    currentRecipe.instructions = instructions;
    currentlyEditing = false;
    for (let i = 0; i < $savedRecipesView.children.length; i++) {
      if (parseInt($savedRecipesView.children[0].getAttribute('data-recipe-id')) === currentRecipe.id) {
        $savedRecipesView.children[i].replaceWith(createCard(currentRecipe));
        break;
      }
    }
  } else {
    data.recipes.push(new Recipe(data.nextRecipeId++, $recipeTitle.textContent, $newRecipeForm.elements['photo-url'].value, ingredients, instructions));
    createAndPrependCard(data.recipes[data.recipes.length - 1]);
  }
  resetForm();
  swapView(event);
  updateData();
}

function resetForm() {
  $newRecipeForm.reset();
  $recipeTitle.textContent = 'New Recipe';
  $ingredientList.innerHTML = '';
  $instructionList.innerHTML = '';
  $recipePhoto.setAttribute('src', 'images/placeholder.jpg');
}

function displayError() {
  $spinner.className = 'lds-spinner hidden';
  $searchHeader.textContent = 'Sorry! There was an error connecting to the network! Please check your internet connection and try again.';
}

function updateData(event) {
  localStorage.setItem('data', JSON.stringify(data));
}
