const PUPS_URL = "http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", e =>
    {
        const dogArray = []

        const dogBar = document.getElementById('dog-bar')
        const dogInfoContainer = document.getElementById('dog-info')
        const goodDogFilter = document.getElementById('good-dog-filter')
        goodDogFilter.innerHTML = `Filter good dogs: ${goodDogFilter.isOn ? 'ON' : 'OFF'}`

        fetch(PUPS_URL)
        .then(resp => resp.json())
        .then(dogs => {
            const randDog = dogs[Math.floor(Math.random() * dogs.length)]
            dogInfoContainer['dog-id'] = randDog.id
            dogInfoContainer['is-good-dog'] = randDog.isGoodDog
            dogInfoContainer.innerHTML = `<img src=${randDog.image}><h2>${randDog.name}</h2><button>${randDog.isGoodDog ? 'Good' : 'Bad'} Dog!</button>`
            dogs.forEach(dog => {
                dogArray.push(dog)
                dogBar.innerHTML += `<span style="display: block" id=${dog.id} is-good-dog=${dog.isGoodDog}>${dog.name}</span>`
            })
        })

        dogBar.addEventListener("click", e => {
            if (e.target.tagName === 'SPAN') {
                fetch(`${PUPS_URL}/${e.target.id}`)
                .then(resp => resp.json())
                .then(dog => {
                    dogInfoContainer['dog-id'] = dog.id
                    dogInfoContainer['is-good-dog'] = dog.isGoodDog
                    dogInfoContainer.innerHTML = `<img src=${dog.image}><h2>${dog.name}</h2><button>${dog.isGoodDog ? 'Good' : 'Bad'} Dog!</button>`
                })
            }
        })

        goodDogFilter.addEventListener('click', () => {
            goodDogFilter.isOn = !goodDogFilter.isOn
            goodDogFilter.innerHTML = `Filter good dogs: ${goodDogFilter.isOn ? 'ON' : 'OFF'}`
            
            const dogContainer = dogArray.filter(dog => dog.isGoodDog || !goodDogFilter.isOn)
            dogBar.innerHTML = dogContainer.map(dog => `<span id=${dog.id} is-good-dog=${dog.isGoodDog}>${dog.name}</span>`).join('')

        })

        dogInfoContainer.addEventListener("click", e => {
            if (e.target.tagName === 'BUTTON') {
                const myDog = e.target.parentNode
                const myButton = myDog.querySelector('button')

                const configObj = {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({isGoodDog: !myDog['is-good-dog']})
                }

                fetch(`${PUPS_URL}/${myDog['dog-id']}`, configObj)
                .then(resp => resp.json())
                .then(dog => {
                    myDog['is-good-dog'] = dog.isGoodDog
                    dogArray[dog.id - 1].isGoodDog = dog.isGoodDog
                    myButton.innerHTML = `${dog.isGoodDog ? 'Good' : 'Bad'} Dog!`
                    const myDogSpan = document.querySelector(`span[id='${dog.id}']`)
                    myDogSpan['is-good-dog'] = dog.isGoodDog
                })
            }
        })
    }
)
