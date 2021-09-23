/* exported data */

var data = {
  view: 'new-recipe',
  recipes: [],
  editing: null,
  nextRecipeId: 1
};

if (localStorage.getItem('data')) {
  data = JSON.parse(localStorage.getItem('data'));
}

function updateData(event) {
  localStorage.setItem('data', JSON.stringify(data));
}

window.addEventListener('beforeunload', updateData);
