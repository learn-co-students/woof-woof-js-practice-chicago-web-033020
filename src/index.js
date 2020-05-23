const dogApi = 'http://localhost:3000/pups/';

const dogBar = document.querySelector('#dog-bar');

const dogInfo = document.querySelector('#dog-info');

const dogButton = document.querySelector("button");

const fetchDogs = () => {
    fetch(dogApi)
    .then((results) => results.json())
    .then((dogData) => dogData.forEach(renderDogBar))
}

const renderDogBar = (dog) => {
    const { id, name, isGoodDog, image } = dog;
    dogBar.innerHTML += `<div id="dog-bar" data-id=${id}>
        <span>${name}</span>
    </div>`;

    dogBar.addEventListener('click', handleDogSpanClick);
}

const handleDogSpanClick = (event) => {
    const dogId = event.target.parentElement.dataset.id;
    // console.log(dogId)
    fetch(dogApi + dogId)
    .then((results) => results.json())
    .then((dog) => renderDog(dog))
}

function renderDog(dog) {
    // console.log(dog)
   const { id, name, image, isGoodDog } = dog;
   dogInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="${image}"/>
        <button type="button" data-id=${id}></button>`;

    const dogButton = dogInfo.querySelector("button");

    if(isGoodDog === false) {
        dogButton.innerText = "Bad Dog!"
    } else if (isGoodDog === true) {
        dogButton.innerText = "Good Dog!"
    };

    dogButton.addEventListener("click", handleButtonClick);
};

const handleButtonClick = (dog) => {
    let newDogStatus;

    if(event.target.innerText.includes("Bad")) {
        newDogStatus = true;
        console.log("bad now good");
        console.log(newDogStatus);
    } else if(event.target.innerText.includes("Good")) {
        newDogStatus = false;
        console.log("good now bad");
        console.log(newDogStatus);
    }

    const dogId = event.target.dataset.id;
    toggleDogStatus(dogId, newDogStatus);
}

function toggleDogStatus(dogId, newDogStatus) {
    fetch(dogApi + dogId, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ isGoodDog: newDogStatus })
    })
    .then((results) => results.json())
    .then((status) => console.log(status.isGoodDog))
}

fetchDogs();