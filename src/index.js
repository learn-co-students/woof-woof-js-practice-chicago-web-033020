const dogBar = document.getElementById("dog-bar")
const dogInfo = document.getElementById("dog-info")
const dogFilter = document.getElementById("good-dog-filter")
let filterOn = "off"

let allPups = []
function main(){
  getPups()

  dogBar.addEventListener("click", handleClick)
  dogInfo.addEventListener("click", handleToggle)
  dogFilter.addEventListener("click", filterClick)
}

// get all the pups and render them
function getPups(){
  fetch('http://localhost:3000/pups')
  .then(resp => resp.json())
  .then(pups => {
    allPups = pups
    renderPups(pups)})
}

// this handle the click of the on/off toggle for good/bad dog
function filterClick(event){
  let status = event.target.innerText.split(":")[1]
  const label = event.target.innerText.split(":")[0]
 
  // set the master switch condition to on or off
  if (status === " OFF"){
    event.target.innerText = label + ": ON" 
    filterOn = "on"
  } else {
    event.target.innerText = label + ": OFF" 
    filterOn = "off"
  }
  // render the dog labels
  dogBar.innerHTML = ""
  renderPups(allPups)
}

function renderPups(pups){
  // set up the array to be rendered from based on whether the filter is on or off
  let allPups = []
  if (filterOn === "on"){
    allPups = pups.filter(pup => pup.isGoodDog === true )
  } else {
    allPups = pups
  }
  dogBar.innerHTML = ""
  allPups.forEach(pup => renderOnePup(pup))
  
}

// this render each dog label
function renderOnePup(pup){
  let sp = `<span data-id=${pup.id}>${pup.name} </span>`
  dogBar.innerHTML += sp
}

// this handles the click on each dog label
function handleClick(event){
  
  let labelD = ""

  // this determines if the dog clicked is a good or bad dog
  if (allPups[parseInt(event.target.dataset.id) - 1].isGoodDog){
    labelD = "Good Dog!"
  } else {
    labelD = "Bad Dog!"
  }
  // this display the dog info
  let div = `<img src=${allPups[parseInt(event.target.dataset.id) - 1].image}>` +
  `<h2>${allPups[parseInt(event.target.dataset.id) - 1].name}` + `
  </h2> <button data-dog-id=${event.target.dataset.id}> ${labelD} </button>`
  dogInfo.innerHTML = div

}

// this handles the toggling between good and bad dog
function handleToggle(event){
  let goodDog = true

  // set up the attribute to be updated
  event.target.innerText.charAt(0) === "G" ? goodDog = false : goodDog = true
  const formData = {
    isGoodDog: goodDog
  }

  const reqObj = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
      // Accept: "application/json"
    },
    body: JSON.stringify(formData)
  }
  fetch(`http://localhost:3000/pups/${event.target.dataset.dogId}`, reqObj)
  .then(resp => resp.json())
  .then(dog => updateDog(event, dog))
}

// this updates the good/bad label
function updateDog(event, dog){
  let dg = ""
  dog.isGoodDog ? dg = "Good Dog!" : dg = "Bad Dog!"
  event.target.innerText = dg
  
  // refresh the dog bar with updated data
  getPups()
}
main()