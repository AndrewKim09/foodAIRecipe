
import { faBars, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { GridRecipeItem } from './GridRecipeItem'
import { NavBar } from './NavBar'
import { Context } from '../App'
import axios from 'axios'
import { RecipePage } from './RecipePage'

export const UserPage = () => {
	const {setPage, user, setUser, backendLocation} = React.useContext(Context)
	const [clickedRecipeData, setClickedRecipeData] = React.useState()
	const [userRecipes, setUserRecipes] = React.useState();
	const onMenuClick = () => {
		document.querySelector('.navBar').classList.add('w-[400px]')
		document.querySelector('.navBar').classList.remove('w-[0%]')
		const navBarItems = document.querySelectorAll('.navBarItem')
		navBarItems.forEach(item => {
			item.style.opacity = 1
		})
	}

	const onLoad = () => {
		axios.get(backendLocation + `/api/v1/users/recipes/get/${user}`)
		.then(res => {
			console.log(res.data)
			setUserRecipes(res.data)
		})
	}

	const onDelete = () => {
		console.log('deleting recipe')
		axios.delete(backendLocation + '/api/v1/users/recipes/delete', {
			data: {
				username: user,
				title: clickedRecipeData.title
			}
		})
		.then(response => {
			console.log(response)
		})

		setUserRecipes(userRecipes.filter(recipe => recipe.title !== clickedRecipeData.title))
		setClickedRecipeData(null)

	}


	useEffect(() => {
		onLoad()
	}, []) 

	return (
		<div className='pageContainer min-w-[350px] md:min-w-[736px] md:w-[70%] w-[90%] bg-white rounded-2xl min-h-[95%] h-auto absolute left-[50%] translate-x-[-50%] mt-[30px] overflow-auto flex flex-col items-center'>
			{clickedRecipeData ?
        <div className='w-[100%] h-[100%]'>
          <span className='absolute z-30 top-5 right-14'>
            <FontAwesomeIcon icon={faTrash} className='cursor-pointer text-darkraspberry aspect-square h-[30px] mr-4' onClick={() => {onDelete()}}/>
            <FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={() => setClickedRecipeData(null)}/>
          </span>
          <RecipePage preparation={clickedRecipeData.instructions} time={clickedRecipeData.time} ingredients={clickedRecipeData.ingredients} instructions={clickedRecipeData.instructions} nutrition={clickedRecipeData.nutrition} title={clickedRecipeData.title} image={clickedRecipeData.image} page={"user"}/>
        </div>
      :null}

			<NavBar lastPage={'userpage'} setPage={setPage}/>
			
			<div className='flex flex-col h-[100%] w-[94%]'>

			<h1 className='flex items-center gap-2 text-lg'>
				<FontAwesomeIcon icon={faBars} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={onMenuClick} />
				Your Recipe
			</h1>


				<div className='grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-[50px]'>
					{userRecipes && userRecipes.map((recipe, index) => {
						return(
							<span key={index} onClick={() => {setClickedRecipeData(recipe)}}>
								<GridRecipeItem key={index} image={recipe.image} title={recipe.title} />
							</span>
						)
					})}

				</div>
			</div>


		</div>
	)
}
