import {create} from 'zustand'
import toast from 'react-hot-toast'
import axiosInstance from './../lib/axios';




const useChatStore = create((set, get)  => ({
    messages:[],
    users:[],

    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users")
            set({users: res.data})
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            set({isUsersLoading: false})
        }
    },


    getMessages: async(userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data ] })
        } catch (error) {
            console.log("Error in send message:", error);
            
            toast.error("Something went wrong")
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}))

export default useChatStore