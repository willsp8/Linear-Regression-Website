import { useEffect, useState, useRef, useMemo  } from 'react'

import '../App.css'
import axios from 'axios'
import Select from 'react-select'

import { NavBar } from '../NavBar'

import * as THREE from "three"
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber"
import { Clouds, Cloud, CameraControls, Sky as SkyImpl, StatsGl, Html } from "@react-three/drei"
import { Effects } from '@react-three/drei'
import { FilmPass, WaterPass, UnrealBloomPass, LUTPass, LUTCubeLoader } from 'three-stdlib'
import { Card, Typography } from "@material-tailwind/react";
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

 


extend({ WaterPass, UnrealBloomPass, FilmPass, LUTPass })





function LinearRegression() {
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
    const [im, setIms] = useState('')

    const [tableHead, setTableHead] = useState([])
    const [tableRows, setTableRows] = useState([])
    const[tableArray, setTableArray] = useState([])
    const [plots, setPlots] = useState([])
    const [plots2, setPlots2] = useState([])

    const TABLE_HEAD = ["Name", "Job", "Employed", ""];
 
    const TABLE_ROWS = [
      {
        name: "John Michael",
        job: "Manager",
        date: "23/04/18",
      },
      {
        name: "Alexa Liras",
        job: "Developer",
        date: "23/04/18",
      },
      {
        name: "Laurent Perrier",
        job: "Executive",
        date: "19/09/17",
      },
      {
        name: "Michael Levi",
        job: "Developer",
        date: "24/12/08",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },

    ];
  
    useEffect(() => {
      getImage()
      getImage2()
      getNN()
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

    // for this method https://saturncloud.io/blog/creating-a-blob-from-a-base64-string-in-javascript/#:~:text=BLOB%20in%20JavaScript-,To%20convert%20a%20Base64%20string%20to%20a%20BLOB%20in%20JavaScript,creates%20a%20new%20BLOB%20object.
    function base64ToBlob(base64String, contentType = '') {
      const byteCharacters = atob(base64String);
      const byteArrays = [];
  
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
    
        const byteArray = new Uint8Array(byteArrays);
        return new Blob([byteArray], { type: contentType });
    }
    
    // Function to save Blob as a text file https://saturncloud.io/blog/creating-a-blob-from-a-base64-string-in-javascript/#:~:text=BLOB%20in%20JavaScript-,To%20convert%20a%20Base64%20string%20to%20a%20BLOB%20in%20JavaScript,creates%20a%20new%20BLOB%20object.
    function saveBlobAsTextFile(blob, fileName) {

        // // --------- if you want to down load image ---------
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = fileName;
        // link.click();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        // link.download = fileName;
        // link.click();
        
        return link.href
        
    }
  

    const getNN = async () => {
      await axios.get(`http://localhost:8080/poly`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("poly 33333")
        console.log(response)
        
        
        const contentType = "image/jpeg";

        // Convert Base64 to Blob
        const blob = base64ToBlob(response.data.photo, contentType);

        // Save Blob as a text file
        let imageToDownload = saveBlobAsTextFile(blob, "example.png");
        setImage3(imageToDownload)
        
      }).catch((error) => {
          console.log(error)
      })
      
    }

    const getNNImage = async () => {

      console.log("poly222")
      console.log(image)

      // await axios.post("http://localhost:8080/poly/image",  null, 
      // { headers: { "Content-Type": "application/json; charset=UTF-8" },
      //   params: { independent: image}, //Add userID as a param 
      // }).then(response=> console.log("repsonse", response))

      
      
    }

    useEffect(() => {
      console.log("Free Time")
      console.log(image)
      //getNNImage()
    }, [im])
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

  // useEffect(() => {
  //   console.log("star wars")
  //   let data2 = []
  //   let data3 = []
  //   tableRows.map((element, index) => {
  //     const isLast = index === tableRows.length - 1;
  //     const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
  //     console.log(element)
  //     let name = element[tableHead[0]]
  //     let job = element[tableHead[1]]
  //     //let date = element[tableHead[2]]
  //     let date2 = element[tableHead[3]]

  //     data2.push({ x: element[tableHead[0]], y: element[tableHead[1]], z: 200 })
  //     data3.push({ x: element[tableHead[0]], y: element[tableHead[3]], z: 300 })
    
  //   })
  //   setPlots(data2)
  //   setPlots2(data3)
  //   console.log(plots)
  // }, [tableArray])

  useEffect(() => {
    console.log(tableArray)
    // tableArray.map((tab, ind) => {
    //   console.log(tab)
    //   console.log(ind)
    // })
    let headers =[]
    let rows = []
    let data2 = []
    let data3 = []
    
    for (let key in tableArray) {
      if(key == 0){
       
        headers = Object.keys(JSON.parse(tableArray[key]))

        

      }
      //console.log(JSON.parse(tableArray[key]))
      
      rows.push(JSON.parse(tableArray[key]))
      let element = JSON.parse(tableArray[key])
      data2.push({ x: element[headers[0]], y: element[headers[1]], z: 200 })
      data3.push({ x: element[headers[0]], y: element[headers[3]], z: 300 })
    
    }
    setPlots(data2)
    setPlots2(data3)
    setTableHead(headers)
    setTableRows(rows)

    const  TABLE_HEAD2 = ["Name", "Job", "Employed", ""];
 
  

  }, [tableArray])
  
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
          console.log(response)
    
          var arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], {type:"image/png"} );
          const img = window.URL.createObjectURL(blob)
          console.log(img)
          
          setImage3(img)
  
          
      
      }).catch((error) => {
          console.log(error)
      })

    await axios.post(`http://localhost:8080/upload/regression/data`, {
        "file": filet,
        "independent": userChoice,
        "dependent": userChoice2
        
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
          setTableArray(response.data)
          
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
  console.log(image2)
  
  const fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
    setFilet(event.target.files[0])
  };

  const data = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
  
    
  
    return (
      
      <div>
        <NavBar/>
        <div style={{ width: "100vw", height: "100vh" }}> 
            
            <Canvas linear flat legacy dpr={1} camera={{ fov: 100, position: [0, 0, 30] }}>
                <ambientLight intensity={0.01} />
                <pointLight distance={60} intensity={4} color="lightblue" />
                <spotLight intensity={0.0} position={[0, 0, 2000]} penumbra={1} color="blue" />
                
                <Swarm count={2} />
                <Swarm2></Swarm2>
                <Postpro />
                
                            
                <Html zIndexRange={[0, 0]} fullscreen>
                    <div >
                        
                        <div class="w-[100vw] h-[100vh]">
                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleCreateProject}> Create Project </button>
                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleOnLogout}> LogOut </button>
                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleSubmitFile}> Submit Entire File </button>

                            <div class="  flex flex-row justify-between bg-indigo-900 bg-opacity-30 overflow-y-auto">
                                
                    
                                <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                                    {choices2.length > 0 ? (
                                        <div>

                                        <Select onChange={(value) => setUserChoice(value.value)} options={choices2} />
                                        <Select  onChange={(value) => setUserChoice2(value.value)} options={choices2} />
                                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleSelect} > Submit Linear regression </button>
                                        

                                        </div>

                                        
                                        ) : (
                                        <div></div>
                                        )}

                                    <div>

                                    <div>
                                        <input
                                        id="myInput"
                                        fileTypes={'.csv'}
                                        type={"file"}
                                        onChange={fileSelectedHandler}

                                        />
                                        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={handleBtnClick}> submit </button>
                                    </div>
                                    
                                    </div> 
                                    
                                    
                                </div>
                               
                                <div class="w-[100vw] h-[84vh] w-full px-5 flex flex-col justify-between ">
                                <div class=" h-[5000vh] flex flex-col mt-10 overflow-y-auto">
                                {plots.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                  <ScatterChart
                                    margin={{
                                      top: 20,
                                      right: 20,
                                      bottom: 20,
                                      left: 20,
                                    }}
                                  >
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="x" name={tableHead[0]}  />
                                    <YAxis type="number" dataKey="y" name={tableHead[1]} />
                                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="score" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name="point" data={plots} fill="#8884d8" shape="circle" />
                                    <Scatter name={tableHead[3]} data={plots2} fill="#82ca9d" shape="circle" />
                                  </ScatterChart>
                                </ResponsiveContainer>) : (
                                  <div></div>
                                  )}

                                    
                                {/* {plots.length > 0 ? (
                                        <ScatterChart
                                        width={400}
                                        height={400}
                                        margin={{
                                          top: 20,
                                          right: 20,
                                          bottom: 20,
                                          left: 20,
                                        }}
                                      >
                                        <CartesianGrid />
                                        <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                                        <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="A school" data={plots} fill="#8884d8">
                                          {plots.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                          ))}
                                        </Scatter>
                                      </ScatterChart>

                                        
                                        ) : (
                                        <div></div>
                                        )} */}
                                
                                    <img src={`${image3}`} />
                                    <img src={`${image2}`} />
                                    
                                    
                                </div>
                                    <div class="flex-col mt-5 overflow-y-auto">
                                    
                                      <Card className="table-auto overflow-scroll">
                                        <table className="w-full min-w-max table-auto text-left">
                                          <thead>
                                            <tr>
                                              {tableHead.map((head) => (
                                                <th
                                                  key={head}
                                                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                  >
                                                    {head}
                                                  </Typography>
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          
                                          <tbody>
                                          {/* {tableRows.map((element, index) => {
                                            console.log(index)
                                            return (
                                              <div key={index}>
                                                {element}
                                              </div>
                                            )
                                          })} */}
                                            {tableRows.map((element, index) => {
                                              const isLast = index === tableRows.length - 1;
                                              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                              
                                              let name = element[tableHead[0]]
                                              let job = element[tableHead[1]]
                                              let date = element[tableHead[2]]
                                              let date2 = element[tableHead[3]]

                                              return (
                                                
                                                <tr key={name}>
                                                  <td className={classes}>
                                                    <Typography
                                                      variant="small"
                                                      color="blue-gray"
                                                      className="font-normal"
                                                    >
                                                      {name}
                                                    </Typography>
                                                  </td>
                                                  <td className={classes}>
                                                    <Typography
                                                      variant="small"
                                                      color="blue-gray"
                                                      className="font-normal"
                                                    >
                                                      {job}
                                                    </Typography>
                                                  </td>
                                                  <td className={classes}>
                                                    <Typography
                                                      variant="small"
                                                      color="blue-gray"
                                                      className="font-normal"
                                                    >
                                                      {date}
                                                    </Typography>
                                                  </td>
                                                  <td className={classes}>
                                                    <Typography
                                                      variant="small"
                                                      color="blue-gray"
                                                      className="font-normal"
                                                    >
                                                      {date2}
                                                    </Typography>
                                                  </td>
                                                  
                                                </tr>
                                                
                                              );
                                            })}
                                          </tbody>
                                          
                                        </table>
                                      </Card>
  
                                       
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    

                    </div>
                </Html>
            </Canvas>
        </div>
    </div>
    )
}

function Swarm({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()
    const light = useRef()
    const particles = useMemo(() => {
      const temp = []
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100
        const factor = 20 + Math.random() * 100
        const speed = 0.01 + Math.random() / 200
        const xFactor = -50 + Math.random() * 100
        const yFactor = -50 + Math.random() * 100
        const zFactor = -50 + Math.random() * 100
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
      }
      return temp
    }, [count])
    useFrame((state) => {
     // light.current.position.set((-state.mouse.x * state.viewport.width) / 5, (-state.mouse.y * state.viewport.height) / 5, 0)
      //light.current.rotation.y += 0.2
      light.current.rotation.y += 0.01
      mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
      <>
        <pointLight ref={light} distance={40} intensity={8} color="lightblue">
          <mesh scale={[1, 1, 6]} position={[5, 0, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[0, 10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[10, -10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[15, -20, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
        </pointLight>
        <instancedMesh ref={mesh} args={[null, null, count]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#020000" roughness={0.5} />
        </instancedMesh>
      </>
    )
  }
  function Swarm2({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()
    const light = useRef()
    const particles = useMemo(() => {
      const temp = []
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100
        const factor = 20 + Math.random() * 100
        const speed = 0.01 + Math.random() / 200
        const xFactor = -50 + Math.random() * 100
        const yFactor = -50 + Math.random() * 100
        const zFactor = -50 + Math.random() * 100
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
      }
      return temp
    }, [count])
    useFrame((state) => {
     // light.current.position.set((-state.mouse.x * state.viewport.width) / 5, (-state.mouse.y * state.viewport.height) / 5, 0)
      //light.current.rotation.y += 0.2
      light.current.rotation.z -= 0.01
      mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
      <>
        <pointLight ref={light} distance={40} intensity={8} color="lightblue">
          <mesh scale={[1, 1, 6]} position={[5, 0, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[0, 10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[10, -10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[15, -20, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
        </pointLight>
        <instancedMesh ref={mesh} args={[null, null, count]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#020000" roughness={0.5} />
        </instancedMesh>
      </>
    )
  }
  
  function Postpro() {
    const water = useRef()
    const data = useLoader(LUTCubeLoader, '/cubicle.CUBE')
    useFrame((state) => (water.current.time = state.clock.elapsedTime * 4))
    return (
      <Effects disableGamma>
        <waterPass ref={water} factor={1} />
        <unrealBloomPass args={[undefined, 1.25, 1, 0]} />
        <filmPass args={[0.2, 0.5, 1500, false]} />
        <lUTPass lut={data.texture} intensity={0.75} />
      </Effects>
    )
  }

export default LinearRegression


 
function DefaultTable() {
  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}ff
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {TABLE_ROWS.map(({ name, job, date }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
            return (
              
              <tr key={name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {job}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {date}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    Edit
                  </Typography>
                </td>
              </tr>
              
            );
          })}
        </tbody>
        
      </table>
    </Card>
  );
}