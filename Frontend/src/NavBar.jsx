import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
 
  MenuHandler,

  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";


import { useEffect, useState, useRef  } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import Select from 'react-select'
import Stomp from "stompjs";
import { Link,Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
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

     
 
// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];
 

 
// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];


 
function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
 
  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));
 
  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
        Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}
 
// nav list component
const navListItems = [
  {
    label: "Account",
    icon: UserCircleIcon,
  },
  {
    label: "Blocks",
    icon: CubeTransparentIcon,
  },
  {
    label: "Docs",
    icon: CodeBracketSquareIcon,
  },
];
 
function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, icon }, key) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="small"
          color="gray"
          className="font-medium text-blue-gray-500"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            <span className="text-gray-900"> {label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}





var stompClient = null
export function NavBar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

 
  const [notifications, setNotification] = useState([]);
  const [toggleUserIcon, setToggleUserIcon] = useState(false);

  const [recommendUsers2, setRecommendUsers2] = useState([]);

  const [publicChat, setPublicChat] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [toggleChatMenu, setToggleChatMenu] = useState(false);
  const [newMessages, setNewMessages] = useState(["hey"])
  

  const [photo, setPhoto] = useState([]);

  const navigate = useNavigate()
  
  const [userData, setUserData] = useState({
    username: "",
    receiverName: "",
    connected: false,
    message: ""

  })


  const handleOnLogout = async (e) => {
    
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

  useEffect(() => {
    if(window.location.href != "http://localhost:5173/"){
        checkLoggedin()
    }
    
  }, [])
  
  
  const checkLoggedin = async () => {
    await axios.get(`http://localhost:8080/users`, {
      withCredentials: true,
    }).then((response) => {
      console.log(response)
      if(response.request.responseURL == "http://localhost:8080/login"){
                console.log(response.url)
                document.location = response.request.responseURL
                console.log(document.location)
              }else{
                console.log(response.data)
                setRecommendUsers2(response.data)
              }
      
    }).catch((error) => {
      console.log(error)
    })
  
    
    await axios.get(`http://localhost:8080/user/email`, {
      withCredentials: true,
    }).then((response) => {
      if(response.request.responseURL == "http://localhost:8080/login"){
                console.log(response.url)
                document.location = response.request.responseURL
                console.log(document.location)
              }else{
                console.log(response.data)
                
                localStorage.setItem('item', response.data);
                stompClient = Stomp.client("ws://localhost:8080/ws");
                stompClient.connect({}, onConnected2, onError);
              }
      
    }).catch((error) => {
      console.log(error)
    })

    const res = await axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:8080/download/photo",
      responseType: 'blob'
    })
    console.log(res.data)
    

    const href = URL.createObjectURL(res.data);
    setPhoto(href)
    

    
  }

  const onError = () => {

  }



  const connectWithUser = ()=> {
    stompClient = Stomp.client("ws://localhost:8080/ws");
      // Stomp.connect
      // stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }

  const onConnected = (e) => {
    console.log("connected")
    // now we need to subscribe to a topic 
    stompClient.subscribe("/chatroom/public", onPublicMessageReceived)
    
    
    stompClient.subscribe("/user/"+chatUser.email+"/private", onPrivateMessageReceived)
    
    // so now we need to open the text box 
    userJoin();
  }

  const onConnected2 = (e) => {
    console.log("connected")
    // now we need to subscribe to a topic 
    let email = localStorage.getItem('item');
    stompClient.subscribe("/user/"+email+"/private", onPrivateMessageReceived)
  }

  

  

 

  const onPrivateMessageReceived = (payload)=> {
    console.log("messaege forom private " + notifications)
    let arr = []
    arr.push(1)
    setNotification(arr)
    var payloadData = JSON.parse(payload.body);
    let arr2 = ["hey"]
    setNewMessages(arr2)
    if(privateChats.get(payloadData.senderName)){
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats))
      console.log("hehehe1")
      setNewMessages(new Map("hey"))
    }else{
      console.log("hehehe2")
      let list = []
      list.push(payload)

      privateChats.set(payloadData.senderName, list)
      setPrivateChats(new Map(privateChats))
      setNewMessages(new Map(1))
    }
    
  }

  const resetNotification = () => {
    setNotification([])
  }

  const toggleMenu = () => {
    if(toggleUserIcon == false){

    }

    setNotification(false)
  }

  const handleMessage = (e) => {
    const {value, name} = e.target
    setUserData({...userData, [name]:value})
  }

  const sendPrivateMessage = () => {

    if(stompClient){

      let chatMessage = {
        senderName: userData.username,
        receiverName: chatUser.email,
        message:userData.message, 
        status: "MESSAGE"

      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({...userData, "message":""})
    }
  }


  const navigation = [
    { name: 'Dashboardddd', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  // now we need to check a user has got an email 
 
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);
 
  return (

    
    <>
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div class="z-40" className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-40">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <Link to="/dashboard" class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</Link>
                    <Link to="/regression"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Linear Regression</Link>
                    <Link to="/chatroom"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Chat</Link>
                    <Link to="/about"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">About</Link>
                    <Link to="/network" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Nerual Network</Link>
                  </div>
                </div>
              </div>
              <div class="z-[100]" className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                

                {/* notication dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                  {notifications.length > 0 ? (
                       
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        
                    </MenuButton>
                    ) : (
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </MenuButton>
                    )

                    }
                    
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        
                    {newMessages.map((user, index)=> {
                      return (<MenuItem key={index}>
                        
                        {({ focus }) => (
                            <Link to="/profile" className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Profile</Link>
                            
                        )}    
                            
                            
                        
                      </MenuItem>)
                      })}
                      
                    </MenuItems>
                  </Transition>
                </Menu>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div >
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={photo}
                        alt=""
                      />
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ focus }) => (
                            <Link to="/profile" className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Profile</Link>
                            
                          
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                            <Link to="/setting" className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Settings</Link>
          
                            
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                           <a onClick={handleOnLogout} className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
                <Link to="/dashboard" class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</Link>
                <Link to="/regression"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Linear Regression</Link>
                <Link to="/chatroom"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Chat</Link>
                <Link to="/about"  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">About</Link>
                <Link to="/network" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Nerual Network</Link>
                
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
    <Outlet></Outlet>
    </>

  );
}