var $recipeTitle = document.querySelector('#recipe-title');
var $recipeTitleInput = document.querySelector('#title');
var $recipePhoto = document.querySelector('#recipe-photo');
var $recipePhotoUrlInput = document.querySelector('#photo-url');

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

$recipePhotoUrlInput.addEventListener('input', updateRecipePhoto);

$recipeTitleInput.addEventListener('input', updateRecipeTitle);
