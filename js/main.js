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

var recipe = {
  title: '',
  photoUrl: '',
  ingredients: [],
  instructions: []
};

function updateRecipeTitle(event) {
  $recipeTitle.textContent = event.target.value;
}

function updateRecipePhoto(event) {
  $recipePhoto.setAttribute('src', event.target.value);
}

function createAndAppend(type, textContent, parent) {
  var newIngredient = document.createElement(type);
  newIngredient.textContent = textContent;
  parent.append(newIngredient);
}

function addIngredient(event) {
  event.preventDefault();
  createAndAppend('li', $addIngredientInput.value, $ingredientList);
  $addIngredientInput.value = '';
}

function addInstruction(event) {
  event.preventDefault();
  createAndAppend('li', $addInstructionInput.value, $instructionList);
  $addInstructionInput.value = '';
}

$addInstructionButton.addEventListener('click', addInstruction);

$addIngredientButton.addEventListener('click', addIngredient);

$recipePhotoUrlInput.addEventListener('input', updateRecipePhoto);

$recipeTitleInput.addEventListener('input', updateRecipeTitle);
