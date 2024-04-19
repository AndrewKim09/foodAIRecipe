
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faBarsProgress,faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Context } from '../App'

export const NavBar = () => {
  const {setPage, setUser, backendLocation} = React.useContext(Context)


	const onMenuClose =() =>{
		document.querySelector('.navBar').classList.add('w-[0%]')
		document.querySelector('.navBar').classList.remove('w-[400px]')
		const navBarItems = document.querySelectorAll('.navBarItem')
  	navBarItems.forEach(item => {
    	item.style.opacity = 0
  	})
	}
  return (
    <div className='navBar transition-all fixed top-0 bottom-0 left-0 w-[0%] flex flex-col items-center bg-gray-50' >
				<FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px] self-start ml-[10px] mt-[15px] navBarItem' onClick={onMenuClose} style={{opacity: 0}}/>
				<div className='flex flex-col items-start justify-center mt-[50px] w-[90%] gap-4'>
					
          <div className='flex items-center gap-2 cursor-pointer navBarItem' onClick={() => {setPage('userpage')}} style={{opacity: 0}}>
						<FontAwesomeIcon icon={faBarsProgress} className='text-darkraspberry aspect-square h-[30px]' />
						<h1 className='w-auto h-auto text-lg text-darkraspberry'>Your Recipe</h1>
					</div>

					<div className='flex items-center gap-2 cursor-pointer navBarItem' onClick={() => {setPage('newrecipes')}} style={{opacity: 0}}>
						<FontAwesomeIcon icon={faStar} className='text-darkraspberry aspect-square h-[30px]' />
						<h1 className='w-auto h-auto text-lg text-darkraspberry'>New Recipes</h1>
					</div>
				
        </div>

			</div>
  )
}
