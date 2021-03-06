/* eslint-disable indent */
import './css/index.scss';
import './images/apple-logo.png';
import './images/search.png';
import './images/seasoning.png';
import './images/cookbook.png';
import './images/pot.png';
import User from './user';
import Recipe from './recipe';
import {getData, postData} from './apis';
import domUpdates from './dom-updates';
import Ingredient from './ingredient';

let users = [];
let recipes = [];
let ingredients = [];
let user;

window.addEventListener("load", loadPage);

function addEvent(area, eventType, func) {
  document.querySelector(area).addEventListener(eventType, func)
}

addEvent("header", "click", navClicks)
addEvent(".login-btn", "click", login) 
addEvent("#search", "submit", pressEnterSearch) 
addEvent(".pantry", "click", pantryClicks)
addEvent(".add-ingredient-form", "submit", addIngredientToPantry)
addEvent(".filter-btn", "click", displayTaggedRecipes)
addEvent("main", "click", mainClicks)

function loadPage() {
  getData('users', users)
  getData('recipes', recipes)
  getData('ingredients', ingredients)
}

function login() {
  updateDataToClassInstances()
  const loginInput = document.querySelector('.user-input');
  const userLoggingIn = users.find(user => user.name === loginInput.value)
  user = userLoggingIn
  domUpdates.toggle(['.login', '.page-wrapper'])
  showHome()
  displayTagsSideBar()
}

function updateDataToClassInstances() {
  users = users.map(user => new User(user))
  recipes = recipes.map(recipe => new Recipe(recipe, ingredients))
}

function displayTagsSideBar() {
  const allTags = recipes.flatMap(recipe => recipe.tags)
  const uniqueTags = new Set(allTags)
  const sortedUniqueTags = Array.from(uniqueTags).sort()
  domUpdates.listTags(sortedUniqueTags);
}
function navClicks(event) {
  const targetButton = event.target.closest("button")

  switch(targetButton.getAttribute("name")) {
    case 'filter-button':
      showFilterMenu()
      break;
    case 'home-button' || 'home-btn':
      showHome()
      break;
    case 'nav-search-button':
      searchRecipes()
      break;
    case 'fav-button':
      displayFavoritedRecipes()
      break;
    case 'pantry-button':
      displayPantry()
      break;
    case 'to-cook-button':
      displayToCookRecipes()
      break;
  }
}

function showFilterMenu() {
  const filterBar = document.querySelector('.dropdown-filter')
  filterBar.classList.toggle('filter-drop')
  filterBar.classList.toggle('recipe-filters')
}

function showHome() {
  domUpdates.displayCards(recipes)
  console.log('LOADING RECIPES')
}

function searchRecipes() {
  const userSearch = document.querySelector('#search-input').value.toLowerCase()
  const searchResults = recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(userSearch);
  });
  domUpdates.displayCards(searchResults)
}

function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function displayFavoritedRecipes() {
  console.log(user.favoriteRecipes)
  domUpdates.displayCards(user.favoriteRecipes)
}

function displayToCookRecipes() {
  domUpdates.displayCards(user.recipesToCook)
}

function displayPantry() {
  console.log('INGREDIENTS', ingredients)
  domUpdates.showUserPantry(user, ingredients)
  domUpdates.toggle(['.pantry'])
}

function pantryClicks(event) {
  const target = event.target
  switch(target.id) {
    case 'exit-pantry':
      displayPantry()
      break;
    case "find-recipes-using-pantry-btn":
      findRecipesUsingPantry()
      break;
  }
}

function addIngredientToPantry(event) {
  event.preventDefault()
  const nameAdded = document.querySelector(".name-ingredient-form").value
  const quantityAdded = document.querySelector(".quantity-ingredient-form").value

  const match = ingredients.find(ingredient => {
    return ingredient.name === nameAdded.toLowerCase()
  })
  const matchId = match ? match.id : Date.now()

  postData(user.id, matchId, quantityAdded)
  alert(`You have added ${quantityAdded} of ${nameAdded} to your pantry!`)
}

function findRecipesUsingPantry() {
  const recipesUserCouldCook = recipes.filter(recipe => {
    return !user.pantry.compareIngredients(recipe)
  })
  if (recipesUserCouldCook.length) {
    domUpdates.displayCards(recipesUserCouldCook)
    domUpdates.toggle(['.pantry'])
  } else {
    alert('Sorry, you cannot cook any recipes, you need to go to the groccery store.')
  }
}


function mainClicks(event) {
  const target = event.target
  const targetRecipe = findTargetRecipe(target)

  switch(target.id) {
    case 'img1':
      target.closest('.recipe-card').classList.add('recipe-card-active')
      break;
    case 'img2':
      target.closest('.recipe-card').classList.add('recipe-card-active')
      break;
    case 'icon-fav' || 'icon-fav-text':
      addOrRemoveFromUserList(targetRecipe, 'isFavorited', 'favoriteRecipes')
      break;
    case 'icon-cook' || 'icon-cook-text':
      addOrRemoveFromUserList(targetRecipe, 'isToCook', 'recipesToCook')
      break;
    case 'exit-recipe':
      target.closest('.recipe-card').classList.remove('recipe-card-active')
      break;
    case 'cooked-recipe':
      cookThisRecipe(targetRecipe)
      break;
    case 'exit-pantry':
      target.parentNode.classList.add('hidden')
      break;
    case `compare-recipe`:
      compareRecipes(targetRecipe)
      break;
  }
}

function findTargetRecipe(target) {
  const targetId = target.closest('.recipe-card').getAttribute('name')
  return recipes.find(recipe => recipe.id == targetId)
}

function addOrRemoveFromUserList(targetRecipe, checkProperty, userListName) {
  if (targetRecipe[checkProperty]) {
    targetRecipe[checkProperty] = false
    user.removeRecipe(targetRecipe, userListName)
  } else {
    targetRecipe[checkProperty] = true
    user.saveRecipe(targetRecipe, userListName)
  }
  console.log(targetRecipe)
  showHome()
}

function compareRecipes(targetRecipe) {
  const missingList = user.pantry.compareIngredients(targetRecipe)
  if (missingList) {
    domUpdates.showRecipeComparison(missingList, targetRecipe)
  } else {
    alert('You can cook this with your current pantry ingredients!')
  }
}

function cookThisRecipe(targetRecipe) {
  user.removeRecipe(targetRecipe, 'recipesToCook')
  user.pantry.removeIngredients(targetRecipe)
  domUpdates.showUserPantry(user, ingredients)
  alert('Good cooking! Recipe will be removed from your recipes to cook.')
  setTimeout(showHome, 1000)
}

function displayTaggedRecipes(checkboxesSelector) {
  const checkboxes = document.querySelectorAll(".checked-tag");
  const checkboxValues = Array.from(checkboxes)
  const selectedBoxes = checkboxValues.filter(box => box.checked).map(tag => tag.id)
  const searchResults = recipes.filter(recipe => {
    return recipe.tags.some(tag => selectedBoxes.includes(tag));
  });
  domUpdates.displayCards(searchResults)
}
