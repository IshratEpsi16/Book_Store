import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WishList = () => {
    const [wishlist, setWishlist] = useState([]);

    // Retrieve wishlist from localStorage when the component mounts
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    // Remove a book from the wishlist and update localStorage
    const removeFromWishlist = (bookId) => {
        const updatedWishlist = wishlist.filter((book) => book.id !== bookId);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); // Update localStorage
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <p className="mt-4">No items in the wishlist.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {wishlist.map((book) => (
                        <div key={book.id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={book.formats['image/jpeg']}
                                alt={book.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h2 className="font-bold text-xl">{book.title}</h2>
                            <p className="text-gray-600">Author: {book.authors.map(author => author.name).join(', ')}</p>
                            <p className="text-gray-600">Topic: {book.subjects.join(', ')}</p>

                            <div className="flex justify-between mt-2">
                                <Link to={`/book/${book.id}`} className="text-blue-500 hover:underline">View Details</Link>
                                <button
                                    onClick={() => removeFromWishlist(book.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link to="/" className="mt-4 block text-blue-500 hover:underline">Back to Home</Link>
        </div>
    );
};

export default WishList;
