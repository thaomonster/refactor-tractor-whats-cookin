// use get to grab whatever dataType (users/ingredients/recipes)
export function getData(dataType, localArray) {
  fetch(`http://localhost:3001/api/v1/${dataType}`)
    .then(response => response.json())
    .then(dataArray => {
      dataArray.forEach(dataObject => {
        localArray.push(dataObject)
      })
    })
    .catch(error => alert(`Sorry, there is an error: ${error}`))
}

// use post to modify ingredients 
export function postData(userId, ingredientId, amount) {
  const amountNum = parseInt(amount)
  const settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      userID: userId, 
      ingredientID: ingredientId, 
      ingredientModification: amountNum
    })
  }
  fetch('http://localhost:3001/api/v1/users', settings)
    .then(response => response.json())
    .catch(error => alert(`Sorry, there is an error: ${error}`))
}