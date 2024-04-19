
import React, { useEffect, useState } from 'react'
import { NavBar } from './NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBoxArchive, faPlay, faRefresh, faX } from '@fortawesome/free-solid-svg-icons'
import { Context } from '../App'
import OpenAI from "openai"
import axios from 'axios'
import { GridRecipeItem } from './GridRecipeItem'
import { RecipePage } from './RecipePage'
import { faSave, faStar } from '@fortawesome/free-regular-svg-icons'

export const NewRecipes = () => {
  const {setPage, user, setUser, backendLocation} = React.useContext(Context)
  const [generatePageState, setGeneratePageState] = React.useState(false)
  const [generateItemError, setGenerateItemError] = React.useState('')
  const [generateState, setGenerateState] = React.useState(false)
  const [generatedRecipes, setGeneratedRecipes] = React.useState()
  const [userItems, setUserItems] = React.useState()
  const [choiceOfMeal, setChoiceOfMeal] = React.useState('')
  const [numberOfRecipes, setNumberOfRecipes] = React.useState()

  const [savedItems, setSavedItems] = useState({})

  const [clickedRecipeData, setClickedRecipeData] = useState()

  const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true})
  const unsplashkey = process.env.REACT_APP_SPLASH_API_KEY


  const getUserItems = () => {
    try{
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

  useEffect(() => {
    getUserItems()
  
  }, [])



  const onMenuClick = () => {
		document.querySelector('.navBar').classList.add('w-[400px]')
		document.querySelector('.navBar').classList.remove('w-[0%]')
		const navBarItems = document.querySelectorAll('.navBarItem')
		navBarItems.forEach(item => {
			item.style.opacity = 1
		})
	}

  const onGenerate = async() => {
    
    console.log("generating")
    if(generateState){
      console.log("already generating")
      return;
    }
    if(choiceOfMeal === ''){
      setGenerateItemError('Please select a meal')
      return;
    }
    if(isNaN(numberOfRecipes)){
      setGenerateItemError('Please enter a number')
      return;
    }
    if(numberOfRecipes < 1){
      setGenerateItemError('Please enter a number greater than 0')
      return;
    }
    if(numberOfRecipes > 5){
      setGenerateItemError('Please enter a number less than 6')
      return;
    }
    setGenerateState(true);

    const userIngredients = Object.keys(userItems).map((key) => {
      return (`${userItems[key].ingredient} (${userItems[key].amount} ${userItems[key].unit})`)
    })
  

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", 
        content: `using strictly ONLY ${userIngredients} (not including seasonings) create ${numberOfRecipes} ${choiceOfMeal} recipes and return a json object that must have the following format (if a recipe is possible) (do not add 1. 2. to instructions): 
        {'recipe#': 
          {ingredients: [], 
          instructions: [], 
          nutrition: {calories, sodium, fat, protein}, 
          servings: "", 
          time: "", 
          title: "" 
          image: "image", 
          description: ""
        } 
          
        if a recipe is not possible return the single json object: {"none": "none"}` }],
          
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" }
    })
    
    const data = JSON.parse(completion.choices[0].message.content)
    if(data['none'] === 'none'){
      console.log('no recipes')
      setGenerateItemError('No recipes could be generated')
      setGenerateState(false)
      return
    }
    console.log(data)
    
    var toSave = {}
    var promises = []

    Object.keys(data).forEach((key) => {
      toSave = {...toSave, [data[key].title]: false}
      var promise = axios.get(`https://api.unsplash.com/search/photos?client_id=${unsplashkey}&query=${data[key].title}`)
      .then(response => {
        console.log(response)
        data[key].image = response.data.results[0].urls.regular
      })
      promises.push(promise)

    })

    Promise.all(promises)
      .then(() => {
        console.log('done')
        console.log(toSave)
        setSavedItems(toSave)
        setGeneratedRecipes(data)
        console.log(data)

        setGeneratePageState(false)
        setGenerateState(false)
        setGenerateItemError('')
      })
  }

  const onClickRecipe = (data) => {
    console.log(data)
    setClickedRecipeData(data)
  }

  const onSaveClick = (title) => {
    console.log(title)
    console.log(savedItems)
    setSavedItems({...savedItems, [title]: !savedItems[title]});
  }

  const onSaveRecipe = () => {
    if(savedItems[clickedRecipeData.title] == false){
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
      return;
    }
    console.log('saving')
    if(clickedRecipeData === undefined){
      console.log('no recipe selected')
      return;
    }
    axios.put(backendLocation + '/api/v1/users/recipes/add', {
      username: user,
      title: clickedRecipeData.title,
      ingredients: clickedRecipeData.ingredients,
      instructions: clickedRecipeData.instructions,
      nutrition: clickedRecipeData.nutrition,
      servings: clickedRecipeData.servings,
      time: clickedRecipeData.time,
      image: clickedRecipeData.image
    })


  }

  const onCloseRecipe = () => {
    setClickedRecipeData(null);
    onSaveRecipe();
  }
  return (
    <div className='pageContainer min-w-[350px] md:min-w-[736px] md:w-[70%] w-[90%] bg-white rounded-2xl min-h-[95%] h-auto absolute left-[50%] translate-x-[-50%] mt-[30px] overflow-auto flex flex-col items-center'>
      {clickedRecipeData ?
        <div className='w-[100%] h-[100%]'>
          <span className='absolute z-30 top-5 right-14'>
            {!savedItems[clickedRecipeData.title] ? <FontAwesomeIcon icon={faStar} className='mr-4 cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={() => {onSaveClick(clickedRecipeData.title)}}/> : <FontAwesomeIcon icon={faStar} className='mr-4 cursor-pointer text-yellow-400 aspect-square h-[30px]' onClick={() => {onSaveClick(clickedRecipeData.title)}}/>}
            <FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={() => {onCloseRecipe()}}/>
          </span>
          <RecipePage preparation={clickedRecipeData.instructions} time={clickedRecipeData.time} ingredients={clickedRecipeData.ingredients} description={clickedRecipeData.description} instructions={clickedRecipeData.instructions} nutrition={clickedRecipeData.nutrition} title={clickedRecipeData.title} image={clickedRecipeData.image} />
        </div>
      :null}
      
      { generatePageState ? <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-50'/> : null}

      { generatePageState ? 
        <div className='w-[80%] flex justify-between items-center px-[20px] z-20 bg-white rounded-xl absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] py-2'>
          <div className='flex flex-col'>
            <select className='w-[100%] max-w-[250px] h-[40px] border-2 border-gray-300 rounded-md mx-[auto] px-[10px]' onChange={(e) => {setChoiceOfMeal(e.target.value)}}>
              <option value=''>Choice of meal</option>
              <option value='breakfast'>breakfast</option>
              <option value='lunch'>lunch</option>
              <option value='dinner'>dinner</option>
              <option value='snack'>snack</option>
              <option value='dessert'>dessert</option>
            </select>
            <span className='text-red-600'>{generateItemError}</span>
          </div>
          <input type="number" className='border-2 border-gray-300 rounded-md mx-[auto] px-[10px] w-[30%]' placeholder='# of recipes' min={1} max={5} onChange={(e) => {setNumberOfRecipes(e.target.value)}}/>
          <div className='flex items-center'>
            {generateState ? <div className='z-30 w-4 h-4 mr-2 loading'></div>: <div className="mr-6"></div>}
            <button className='px-2 py-0.5 text-center border-gray-600 border-2 border-solid bg-gray-400 rounded-xl' onClick={() => {onGenerate()}}>Generate</button>
          </div>
          <FontAwesomeIcon icon={faX} className='cursor-pointer text-darkraspberry aspect-square h-[30px] ml-2' onClick={() => setGeneratePageState(false)}/>
        </div>
      :null}

      <NavBar lastPage={'newrecipes'} setPage={setPage}/>
      <div className='flex flex-col h-[100%] w-[94%]'>
        <div className='flex items-center justify-between'>
            <h1 className='flex items-center gap-2 text-lg'>
              <FontAwesomeIcon icon={faBars} className='cursor-pointer text-darkraspberry aspect-square h-[30px]' onClick={onMenuClick} />
              New Recipes
            </h1>
            <span>
              <FontAwesomeIcon icon={faBoxArchive} alt='inventory' className='cursor-pointer text-darkraspberry aspect-square mr-[20px] h-[30px]' onClick={() => {setPage('inventory')}} />
              <FontAwesomeIcon icon={faPlay} alt='generate' className='cursor-pointer text-darkraspberry aspect-square mr-[20px] h-[30px]' onClick={() => {setGeneratePageState(true)}}/>
            </span>
        </div>

        {generatedRecipes ? 
        <div className='grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-[50px] w-[100%]'>
          {Object.keys(generatedRecipes).map((key, index) => (
            <div key={index} onClick={() => {onClickRecipe(generatedRecipes[key])}}>
              <GridRecipeItem title={generatedRecipes[key].title} image={generatedRecipes[key].image}/>
            </div>
          ))}
        </div>
        : null}
      </div>
      
    </div>
  )
}
