import { useEffect } from 'react'
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaLayerGroup } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories, selectCategoryError, selectCategoryStatus } from '../feature/categories/categorySlice';
import ErrorMessage from '../components/helper/ErrorMessage';
import LoadingState from "../components/helper/LoadingState";
import CategoryCard from '../components/Category/CategoryCard';

const Category = () => {

  const dispatch = useDispatch();
  const categoires = useSelector(selectCategories);
  const categoryStatus = useSelector(selectCategoryStatus);
  const categoryError = useSelector(selectCategoryError);

  useEffect(() => {
    if (categoryStatus === "idle") dispatch(fetchCategories());
  }, [categoryStatus, dispatch]);

  return (
    <div className='w-full md:space-y-6 space-y-3'>
      <div className="w-full my-4">
        <div className='flex md:flex-row flex-col flex-1 justify-between md:items-center items-start'>
          <div className="space-y-4 my-4 md:p-2 p-0">
            <h2 className="md:text-4xl font-semibold sm:text-3xl text-2xl">
              Category Management
            </h2>
            <p className="md:text-base text-sm text-gray-500">
              Organize and manage your product categories.
            </p>
          </div>
          <Link to="/categories/create" className='flex items-center md:gap-1.5 gap-1 text-white bg-blue-700 md:py-2.5 md:px-3 p-2 rounded-xl hover:bg-blue-500 transition-all ease-in-out duration-200 font-medium'>
            <FaPlus size={18}/>
            Add Category
          </Link>
        </div>
        <div className="w-full md:p-2 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-6">
          {
            categoires.length > 0 && categoryStatus === 'succeeded' && (
              categoires.map((category) => (
                <CategoryCard category={category} key={category.id}/>
              ))
            )
          }
          {
            categoryStatus === "failed" && (
              <ErrorMessage message={categoryError}/>
            )
          }
          {
            categoryStatus === "loading" && (
              <LoadingState />
            )
          }
          <div className='w-full h-65 flex flex-col group'>
            <div className='w-full h-full flex flex-col justify-center items-center border-2 cursor-pointer border-gray-300 border-dashed rounded-md  group-hover:bg-blue-200 group-hover:border-blue-500 transition-colors ease-in-out duration-300 md:space-y-2 space-y-1.5'>
              <Link to={'/categories/create'}> 
                <div className='bg-blue-100 p-3 rounded-lg text-slate-700 transition-colors duration-300 ease-in-out group-hover:bg-blue-700 group-hover:text-white'>
                  <FaPlus size={25}/>
                </div>
              </Link>
              <h3 className='font-medium text-lg tracking-wide'>Create New Category</h3>
              <span className='text-sm tracking-wide text-gray-500'>Add more categories.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category