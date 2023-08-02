let projectList;
const fetchProjectList = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/tom-gora/webdev_basics/master/fetch-me.json"
  );
  const projects = await response.json();
  return projects;
};

fetchProjectList().then((projects) => {
  console.log(projects);
});
