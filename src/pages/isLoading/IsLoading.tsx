// import React from 'react'

import { Circles } from "react-loader-spinner";
// import logo from "../../assets/images/logo.png"

const IsLoading = () => {

  return (
    <div style={{width:"100%", height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:"20px", backgroundColor:"#28166f"}}>

        {/* <i style={{fontSize:"15px", color:"#0a4757", marginBottom:"40px"}}>SWYS</i> */}

        {/* <img src={logo} className="w-[80px]" alt="Logo" /> */}

        
          <Circles
            height="80"
            width="80"
            color="#f9f9fd"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />
            
        <i style={{fontSize:"17px", color:"#f9f9fd", marginTop:"30px"}}>Loading...</i>

    </div>
  )
}

export default IsLoading