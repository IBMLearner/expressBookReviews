const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const neededUsername = req.body.username;
    if (!neededUsername) {
        res.status(400).send("Bad request. Username is missing");
    }

    const neededPassword = req.body.password;
    if (!neededPassword) {
        res.status(400).send("Bad request. Password is missing");
    }

    if (users.includes(neededUsername)) {
        res.status(400).send("Bad request. Username already exists");
    }
    
});

// Simulating an external API
public_users.get('/internal-books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/internal-books');
      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(500).send('Error fetching books: ' + error.message);
    }
  });
  
  // Get the book list available in the shop using async/await
  public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/internal-books');
      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(500).send('Error fetching books: ' + error.message);
    }
  });

// Get book details based on ISBN
// Simulating an external API by creating an internal endpoint to fetch a book by ISBN
public_users.get('/internal-books/:isbn', (req, res) => {
  const neededISBN = req.params.isbn;
  const neededBook = books[neededISBN];

  if (!neededBook) {
    return res.status(404).send("No such book");
  }

  return res.status(200).send(JSON.stringify(neededBook));
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const neededISBN = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/internal-books/${neededISBN}`);
    return res.status(200).send(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send("No such book");
    }
    return res.status(500).send('Error fetching book details: ' + error.message);
  }
});
  
// Get book details based on author using async/await

public_users.get('/internal-books-by-author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length === 0) {
        return res.status(404).send('No books found by this author');
    }

    return res.status(200).send(JSON.stringify(filteredBooks));
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/internal-books-by-author/${author}`);
        return res.status(200).send(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('No books found by this author');
        }
        return res.status(500).send('Error fetching book details: ' + error.message);
    }
});

// Get all books based on title
public_users.get('/internal-books-by-title/:title', (req, res) => {
    const neededTitle = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === neededTitle);

    if (filteredBooks.length === 0) {
        return res.status(404).send('No books found with this Title');
    }

    return res.status(200).send(JSON.stringify(filteredBooks));
});

public_users.get('/title/:title', async (req, res) => {
    const neededTitle = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/internal-books-by-title/${neededTitle}`);
        return res.status(200).send(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('No books found with this title');
        }
        return res.status(500).send('Error fetching book details: ' + error.message);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const neededISBN = req.params.isbn;
    const neededBook = books[neededISBN];
    
    if (!neededBook) {
        res.status(404).send("Book with such ISBN was not found.");
    }

    const neededReviews = neededBook.reviews;

    return res.status(200).send(`Reviews found: ${JSON.stringify(neededReviews)}`);
});

module.exports.general = public_users;