"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material";

export default function Home() {
  const [categoryList, setCategoryList] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [editMode, setEditMode] = useState(false);

  const columns = [
    { field: 'name', headerName: 'Category', width: 200},
    {field: 'order', headerName: 'Order', width: 100},
    {
      field: 'edit', headerName: 'Edit', width:100,
      renderCell: (params)=> 
        
        <button 
              onClick={()=> startEditMode(params.row)}
              className='border bordery-gray-700 px-1 m-1'>🖋️</button>
      }
  ];

  async function fetchCategory() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((cateory)=>{
      cateory.id = cateory._id;
      return cateory
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function createorUpdateCategory(data) {
    if (editMode){
      // update category
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode()
        fetchCategory()});
      return
    }
    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
    
  }

  function startEditMode(category){
    reset(category)
    setEditMode(true);
  }

  function stopEditMode(){
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  return (
    <main>
      <form onSubmit={handleSubmit(createorUpdateCategory)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-red-600 p-4">
          <div>Category Name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2 text-right">
            {editMode ? 
              <>
              <input
              type="submit"
              value="Update"
              className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              /> 
              {' '}
              <button onClick={()=> {
              // reset({
              //   name: '',
              //   order: ''
              // })
              // setEditMode(false)
              stopEditMode()

              }}
              className='italic bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full'>
              Cancel</button>
              </>
            : 
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
            
          </div>
        </div>
      </form>
      <div>
        <h1>Category ({categoryList.length})</h1>
        <div className="mx-4 border boreder-gray-600">
          <DataGrid 
          columns={columns} 
          rows={categoryList}/>

        </div>
        {/* <ul>
          {categoryList.map((category) => (
            <li key={category._id}>
              <button 
              onClick={()=> startEditMode(category)}
              className='border bordery-gray-700 px-1 m-1'>🖋️</button>
              <Link href={`/product/category/${category._id}`} className="text-red-600">
                {category.name} [{category.order}]
              </Link>
            </li>
          ))}
        </ul> */}
      </div>
    </main>
  );
}