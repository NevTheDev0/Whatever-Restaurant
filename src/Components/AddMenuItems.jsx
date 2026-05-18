import { useState } from "react"
import { SupabaseClient } from "@supabase/supabase-js"
import supabase from "../Config/supabaseClient"
import { useNavigate } from "react-router-dom"

function AddMenuItems(){
    const navigate = useNavigate()


    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [formError, setFormError] = useState(null)

    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!title || !desc){
            setFormError("Please fill in all the fields correctly")
            return
        }

       const {data, error} = await supabase
        .from("menu_items")
        .insert([{title, desc}])
        .select()

        if(error){
            console.log(`There is an error ${error}`)
            setFormError('Please fill in all the fields correctly')
        }
        if(data){
            console.log(data)
            setFormError(null)
            navigate('/')

        }

    }


    return(
    <div>
        <form onSubmit={handleSubmit} className="bg-yellow-500 p-5 max-w-md mx-auto rounded-md">
            <label htmlFor="title" className="text-red-500">Title:</label>
            <input className="block w-full border border-gray-500 mt-2.5 mb-5" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

            <label htmlFor="desc" className="text-red-500">Desc:</label>
            <textarea className="block w-full border border-gray-500 mt-2.5 mb-5" id="desc" type="text" value={desc} onChange={(e) => setDesc(e.target.value)}/>

            <button className="bg-yellow-600 text-red-700 border-0 rounded-md px-4 py-2 font-sans cursor-pointer">Create Menu Item</button>
            {formError && <p className="">{formError}</p>}
        </form>

    </div>
    )
    
}
export default AddMenuItems