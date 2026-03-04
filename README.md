# Antoney Ouko - Personal Portfolio & Studio

A professional, human-centered portfolio website designed for a Business IT Specialist. This project features a custom design system, a dynamic blog, and an interactive chatbot.

## 🌟 Features

- **Responsive Design:** Fluid layout that adapts to mobile, tablet, and desktop screens.
- **Theme System:** Native Dark/Light mode toggle with preference saved in LocalStorage.
- **Dynamic Content Engine:**
  - **Blog:** Posts are stored in `blog-data.js` and rendered dynamically on `blog.html` and `post.html`.
  - **Projects:** Portfolio items are managed in `data.js` and populated via JavaScript.
- **"Bot Toney" Chatbot:** A custom, rule-based chatbot that answers visitor questions, suggests topics, and handles idle states.
- **Contact Integration:** Functional contact form using Web3Forms API.
- **Animations:** Intersection Observer API used for scroll-triggered fade-in effects.

## 📂 File Structure

| File | Description |
|------|-------------|
| `index.html` | Main landing page (Hero, Skills, Services, Contact). |
| `blog.html` | Blog listing page displaying all entries from `blog-data.js`. |
| `post.html` | Single post template. Renders content based on `?id=` URL parameter. |
| `style.css` | Main stylesheet using CSS Variables for colors and typography. |
| `main.js` | Core logic: UI toggles, animations, and general event listeners. |
| `blog-data.js` | Data store for blog posts (JSON-like structure). |
| `data.js` | Data store for portfolio projects. |

## 🚀 How to Customize

### 1. Adding a Blog Post
Open `blog-data.js` and add a new entry to the `blogPosts` object:
```javascript
'new-post-id': {
    title: 'Your Title',
    date: 'Date',
    author: 'Name',
    image: 'path/to/image.jpg',
    excerpt: 'Short summary...',
    content: '<p>HTML content here...</p>'
}
```

### 2. Updating Projects
Open `data.js` and modify the `projectData` object to add or remove portfolio items.

### 3. Changing Colors
Open `style.css` and modify the variables in the `:root` selector to change the color scheme (e.g., `--terracotta`, `--sage`).

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Icons:** Font Awesome
- **Fonts:** Adobe Fonts (Freight Text) & Google Fonts (Fragment Mono)