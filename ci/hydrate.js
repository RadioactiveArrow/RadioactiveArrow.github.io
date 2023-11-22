const fs = require('fs');
const { JSDOM } = require('jsdom');


const projects = [
  {
    "name": "5a.vc",
    "subtitle": "the link shrinker for the modern web",
    "description": "A link shortener with a modern UI and a powerful analytics system.",
    "image": "assets/5avc.png",
    "url": "https://5a.vc",
    "github": "https://github.com/savvychez/5a"
  },
  {
    "name": "Meridian",
    "subtitle": "sea surface analytics, at scale",
    "description": "A platform for analyzing trends in and visualizing large sets of oceanic climate data!",
    "image": "assets/meridian.png",
    "url": "https://viewmeridian.com",
    "github": "https://github.com/savvychez/meridian_client",
    "technologies": ["reactjs", "python", "express"]
  },
  {
    "name": "Tributary",
    "subtitle": "a different perspective on the world's news",
    "description": "Witness global events as they unfold on the news aggregator built for a changing world.",
    "image": "assets/tributary.png",
    "url": "https://tributary.svvc.dev/",
    "github": "https://github.com/savvychez/tributary-web",
    "technologies": ["reactjs", "python", "NLP"]
  },
  {
    "name": "RecipeBook",
    "subtitle": "a new way to pass down recipes",
    "description": "Built with a user-friendly UI and an infinitely scalable data model, RecipeBook is perfect for home cooks and michelin star chefs alike.",
    "image": "assets/RecipeBook.png",
    "github": "https://github.com/savvychez/recipe-book",
    "technologies": ["reactjs", "express", "mongo-db"]
  },
  {
    "name": "CSPrep",
    "subtitle": "an education platform built for code",
    "description": "A test review platform with complete Java language support and a comprehensive tutoring system.",
    "image": "assets/csprep2.png",
    "github": "https://github.com/savvychez/csprep",
    "technologies": ["php", "mysql", "nginx"]
  }
]

// load the HTML file
const htmlFile = fs.readFileSync('./index.html', 'utf8');
const dom = new JSDOM(htmlFile);
const document = dom.window.document;

// find projects list
const projectsList = document.querySelector('.projects-list');

// clear existing projects
while (projectsList.firstChild) {
    projectsList.removeChild(projectsList.firstChild);
}

// convert JSON data to HTML and append to the projects list
projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';

    projectItem.innerHTML = `
        <div class="title-container">
            <li><h1 class="name">${project.name}</h1></li>
            <p class="subtitle">${project.subtitle}</p>
        </div>
        <div class="img-container">
            <img src="${project.image}" alt="" srcset="">
            <div class="link-container">
                ${project.url ? `<a class="link b" target="_blank" href="${project.url}"><img src="assets/globe.svg" alt=""><p>visit</p></a>` : ''}
                ${project.github ? `<a class="link b" target="_blank" href="${project.github}"><img src="assets/logo.svg" alt=""><p>github</p></a>` : ''}
            </div>
            <p class="code"><strong>tech:</strong> ${project.technologies.join(', ')}</p>
        </div>
        <p class="desc">${project.description}</p>
    `;

    projectsList.appendChild(projectItem);
});

// write the changes back to the HTML file
fs.writeFileSync('./index.html', dom.serialize());