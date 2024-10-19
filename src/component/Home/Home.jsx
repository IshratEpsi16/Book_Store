import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState({ results: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const booksPerPage = 12;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://gutendex.com/books/');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Load wishlist from localStorage when the component mounts
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    const allTopics = Array.from(new Set(data.results.flatMap(book => book.subjects)));

    const filteredBooks = data.results.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTopic = selectedTopic ? book.subjects.includes(selectedTopic) : true;
        return matchesTitle && matchesTopic;
    });

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredBooks.length / booksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleWishlist = (book) => {
        const isInWishlist = wishlist.some(item => item.id === book.id);
        let updatedWishlist;
        if (isInWishlist) {
            updatedWishlist = wishlist.filter(item => item.id !== book.id); // Remove from wishlist
        } else {
            updatedWishlist = [...wishlist, book]; // Add to wishlist
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); // Save to localStorage
    };

    const isBookInWishlist = (bookId) => {
        return wishlist.some(item => item.id === bookId);
    };

    return (
        <>
            <div>
                <nav className="bg-cyan-600" style={{ marginTop: '-3%' }}>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <button className="btn btn-outline btn-info">
                                            <Link to="/" className="rounded-md text-lg font-bold px-3 py-2 text-sm font-medium text-white" aria-current="page">Book Store</Link>
                                        </button>
                                        <Link to="/wish_list" style={{ color: 'white' }} className="mt-4 block text-blue-500 hover:underline">Wish List</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex flex-col md:flex-row justify-center items-center space-x-4 mt-4">
                    <input
                        type="text"
                        placeholder="Search by title"
                        className="input input-bordered w-full md:w-64 mb-2 md:mb-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="input input-bordered w-full md:w-48"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option value="">All Topics</option>
                        {allTopics.map((topic, index) => (
                            <option key={index} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>

                <h1 className="text-center mt-4 text-xl md:text-2xl">Choose your favorite book</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                    {currentBooks.map((item) => (
                        <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={item.formats['image/jpeg']}
                                alt={item.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-lg">{item.title}</h2>
                                <button
                                    className={`text-red-500 ${isBookInWishlist(item.id) ? 'text-red-600' : 'text-gray-400'}`}
                                    onClick={() => toggleWishlist(item)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width='25px' height='25px' viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" /></svg>
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm">Author: {item.authors.map(author => author.name).join(', ')}</p>
                            <p className="text-gray-600 text-sm">Topic: {item.subjects.join(', ')}</p>
                            <Link to={`/book/${item.id}`} className="text-blue-500 hover:underline mt-2 inline-block text-sm">View Details</Link>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center space-x-4 mt-4">
                    <button
                        onClick={prevPage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
