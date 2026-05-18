import AddMenuItems from "../Components/AddMenuItems"
import Card from "../Components/Card"
import supabase from "../Config/supabaseClient"
import { useEffect, useState } from "react"

function AdminPanel(){
    const [fetchError, setFetchError] = useState(null)
    const [menuItems, setmenuItems] = useState(null)

    function handleDelete(id){
        setmenuItems(prevMenu => {
            return menuItems.filter(m => m.id !== id)
        })
    }

    useEffect(() => {
        const fetchMenuItems = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                if(error){
                    setFetchError("Could not fetch the menu items")
                    setmenuItems(null)
                    console.log(error)
                }
                if (data){
                    setmenuItems(data)
                    setFetchError(null)
                }
            }
            fetchMenuItems()
        },[])

    return(
        <div className="min-h-screen bg-red-500">
            <header className="bg-yellow-500 py-6 px-6 shadow-md">
                <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
                <p className="text-red-500 text-sm">Manage your menu items</p>
            </header>

            <div className="py-10 px-6 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-4">Add New Item</h2>
                <AddMenuItems/>
            </div>

            <section className="py-10 px-6 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-6">Current Menu Items</h2>
                {fetchError && <p className="text-yellow-300 mb-4">{fetchError}</p>}
                {menuItems?.length === 0 && <p className="text-yellow-300">No menu items yet!</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {menuItems?.map(item => (
                        <Card key={item.id} id={item.id} title={item.title} desc={item.desc} image={item.img_url} isAdmin={true} onDelete={handleDelete}/>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default AdminPanel