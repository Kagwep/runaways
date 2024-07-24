import React, { useState } from 'react';

interface JacketPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (price: string, id: number) => void;
    id: number;
  }

function JacketPriceModal({ isOpen, onClose, onSubmit, id }: JacketPriceModalProps) {
  const [price, setPrice] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSubmit(price, id);
    setPrice('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-xl font-bold mb-4">Enter Price</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JacketPriceModal;