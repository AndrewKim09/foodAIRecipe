import { faBackwardStep, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Context } from '../App'
import axios from 'axios';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

export const Inventory = (props) => {
  const {setPage, user, setUser, backendLocation} = React.useContext(Context)
  const [addingState, setAddingState] = useState(false)
  const [item , setItem ] = useState();
  const [quantity, setQuantity] = useState();
  const [unit, setUnit] = useState();
  const [addItemError, setAddItemError] = useState('');
  const [quanitityError, setQuantityError] = useState('');
  const [submitState, setSubmitState] = useState(false);
  const [userItems, setUserItems] = useState([{}])
  const [editingState, setEditingState] = useState(false)

  const [itemToEdit, setItemToEdit] = useState('')
  const [quantityToEdit, setQuantityToEdit] = useState('')
  const [editItemError, setEditItemError] = useState('')


  const onSubmit = () => {
    const infinite = document.getElementById('infinite').checked;
    if(item === null || item === ''){
      setAddItemError('Item Name cannot be empty')
      return;
    }
    if(quantity === null || quantity === ''){
      setQuantityError('Quantity cannot be empty')
      return;
    }
    if(unit === undefined || unit === ''){
      setQuantityError('select a unit')
      return;
    }
    if(submitState) return;

    setSubmitState(true);
    const data = {'username': user, 'ingredient': item, 'amount': quantity, 'units': unit}
    if (infinite) {
      data.quantity = 'infinite';
    }
    
    try{
      axios.post(backendLocation + '/api/v1/users/ingredients', data)
        .then(response => {
        if(response.status === 200){
          setAddingState(false);
        }else{
          setAddItemError('Error adding item')
        }
      })
    } catch (error) {
      console.error(error)
      setAddItemError('Error adding item')
    }

    setItem('');
    setQuantity('');
    setUnit('');

    setSubmitState(false);
  }

  const getUserItems = () => {
    try{
      console.log(user)
      axios.get(backendLocation + `/api/v1/users/ingredients/${user}`)
        .then(response => {
          if(response.status === 200){
            setUserItems(response.data)
          }
        })
    }
    catch(error){
      console.error(error)
    }
  }

  const onEditClick = (ingredient) => {
    setEditingState(true)
    setItemToEdit(ingredient)
  }

  const onEditSubmit = () => {
    console.log('submitting')

    setSubmitState(true);
    if(itemToEdit === null || itemToEdit === ''){
      setEditItemError('Item Name cannot be empty')
      return;
    }
    if(quantityToEdit === null || quantityToEdit === ''){
      setEditItemError('Quantity cannot be empty')
      return;
    }

    const data = {'username': user, 'ingredient': itemToEdit, 'amount': quantityToEdit}
    try{
      axios.put(backendLocation + '/api/v1/users/ingredients/edit', data)
        .then(response => {
        if(response.status === 200){
          setEditingState(false);
          setUserItems(response.data)
        }else{
          setAddItemError('Error adding item')
        }
      })
    } catch (error) {
      console.error(error)
      setAddItemError('Error adding item')
    }

    setItemToEdit('');
    setQuantityToEdit('');
    setSubmitState(false);
  }

  const onDelete = (ingredient) => {
    console.log({'username': user, 'ingredient': ingredient})
    try{
      axios.delete(backendLocation + `/api/v1/users/ingredients/delete`, {data: {'username': user, 'ingredient': ingredient}})
        .then(response => {
          if(response.status === 200){
            setUserItems(response.data)
          }
        })
    }
    catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(userItems)
  }, [userItems])

  useEffect(() => {
    getUserItems()
  }, [])



  return (
    <div className='pageContainer min-w-[350px] md:min-w-[736px] md:w-[70%] w-[90%] bg-white rounded-2xl min-h-[95%] h-auto absolute left-[50%] translate-x-[-50%] mt-[30px] overflow-auto flex flex-col items-center'>
      
      { addingState || editingState ? <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-50'/> : null}
      {addingState ? 
        <div className='absolute h-[70%] w-[50%] bg-white left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] px-[20px] z-20 rounded-2xl flex flex-col'>
          <p className='text-center text-lg mt-[20px]'>Add Item</p>
          <FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px] absolute top-7 right-7' onClick={() => setAddingState(false)}/>

          <div><p className='text-red-500 px-[50px]'>{addItemError}</p></div>

          <input type='text' placeholder='Item Name' className='w-[90%] h-[40px] border-2 border-gray-300 rounded-md mt-[20px] mx-[auto] px-[10px]' onChange={(e) => {setItem(e.target.value)}}/>
          
          
          <label htmlFor='quantity' className='text-lg mt-[20px] text-center'>Quantity</label>
          <div><p className='text-red-500 px-[50px]'>{quanitityError}</p></div>
          <div className='flex items-center justify-center gap-2'>
            <input type='number' id='quantity' placeholder='Quantity' className='w-[80%] max-w-[250px] h-[40px] border-2 border-gray-300 rounded-md mt-[20px] mx-[auto] px-[10px]' min={1} onChange={(e) => {setQuantity(e.target.value)}}/>
            <select className='w-[90%] max-w-[250px] h-[40px] border-2 border-gray-300 rounded-md mt-[20px] mx-[auto] px-[10px]' onChange={(e) => {setUnit(e.target.value)}}>
              <option value=''>Unit</option>
              <option value='kg'>Kg</option>
              <option value='g'>g</option>
              <option value='l'>l</option>
              <option value='ml'>ml</option>
              <option value='pcs'>pcs</option>
            </select>
          </div>
        
          <button className='w-[90%] h-[40px] bg-darkraspberry text-white rounded-md mt-[20px] mx-[auto]' onClick={onSubmit}>Add</button>
          <div className='flex items-center justify-center mt-[20px]'>
            <input type='checkbox' id='infinite' />
            <label htmlFor='infinite'>Infinite</label>
          </div>
        </div>
        
      :null}

      {editingState ? 
        <div className='w-[80%] flex justify-between px-[20px] z-20 bg-white rounded-xl absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] py-2'>
          <div className='flex flex-col'>
            <input type="number" min={1} placeholder='new value' className='px-2 border-2 border-gray-600 border-solid rounded-xl' onChange={(e) => {setQuantityToEdit(e.target.value)}}/>
            <span className='text-red-600'>{editItemError}</span>
          </div>
          <button className='px-2 py-0.5 text-center border-gray-600 border-2 border-solid bg-gray-400 rounded-xl' onClick={onEditSubmit}>Submit</button>
          <FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px] ' onClick={() => setEditingState(false)}/>
        </div>

          
      :null}

        
      

      <div className='flex flex-col h-[100%] w-[94%]'>
        <div className='flex items-center justify-between'>
          <h1 className='flex items-center gap-2 text-lg'>
            <FontAwesomeIcon icon={faBackwardStep} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={() => {setPage('newrecipes')}}/>
            Inventory
          </h1>
          <FontAwesomeIcon icon={faPlus} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={() => {setAddingState(true)}}/>
        </div>

        <div className='flex flex-col gap-4 mt-[50px] justift'>
          <div className='grid items-center grid-cols-3 align-middle border-b-2'>
            <span>Item</span>
            <span>Amount</span>
            <span>Units</span>
          </div>
          {Object.entries(userItems).map(([key, value]) => {
            return (
              <div key={key} className='grid items-center grid-cols-3 align-middle'>
                <span>{value.ingredient}</span>
                <span className='flex items-center gap-2'>{value.amount}<FontAwesomeIcon className='cursor-pointer' icon={faEdit} onClick={() => {onEditClick(value.ingredient)}}/></span>
                <span className='flex items-center justify-between cursor-pointer'>{value.unit} <FontAwesomeIcon className='text-red-500 cursor-pointer' icon={faTrash} onClick={() => {onDelete(value.ingredient)}}/></span>
              </div>
            )
          })}
        </div>

        


      </div>
    </div>
  )
}
