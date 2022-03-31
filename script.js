const usernameInput = document.querySelector("#username");
const baseRequest = `https://api.github.com/users/`

const form = document.querySelector("form");
const button = document.querySelector("button");

const topInfoArea = document.querySelector(".top-info-area");
const starredArea = document.querySelector(".starred-area");
const recentActivityArea = document.querySelector(".recent-activity-area");


const Chart = require('chart.js')

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submittedUsername = usernameInput.value;
    const combined = Promise.all([
    Promise.resolve(getUser(submittedUsername)),
    // .then((user) => Promise.resolve(getPopularity(user))),    
    Promise.resolve(getStarredProjects(submittedUsername)),
    Promise.resolve(getUserEvents(submittedUsername)),
    
])
    .then(combined => console.log(combined))
    .catch(console.error)
});



function getUser(username) {
    return fetch(`${baseRequest}${username}`)
    .then(response => response.json())
    .then(json => topInfoRenderer(json))
}

function topInfoRenderer(json) {
        console.log(json);
        const template = document.querySelector('.top-info');
        domFragment = template.content.cloneNode(true);
        domFragment.querySelector("h2").textContent = json.login;
        domFragment.querySelector("img").src = json.avatar_url;
        domFragment.querySelector(".repo-number").textContent = json.public_repos;
        domFragment.querySelector(".github-link").textContent = json.html_url;
        if (json.twitter_username !== null) {
            domFragment.querySelector(".twitter-link").textContent = json.twitter_username;
        }
        if (json.blog.length > 0) {
            domFragment.querySelector(".blog-link").textContent = json.blog;
        }
        topInfoArea.appendChild(domFragment);
}

function getStarredProjects(username) {
return fetch(`${baseRequest}${username}/starred`)
   .then(response => response.json())
   .then(json => starredRenderer(json));
}

function starredRenderer(json) {
    console.log(json);
    if (json.length < 1) {
        const noStars = document.querySelector('.no-stars');
        domFragmentNoStars = noStars.content.cloneNode(true);
        starredArea.appendChild(domFragmentNoStars);
    }
    else{
    const templateTable = document.querySelector('.starred-table');
    const templateRow = document.querySelector('.starred-row');
    domFragmentTable = templateTable.content.cloneNode(true);
    const tbody = domFragmentTable.querySelector("tbody");
    json.forEach(project => {
    domFragmentRow = templateRow.content.cloneNode(true);
    td = domFragmentRow.querySelectorAll("td")
        td[0].querySelector("a").textContent = project.owner.login;
        td[0].querySelector("a").href = project.owner.html_url;
        td[1].querySelector("a").textContent = project.name;
        td[1].querySelector("a").href = project.html_url;
    tbody.appendChild(domFragmentRow);
    })
starredArea.appendChild(domFragmentTable);
}
}


// function getUserEvents(username) {
//     return fetch(`${baseRequest}${username}/events`)
//     .then(response => response.json());
// }

// function eventRenderer(json) {
//     new Chart(recentActivityArea.querySelector("#recent-activity-chart"),
//         type: 'bar'
    
//     )
// }

//this could be modified by changing /events to /events?page=123&per_page=50




// function getPopularity(user) {
//     let forkArray = [];
//     let starArray = [];
//     let watchArray = []
//     fetch(user.repos_url)
//     .then(response => {response = response.json(); return response})
//     .then(response => {
//         response.forEach(response => {
//         forkArray.push(response.forks_count);
//         starArray.push(response.stargazers_count);
//         watchArray.push(response.watchers_count)
//         })
//         return [forkArray, starArray, watchArray];
//     })
//     .then(array => {
//         let sum = 0;
//         for (let i = 0; i< array.length; i++){
//             for (let i = 0; i< array.length; i++) {
//                 sum += array[j];
//             }

//         }
//     })
   
    
// }


// getUser("oliverjam")
// // .then(getStarredProjects)
// // .then(getUserEvents)
// .then(console.log)
// .catch(console.error);

// getUserEvents('lascellesabercrombie')
// .then(console.log)
// .catch(console.error)