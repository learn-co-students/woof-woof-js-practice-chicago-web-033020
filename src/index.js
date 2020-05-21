window.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed")

  const DOG_URL = "http://localhost:3000/pups"
  const dogBar = document.querySelector("#dog-bar")
  dogBar.addEventListener("click", showDogInfo)
  const dogInfoContainer = document.querySelector("#dog-info")
  dogInfoContainer.addEventListener("click", event => {
    if (event.target.tagName==="BUTTON") {
      toggleButton(event)
    }
  })
  const filterDogBtn = document.querySelector("#good-dog-filter")
  filterDogBtn.addEventListener("click", filterDogs)


  function fetchDogs() {
    fetch(DOG_URL)
    .then(resp => resp.json())
    .then(dogs => {
      renderDog(dogs)
    })
  }

  function renderDog(dogs) {
    dogs.forEach(dog => renderOneDog(dog))
  }

  function renderOneDog(dog) {
    const dogSpan = `<span data-dog-id=${dog.id} name="${dog.name}">${dog.name}</span>`
    dogBar.innerHTML += dogSpan
  }

  function showDogInfo(event) {
    if (event.target.dataset.dogId) {
      fetch(`${DOG_URL}/${event.target.dataset.dogId}`)
      .then(resp => resp.json())
      .then(dog => {
        const dogCard = `<div id=${dog.id}>
        <img src="${dog.image}"></img>
        <h2>${dog.name}</h2>
        <button>${dog.isGoodDog ? "Good" : "Bad"} Dog!</button>
        </div>
        `
        dogInfoContainer.innerHTML = dogCard
      })
    }
  }

  function toggleButton(event) {
    const isGood = event.target.innerText === "Good Dog!" ? true : false
    event.target.innerText.includes("Good") ? event.target.innerText = "Bad Dog!" : event.target.innerText = "Good Dog!"
    
    const formData = {
      isGoodDog: !isGood
    }

    const formObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

    fetch(`${DOG_URL}/${event.target.parentNode.id}`, formObj)
    .then(resp=>resp.json())
    .then(dog=> dog)
  }

  function filterDogs(event) {
    if (event.target.innerText.includes("OFF")) {
      event.target.innerText = "Filter good dogs: ON"
      dogBar.innerHTML = ""
      fetch(DOG_URL)
      .then(resp=> resp.json())
      .then(dogs => {
        dogs.filter(dog => dog.isGoodDog).forEach(dog => renderOneDog(dog))
      })
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      fetchDogs()
    }
  }



  fetchDogs()

})