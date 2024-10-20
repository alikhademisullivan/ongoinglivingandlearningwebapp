import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './profile';
import RegisterChild from './RegisterChild';
import InteractiveIcons from './headerAndFooter';
import ChildGames from './childGames';

const ChildHome = () => {
  return (
    <div>
      <InteractiveIcons hideButton="childLogin"/>
      <ChildGames />
      <div><br></br><br></br><br></br><br></br></div>
    </div>
  );
};

export default ChildHome;
