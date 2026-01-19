
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddEditCard from './pages/AddEditCard';
import CardList from './pages/CardList';
import CardDetail from './pages/CardDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0c10]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditCard />} />
          <Route path="/edit/:id" element={<AddEditCard />} />
          <Route path="/list" element={<CardList />} />
          <Route path="/detail/:id" element={<CardDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
