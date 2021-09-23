var $newRecipeForm = document.querySelector('#new-recipe-form');
var $recipeTitle = document.querySelector('#recipe-title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $ingredientList = document.querySelector('#ingredient-list');
var $instructionList = document.querySelector('#instruction-list');
var $savedRecipesView = document.querySelector('#saved-recipes');
var $savedRecipesLink = document.querySelector('#saved-recipes-link');
var $views = document.querySelectorAll('.view');

populateSavedRecipesView();

$savedRecipesView.addEventListener('click', readRecipe);

$savedRecipesLink.addEventListener('click', swapView);

$newRecipeForm.elements['save-button'].addEventListener('click', saveRecipe);

$newRecipeForm.elements['add-instruction-button'].addEventListener('click', addInstruction);

$newRecipeForm.elements['add-ingredient-button'].addEventListener('click', addIngredient);

$newRecipeForm.elements['photo-url'].addEventListener('input', updateRecipePhoto);

$newRecipeForm.elements.title.addEventListener('input', updateRecipeTitle);

function readRecipe(event) {
  if (!event.target.matches('.fa-info-circle')) {
    return;
  }
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
}

function populateSavedRecipesView() {
  for (var l = 0; l < data.recipes.length; l++) {
    createAndAppendCard(data.recipes[l]);
  }
}

function createAndAppendCard(recipe) {
  var $card = document.createElement('div');
  $card.className = 'row bg-white min-height-15rem margin-top-bottom-1rem';
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
  for (var k = 0; k < recipe.ingredients.length; k++) {
    createAndAppendElement('li', recipe.ingredients[k], $ingredients);
  }

  var $infoRow = document.createElement('div');
  $infoRow.className = 'row justify-content-end';
  var $infoAnchor = document.createElement('a');
  var $infoIcon = document.createElement('i');
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

  $savedRecipesView.prepend($card);
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
  createAndAppendElement('li', $newRecipeForm.elements['add-ingredient'].value, $ingredientList);
  $newRecipeForm.elements['add-ingredient'].value = '';
}

function addInstruction(event) {
  event.preventDefault();
  if ($newRecipeForm.elements['add-instruction'].value === '') {
    return;
  }
  createAndAppendElement('li', $newRecipeForm.elements['add-instruction'].value, $instructionList);
  $newRecipeForm.elements['add-instruction'].value = '';
}

function saveRecipe(event) {
  event.preventDefault();
  if ($newRecipeForm.elements[0].value === '' || $newRecipeForm.elements[1].value === '') {
    return;
  }
  var ingredients = [];
  var instructions = [];
  for (var i = 0; i < $ingredientList.children.length; i++) {
    ingredients.push($ingredientList.children[i].textContent);
  }
  for (var j = 0; j < $instructionList.children.length; j++) {
    instructions.push($instructionList.children[j].textContent);
  }
  data.recipes.push(new Recipe(data.nextRecipeId++, $recipeTitle.textContent, $newRecipeForm.elements['photo-url'].value, ingredients, instructions));
  resetForm();
}

function resetForm() {
  $newRecipeForm.reset();
  $recipeTitle.textContent = 'New Recipe';
  $ingredientList.innerHTML = '';
  $instructionList.innerHTML = '';
  $recipePhoto.setAttribute('src', 'images/placeholder.jpg');
}
