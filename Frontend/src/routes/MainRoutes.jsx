import ProtectedRoute from "../components/ProtectedRoute";
import { Route, Routes } from 'react-router-dom';
import Recipes from '../pages/Recipes';
import About from '../pages/About';
import Home from '../pages/Home';
import CreateRecipe from '../pages/CreateRecipe';
import SingleRecipe from '../pages/SingleRecipe';
import PageNotFound from '../pages/PageNotFound';
import Favorite from '../pages/Favorite';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Myrecipes from '../pages/Myrecipes';
import EditProfile from "../pages/EditProfile";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/recipes' element={<Recipes/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/recipes/detail/:id' element={<SingleRecipe/>} />
        <Route path='/create-recipe' element={<CreateRecipe/>} />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/my-recipes' element={<Myrecipes/>} />   
        <Route path='/user/edit' element={<EditProfile/>} />
      </Route>

      {/* 404 Page */}
      <Route path='*' element={<PageNotFound/>} />
    </Routes>
  )
}

export default MainRoutes;
