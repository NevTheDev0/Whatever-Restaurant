import { useParams, useNavigate, replace } from "react-router-dom"
import { useEffect, useState } from "react"
import supabase from "../Config/supabaseClient"

function Update(){
    const {id} = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [formError, setFormError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!title || !desc){
            setFormError('Please fill in all the fields correctly')
            return
        }

        const {data, error} = await supabase
            .from('menu_items')
            .update({title, desc})
            .eq('id', id)
            .select()

        if(error){
            console.log(error)
            setFormError('Please fill in all the fields correctly')
        }
        if(data){
            console.log(data)
            setFormError(null)
            navigate('/admin')
        }
    }

    useEffect(() => {
        const fetchMenuItems = async () => {
                const {data, error} = await supabase
                .from('menu_items')
                .select()
                .eq('id', id)
                .single()

            if(error){
                navigate('/admin', {replace: true})
            }
            if(data){
                setTitle(data.title)
                setDesc(data.desc)
                console.log(data)
            }
        }

        fetchMenuItems()
    }, [id, navigate])



    return(
        <div>
            <form onSubmit={handleSubmit} className="bg-yellow-500 p-5 max-w-md mx-auto rounded-md">
                <label htmlFor="title" className="text-red-500">Title:</label>
                <input className="block w-full border border-gray-500 mt-2.5 mb-5" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

                <label htmlFor="desc" className="text-red-500">Desc:</label>
                <textarea className="block w-full border border-gray-500 mt-2.5 mb-5" id="desc" type="text" value={desc} onChange={(e) => setDesc(e.target.value)}/>

                <button className="bg-yellow-600 text-red-700 border-0 rounded-md px-4 py-2 font-sans cursor-pointer">Update Menu Item</button>
                {formError && <p className="">{formError}</p>}
            </form>
        </div>
    )
}

export default Update