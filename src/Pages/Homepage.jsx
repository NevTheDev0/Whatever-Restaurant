import { useEffect, useState } from "react";
import Card from "../Components/Card"
import { Link, useNavigate } from "react-router-dom";
import YouPickPizza from "../assets/YouPickPizza.jpg";
import WhateverSushi from "../assets/WhateverSushi.jpg";
import NothingBurger from "../assets/NothingBurger.jpg";
import supabase from "../Config/supabaseClient";

function Homepage(){
    const [fetchError, setFetchError] = useState(null)
    const [menuItems, setmenuItems] = useState(null)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    function handleDelete(id){
        setmenuItems(prevMenu => {
            return menuItems.filter(m => m.id !== id)
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
        navigate("/login")
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
            const getUser = async () => {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
                if (user?.user_metadata?.role === "admin") {
                    setIsAdmin(true)
                }
            }
            getUser()
        },[])

    return(<>
        <header>
            <nav className="w-full h-16 flex items-center justify-between px-6 bg-yellow-500">
                <span className="font-bold">Logo</span>
                <div className="flex gap-6">
                    <a href="#" className="hover:underline">Awesome</a>
                    {isAdmin ? (
                        <Link to="/admin" className="hover:underline">Admin Panel</Link>
                    ) : (
                        <a href="#" className="hover:underline">Cool</a>
                    )}
                    {user ? (
                        <button onClick={handleSignOut} className="hover:underline cursor-pointer">Sign Out</button>
                    ) : (
                        <Link to="/login" className="hover:underline">Login</Link>
                    )}
                </div>
            </nav>
        </header>
        <main>
            <section className="w-full h-[80vh] flex flex-col justify-center items-center bg-hungryred-500 text-center">
                <h1 className="text-4xl font-bold mb-4 text-yellow-500">The "whatever" restaurant</h1>
                <p className="mb-6 text-yellow-400">We serve food</p>
                <button className="bg-yellow-500 text-red-500 px-6 py-2 rounded transition duration-150 ease-in-out hover:bg-yellow-600 hover:text-white cursor-pointer">
                    Check out our Menu
                </button>
            </section>
            <section className="py-16 px-6 bg-red-500">
                <h2 className="text-3xl font-bold text-white text-center mb-10">Our Menu</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {menuItems?.map(item => (
                        <Card key={item.id} id={item.id} title={item.title} desc={item.desc} image={item.img_url} onDelete={handleDelete}/>
                    ))}
                </div>
            </section>
            <section className="py-16 px-6 bg-yellow-50 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">About Us</h2>
                <p className="text-gray-600 max-w-xl mx-auto">We are an Lorem Ipsum restaurant</p>
                <p className="text-gray-500 mt-4 text-sm">Open daily: 11am - 10pm</p>
                <p className="text-red-700 text-sm mt-1">123 Whatever St, New Vegas</p>
            </section>
        </main>
        <footer className="bg-yellow-500 py-6 px-6 text-center">
            <p>© 2025 The Whatever Restaurant</p>
        </footer>
    </>
    )
}
export default Homepage