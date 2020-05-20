const dogBar = document.getElementById("dog-bar")
const dogInfo = document.getElementById("dog-info")
const dogFilter = document.getElementById("good-dog-filter")
let filterOn = "off"

let allPups = []
function main(){
  fetch('http://localhost:3000/pups')
  .then(resp => resp.json())
  .then(pups => {
    allPups = pups
    renderPups(pups)});

  dogBar.addEventListener("click", handleClick)
  dogInfo.addEventListener("click", handleToggle)
  dogFilter.addEventListener("click", filterClick)
}

function filterClick(event){
  let status = event.target.innerText.split(":")[1]
  const label = event.target.innerText.split(":")[0]
  // debugger
 
  if (status === " OFF"){
    event.target.innerText = label + ": ON" 
    //  filpups = allPups.filter(pup => pup.isGoodDog === true )
    filterOn = "on"
  } else {
    event.target.innerText = label + ": OFF" 
    // filpups = allPups
    filterOn = "off"
  }
  dogBar.innerHTML = ""
  renderPups(allPups)
  // filpups.forEach(pup => renderOnePup(pup))
}

function renderPups(pups){
  // debugger
  let allPups = []
  if (filterOn === "on"){
    allPups = pups.filter(pup => pup.isGoodDog === true )
    // filterOn = "off"
  } else {
    allPups = pups
    // filterOn = "on"
  }
  dogBar.innerHTML = ""
  allPups.forEach(pup => renderOnePup(pup))
  
}

// function renderfilPups(filpups){
//   filpups.forEach(pup => renderOnePup(pup))
  
// }

function renderOnePup(pup){
  // debugger
  let sp = `<span data-id=${pup.id}>${pup.name} </span>`
  dogBar.innerHTML += sp
}

function handleClick(event){
  // debugger
  // console.log(event)
  let labelD = ""

  if (allPups[parseInt(event.target.dataset.id) - 1].isGoodDog){
    labelD = "Good Dog!"
  } else {
    labelD = "Bad Dog!"
  }
  let div = `<img src=${allPups[parseInt(event.target.dataset.id) - 1].image}>` +
  `<h2>${allPups[parseInt(event.target.dataset.id) - 1].name}` + `
  </h2> <button data-dog-id=${event.target.dataset.id}> ${labelD} </button>`
  dogInfo.innerHTML = div

}

function handleToggle(event){
  // debugger
  // console.log(event)
  let goodDog = true
  if (event.target.innerText.charAt(0) === "G"){
    goodDog = false
  } else {
    goodDog = true
  }
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

function updateDog(event, dog){
  let dg = ""
  // debugger
  if (dog.isGoodDog) {
    dg = "Good Dog!"
    allPups[parseInt(event.target.dataset.dogId) - 1]["isGoodDog"] = true
  } else {
    dg = "Bad Dog!"
    allPups[parseInt(event.target.dataset.dogId) - 1]["isGoodDog"] = false
  }

  event.target.innerText = dg
  if (filterOn === "on"){
    renderPups(allPups)
  }
}
main()