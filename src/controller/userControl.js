import Book from "../model/Book.js";
import cloudinary from "../lib/cloudinary.js";

export const userBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createAt: -1,
    });
    res.status(200).json(books);
  } catch (error) {
    console.log("Error in get user books", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const postBooks = async (req, res) => {
  try {
    // const response = await fetch("http://localhost:3000/api/books?page=3&limit=5");

    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload Image to cloudinary
    const uploadResponse = await cloudinary.uploader(image);
    const imgUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imgUrl,
      user: req.user._id,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book routes", error);
    res.status(500).json({ message: "Interval Error server" });
  }
};

export const allBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.page.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books route", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const deleteBooks = async (req, res) => {
  try {
    // Check to find if Book exist
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Only the user can delete the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // delete image from cloudinary also
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error in deleting image from cloudinary", deleteError);
      }
    }
    // delete the book only if owner of the post
    await book.deleteOne();

    res.status(200).json({ message: "Book delete successfully" });
  } catch (error) {
    console.log("Error in delete routes", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
