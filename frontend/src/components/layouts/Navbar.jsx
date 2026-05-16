import React from 'react'
import ProfileInfoCard from "../cards/ProfileInfoCard";
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.svg"

const Navbar = () => {
    return (
        <div className='h-16 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 sticky top-0 z-30'>
            <div className='container px-10 mx-auto flex items-center justify-between gap-5'>
                <Link to="/dashboard">
                    <div className='text-xl text-black flex w-7.5 font-extrabold items-center gap-1'>
                        <img src={logo} />
                        PrepIQ
                    </div>
                </Link>

                <ProfileInfoCard />
            </div>
        </div>
    )
}

export default Navbar;