import React, { useState, useEffect } from 'react';
import InitialBooks from './Books.json';
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";

const BookListing = () => {
  const [initialBooks, setInitialBooks] = useState(InitialBooks);
  const [Books, setBooks] = useState(InitialBooks);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookData, setBookData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setInitialBooks(Books);
  }, [Books]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpen = () => {
    setEditMode(false);
    setSelectedBook(null);
    setBookData((prevData) => ({
      name: '',
      price: '',
      category: '',
      description: '',
      ...prevData,
    }));
    setOpen((prev) => !prev);
  };

  const handleEdit = (book) => {
    setEditMode(prev => !prev);
    setSelectedBook(book);
    setBookData({
      name: book.name,
      price: book.price,
      category: book.category,
      description: book.description,
    });
    setOpen(true);
  };

  const deleteSingleBook = () => {
    if (selectedBook) {
      const updatedBooks = Books.filter((book) => book.id !== selectedBook.id);
      setBooks(updatedBooks);
      setSelectedBooks([]);
      setSelectedBook(null);
      setBookData({
        name: '',
        price: '',
        category: '',
        description: '',
      });
      setEditMode(false);
      setOpen(false);
      return;
    }
  };

  const deleteMultipleBooks = () => {
    if (selectedBooks.length > 0) {
      const updatedBooks = Books.filter((book) => !selectedBooks.includes(book.id));
      setBooks(updatedBooks);
      setSelectedBooks([]);
      setEditMode(false);
      setSelectedBook(null);
      setBookData({
        name: '',
        price: '',
        category: '',
        description: '',
      });
    }
  };

  const handleDelete = (book) => {
    if (editMode) {
      deleteSingleBook();
    } else if (selectedBooks.length > 0) {
      deleteMultipleBooks();
    } else {
      const updatedBooks = Books.filter((b) => b.id !== book.id);
      setBooks(updatedBooks);
    }
  };

  const handleAddBook = () => {
    if (editMode) {
      // Update existing book
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === selectedBook.id ? { ...book, ...bookData } : book))
      );
    } else {
      // Add new book
      setBooks((prevBooks) => [
        ...prevBooks,
        {
          id: prevBooks.length + 1,
          ...bookData,
        },
      ]);
    }

    setOpen(false);
    setEditMode(false);
    setSelectedBook(null);
    setBookData({
      name: '',
      price: '',
      category: '',
      description: '',
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedBooks((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedBooks = [...Books].sort((a, b) => {
    const columnA = a[sortBy];
    const columnB = b[sortBy];

    let comparison = 0;
    if (columnA > columnB) {
      comparison = 1;
    } else if (columnA < columnB) {
      comparison = -1;
    }

    return sortOrder === 'desc' ? comparison * -1 : comparison;
  });

  return (
    <>
      <div className='p-10  bg-gradient-to-r from-violet-500 to-fuchsia-300 flex flex-col items-center justify-start h-screen'>
      <h1 className='mb-3 font-bold text-white text-3xl'>Shelf Wise      </h1>
        <h1 className='mb-6 font-semibold text-xl text-white italic'>A Modern Library Experience</h1>
        <div className='flex  flex-row items-center justify-between w-full'>
        <div className='flex flex-row gap-2'>
        <button className='rounded-md font-semibold text-lg flex gap-2 flex-row p-3 bg-gray-100 items-center border-2 border-gray-300 mb-10'
            onClick={handleOpen}>
            Add book
            <IoMdAdd />
          </button>
          {selectedBooks.length > 0 && (
            <button className='rounded-md font-semibold text-lg flex gap-2 flex-row p-3 text-white bg-red-700 items-center border-2 border-gray-300 mb-10'
              onClick={handleDelete}>
              Delete Selected
            </button>
          )}
        </div>
          
          <div className=''>
            <label className='mr-2 font-semibold'>Sort By</label>
            <select
              onChange={(e) => handleSort(e.target.value)}
              value={sortBy}
              className='p-2 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500'>
              <option value=''>Select</option>
              <option value='name'>Name</option>
              <option value='price'>Price</option>
              <option value='category'>Category</option>
              <option value='description'>Description</option>
            </select>
            {sortBy && (
              <button className='ml-2' onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            )}
          </div>
        </div>

        {/* Modal Code for adding/editing book */}
        <div className={`fixed inset-0 ${open ? 'flex' : 'hidden'} items-center justify-center z-50`}>
          <div className='absolute inset-0 bg-black opacity-50'></div>
          <div className='bg-white p-8 rounded-lg z-10 w-[45%] '>
            <p className='text-xl font-semibold mb-4'>{editMode ? `Edit Book ` : 'Add Book'}</p>
            <div className='flex flex-col gap-4'>
              <input
                type='text'
                placeholder='Name'
                name='name'
                value={bookData.name}
                onChange={handleInputChange}
                className='border-2 border-gray-300 p-2 rounded-md outline-none focus:border-blue-500'
              />
              <input
                type='text'
                placeholder='Price'
                name='price'
                value={bookData.price}
                onChange={handleInputChange}
                className='border-2 border-gray-300 p-2 rounded-md outline-none focus:border-blue-500'
              />
              <input
                type='text'
                placeholder='Category'
                name='category'
                value={bookData.category}
                className='border-2 border-gray-300 p-2 rounded-md outline-none focus:border-blue-500'
                onChange={handleInputChange}
              />
              <input
                type='text'
                placeholder='Description'
                name='description'
                value={bookData.description}
                className='border-2 border-gray-300 p-2 rounded-md outline-none focus:border-blue-500'
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-row gap-4 mt-10'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                onClick={handleAddBook}
              >
                {editMode ? 'Update' : 'Submit'}
              </button>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              {editMode && (
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Display the Books array in a table with checkboxes */}
        <div className={`flex flex-row gap-4 bg-gray-100 p-6 overflow-y-scroll  rounded-xl`}>
          <table className='table-auto'>
            <thead>
              <tr>
                <th className='cursor-pointer p-2'>Select</th>
                <th className='cursor-pointer p-2' onClick={() => handleSort('name')}>Name</th>
                <th className='cursor-pointer p-2' onClick={() => handleSort('price')}>Price</th>
                <th className='cursor-pointer p-2' onClick={() => handleSort('category')}>Category</th>
                <th className='cursor-pointer p-2' onClick={() => handleSort('description')}>Description</th>
                <th className='cursor-pointer p-2'>Actions</th>
              </tr>
            </thead>
            <tbody className=''>
  {sortedBooks.map((book, index) => (
    <tr key={book.id} className={index % 2 === 0 ? 'bg-gray-100 rounded-md' : 'bg-gray-300 rounded-md'}>
      <td>
        <input
          type='checkbox'
          checked={selectedBooks.includes(book.id)}
          onChange={() => handleCheckboxChange(book.id)}
          className='cursor-pointer ml-2'
        />
      </td>
      <td onClick={() => handleEdit(book)} className='cursor-pointer p-2'>{book.name}</td>
      <td className='cursor-pointer p-2'>{book.price}</td>
      <td className='cursor-pointer p-2'>{book.category}</td>
      <td className='cursor-pointer p-2'>{book.description}</td>
      <td>
        <button className='flex items-center justify-center px-3' onClick={() => handleDelete(book)}>
          <MdDeleteOutline className='font-semibold text-red-700' />
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </>
  );
};

export default BookListing;
