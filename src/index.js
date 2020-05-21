const PUPS_URL=" http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", e =>
    {
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
            dogs.forEach(
            dog => dogBar.innerHTML += `<span style="display: block" id=${dog.id} is-good-dog=${dog.isGoodDog}>${dog.name}</span>`)
        })

        dogBar.addEventListener("click", e => {
            if (e.target.tagName === 'SPAN') {
                console.log(e.target)
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
            
            for (const dog of dogBar.querySelectorAll('span')) {
                dog.style.display = ((dog['is-good-dog'] || !goodDogFilter.isOn) ? 'block' : 'none')
            }
        })

        dogInfoContainer.addEventListener("click", e => {
            if (e.target.tagName === 'BUTTON') {
                const myDog = e.target.parentNode
                const myButton = myDog.querySelector('button')
                console.log(myDog['is-good-dog'])
                console.log(myDog['dog-id'])

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
                    myButton.innerHTML = `${dog.isGoodDog ? 'Good' : 'Bad'} Dog!`
                    const myDogSpan = document.querySelector(`span[id='${dog.id}']`)
                    console.log(myDogSpan, myDogSpan['is-good-dog'])
                    myDogSpan['is-good-dog'] = dog.isGoodDog
                })
            }
        })
    }
)