var $newRecipeForm = document.querySelector('#new-recipe-form');
var $recipeTitle = document.querySelector('#recipe-title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $ingredientList = document.querySelector('#ingredient-list');
var $instructionList = document.querySelector('#instruction-list');

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
  var newIngredient = document.createElement(type);
  newIngredient.textContent = textContent;
  parent.append(newIngredient);
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

$newRecipeForm.elements['save-button'].addEventListener('click', saveRecipe);

$newRecipeForm.elements['add-instruction-button'].addEventListener('click', addInstruction);

$newRecipeForm.elements['add-ingredient-button'].addEventListener('click', addIngredient);

$newRecipeForm.elements['photo-url'].addEventListener('input', updateRecipePhoto);

$newRecipeForm.elements.title.addEventListener('input', updateRecipeTitle);
