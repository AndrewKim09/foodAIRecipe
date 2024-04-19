import React from 'react'

export const GridRecipeItem = (props) => {
  return (
    <div className='overflow-hidden cursor-pointer recipes h-[200px]'>
      <div className='recipeImage w-[100%] h-[180px] mb-[12px]'>
        <img className='w-[100%] h-[100%] object-cover' src={props.image} />
      </div>
      <h1 className='text-[20px] font-medium text-black'>{props.title}</h1>
    </div>
  )
}
