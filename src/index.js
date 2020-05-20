const dogBar = document.querySelector("#dog-bar")
const dogInfo = document.querySelector("#dog-info")
const goodDogFilter = document.querySelector("#good-dog-filter")

dogBar.addEventListener("click", renderDoggoInfo)
dogInfo.addEventListener("click", toggleGoodness)
goodDogFilter.addEventListener("click", dealWithFilter)

function getDoggos(){
  fetch(`http://localhost:3000/pups`)
  .then(resp => resp.json())
  .then(doggos => renderDoggos(doggos))
}

function fetchSingleDog(id){
  fetch(`http://localhost:3000/pups/${id}`)
  .then (resp => resp.json())
  .then (doggo => {
    dogInfo.innerHTML = `<img src="${doggo.image}"> <h2>${doggo.name}</h2> <button id="${doggo.id}">${isGoodDog(doggo)}</button>`
  })
}

const isGoodDog = dog => dog.isGoodDog ? "Good Dog!" : "Bad Dog!"

function fetchGoodDogsOnly(){
  fetch(`http://localhost:3000/pups?isGoodDog=true`)
    .then(resp => resp.json())
    .then(doggos => renderDoggos(doggos))
}

function renderDoggos(doggos){
  const doggoList = doggos.map(doggo => `<span id="${doggo.id}">${doggo.name}</span>`).join("")
  dogBar.innerHTML = doggoList
}

function renderDoggoInfo(event){
  const dogClicked = parseInt(event.target.id)
  fetchSingleDog(dogClicked)
}

function toggleGoodness(event){
  const dogClicked = parseInt(event.target.id)
  const goodOrNot = event.target.innerHTML === "Good Dog!" ? true : false

  const formData = {isGoodDog: !goodOrNot}

  const reqObj = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  }
  fetch(`http://localhost:3000/pups/${dogClicked}`, reqObj)
  .then(resp => resp.json())
  .then(updatedDog => {
    fetchSingleDog(updatedDog.id)
  })
}

function dealWithFilter(event){
  if (event.target.innerHTML === "Filter good dogs: OFF"){
    event.target.innerHTML = "Filter good dogs: ON"
    fetchGoodDogsOnly()
  } else {
    event.target.innerHTML = "Filter good dogs: OFF"
    getDoggos()
  }
}

getDoggos()