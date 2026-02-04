# Portfolio Website - React + Vite

A modern, professional portfolio website built with React and Vite, featuring an Apple-inspired design with smooth animations and responsive layout.

## Features

- ✨ Modern, minimalist design inspired by Apple
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- ⚡ Built with Vite for fast development
- 🎨 Smooth animations and transitions
- 🔗 Smooth scroll navigation
- 📧 Contact form ready to integrate

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Icons** - Icon library
- **CSS3** - Styling with CSS variables for theming

### Project Structure

```
src/
├── components/
│   ├── Navigation.jsx      # Navigation bar with theme toggle
│   ├── Hero.jsx            # Hero section with intro
│   ├── Experience.jsx      # Work experience timeline
│   ├── Skills.jsx          # Skills and expertise
│   ├── Projects.jsx        # Featured projects showcase
│   ├── Contact.jsx         # Contact form section
│   └── Footer.jsx          # Footer
├── App.jsx                 # Main app component
├── App.css                 # Global styles and CSS variables
└── main.jsx                # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd My_Website_React
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Customization

### Update Personal Information

Edit the following files to add your information:

- `src/components/Hero.jsx` - Update your bio and title
- `src/components/Experience.jsx` - Add your work experience
- `src/components/Skills.jsx` - List your skills
- `src/components/Projects.jsx` - Showcase your projects
- `src/components/Contact.jsx` - Add your contact details

### Customize Colors

Edit `src/App.css` to modify the CSS variables:

```css
.app.dark {
  --accent: #0071e3;  /* Change primary color */
  --bg-primary: #0f0f0f;
  /* ... other variables */
}
```

### Add Profile Picture

Replace the gradient placeholder in `src/components/Hero.jsx` with an actual image:

```jsx
<img src="path/to/your/image.jpg" alt="Profile" />
```

## Deployment

### Deploy to Netlify

1. Build the project: `npm run build`
2. Connect your Git repository to Netlify
3. Set build command to `npm run build`
4. Set publish directory to `dist`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

© 2026 Yash Kumar Dubey. All Rights Reserved.

This project is proprietary and confidential. Unauthorized copying, modification, or distribution is strictly prohibited.

## Contact

Feel free to reach out if you have any questions or suggestions!
