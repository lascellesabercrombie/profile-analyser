const usernameInput = document.querySelector("#username");
const baseRequest = `https://api.github.com/users/`

const form = document.querySelector("form");
const button = document.querySelector("button");

const topInfoArea = document.querySelector(".top-info-area");
const starredArea = document.querySelector(".starred-area");
const recentActivityArea = document.querySelector(".recent-activity-area");
const repoListArea = document.querySelector(".repo-list-area");


form.addEventListener("submit", (e) => {
    e.preventDefault();
    formClearer();
    const submittedUsername = usernameInput.value;
    const combined = Promise.all([
    Promise.resolve(getUser(submittedUsername))
    .then(response => topInfoRenderer(response)),
    // .then((user) => Promise.resolve(getPopularity(user))),  
    Promise.resolve(listRepos(submittedUsername)),  
    Promise.resolve(getStarredProjects(submittedUsername)),
    Promise.resolve(getUserEvents(submittedUsername))
    .then(array => activityChartMaker(array))
])
    .then(combined => console.log(combined))
    .catch(console.error)
});

function formClearer() {
    if (topInfoArea.querySelector(".top-info-div")) {
        topInfoArea.querySelector(".top-info-div").remove();
    };
    if (starredArea.querySelectorAll("div")) {
        starredArea.querySelectorAll("div").forEach(div => div.remove());
    }
    if (repoListArea.querySelectorAll("ul")) {
        repoListArea.querySelectorAll("ul").forEach(list => list.remove());
    }
}

function getUser(username) {
    return fetch(`${baseRequest}${username}`)
    .then(response => response.json())
}

//presents key information on searched user

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

//accesses user's starred projects

function getStarredProjects(username) {
return fetch(`${baseRequest}${username}/starred`)
   .then(response => response.json())
   .then(json => starredRenderer(json));
}

//presents user's starred projects in a table

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
        td[2].textContent = (project.description !== null) ? project.description : "n/a";
    tbody.appendChild(domFragmentRow);
    })
starredArea.appendChild(domFragmentTable);
}
}

// function to get and organise user's last 30 events
//fetch request could be modified by changing /events to e.g. /events?page=123&per_page=50

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

//function to make chart from user events

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

//function to get a list of user's repos and info for popularity chart

function listRepos(username) {
    return fetch(`${baseRequest}${username}/repos`)
    .then(response => response.json())
    .then(json => {
    console.log(json);
    const template = document.querySelector('.repo-list');
    domFragment = template.content.cloneNode(true);
    let repoPopArray = [];
    json.forEach(repo => {
        const templateList = domFragment.querySelector(".repo-list-item")
        domFragmentItem = templateList.content.cloneNode(true);
        domFragmentItem.querySelector("li").textContent = repo.name;
        domFragmentItem.querySelector("li").setAttribute('id', `repo_${repo.name}`);
        domFragmentItem.querySelector("li").addEventListener('click', () => displayContributors(repo)) 

        let array = [repo.forks_count, repo.stargazers_count, repo.watchers_count, repo.name];
        repoPopArray.push(array);
        domFragment.querySelector("ul").appendChild(domFragmentItem);
    });
    //repoPopArray will now be an array of arrays, with each array representing a repo
    let forkArray = [];
    let starArray = [];
    let watchArray = [];
    let nameArray = [];
    repoPopArray.map(array => {
        forkArray.push(array[0]);
        starArray.push(array[1]);
        watchArray.push(array[2]);
        nameArray.push(array[3]);
    })
    repoListArea.appendChild(domFragment);
    //chart template based on https://codepen.io/elisescolaro/details/YaGyMW
    popularityChart(nameArray, forkArray, starArray, watchArray);
})
}

//accesses info on repo contributors to feed into graph function

function displayContributors(repo) {

        console.log(repo.contributors_url)
        return fetch (`${repo.contributors_url}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            let contributorArray = [];
            let contributionArray = [];
            json.forEach(contributor => {
                contributorArray.push(contributor.login);
                contributionArray.push(contributor.contributions)
            })
            console.log(contributorArray);
            console.log(contributionArray);

            contributorChart(contributorArray, contributionArray)
})}

//function to make a pie chart of contributors to repo

function contributorChart(contributorArray, contributionArray) {
    new Chart(document.getElementById('contributor-chart'), {
        type: 'pie',
        data: {
          labels: contributorArray,
          datasets: [
            {
              label: "Proportion of contributions",
              backgroundColor: ["#3e95cd", "#8e5ea2"],
              data: contributionArray
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Contributors'
          }
        }
    })
}

// function to make stacked bar chart of repos' popularity

function popularityChart(nameArray, forkArray, starArray, watchArray) {
new Chart(document.getElementById('repo-popularity-chart'), {
    type: 'bar',
    data: {
labels: nameArray,
datasets: [
{
label: "forks",
backgroundColor: "green",
data: forkArray
},
{
label: "stars",
backgroundColor: "yellow",
data: starArray
},
{
label: "watching",
backgroundColor: "red",
data: watchArray
}
],
    },
    options: {
        tooltips: {
          displayColors: true,
          callbacks:{
            mode: 'x',
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: 'linear',
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
  }
  })
}