import { useState } from "react";
import { RecipePage } from "./components/RecipePage";
import { LoginPage } from "./components/LoginPage";
import { Signup } from "./components/Signup";
import { UserPage } from "./components/UserPage";
import { NewRecipes } from "./components/NewRecipes";
import { Inventory } from "./components/Inventory";
import React from 'react';

export const Context = React.createContext();


function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState('');
  const backendLocation = 'http://localhost:8080';
  console.log(page)
  return (
    <Context.Provider value={{user, setPage, setUser, backendLocation}}>
      <div className="App w-[100vw] min-h-[100vh] bg-[#F3E5D7] h-auto overflow-hidden">
        {page ==='inventory' && <Inventory/>}
        {page === 'newrecipes' && <NewRecipes/>}
        {page === 'userpage' && <UserPage/>}
        {page === 'login' && <LoginPage/>}
        {page === 'signup' && <Signup/>}
        {page === 'recipe' && <RecipePage/>}
      </div>
    </Context.Provider>
  );
}

export default App;
