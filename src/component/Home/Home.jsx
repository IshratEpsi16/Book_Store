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

    const addToWishlist = (book) => {
        if (!wishlist.some(item => item.id === book.id)) {
            const updatedWishlist = [...wishlist, book];
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); // Save to localStorage
        }
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
                                        <a href="#" className="rounded-md text-lg font-bold px-3 py-2 text-sm font-medium text-white" aria-current="page">Book Store</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex justify-center space-x-4 mt-4">
                    <input
                        type="text"
                        placeholder="Search by title"
                        className="input input-bordered w-24 md:w-auto"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="input input-bordered"
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

                <h1 className="text-center mt-4">Choose your favorite book</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                    {currentBooks.map((item) => (
                        <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={item.formats['image/jpeg']}
                                alt={item.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-xl">{item.title}</h2>
                                <button
                                    className="text-red-500"
                                    onClick={() => addToWishlist(item)}
                                >
                                    ❤️
                                </button>
                            </div>
                            <p className="text-gray-600">Author: {item.authors.map(author => author.name).join(', ')}</p>
                            <p className="text-gray-600">Topic: {item.subjects.join(', ')}</p>
                            <Link to={`/book/${item.id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Details</Link>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center space-x-4 mt-4">
                    <button
                        onClick={prevPage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button
                        onClick={nextPage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        disabled={currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
                    >
                        Next
                    </button>
                </div>

                <Link to="/wish_list" className="mt-4 block text-blue-500 hover:underline">Go to Wish List</Link>
            </div>
        </>
    );
};

export default Home;
