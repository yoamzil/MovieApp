# Movie Finder App

![image](https://github.com/user-attachments/assets/415f7f23-62dc-48d7-b2df-54957818dac5)

This is a Movie Finder application built with React and Vite. It allows users to search for movies and view trending movies using the TMDB API. The app also tracks search counts using Appwrite.

## Features

- Search for movies by title
- View trending movies
- Responsive design

## Technologies Used

- React
- Vite
- Tailwind CSS
- Appwrite
- TMDB API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yoamzil/MovieApp.git
   cd MovieApp
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a .env.local file in the root directory and add your environment variables:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   ```

### Running the App

To start the development server:

```sh
npm run dev
```
