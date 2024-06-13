import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'


const Stuff = () => {
const [image, setImage] = useState();

  useEffect(() => {
    getImage()
    console.log("get")
  }, [])
  
  const getImage = async () => {
    await axios.get(`http://localhost:8080/json`, {
      responseType: 'arraybuffer'
    })
            .then((response) => {
                console.log(response.data)
                let blob = new Blob(
                  [response.data], 
                  { type: response.headers['content-type'] }
                )
                let image = window.URL.createObjectURL(blob)
                setImage(image)
                
                
            //setArr(response.data)
            }).catch((error) => {
                console.log(error)
            })
  }
}

