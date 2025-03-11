# Superpower Showdown

Superpower Showdown is a fun, interactive website that lets users rank and compare their favorite superpowers. With a dynamic leaderboard and a "would-you-rather" style game, visitors can cast votes on various superpowers and see the rankings based on community preferences.

The project uses [SQLite](https://www.sqlite.org/index.html) for a lightweight, file-based database solution (the database file is created automatically). The backend is built on Node.js with Express and uses the `sqlite3` package.

You can see a live version [here](https://kieee.nasram.net/).

Note: *This README was entirely generated by OpenAI's o3 LLM model. Some information may be incorrect. Tbh I can't be bothered to fact-check it.*

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

- **Interactive Ranking Game:** Compare two superpowers side-by-side in a "would-you-rather" style interface.
- **Global Leaderboard:** See the ranking of superpowers based on all user votes. Rankings are updated dynamically.
- **Admin Panel:** Secure admin interface (with login) to add or remove superpowers. New item IDs are automatically assigned.
- **SQLite Database:** All data is stored in a local SQLite database file for simplicity and ease of deployment.
- **Built with Node.js and Express:** Server code uses Express, along with session-based authentication.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher recommended)
- SQLite is automatically handled by the code using the [sqlite3](https://www.npmjs.com/package/sqlite3) npm package.

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/TheCyaniteProject/superpower-showdown.git
   cd superpower-showdown
   ```

2. **Install Dependencies**

   Install the required npm packages:

   ```bash
   npm install
   ```

   This will install Express, sqlite3, express-session, and other necessary packages as listed in `package.json`.

3. **Run the Server**

   Start the server with:

   ```bash
   node server.js
   ```

   The server will create (if not already present) a SQLite database file (for example, `rankings.db`) automatically.  
   Visit [http://localhost:8080](http://localhost:8080) in your browser.

## Usage

- **Home Page**  
  Visit [http://localhost:8080/index.html](http://localhost:8080/index.html) to see the leaderboard. Superpowers are ranked by community votes (the ranking numbers are displayed with first place labeled as "1", second as "2", and so on).

- **Game Page**  
  Navigate to [http://localhost:8080/play.html](http://localhost:8080/play.html) to participate in the ranking game. Users choose between two superpowers; the winning choice will help adjust the overall rankings.

- **Login & Admin Panel**  
  Click the login button (placed in the top right corner of the home page) or navigate to [http://localhost:8080/login.html](http://localhost:8080/login.html) to log in. After logging in (default credentials: username: `admin`, password: `admin`), the admin page becomes accessible via [http://localhost:8080/admin](http://localhost:8080/admin). From the admin panel, you can add new superpowers (with IDs auto-calculated) or remove existing ones.

## Contributing

Contributions are welcome! To suggest improvements or add new features:

1. Fork this repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/my-new-feature
   ```
5. Open a Pull Request detailing your changes.

Please try to follow any existing coding conventions in the project and include proper descriptions in your commits.

## License

This project is licensed under the **GPL v3** License. See the [LICENSE](LICENSE) file for further details.

## Disclaimer

*This project contains code generated by OpenAI's o3 LLM model.*
*This README was entirely generated by OpenAI's o3 LLM model.*
