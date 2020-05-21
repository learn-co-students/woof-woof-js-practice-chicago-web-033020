let dogBar = document.getElementById("dog-bar")
let dogInfo = document.getElementById("dog-info")
const dogUrl = "http://localhost:3000/pups"
let goodDogButton = document.getElementById("good-dog-filter")

function renderPups(puppers){
    let dogBarHtml = ''
    let dogInfoHtml = ''
    puppers.forEach(pupper => dogBarHtml+= `<span class=${pupper.name.split(" ")[0]}_${pupper.id}>${pupper.name}</span>`) 
    puppers.forEach(pupper => {
        if (pupper.isGoodDog === true){
            dogInfoHtml += `<div id=${pupper.name.split(" ")[0]}_${pupper.id} style="display: none;"><h2>Name: ${pupper.name}</h2><img src="${pupper.image}"></img><br><button type="button" id=${pupper.id}>Good Dog!</button><br></div>`
        } else {
            dogInfoHtml += `<div id=${pupper.name.split(" ")[0]}_${pupper.id} style="display: none;"><h2>Name: ${pupper.name}</h2><img src="${pupper.image}"></img><br><button type="button" id=${pupper.id}>Bad Dog!</button><br></div>`
        }
    })
    dogBar.innerHTML = dogBarHtml
    dogInfo.innerHTML = dogInfoHtml
};



function createPuppies(){
    fetch(dogUrl)
    .then(res => res.json())
    .then(data => renderPups(data))
}
createPuppies()

function showPup(event){
    let targetPuppy = document.getElementById(`${event.target.className}`)
    if (event.target.tagName === 'SPAN' && targetPuppy.style.display === 'block'){
            targetPuppy.style.display = 'none'
        } else if (targetPuppy.style.display === 'none'){
            targetPuppy.style.display = 'block'
    }
};

    //passes in event 'click' event object with an ID.
    //switches div in dogInfo with corresponding ID's "style.display" property to 'Block'

function toggleGoodDog(event){
    // console.log(event.target)
    if (event.target.tagName === "BUTTON" && event.target.innerHTML === "Bad Dog!"){
    event.target.innerHTML = "Good Dog!"
    fetch(`http://localhost:3000/pups/${event.target.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({isGoodDog: true})
    })
        .then(result => result.json())
    } else if (event.target.tagName === "BUTTON" && event.target.innerHTML === "Good Dog!") {
    event.target.innerHTML = "Bad Dog!"
    fetch(`http://localhost:3000/pups/${event.target.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({isGoodDog: false})
    })
        .then(result => result.json())
    }
}

dogBar.addEventListener('click', showPup)
dogInfo.addEventListener('click', toggleGoodDog)
goodDogButton.addEventListener('click', filterDogs)


function filterDogs(event){
    if (goodDogButton.innerHTML === "Filter good dogs: OFF"){
        goodDogButton.innerHTML = "Filter good dogs: ON"
        dogBar.childNodes.forEach(child => {
            identifier = child.className.split("_")[1]
            if (document.getElementById(identifier).innerText === "Bad Dog!"){
                child.style.display = 'none'
            }
        })
    } else {
        goodDogButton.innerHTML = "Filter good dogs: OFF"
        dogBar.childNodes.forEach(child => child.style.display = 'block')
    }
}