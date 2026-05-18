import { Link } from "react-router-dom"
import { FaEdit, FaTrash } from "react-icons/fa"
import supabase from "../Config/supabaseClient"

function Card({ id, title, desc, image, isAdmin, onDelete}) {

  const handleDelete = async () => {
    const {data, error} = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .select()

    if(error){
      console.log(error)
    }
    if(data){
      console.log(data)
      onDelete(id)
    }
  }

  return (
    <div className="bg-yellow-500 shadow p-4 rounded-lg hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-32 bg-yellow-300 object-cover rounded mb-3"/>
      <h3 className="font-semibold text-lg text-red-600">{title}</h3>
      <p className="text-sm text-red-500">{desc}</p>
      {isAdmin && (
      <div>
        <Link to={'/update/' + id}>
          <FaEdit className="bg-red-500 rounded-full text-xl cursor-pointer p-1 text-yellow-300"></FaEdit>
        </Link>
        <FaTrash onClick={handleDelete}></FaTrash>
      </div>
      )}
    </div>
  )
}
export default Card