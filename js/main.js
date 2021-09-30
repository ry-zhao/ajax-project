var $newRecipeForm = document.querySelector('#new-recipe-form');
var $recipeTitle = document.querySelector('#recipe-title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $ingredientList = document.querySelector('#ingredient-list');
var $instructionList = document.querySelector('#instruction-list');
var $savedRecipesView = document.querySelector('#saved-recipes');
var $searchRecipesLink = document.querySelector('#search-recipes-link');
var $savedRecipesLink = document.querySelector('#saved-recipes-link');
var $views = document.querySelectorAll('.view');
var $readRecipeTitle = document.querySelector('#read-recipe-title');
var $readRecipePhoto = document.querySelector('#read-recipe-photo');
var $readRecipeIngredientList = document.querySelector('#read-recipe-ingredient-list');
var $readRecipeInstructionList = document.querySelector('#read-recipe-instruction-list');
var $listCol = document.querySelector('#list-col');
var $searchForm = document.querySelector('#search-form');
var $searchRecipes = document.querySelector('#search-recipes');
var currentlyEditing = false;
var currentRecipe;
var results;

var recipeRequest = new XMLHttpRequest();

populateSavedRecipesView();

$searchForm.elements['search-button'].addEventListener('click', searchRecipes);
recipeRequest.addEventListener('load', getAllResultIngredients);

$listCol.addEventListener('click', deleteItem);
$listCol.addEventListener('click', saveItemEdit);
$listCol.addEventListener('click', openItemEditor);
$savedRecipesView.addEventListener('click', openEditor);
$savedRecipesView.addEventListener('click', readRecipe);
$savedRecipesLink.addEventListener('click', swapView);
$searchRecipesLink.addEventListener('click', swapView);
$newRecipeForm.elements['save-button'].addEventListener('click', saveRecipe);
$newRecipeForm.elements['add-instruction-button'].addEventListener('click', addInstruction);
$newRecipeForm.elements['add-ingredient-button'].addEventListener('click', addIngredient);
$newRecipeForm.elements['photo-url'].addEventListener('input', updateRecipePhoto);
$newRecipeForm.elements.title.addEventListener('input', updateRecipeTitle);

function storeIngredients(event) {
  var ingredients = JSON.parse(event.target.response);
  var resultsIngredients = [];
  for (var d = 0; d < ingredients.ingredients.length; d++) {
    resultsIngredients.push(ingredients.ingredients[d].amount.us.value + ' ' + ingredients.ingredients[d].amount.us.unit + ' ' + ingredients.ingredients[d].name);
  }
  for (var e = 0; e < results.length; e++) {
    if (results[e].id === event.target.recipeId) {
      var searchCard = createCard(new Recipe(null, results[e].title, results[e].image, resultsIngredients, null));
      $searchRecipes.append(searchCard);
    }
  }
}

function getIngredients(id) {
  var ingredientRequest = new XMLHttpRequest();
  ingredientRequest.recipeId = id;
  ingredientRequest.addEventListener('load', storeIngredients);
  var requestUrl = 'https://api.spoonacular.com/recipes/' + id + '/ingredientWidget.json/?apiKey=279743e11f664fc380e7ff0f067eb7a3';
  ingredientRequest.open('GET', requestUrl);
  ingredientRequest.send();
}

function getAllResultIngredients(event) {
  results = JSON.parse(recipeRequest.response).results;
  for (var c = 0; c < results.length; c++) {
    getIngredients(results[c].id);
  }
}

function searchRecipes(event) {
  event.preventDefault();
  var search = $searchForm.elements.search.value;
  search.replaceAll(' ', '+');
  var requestUrl = 'https://api.spoonacular.com/recipes/complexSearch?query=' + search + '&apiKey=279743e11f664fc380e7ff0f067eb7a3';
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
  var $editInput = document.createElement('input');
  var $saveEditButton = document.createElement('i');
  $editInput.className = 'width-100-percent';
  $editInput.value = event.target.parentNode.previousSibling.children[0].textContent;
  $saveEditButton.className = 'fas fa-check-square barn-red margin-left-1rem';
  var $editRow = event.target.closest('.row');
  $editRow.className = 'row margin-bottom-1rem';
  $editRow.innerHTML = '';
  $editRow.append($editInput, $saveEditButton);
}

function saveItemEdit(event) {
  if (!event.target.matches('.fa-check-square')) {
    return;
  }
  var $savedEditRow = event.target.closest('.row');
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
  for (var m = 0; m < $views.length; m++) {
    if ($views[m].getAttribute('data-view') === event.target.getAttribute('data-view')) {
      $views[m].className = 'view margin-auto width-90-percent';
    } else {
      $views[m].className = 'view margin-auto width-90-percent hidden';
    }
  }
  window.scrollTo(0, 0);
  if (currentlyEditing === true) {
    resetForm();
    currentlyEditing = false;
  }
}

function findRecipe(id) {
  for (var n = 0; n < data.recipes.length; n++) {
    if (data.recipes[n].id === id) {
      currentRecipe = data.recipes[n];
      break;
    }
  }
}

function populateSavedRecipesView() {
  for (var l = 0; l < data.recipes.length; l++) {
    createAndPrependCard(data.recipes[l]);
  }
}

function createAndPrependCard(recipe) {
  $savedRecipesView.prepend(createCard(recipe));
}

function createCard(recipe) {
  var $card = document.createElement('div');
  $card.className = 'row bg-white min-height-15rem margin-top-bottom-1rem max-width-900px margin-auto';
  $card.setAttribute('data-recipe-id', recipe.id);
  var $colFull = document.createElement('div');
  $colFull.className = 'col-full';
  var $contentRow = document.createElement('div');
  $contentRow.className = 'row width-100-percent';
  var $titleCol = document.createElement('div');
  $titleCol.className = 'col-one-half';
  var $imgRow = document.createElement('div');
  $imgRow.className = 'row justify-content-center';
  var $img = document.createElement('img');
  $img.className = 'card-img margin-top-p75rem';
  $img.setAttribute('src', recipe.photoUrl);
  $imgRow.append($img);
  var $titleRow = document.createElement('div');
  $titleRow.className = 'row justify-content-center';
  var $title = document.createElement('h2');
  $title.className = 'text-align-center';
  $title.textContent = recipe.title;
  $titleRow.append($title);
  $titleCol.append($imgRow);
  $titleCol.append($titleRow);
  $contentRow.append($titleCol);
  var $ingredientCol = document.createElement('div');
  $ingredientCol.className = 'col-one-half flex align-items-center';
  var $ingredients = document.createElement('ul');
  populateViewList(recipe.ingredients, $ingredients);
  var $infoRow = document.createElement('div');
  $infoRow.className = 'row justify-content-end';
  var $infoAnchor = document.createElement('a');
  var $infoIcon = document.createElement('i');
  var $editAnchor = document.createElement('a');
  var $editIcon = document.createElement('i');
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
  for (var k = 0; k < array.length; k++) {
    createAndAppendElement('li', array[k], list);
  }
}

function populateEditList(array, list) {
  for (var b = 0; b < array.length; b++) {
    list.append(createEditItemRow(array[b]));
  }
}

function createEditItemRow(item) {
  var $itemRow = document.createElement('div');
  $itemRow.className = 'row';
  var $contentCol = document.createElement('div');
  $contentCol.className = 'col-eight-tenths';
  createAndAppendElement('li', item, $contentCol);
  var $iconCol = document.createElement('div');
  $iconCol.className = 'col-two-tenths barn-red';
  var $itemEditIcon = document.createElement('i');
  $itemEditIcon.className = 'fas fa-pencil-alt margin-right-1rem';
  var $itemDeleteIcon = document.createElement('i');
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
  var newElement = document.createElement(type);
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
  var ingredients = [];
  var instructions = [];
  for (var i = 0; i < $ingredientList.children.length; i++) {
    ingredients.push($ingredientList.children[i].textContent);
  }
  for (var j = 0; j < $instructionList.children.length; j++) {
    instructions.push($instructionList.children[j].textContent);
  }
  if (currentlyEditing === true) {
    currentRecipe.title = $recipeTitle.textContent;
    currentRecipe.photoUrl = $newRecipeForm.elements['photo-url'].value;
    currentRecipe.ingredients = ingredients;
    currentRecipe.instructions = instructions;
    currentlyEditing = false;
    for (var a = 0; a < $savedRecipesView.children.length; a++) {
      if (parseInt($savedRecipesView.children[0].getAttribute('data-recipe-id')) === currentRecipe.id) {
        $savedRecipesView.children[a].replaceWith(createCard(currentRecipe));
        break;
      }
    }
  } else {
    data.recipes.push(new Recipe(data.nextRecipeId++, $recipeTitle.textContent, $newRecipeForm.elements['photo-url'].value, ingredients, instructions));
    createAndPrependCard(data.recipes[data.recipes.length - 1]);
  }
  resetForm();
  swapView(event);
}

function resetForm() {
  $newRecipeForm.reset();
  $recipeTitle.textContent = 'New Recipe';
  $ingredientList.innerHTML = '';
  $instructionList.innerHTML = '';
  $recipePhoto.setAttribute('src', 'images/placeholder.jpg');
}
