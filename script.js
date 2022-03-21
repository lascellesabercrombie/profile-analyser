const usernameInput = document.querySelector("#username");
const baseRequest = `https://api.github.com/users/`

const form = document.querySelector("form");
const button = document.querySelector("button");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submittedUsername = usernameInput.value;
    getUser(submittedUsername)
    .then(getStarredProjects)
    .then(console.log)
    .catch(console.error)
});



function getUser(username) {
    return fetch(`${baseRequest}${username}`)
    .then((response => response.json()))

}



function getStarredProjects(user) {
   return fetch(user.repos_url)
   .then(response => response.json())
}

// function getUserEvents(username) {
//     return fetch(`${baseRequest}${username}/events`).then(response => response.json());
// }

// getUser("oliverjam")
// // .then(getStarredProjects)
// // .then(getUserEvents)
// .then(console.log)
// .catch(console.error);

// getUserEvents('lascellesabercrombie')
// .then(console.log)
// .catch(console.error)