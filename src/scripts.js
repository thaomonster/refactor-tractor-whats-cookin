import './css/base.scss';
import './css/styles.scss';
import {getData, postData} from './apis'
import domUpdates from './dom-updates';
import User from './user';
import Recipe from './recipe';

const fullRecipeInfo = document.querySelector(".recipe-instructions");

let pantryInfo = [];
let recipes = [];
let users = [];
let ingredients = []
let user; 

const addClickEvent = (buttonName, func) => {
  document.querySelector(buttonName).addEventListener("click", func)
}

window.addEventListener("load", loadPage);

const loginInput = document.querySelector('.user-input');
addClickEvent(".login-btn", login)
addClickEvent(".show-all-btn", showAllRecipes)
addClickEvent(".filter-btn", findCheckedBoxes)
addClickEvent("main", addToMyRecipes)
addClickEvent(".my-pantry-btn", displayMenu)
addClickEvent(".saved-recipes-btn", domUpdates.showSavedRecipes)
addClickEvent(".search-btn", domUpdates.searchRecipes)
addClickEvent(".show-pantry-recipes-btn", findCheckedPantryBoxes)

// search
const searchForm = document.querySelector("#search");
const searchInput = document.querySelector("#search-input");
searchForm.addEventListener("submit", pressEnterSearch);

const loadPage = () => {
  getData('users', users)
  console.log('hi')
}

const returnUserId = () => {
  const userSearched = users.find(user => user.name === loginInput.value)
  user = new User(userSearched)
}

const login = () => {
  getData('recipes', recipes)
  getData('ingredients', ingredients)
  returnUserId()
  createCards()
  findTags()
  findPantryInfo()
  domUpdates.displayWelcomeBanner()
}
const pressEnterSearch = (event) => {
  event.preventDefault();
  domUpdates.searchRecipes();
}

//showWelcomeBanner & showMyRecipesBanner
domUpdates.toggleSelection(".welcome-msg", ".my-recipes-banner")

//toggleMenu
const displayMenu = () => {
  domUpdates.toggleMenu()
}

const showSavedRecipes = () => {
  const unsavedRecipes = recipes.filter(recipe => {
      return !user.favoriteRecipes.includes(recipe.id);
  });
  domUpdates.recipeDisplay(unsavedRecipes)
  domUpdates.toggleSelection(".welcome-msg", ".my-recipes-banner")
}
//PLANNING


// load
  // login page html displays
  // get user data to use for login button search
  // get all recipes data?
  // get all ingredients data?

// on login display
  // create user & display welcome
  // create & hide display pantry
  // create & hide display favs 
  // create & hide display to cook


// search bar button
// checkbox search button
  // const displayFilteredRecipes = () => {
  //   let search = whateverItIsThatWasSearched
  //   recipes.methodThatFilters
  //   domUpdates.displayRecipes()
  // }

// user favorites button
  // displayFilteredRecipes by 'favorites'?
  // dropdown or what display?

// user to cook button
  // displayFilteredRecipes by 'toCook'?

// user 'cook this' button
  // method that updates local and posts pantry ingredient changes

//user pantry button
  // displays ingredients in user pantry
  // do we need a form here to post ingredients 
  // so users can update their pantry?

//function that updates the pantry locally and does the fetch post