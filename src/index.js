const pupsURL = 'http://localhost:3000/pups'
const pupBar = document.querySelector('#dog-bar')
const pupShow = document.querySelector('#dog-info')

function main(){
  getAllPups()
  handlePupBarClick()
  handleGoodBadBtn()
  handleFilterBtn()
}

function handleFilterBtn(){
  const filterBtn = document.querySelector('#good-dog-filter')
  filterBtn.addEventListener('click', function(event){
    if(event.target.innerHTML === 'Filter good dogs: OFF'){
      event.target.innerHTML = 'Filter good dogs: ON'
      pupBar.innerHTML = ''
      filterPups(event)
    } else {
      event.target.innerHTML = 'Filter good dogs: OFF'
      pupBar.innerHTML = ''
      getAllPups()
    }
  })
}

function filterPups(event){
  fetch(pupsURL)
  .then(resp => resp.json())
  .then(pups => {
    pups.forEach(pup => {
      if(pup.isGoodDog){
        pupBar.innerHTML += `<span data-id=${pup.id}>${pup.name}</span>`
      } 
    })
  })
}


function handleGoodBadBtn(){
  pupShow.addEventListener('click', function(event){
    if(event.target.tagName === 'BUTTON'){
      toggleGoodBad(event)
    }
  })
}

function toggleGoodBad(event){
  const pupId = event.target.dataset.id
  fetch(`${pupsURL}/${pupId}`)
  .then(resp => resp.json())
  .then(pup => {
    if(pup.isGoodDog){
      pup.isGoodDog = false
      postGoodBad(pup)
    } else {
      pup.isGoodDog = true
      postGoodBad(pup)
    }
  })
}

function postGoodBad(pup){
  const reqObj = {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isGoodDog: pup.isGoodDog
    })
  }
  fetch(`${pupsURL}/${pup.id}`, reqObj)
  .then(resp => resp.json())
  .then(updatedPup => {
    editPupBtn(updatedPup)
    pupBar.innerHTML = ''
    filterPups()
  })
}

function editPupBtn(pup){
  const pupBtn = pupShow.children[2]
  if(pup.isGoodDog){
    pupBtn.innerHTML = 'Bad Dog!'
  } else {
    pupBtn.innerHTML = 'Good Dog!'
  }
}


function handlePupBarClick(){
  pupBar.addEventListener('click', function(event){
    if(event.target.tagName === 'SPAN'){
      getOnePup(event)
    }
  })
}

function getOnePup(event){
  const pupId = event.target.dataset.id
  fetch(`${pupsURL}/${pupId}`)
  .then(resp => resp.json())
  .then(pup => {
    showPup(pup)
  })
}

function showPup(pup){
  pupShow.innerHTML = ''
  if(pup.isGoodDog){
    let pupBtn = `<button data-id=${pup.id} type="button">Bad Dog!</button>`
    pupShow.innerHTML = `<img src=${pup.image}><h2>${pup.name}</h2>${pupBtn}`
  } else {
    let pupBtn = `<button data-id=${pup.id} type="button">Good Dog!</button>`
    pupShow.innerHTML = `<img src=${pup.image}><h2>${pup.name}</h2>${pupBtn}`
  }

}

function getAllPups(){
  fetch(pupsURL)
  .then(resp => resp.json())
  .then(pups => {
    pups.forEach(pup => {
      pupBar.innerHTML += `<span data-id=${pup.id}>${pup.name}</span>`
    })
  })
}

main();