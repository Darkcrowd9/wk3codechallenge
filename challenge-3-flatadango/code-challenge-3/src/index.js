// Your code here
displayAllMovies();


async function displayAllMovies() {
    const allMovies = document.querySelector('.allMovies');
    await fetch('https://code-challenge-3-orpin.vercel.app/db/db.json')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            res = res.films
            res.forEach(element => {
                console.log(element)
                const singlePoster = document.createElement('div');
                singlePoster.classList.add('singlePoster');
                singlePoster.innerHTML = `
                    <img src="${element.poster}" alt="">
                    <h3 class="tittle">${element.title}</h3>
                `
                allMovies.append(singlePoster);
            });
        })
        .catch(err => console.log(err.message))

    const singlePoster = document.querySelectorAll('.singlePoster');
    getSingleMovie();
    singlePoster.forEach((element, index) => {
        element.addEventListener('click', () => {
            getSingleMovie(index);
        })
    })
}


function calculateAvailabeTickets(capacity, ticketsSold) {
    return capacity - ticketsSold;
}

async function getSingleMovie(index=0) {
    let ticketsSold;
    let filmId;
    await fetch(`https://deploymentjson.vercel.app/`)
        .then(res => res.json())
        .then(res => {
            res = res.films[index]
            ticketsSold = res.tickets_sold;
            filmId = res.id;
            const singleMovie = document.querySelector('.singleMovie');
            singleMovie.innerHTML = `
                <h2 class="movieTittle">${res.title}</h2>
                <img src="${res.poster}">
                <div class="imgDetails">
                    <p class="description">${res.description}</p>
                    <div>
                        <h3>Show Time: </h3>
                        <span class="showTime">${res.showtime}</span>
                        <h3>Run time: </h3>
                        <span class="runTime">${res.runtime}</span>
                    </div>
                </div>
                <div class="tickets">
                    <button type="button" class="buyTicket" >Buy ticket</button>
                    <h3 class="availableTickets">Available Tickets: <span>${calculateAvailabeTickets(res.capacity, res.tickets_sold)}</span></h3>
                </div>
            `
            const buyTicket = document.querySelector('button');
            console.log(buyTicket)
            const availableTickets = document.querySelector('.availableTickets span')
            buyTicket.addEventListener('click', async () => {
                console.log('clicked')
                let number = parseInt(availableTickets.textContent)
                if (number === 1) {
                    const tickets = document.querySelector('.tickets');
                    tickets.textContent = 'All Tickets Sold!!'
                }
                number-=1
                availableTickets.textContent = number
        
                const patchData = {
                    tickets_sold: ticketsSold + 1
                };

                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(patchData)
                };

                await fetch(`https://deploymentjson.vercel.app/${filmId}`, options)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => console.log(err.message))
                       
            })
            

        })
}