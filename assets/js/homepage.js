const userFormEl = document.querySelector(`#user-form`);
const nameInputEl = document.querySelector(`#username`);
const repoContainerEl = document.querySelector(`#repos-container`);
const repoSearchTerm = document.querySelector(`#repo-search-term`);

const formSubmitHandler = function (event) {
  event.preventDefault();

  // Get value from input element
  const username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = '';
  } else {
    alert(`Please enter a GitHub username!`);
  }
};

const displayRepos = function (repos, searchTerm) {
  // clear old content
  repoContainerEl.textContent = ``;
  repoSearchTerm.textContent = ` ${searchTerm}`;

  // Loop over repos
  for (let i = 0; i < repos.length; i += 1) {
    // format repo name
    const repoName = `${repos[i].owner.login}/${repos[i].name}`;

    // create a container per repo
    const repoEl = document.createElement(`div`);
    repoEl.classList = `list-item flex-row justify-space-between align-center`;

    // create a span element to hold repository name
    const titleEl = document.createElement(`span`);
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);

    // create a status element
    const statusEl = document.createElement(`span`);
    statusEl.classList = `flex-row align-center`;

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = `<i class='fas fa-times status-icon icon-danger'></i>${repos[i].open_issues_count} issue(s)`;
    } else {
      statusEl.innerHTML = `<i class='fas fa-check-square status-icon icon-success'></i>`;
    }

    // append to container
    repoEl.appendChild(statusEl);

    // Check if api returned any repos
    if (repos.length === 0) {
      repoContainerEl.textContent = `No repositories found.`;
      return;
    }
  }
  console.log(repos);
  console.log(searchTerm);
};

const getUserRepos = function (user) {
  // format the github api url
  const apiUrl = `https://api.github.com/users/${user}/repos`;

  // make a request to the url
  fetch(apiUrl)
    .then((response) => {
      // request was successful
      if (response.ok) {
        response.json().then((data) => {
          displayRepos(data, user);
        });
      } else {
        alert('Error: GitHub User Not Found');
      }
    })
    .catch((error) => {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert('Unable to connect to GitHub');
    });
};

userFormEl.addEventListener(`submit`, formSubmitHandler);
