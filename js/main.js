var $recipeTitle = document.querySelector('#recipe-title');
var $recipeTitleInput = document.querySelector('#title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $recipePhotoUrlInput = document.querySelector('#photo-url');
var $ingredientList = document.querySelector('#ingredient-list');
var $addIngredientInput = document.querySelector('#add-ingredient');
var $addIngredientButton = document.querySelector('#add-ingredient-button');
var $instructionList = document.querySelector('#instruction-list');
var $addInstructionInput = document.querySelector('#add-instruction');
var $addInstructionButton = document.querySelector('#add-instruction-button');
var $saveButton = document.querySelector('#save-button');

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
  if ($addIngredientInput.value === '') {
    return;
  }
  createAndAppendElement('li', $addIngredientInput.value, $ingredientList);
  $addIngredientInput.value = '';
}

function addInstruction(event) {
  event.preventDefault();
  if ($addInstructionInput.value === '') {
    return;
  }
  createAndAppendElement('li', $addInstructionInput.value, $instructionList);
  $addInstructionInput.value = '';
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
  data.recipes.push(new Recipe(data.nextRecipeId++, $recipeTitle.textContent, $recipePhotoUrlInput.value, ingredients, instructions));
}

$saveButton.addEventListener('click', saveRecipe);

$addInstructionButton.addEventListener('click', addInstruction);

$addIngredientButton.addEventListener('click', addIngredient);

$recipePhotoUrlInput.addEventListener('input', updateRecipePhoto);

$recipeTitleInput.addEventListener('input', updateRecipeTitle);
