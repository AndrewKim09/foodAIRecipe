import { faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const RecipePage = (props) => {
    console.log(props)
  return (
    <div className='md:min-w-[736px] md:w-[100%] z-20 bg-white rounded-2xl h-[100%] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] overflow-auto flex flex-col justify-center items-center pageContainer recipeContainer'>
        <div className='flex flex-col w-[94%] h-[94%]'>
            <div className='recipeImage w-[100%] h-[300px] mb-[24px]'>
                <img className='w-[100%] h-[300px] object-cover z-20' src={props.image}/>
            </div>

            <h1 className='text-[40px] font-medium text-black'>{props.title}</h1>
            
            <p className='text-regular mt-[24px]'>{props.description}</p>
            
            <ul className='flex flex-col w-[100%] mt-[24px] bg-snow h-auto p-[28px]'>
                <p className='text-sm font-medium text-darkraspberry'>Preperation time</p>
                <li className='flex gap-x-4 mt-[8px] items-center'>
                        <FontAwesomeIcon icon ={faDotCircle} />
                        <span className='text-wengebrown'>{props.time}</span>
                </li>
            </ul>

            <h1 className='text-md text-brandyred mt-[24px]'>Ingredients</h1>
            <ul className='flex flex-col w-[100%] mt-[8px]'>
                {props.ingredients.map((ingredient, index) => (
                    <li key={index} className='flex gap-x-4 mt-[8px] items-center'>
                        <FontAwesomeIcon icon={faCircle} className='text-brandyred'/>
                        <span className='text-wengebrown'>{ingredient}</span>
                    </li>
                ))}
            </ul>

            <div className='w-[100%] h-[2px] bg-whitecoffee mt-[24px]'/>

            <h1 className='text-md text-brandyred mt-[24px]'>Instructions</h1>
            <ul className='flex flex-col w-[100%] mt-[8px]'>
                {props.instructions.map((instruction, index) => (
                    <li key={index} className='flex gap-x-4 mt-[8px] items-center'>
                        <b className='font-medium text-brandyred'>{index + 1}.</b>
                        <span className='text-wengebrown'>{instruction}</span>
                    </li>
                ))}
            </ul>

            <h1 className='text-md text-brandyred mt-[24px]'>Nutrition</h1>
            <p className='text-wengebrown mt-[10px] text-regular'>The table below shows nutritional values per serving without the additional fillings.</p>
            <ul className='flex flex-col w-[100%] mt-[8px]'>
                {Object.keys(props.nutrition).map((key, index) => {
                    return(
                        <div>
                            <li key={index} className='grid items-start justify-center grid-cols-2'>
                                <b className='font-medium text-wengebrown'>{key}:</b>
                                <span className='font-bold text-brandyred'>{props.nutrition[key]}</span>
                                <div></div>
                            </li>
                            <div className='w-[100%] h-[2px] bg-whitecoffee my-[10px]'/>
                        </div>
                    )
                })}
            </ul>
        </div>
    </div>
  )
}
