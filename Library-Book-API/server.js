const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Library Book Management API is Running!");
});

// GET ALL BOOKS
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});
// FILTER BOOKS BY AUTHOR
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (!author) {
        return res.status(400).json({
            message: "Author name is required"
        });
    }

    const filteredBooks = books.filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    res.status(200).json(filteredBooks);
});
// GET BOOK BY ID
app.get("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
});

// ADD NEW BOOK
app.post("/api/books", (req, res) => {
    const { title, author, genre, publishedYear, available } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            message: "Title and author are required"
        });
    }

    const newBook = {
        id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 101,
        title,
        author,
        genre,
        publishedYear,
        available: available ?? true
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// UPDATE BOOK
app.put("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    Object.assign(book, req.body, { id });

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// DELETE BOOK
app.delete("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});