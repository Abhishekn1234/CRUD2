import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CRUDAppEditSelected = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: inputValue,
        completed: false,
      });
      setItems([...items, response.data]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      if (selectedItemId === id) {
        setSelectedItemId(null); // Reset selectedItemId if the selected item is deleted
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateItem = async (id, newValue) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, { title: newValue });
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, title: newValue };
        }
        return item;
      });
      setItems(updatedItems);
      setSelectedItemId(null); // Reset selectedItemId after updating the item
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEdit = (id) => {
    setSelectedItemId(id);
    const selectedItem = items.find(item => item.id === id);
    setInputValue(selectedItem.title);
  };

  const handleCancelEdit = () => {
    setSelectedItemId(null);
    setInputValue('');
  };

  return (
    <div>
      <h1>CRUD App - Edit Selected Item</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {selectedItemId ? (
        <div>
          <button onClick={() => updateItem(selectedItemId, inputValue)}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <button onClick={addItem}>Add Item</button>
      )}
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {selectedItemId === item.id ? (
              <span>{item.title}</span>
            ) : (
              <div>
                <span>{item.title}</span>
                <button onClick={() => handleEdit(item.id)}>Edit</button>
                <button onClick={() => removeItem(item.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CRUDAppEditSelected;
