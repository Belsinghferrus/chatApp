import {create} from 'zustand'
import axiosInstance from '../lib/axios.js'
import toast from 'react-hot-toast';
import Message from './../../../backend/src/models/message.model';


 const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile:false,
   


    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data})
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
    }
    
 }))


    


 export default useAuthStore