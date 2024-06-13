import { Link } from "react-router-dom"
import { NavBar } from "../NavBar"
import { useEffect, useRef, useState } from "react"
import axios from 'axios'

export const Profile = () => {

    const [user, setUser] = useState([]);
    const [photo, setPhoto] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState([]);

    useEffect(() => {
        console.log("tess")
        getUser()
    }, [])

    const getUser = async () => {
        await axios.get(`http://localhost:8080/api/v1/nb/current/user`, {
          withCredentials: true,
        }).then((response) => {
          
                    console.log(response.data)
                    setUser(response.data)
                  
          
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
          setProfilePhoto(href)
      }

    const changeProfile = async () => {
        
        await axios.get(`http://localhost:8080/api/v1/nb/current/user`, {
          withCredentials: true,
        }).then((response) => {
          
                    console.log(response.data)
                    setUser(response.data)
                  
          
        }).catch((error) => {
          console.log(error)
        })
    }


    const fileSelectedHandler = (event) => {
        console.log(event.target.files[0]);
        setPhoto(event.target.files[0])
      };

    
    const handleSavePhoto = async () => {
    await axios.post(`http://localhost:8080/api/v1/nb/upload/photo/aws`, {
        "photo": photo,
        },
        {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        })
        .then((response) => {
        console.log(response.data)
    
            
        
        }).catch((error) => {
            console.log(error)
        })

    }

    return (
        <>
            <NavBar></NavBar>
          
  
        
            <div class="bg-white overflow-hidden shadow rounded-lg border">
                <div class="px-4 py-5 sm:px-6">
                <div class="h-32 w-32">
                    <img src={profilePhoto} class="rounded-full object-cover h-full w-full shadow-md" />
                </div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        User Profile
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                        This is some information about the user.
                    </p>
                    <Link to="/setting" >Edit</Link>
                </div>
                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl class="sm:divide-y sm:divide-gray-200">
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.name}
                            </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.email}
                            </dd>
                        </div>
                        
                    </dl>
                </div>
            </div>
            


        
        </>
    )
}