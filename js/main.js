var $recipeTitle = document.querySelector('#recipe-title');
var $recipeTitleInput = document.querySelector('#title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $recipePhotoUrlInput = document.querySelector('#photo-url');
var $ingredientList = document.querySelector('#ingredient-list');
var $addIngredientInput = document.querySelector('#add-ingredient');
var $addIngredientButton = document.querySelector('#add-ingredient-button');

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

function addIngredient(event) {
  event.preventDefault();
  var newIngredient = document.createElement('li');
  newIngredient.textContent = $addIngredientInput.value;
  $addIngredientInput.value = '';
  $ingredientList.append(newIngredient);
}

$addIngredientButton.addEventListener('click', addIngredient);

$recipePhotoUrlInput.addEventListener('input', updateRecipePhoto);

$recipeTitleInput.addEventListener('input', updateRecipeTitle);
