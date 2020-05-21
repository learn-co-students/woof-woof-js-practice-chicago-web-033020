function main() {
  fetchPups();
  
} 



const pupsUrl = 'http://localhost:3000/pups'

let pupsList = []

function fetchPups () {

  fetch(pupsUrl)
    .then(response => response.json())
    .then(pups => {
      pupsList = pups
      pupsList.forEach(renderPups)
    })
}

let pupsContainer = document.querySelector('#dog-bar')
const body = document.querySelector('body')
let pupInfoContainer = document.querySelector('#dog-info')

function renderPups(pup) {
  pupsContainer.innerHTML += `<span data-pup-id=${pup.id}>${pup.name}</span>` 
}

body.addEventListener('click', event => {
  if (event.target.tagName === 'SPAN') {
    addPupInfo(event)
  } else if (event.target.className === 'pup-btn') {
    changeGoodBadBoy(event)
  } else if (event.target.className === 'filter-btn') {
    filterPups(event)
  }
})

function addPupInfo(event) {
  const pupId = event.target.dataset.pupId
  
  fetch(`${pupsUrl}/${pupId}`)
    .then(response => response.json())
    .then(singlePup => {
      pupInfoContainer.innerHTML = ''

      const selectedPupInfo = `
      <img src=${singlePup.image} alt="${singlePup.name}'s picture">
      <h2>${singlePup.name}</h2>
      <button class="pup-btn" data-is-good-dog=${singlePup.isGoodDog} data-pup-id=${singlePup.id}>${goodOrBadDog(singlePup.isGoodDog)}</button>
      `

      pupInfoContainer.innerHTML = selectedPupInfo
    })
}


function goodOrBadDog(isGoodDog) {
  if (isGoodDog) {
    return 'Good Dog!'
  } else {
    return 'Bad Dog!'
  }
}

function changeGoodBadBoy(event) {
  const goodDogStatus = event.target.dataset.isGoodDog
  const singlePupId = event.target.dataset.pupId

  function returnOppositeStatus(dogStatus) {
    if (goodDogStatus === 'true') {
      return {"isGoodDog": false}
    } else {
      return {"isGoodDog": true}
    }
  }

  const reqObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(returnOppositeStatus(goodDogStatus))
  }

  console.log(reqObj)

  fetch(`${pupsUrl}/${singlePupId}`, reqObj)
    .then(response => response.json())
    .then(updatedPup => {
      event.target.dataset.isGoodDog = `${updatedPup.isGoodDog}`
      event.target.innerHTML = goodOrBadDog(updatedPup.isGoodDog)
    })
}
const filterButton = document.querySelector('#good-dog-filter')

function filterPups(event) {
  pupsContainer.innerHTML = ''
  pupInfoContainer.innerHTML = ''

  if (filterButton.innerHTML === 'Filter good dogs: OFF') {
    filterButton.innerHTML = 'Filter good dogs: ON';
    pupInfoContainer.innerHTML = ''
    implementFilter()
  } else {
    filterButton.innerHTML = 'Filter good dogs: OFF'
    fetchPups()
  }
}

const pupButtons = document.querySelectorAll('.pup-btn')

function implementFilter() {
  const selectedPupsList = pupsList.filter(pup => pup.isGoodDog)
  selectedPupsList.forEach(selectedPup => renderPups(selectedPup))
}



main();


