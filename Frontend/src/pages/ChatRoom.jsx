import { NavBar } from "../NavBar"
import { useEffect, useState, useRef  } from 'react'

// for later 
{/* <div
          class="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400"
        ></div> */}
import axios from 'axios'
import Select from 'react-select'
import Stomp from "stompjs";

import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Html, ScrollControls, Scroll, } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

import { Fragment } from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BsCircleFill } from "react-icons/bs";

var stompClient = null








function Stars(props) {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ffa0e0" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}


export const ChatRoom = () => {
    const [recommendUsers, setRecommendUsers] = useState([]);

    const [toggleUser, setToggleUser] = useState([]);
    const [toggleUserImage, setToggleUserImage] = useState([]);
    const [currentUserImage, setCurrentUserImage] = useState([]);
    const [message, setMessage] = useState('');

    const [chatHistory, setChatHistory] = useState([]);
    

    useEffect(() =>{
        console.log("moved")
        getUser()
        findCurrentUserImage()
        
        stompClient = Stomp.client("ws://localhost:8080/ws");
        stompClient.connect({}, onConnected2, onError);
    }, [])

    const findCurrentUserImage = async () => {
        const res = await axios({
            method: "POST",
            withCredentials: true,
            url: "http://localhost:8080/download/photo",
            responseType: 'blob'
          })
          console.log(res.data)
          
      
          const href = URL.createObjectURL(res.data);
          setCurrentUserImage(href)
    }

    useEffect(() => {
        findToggleUserImage()
        
        getChatHistory()
        
        console.log(toggleUser)
        stompClient = Stomp.client("ws://localhost:8080/ws");
        stompClient.connect({}, onConnected2, onError);
        // so now we need to grab the chatroom from here
    }, [toggleUser])

    useEffect(() => {
        console.log(chatHistory)
        
    }, [chatHistory])

    const findToggleUserImage = async () => {
        
        let RI = toggleUser.resourceImage 
        toggleUser.resourceImage = null
        const res = await axios({
            method: "POST",
            withCredentials: true,
            url: "http://localhost:8080/download/photo/user",
            responseType: 'blob',
            data: toggleUser
            
          })
          console.log(res.data)
          
      
          const href = URL.createObjectURL(res.data);
          setToggleUserImage(href)
          toggleUser.resourceImage = RI
    }

    

    useEffect(() => {
        recommendUsers.forEach((element, index) => {
            console.log("james " + index)
            findallimages(index, element)
            
        });
        
        
        
    }, [recommendUsers])

    const findallimages = async (index, e) => {
        const res = await axios({
            method: "POST",
            withCredentials: true,
            url: "http://localhost:8080/download/photo/user",
            responseType: 'blob',
            data: e
            
          })
          console.log("locked ")
          const href = URL.createObjectURL(res.data);
          recommendUsers[index].resourceImage = href
          
          console.log(recommendUsers[0])
          console.log(res.data)

    }

    const getChatHistory = async () => {
        console.log("locked 2222")
        console.log(recommendUsers)
        const res = await axios({
            method: "POST",
            data: {
                email: localStorage.getItem('item'),
                email2: toggleUser.email,
                roomId: ""
            },
            withCredentials: true,
            url: "http://localhost:8080/chat/history",
          })
          console.log(res.data)
          setChatHistory(res.data)

        //   const res2 = await axios({
        //     method: "POST",
        //     withCredentials: true,
        //     url: "http://localhost:8080/api/v1/nb/download/photo",
        //     responseType: 'blob'
        //   })
        //   console.log(res2.data)
          
      
        //   const href = URL.createObjectURL(res2.data);
        //   setToggleUserImage(href)
    }


   
    const onError = () => {

    }


    const onConnected = (e) => {
        console.log("connected")
        // now we need to subscribe to a topic 
        
        stompClient.subscribe("/user/"+toggleUser.email+"/private", onPrivateMessageReceived)
        
        }
    
    const onConnected2 = (e) => {
    console.log("connected")
    // now we need to subscribe to a topic 
    let email = localStorage.getItem('item');
    stompClient.subscribe("/user/"+email+"/private", onPrivateMessageReceived)
    
    
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const changeSeenMessages = async () => {
        if(chatHistory[0].chatRoomId){

        
            const res = await axios({
                method: "POST",
                data: {
                    email: localStorage.getItem('item'),
                    email2: toggleUser.email,
                    roomId: chatHistory[0].chatRoomId
                },
                withCredentials: true,
                url: "http://localhost:8080/chat/seen",
            })
            console.log(res.data)
            setChatHistory(res.data)
        }
    }

    useEffect(() => {
        
        scrollToBottom()
    }, [message]);


    // so send message works 
    const sendPrivateMessage = (e) => {
        var currentdate = new Date(); 
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
        if(stompClient){
        
            let chatMessage = {
                senderName: localStorage.getItem("item"),
                receiverName: toggleUser.email,
                message: message,
                date:  datetime,
                seen: false,
                status: "MESSAGE"
        
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            e.target.value = ''
            setMessage('')
            let arr = []
        

            // than we append the list 
            if(chatHistory != [] && chatHistory != null){
                arr = chatHistory
                arr.push(chatMessage)
                console.log("nice")
                setChatHistory(arr)
            }else{
                arr = []
                arr.push(chatMessage)
                console.log("nice")
                setChatHistory(arr)

            }
            
            //   setUserData({...userData, "message":""})
        }
    }

    const onTextChange = (event) => {

        setMessage(event.target.value) //update your value here
        console.log(message)
      }

    const onPrivateMessageReceived = (payload)=> {

        var payloadData = JSON.parse(payload.body);
        
        if(payloadData.senderName == toggleUser.email || payloadData.receiverName == toggleUser.email){
          
            
            setChatHistory(chatHistory => [...chatHistory, payloadData])
            
        }  
        console.log("Kick1" )
        
        recommendUsers.forEach((user) => {
            if(user.email == payloadData.senderName){
                console.log(payloadData.message + " " + payloadData.date)
                user.seenMesssage = false
                user.lastMessage = payloadData.message + " " + payloadData.date
                console.log("Kick2")
               
            }
        })
        let arr = recommendUsers
        setRecommendUsers([])
        setRecommendUsers(arr)
        console.log("hehhehe")
        console.log(recommendUsers)
    }

    const getUser = async () => {
        await axios.get(`http://localhost:8080/users/message`, {
        withCredentials: true,
        }).then((response) => {
        
            console.log(response.data)
            setToggleUser(response.data[0])
            setRecommendUsers(response.data)
        
        
        }).catch((error) => {
        console.log(error)
        })

        

        
    }


    return (
        <>
        
        
        <NavBar></NavBar>
        <div style={{ width: "100vw", height: "100vh" }}> 
        
        
            <Canvas camera={{ position: [0, 0, 1] }}>
                
                <Stars >
                    
                </Stars>
                
                <Html zIndexRange={[0, 0]} fullscreen>
                    <div >
            
                        {toggleUser != [] ? (
                        <div class="px-5 py-5 flex   bg-indigo-900 bg-opacity-30 border-b-2">
                        <div class="font-semibold text-2xl">{toggleUser.name}</div>
                        
                            <img
                            src={toggleUserImage}
                            class="object-cover h-8 w-8 rounded-full"
                            alt=""
                            />
                    
                    
                        </div>
                        
                        
                        ) : (
                            <div></div>
                        )}
                            
                        
                            <div class="  flex flex-row justify-between bg-indigo-900 bg-opacity-30">
                            
                            <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                                
                                {/* Okay this is where we can select user start  */}
                            
                                {recommendUsers.map((user, index)=> {
                            
                                    return(
                                    <div key={index}
                                    onClick={() => setToggleUser(user)}
                                    class="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                                    >
                                        <div class="w-1/4">
                                            <img
                                            src={user.resourceImage}
                                            class="object-cover h-12 w-12 rounded-full"
                                            alt=""
                                            />
                                        </div>
                                        <div class="w-full">
                                            <div class="text-lg font-semibold">{user.name}</div>
                                            <span class="text-gray-500">{user.lastMessage}</span>
                                        </div>
                                        {!user.seenMesssage && <BsCircleFill></BsCircleFill>}
                                        

                                    </div>)
                                })}
                                
                                {/* Okay this is where we can select user end  */}
                    
                            </div>
                            
                            {/* This is the main chat feature start */}
                                
                                <div class="w-[100vw] h-[84vh] w-full px-5 flex flex-col justify-between ">
                                    <div class="flex flex-col mt-5 overflow-y-auto">
                                    
                                    
                    
                                    {chatHistory != [] ? (
                                    <>
                                    {chatHistory.map((message, index)=> {
                                    return (
                                    <div id={index}>
                    
                                    {message.senderName != toggleUser.email  ? (
                                        <div>

                                    <div 
                                    
                                    key={index}
                                    class="flex justify-end mb-4">
                                        
                                        <div
                                        class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                        >
                                        {message.message}
                                        
                                        </div>
                                        
                                    
                                        <img
                                        src={currentUserImage}
                                        class="object-cover h-8 w-8 rounded-full"
                                        alt=""
                                        />
                                        
                                    </div>
                                    <div 
                                    
                                    
                                    class="flex justify-end mb-4">
                                        <span class="text-xs text-gray-500 leading-none">{message.date}</span>
                                    </div>
                                    
                                    </div>
                                    
                    
                                ) : (
                                    
                                    <div>

                                    
                                    <div class="flex justify-start mb-4" key={index}>
                                    <img
                                    src={toggleUserImage}
                                    class="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                    />
                                    <div
                                    class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                    >
                                    {message.message}
                                    
                                    </div>
                                    
                                    </div>

                                    <div 
                                    
                                    
                                    class="flex justify-start mb-4">
                                        <span class="text-xs text-gray-500 leading-none">{toggleUser.name} {message.date}</span>
                                    </div>
                                    </div>
                                )}
                                    </div>)
                                    })}
                    
                                    </>
                    
                                    ) : (
                                        <div></div>
                                    )}
                                    
                                    </div>
                    
                                    
                    
                                    
                                    <div class="py-5" >
                                    <input
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                            
                                            sendPrivateMessage(e);
                                            //e.target.value = ''
                                            }}
                                        class="w-full bg-gray-300 py-5 px-3 rounded-xl"
                                        type="text"
                                        placeholder="type your message here..."
                                        onChange={(e) => onTextChange(e)}
                                    
                                    />
                                    
                                    </div>
                                </div>
                            
                            {/* This is the main chat feature end */}
                            
                            
                            </div>
                    </div>
                   
                   
                </Html>
                
                
                    
               
            </Canvas>
        </div>
        <button> asdfasd</button>
   

        </>
    )
}

const Root =() => {
    const navigation = [
      { name: 'Dashboard', href: '#', current: true },
      { name: 'Team', href: '#', current: false },
      { name: 'Projects', href: '#', current: false },
      { name: 'Calendar', href: '#', current: false },
    ]
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }
    
    return <>
    
    
    </>
    
    
  }