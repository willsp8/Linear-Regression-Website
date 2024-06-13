import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import Select from 'react-select'





function App() {
  const [count, setCount] = useState(0)
  const [image, setImage] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();
  const [image4, setImage4] = useState();
  const [filet, setFilet] = useState();
  const [choices, setChoices] = useState([]);
  const [choices2, setChoices2] = useState([]);
  const [userChoice, setUserChoice] = useState()
  const [userChoice2, setUserChoice2] = useState()
  const [projectId, setProjectId] = useState('');
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    getImage()
    getImage2()
  }, [])



  
  const getImage = async () => {
    await axios.get(`http://localhost:8080/json2`, {
      responseType: 'arraybuffer',
      withCredentials: true,
    })
            .then((response) => {
              console.log(response.request.responseURL)
              if(response.request.responseURL == "http://localhost:8080/login"){
                console.log(response.url)
                document.location = response.request.responseURL
                console.log(document.location)
              }else{

              
                console.log(response.data)
                // let blob = new Blob(
                //   [response.data], 
                //   { type: response.headers['content-type'] }
                // )
                // let image = window.URL.createObjectURL(blob)

                var arrayBufferView = new Uint8Array(response.data);
                const blob = new Blob([arrayBufferView], {type:"image/jpeg"} );
                const img = window.URL.createObjectURL(blob)
                console.log(img)
                
                setImage(img)

              }
            //setArr(response.data)
            }).catch((error) => {
                console.log(error)
            })
    await axios.get('http://localhost:8080/username', {  withCredentials: true})
    .then((response) => {
        console.log(response.data)

    }).catch((e) => {

    })
  }

  

  const getImage2 = async () => {
    await axios.get(`http://localhost:8080/linear/test`, {
      responseType: 'arraybuffer',
      withCredentials: true,
    })
            .then((response) => {
                console.log(response.data)
                // let blob = new Blob(
                //   [response.data], 
                //   { type: response.headers['content-type'] }
                // )
                // let image = window.URL.createObjectURL(blob)

                var arrayBufferView = new Uint8Array(response.data);
                const blob = new Blob([arrayBufferView], {type:"image/jpeg"} );
                const img = window.URL.createObjectURL(blob)
                console.log(img)
                
                
                setImage2(img)

                

               
            //setArr(response.data)
            }).catch((error) => {
                console.log(error)
            })
  }

  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = () => {
   
      document.getElementById("csvFileInput").click();
    
  }

  const handleOnSubmit = (e) => {
    //e.preventDefault();
    console.log("jaehhehe")

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };

  const inputFileRef = useRef();

const handleBtnClick =  async () => {
  //  inputFileRef.current.click();

  if(projectId == ''){
    await axios.post(`http://localhost:8080/upload`, {
      "file": filet,
      
    },
    {
      
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log(response)
        console.log(response.data[0].columns)
        setChoices(response.data[0].columns)
        
    

        
    
    }).catch((error) => {
        console.log(error)
    })

  }else{
    await axios.post(`http://localhost:8080/upload/project`, {
      "file": filet,
      "projectId": projectId
      
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log(response)
        console.log(response.data[0].columns)
        setChoices(response.data[0].columns)
        
    

        
    
    }).catch((error) => {
        console.log(error)
    })

  }
  

}

const handleSelect =  async () => {
  //  inputFileRef.current.click();
  console.log(userChoice)
  console.log(userChoice2)

  // note make sure to add response type in order to get the image to display on screen 
  // responseType: 'arraybuffer'
  await axios.post(`http://localhost:8080/upload/regression`, {
      "file": filet,
      "independent": userChoice,
      "dependent": userChoice2
      
    },
    {
      responseType: 'arraybuffer',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true,
    }
    )
    .then((response) => {
        
  
        var arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], {type:"image/png"} );
        const img = window.URL.createObjectURL(blob)
        console.log(img)
        
        setImage3(img)

        
    
    }).catch((error) => {
        console.log(error)
    })

}


const handleOnLogout = async (e) => {
  console.log("ehhehehehe")
  await axios.post(`http://localhost:8080/logout`, {
     
    },
    {
      
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data)
      window.location.reload(); 
  
    }).catch((error) => {
        console.log(error)
    })

  
};

const handleSubmitFile = async () => {
  let arr = []
  arr.push(image)
  arr.push(image2)
  setPhotos(arr)
  console.log(arr)

  let arrayOfYourFiles=[{'files': image}, {'files2': image}]
  // create formData object
  
  let formData = new FormData(); 

  let jsonBodyData = { 'someKey': image };
    // for(let key of Object.keys(image)) {
    //   if (key !== 'length') {
    //     formData.append('files', image);
    //   }
    // }

    formData.append('files', image);
    formData.append('files', image2);
   


 
  console.log(formData)
  if(arrayOfYourFiles.length > 0){
  
    await axios.post(`http://localhost:8080/save/regression`, 
    {
      
      "photos":formData
    },
    {
      
      headers: {
        "Content-Type": "multipart/form-data"
        
      },
      withCredentials: true,
    }
    )
    .then((response) => {
      console.log(response.data)
    
    
    }).catch((error) => {
        console.log(error)
    })

    await axios.get('http://localhost:8080/files', {  withCredentials: true})
    .then((response) => {
        console.log(response.data)

    }).catch((e) => {
        console.log(e)
    })

  }
  

}

const handleCreateProject = async () => {
 
  
    await axios.post(`http://localhost:8080/create/project`, 
    {},
    {
      
      withCredentials: true,
    }
    )
    .then((response) => {
      console.log(response.data.id)
      setProjectId(response.data.id)


    
    
    }).catch((error) => {
        console.log(error)
    })
    

    console.log("hehehehehehehe22222")

    await axios.get('http://localhost:8080/get/Projects', {  withCredentials: true})
    .then((response) => {
        console.log(response.data)

    }).catch((e) => {
        console.log(e)
    })

    

  
  

}


useEffect(() => {
  let arr = []
  choices.forEach(element => {
    let arr2 = {}
    
    arr.push({ value: element, label: element })
    setChoices2(arr)
    console.log(arr)
  });

  
},[ choices])

console.log(choices2)
const handleChange = (selectedOptions) => {
  console.log(selectedOptions)
  setUserChoice({selectedOptions})
 
}

// now we are going to add an api call to to springboot that will save 
// csv file the byte array and any of the images that we upload 

//  /upload/regression
console.log(image3)

const fileSelectedHandler = (event) => {
  console.log(event.target.files[0]);
  setFilet(event.target.files[0])
};
  

  return (
    
    <>
    <button onClick={handleCreateProject}> Create Project </button>
    <button onClick={handleOnLogout}> LogOut </button>
    <button onClick={handleSubmitFile}> Submit Entire File </button>

    {choices2.length > 0 ? (
       <div>
        bobobobobobobob

        <Select onChange={(value) => setUserChoice(value.value)} options={choices2} />
        <Select  onChange={(value) => setUserChoice2(value.value)} options={choices2} />
        <button onClick={handleSelect} > Submit Linear regression </button>
        

       </div>

       
      ) : (
        <div></div>
      )}

    <div>

    <div>
  <label htmlFor="myInput">a</label>
  <input
    id="myInput"
    fileTypes={'.csv'}
    type={"file"}
    onChange={fileSelectedHandler}
 
  />
  <button onClick={handleBtnClick}> submit </button>
    </div>
    
    </div> 
    <img src={`${image}`} />
    <img src={`${image2}`} />
    <img src={`${image3}`} />
    <img src={`${image4}`} />
    </>
  )
}

export default App
