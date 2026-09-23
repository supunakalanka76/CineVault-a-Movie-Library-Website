# 🎬 CineVault — Movie Library Website

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![TVmaze API](https://img.shields.io/badge/TVmaze_API-3C948B?style=for-the-badge)
![PHPMailer](https://img.shields.io/badge/PHPMailer-8892BF?style=for-the-badge&logo=php&logoColor=white)
![Composer](https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)
  
CineVault is a responsive movie library website developed as a web development technical assessment. It allows users to discover movies and TV shows through the TVmaze API, add selected titles to a personal favourites grid, remove titles from the collection, and contact the site through a validated contact form.

The project was developed using **HTML5, SCSS/CSS, Vanilla JavaScript, PHP, JSON, TVmaze API, and PHPMailer** without relying on a frontend framework.

</div>

---

## ✨ Features

### 🎥 Movie Library

* Displays an initial collection of movie cards
* Searches movies and TV shows using the **TVmaze API**
* Live search results
* Debounced API requests
* Add selected titles to the favourites grid
* Prevent duplicate additions
* Remove movies from the collection
* Movie posters, titles, release years, genres, and descriptions
* Fallback handling for unavailable movie information
* Responsive movie-card layout

### 🔎 Accessible Movie Search

* Keyboard-accessible search
* Arrow Up / Arrow Down navigation
* Enter to select a result
* Escape to close search results
* Accessible combobox/listbox semantics
* Screen-reader-friendly state announcements
* Dynamic accessible labels

### 📱 Responsive Design

CineVault is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

The interface adapts its navigation, movie grid, contact form, map, typography, spacing, and footer layout for different screen sizes.

### 🍔 Responsive Navigation

* Desktop navigation menu
* Mobile/tablet hamburger navigation
* Dynamic `aria-expanded` state
* Accessible menu labels
* Escape-key support
* Automatically closes after selecting a navigation link

### 📩 Contact Form

The contact section includes:

* First Name
* Last Name
* Email Address
* Phone Number
* Comments

Required fields are validated before submission.

### ✅ Frontend Validation

JavaScript validation includes:

* Required-field validation
* Name length validation
* Email format validation
* Optional phone validation
* Comment length validation
* Real-time validation feedback
* Invalid/valid field states
* Focus management for the first invalid field
* Accessible error associations using `aria-invalid` and `aria-describedby`

### 🐘 PHP Backend

Contact form submissions are processed through a PHP backend.

The backend provides:

* Server-side validation
* JSON request processing
* Error responses
* Successful submission responses
* Persistent submission storage
* Email processing

Frontend validation improves the user experience, while backend validation ensures submitted data is validated independently on the server.

### 💾 JSON Submission Storage

Successful contact submissions are stored in:

```text
data/submissions.json
```

The application uses file locking while writing submission data to reduce the risk of conflicting writes.

The submissions file is excluded from Git version control to prevent submitted user information from being committed to the repository.

### 📧 Email Notifications

CineVault uses **PHPMailer** with SMTP to send two emails after a successful contact submission:

1. **Admin notification** — contains the submitted contact details.
2. **User auto-response** — confirms that the message was successfully received.

HTML email templates are used to provide a consistent CineVault-branded appearance.

Sensitive SMTP credentials are stored separately from the public source code and are excluded from Git.

### 🗺️ Google Maps

The contact section includes an embedded Google Map displaying the eBEYONDS location.

### ♿ Accessibility

Accessibility improvements include:

* Semantic HTML5 elements
* Skip-to-main-content link
* Keyboard-accessible navigation
* Keyboard-accessible movie search
* Visible focus states
* Accessible form labels
* Accessible validation messages
* `aria-expanded` navigation/search states
* `aria-invalid` form states
* `aria-describedby` error associations
* Live status messages
* Accessible movie removal controls
* Descriptive image alternative text where appropriate
* Decorative images/icons hidden from assistive technologies where appropriate
* Reduced-motion support
* Responsive touch targets

---

## 🛠️ Technologies Used

| Technology        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| HTML5             | Page structure and semantic markup          |
| SCSS              | Styling and responsive design               |
| CSS3              | Compiled application styling                |
| JavaScript        | UI interaction, validation, API integration |
| PHP               | Backend contact-form processing             |
| JSON              | Contact submission storage                  |
| TVmaze API        | Movie and TV show search                    |
| PHPMailer         | SMTP email delivery                         |
| Composer          | PHP dependency management                   |
| Google Maps Embed | Location display                            |

---

## 🌐 API

CineVault uses the **TVmaze Search API** to retrieve movie and television-show information.

```text
https://api.tvmaze.com/search/shows?q={search-term}
```

Search requests are performed asynchronously using the JavaScript Fetch API.

The implementation also uses `AbortController` to cancel unnecessary requests when a new search is initiated.

---

## 📂 Project Structure

```text
CineVault-a-Movie-Library-Website/
│
├── .vscode/
│
├── cinevault/
│   │
│   ├── api/
│   │   └── contact.php
│   │
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── config/
│   │   └── mail.php              # Private / ignored by Git
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── data/
│   │   └── submissions.json      # Runtime data / ignored by Git
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── movies.js
│   │   └── validation.js
│   │
│   ├── scss/
│   │   ├── _base.scss
│   │   ├── _contact.scss
│   │   ├── _footer.scss
│   │   ├── _header.scss
│   │   ├── _hero.scss
│   │   ├── _intro.scss
│   │   ├── _movies.scss
│   │   ├── _responsive.scss
│   │   ├── _variables.scss
│   │   └── style.scss
│   │
│   ├── vendor/
│   ├── composer.json
│   ├── composer.lock
│   └── index.html
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
```

Navigate into the application directory:

```bash
cd CineVault-a-Movie-Library-Website/cinevault
```

---

### 2. Install PHP dependencies

Make sure **PHP** and **Composer** are installed.

Then run:

```bash
composer install
```

This installs the required PHP packages, including PHPMailer.

---

### 3. Configure email

Create/configure the private mail configuration used by:

```text
config/mail.php
```

Add the SMTP credentials required by the PHP contact endpoint.

> **Important:** Never commit SMTP usernames, passwords, Gmail App Passwords, API secrets, or other private credentials to GitHub.

The mail configuration file should remain excluded through `.gitignore`.

---

### 4. Prepare JSON storage

Make sure the following directory exists:

```text
data/
```

The application will use:

```text
data/submissions.json
```

for contact-form submission storage.

The PHP process must have permission to write to this location.

---

### 5. Start the PHP development server

From the `cinevault` directory, run:

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000/
```

in your browser.

> Do not open `index.html` directly through `file://` when testing the complete application because the contact form requires the PHP backend.

---

## 🎨 SCSS Development

The source styling is located inside:

```text
scss/
```

The main SCSS entry file is:

```text
scss/style.scss
```

Compiled CSS is generated at:

```text
css/style.css
```

During development, SCSS can be compiled using a compatible Sass compiler or an editor extension such as **Live Sass Compiler**.

Changes should normally be made to the SCSS source files rather than directly editing the generated CSS file.

---

## 🧪 Testing

The completed application has been manually tested for:

* Responsive navigation
* Desktop layout
* Tablet layout
* Mobile layout
* Movie search
* TVmaze API responses
* Keyboard search navigation
* Adding movies
* Removing movies
* Duplicate movie prevention
* Frontend form validation
* Backend form validation
* JSON submission storage
* Admin email notifications
* User auto-response emails
* Google Maps embedding
* Keyboard navigation
* Accessible focus states

### Browser Testing

The application has been tested successfully in:

* ✅ Google Chrome
* ✅ Microsoft Edge
* ✅ Brave

Additional browser testing can be performed in Firefox and Safari where available.

---

## 🔐 Security & Privacy

The repository is configured so sensitive/runtime information should not be committed.

Examples include:

```text
config/mail.php
data/submissions.json
```

Before pushing changes, always verify that SMTP credentials and submitted contact information are not staged for commit.

For production deployment, environment variables or another secure secrets-management approach should be preferred for SMTP credentials.

---

## ♿ Accessibility Notes

CineVault includes practical accessibility improvements based on common WCAG-oriented web development practices.

The website supports keyboard interaction for important controls, provides visible focus states, associates validation errors with their fields, and uses ARIA attributes where additional state information is necessary.

The project does not claim formal WCAG certification.

---

## 📌 Main Functionality Flow

```text
User opens CineVault
        │
        ├──► Browses initial movie collection
        │
        ├──► Searches TVmaze
        │       │
        │       └──► Selects result
        │               │
        │               └──► Movie added to favourites
        │
        ├──► Removes unwanted favourites
        │
        └──► Completes contact form
                │
                ├──► JavaScript validation
                │
                └──► PHP backend
                        │
                        ├──► Server validation
                        ├──► JSON storage
                        ├──► Admin notification email
                        └──► User confirmation email
```

---

## 🎯 Assessment Highlights

The project demonstrates:

* Semantic HTML5
* Responsive web design
* SCSS architecture
* Vanilla JavaScript DOM manipulation
* Asynchronous API integration
* Search functionality
* Dynamic DOM creation
* Keyboard interaction
* Client-side validation
* Server-side validation
* PHP backend development
* JSON file handling
* SMTP email integration
* Accessibility considerations
* Cross-browser testing
* Git-friendly separation of sensitive configuration

---

## 👨‍💻 Project Owner

**Supun Akalanka**

Graduate in Software Engineering

📧 Email: supunakalanka76@gmail.com

🔗 GitHub: https://github.com/supunakalanka76

🔗 LinkedIn: https://linkedin.com/in/supunakalanka76

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Supun Akalanka

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
```

---

<div align="center">

**⭐ If you found this project helpful, consider giving it a star! ⭐**

Made with ❤️ by **Supun Akalanka**

</div>
