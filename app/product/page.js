"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode,setEditMode] = useState(false);
  // const [currentProductId,setCurrentProductId] = useState(null);

  const columns = [
    { field: 'name', headerName: 'Name', width: 100},
    {field: 'description', headerName: 'Description', width: 200},
    {
      field: 'edit', headerName: 'Edit', width:100,
      renderCell: (params)=> 
        
        <button 
              onClick={()=> startEditMode(params.row)}
              className='border bordery-gray-700 px-1 m-1'>🖋️</button>
      },
    {
      field: 'delete', headerName: 'Delete', width: 100,
      renderCell: (params) =>
        <button className="border border-black p-1/2" onClick={deleteById(params.row.id)}>❌</button>
    }
  ]

  async function fetchProducts() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product`);
    const p = await data.json();
    const p2 = p.map((product)=>{
      product.id = product._id;
      return product
    })
    setProducts(p2);
  }

  async function fetchCategory() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    if(editMode){
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode()
        fetchProducts()});

    }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  function startEditMode(product){
    reset(product)
    // setCurrentProductId(product._id)
    setEditMode(true)

  }

  function stopEditMode(){
    reset({
      code: '',
      name: '',
      description: '',
      price: '',
      category: ''
    })

    setEditMode(false)
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64 ">
        <form onSubmit={handleSubmit(createProduct)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name="name"
                type="number"
                {...register("price", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-black w-full"
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
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
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-100">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <div className="mx-4 border boreder-gray-600">
          <DataGrid 
          columns={columns} 
          rows={products}/>

        </div>
        {/* <ul className="list-disc ml-8">
          {
            products.map((p) => (
              <li key={p._id}>
                <button 
                onClick={()=> startEditMode(p)}
                className='border bordery-gray-700 px-1 m-1'>🖋️</button>
                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>❌</button>{' '}
                <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description}
              </li>
            ))}
        </ul> */}
      </div>
    </div>
  );
}
