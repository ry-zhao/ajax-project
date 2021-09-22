var $recipeTitle = document.querySelector('#recipe-title');
var $recipeTitleInput = document.querySelector('#title');

var recipe = {
  title: '',
  photoUrl: '',
  ingredients: [],
  instructions: []
};

function updateRecipeTitle(event) {
  $recipeTitle.textContent = event.target.value;
}

$recipeTitleInput.addEventListener('input', updateRecipeTitle);
