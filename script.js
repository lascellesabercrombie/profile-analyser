const usernameInput = document.querySelector("#username");
const baseRequest = `https://api.github.com/users/`

const form = document.querySelector("form");
const button = document.querySelector("button");

const topInfoArea = document.querySelector(".top-info-area");
const starredArea = document.querySelector(".starred-area");
const recentActivityArea = document.querySelector(".recent-activity-area");
const repoListArea = document.querySelector(".repo-list-area");

// const Chart = require('chart.js')

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submittedUsername = usernameInput.value;
    const combined = Promise.all([
    Promise.resolve(getUser(submittedUsername))
    .then(response => topInfoRenderer(response)),
    // .then((user) => Promise.resolve(getPopularity(user))),  
    Promise.resolve(listRepos(submittedUsername)),  
    Promise.resolve(getStarredProjects(submittedUsername)),
    Promise.resolve(getUserEvents(submittedUsername))
    .then(array => activityChart(array))
])
    .then(combined => console.log(combined))
    .catch(console.error)
});



function getUser(username) {
    return fetch(`${baseRequest}${username}`)
    .then(response => response.json())
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
        return json;
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

function activityChart(array) {
new Chart(document.getElementById("recent-activity-chart"), {
    type: 'pie',
    data: {
      labels: ["PushEvent", "IssuesEvent", "IssueCommentEvent", "CreateEvent"],
      datasets: [
        {
          label: "Proportion of last 30 events",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: array
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Recent Activity'
      }
    }
});
}


function getUserEvents(username) {
    return fetch(`${baseRequest}${username}/events`)
    .then(response => {
        return response.json()
    })
    .then(response2 => {
        console.log(response2)
        let pushEvent = 0;
        let issuesEvent = 0;
        let issueCommentEvent = 0;
        let createEvent = 0;
        let other = 0;
        response2.forEach((item) => {
        switch (item.type) {
            case 'IssuesEvent':
            issuesEvent ++;
            break;
            case 'IssueCommentEvent':
            issueCommentEvent ++;
            break;
            case 'PushEvent':
            pushEvent ++;
            break;
            case 'CreateEvent':
            createEvent ++;
            break; 
            default: 
            other++;
            break;
        }
        })
        let array = [pushEvent, issuesEvent, issueCommentEvent, createEvent, other]
        return array;
    });
}

//this could be modified by changing /events to e.g. /events?page=123&per_page=50

function listRepos(username) {
    console.log('oy')
    return fetch(`${baseRequest}${username}/repos`)
    .then(response => response.json())
    .then(json => {
    console.log(json);
    const template = document.querySelector('.repo-list');
    domFragment = template.content.cloneNode(true);
    json.forEach(repo => {
        const templateList = domFragment.querySelector(".repo-list-item")
        domFragmentItem = templateList.content.cloneNode(true);
        domFragmentItem.querySelector("li").textContent = repo.name;
        domFragmentItem.querySelector("li").setAttribute('id', `repo_${repo.name}`);
        domFragment.querySelector("ul").appendChild(domFragmentItem);
    })
    repoListArea.appendChild(domFragment);
})
}


// }). 
//     ))
//     // "https://api.github.com/repos/theoretischja/Pied-Press/contributors"
//     return cont.json()
//     }))
//     }




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