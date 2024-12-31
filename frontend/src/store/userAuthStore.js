import {create} from 'zustand'
import axiosInstance from '../lib/axios.js'
import toast from 'react-hot-toast';
import {io } from 'socket.io-client'

const BASE_URL = "http://localhost:5001/"

 const useAuthStore = create((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket: null,
    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data})
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({authUser:null})
        } finally {
            set({isCheckingAuth:false})
        }
    },


    signup: async(data)=>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            console.log(res.data);
            
            set({authUser: res.data})
            toast.success("Account created Successful")
            get().connectSocket();

        } catch (error) {
            console.log("Error in signUp", error);
            toast.error("Signup unsuccessful")   
        } finally {
            set({isSigningUp: false})
        }
    },

    login: async(data)=>{
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Login Successful");
            get().connectSocket();
        } catch (error) {
            toast.error("invalid credential");  
        } finally{
            set({isLoggingIn: false});
        }
    },

    logout: async()=>{
        
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Logout Successful")
            get().disconnectSocket();
        } catch (error) {
            console.log("error in logout", error);
            toast.error("Logout unsuccessful")
        } 
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile", error);
            toast.error("Error")
            
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket: () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
        }})
        socket.connect()
        set({socket : socket})
        socket.on("getOnlineUsers",  (userIds) => {
            set({onlineUsers : userIds})
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },


    
 }))


    


 export default useAuthStore