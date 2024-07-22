import React, {useState} from 'react'
import { Link } from 'react-router-dom';

import Banners from '../Banners/Banners';

import RunawaysMarketPlace from './MarketPlace/RunawaysMarketPlace';
import KofiaMarketPlace from './MarketPlace/KofiaMarketPlace';
import JacketsMarketplace from './MarketPlace/JacketsMarketplace';
import Pants from './MarketPlace/Pants';

const MarketplacePage = () => {

  const [activeTab, setActiveTab] = useState('runaways');

  const tabs = ['runaways', 'kofia', 'jacket', 'pants']

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === 'runaways' && <div className="p-4"><RunawaysMarketPlace /></div>}
        {activeTab === 'kofia' && <div className="p-4"><KofiaMarketPlace /></div>}
        {activeTab === 'jacket' && <div className="p-4"><JacketsMarketplace /></div>}
        {activeTab === 'pants' && <div className="p-4"><Pants /></div>}
      </div>
    </div>
  )
}

export default MarketplacePage