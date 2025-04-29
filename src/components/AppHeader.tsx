
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Search, Settings, Home, HelpCircle } from 'lucide-react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-card shadow-md py-3 px-5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="text-primary" size={24} />
          <h1 className="text-xl font-bold">App Review Analyzer</h1>
        </div>
        
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="flex items-center text-sm gap-1 hover:text-primary transition-colors">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/analysis" className="flex items-center text-sm gap-1 hover:text-primary transition-colors">
                <BarChart size={18} />
                <span>Analysis</span>
              </Link>
            </li>
            <li>
              <Link to="/preprocessing" className="flex items-center text-sm gap-1 hover:text-primary transition-colors">
                <Settings size={18} />
                <span>Preprocessing</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center text-sm gap-1 hover:text-primary transition-colors">
                <HelpCircle size={18} />
                <span>About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
