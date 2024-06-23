import React, { useEffect } from 'react'

import { iGama } from "../../types/Interface";
import axios from 'axios';
import { url } from '../../utils/Api';
import { DatasIsaLoading } from '../isLoading/DataIsLoading';

const AllGama = () => {

  const [allGama, setAllGama] = React.useState<iGama[]>([]);
  const [loading, setLoading] = React.useState(false);

  // fetch images from gallery api
useEffect(() => {
  const fetchGama = async () => {
      setLoading(true);
    try {
      const response = await axios.get(`${url}/member/allmembersregistered`);

      setAllGama(response.data.data);

      setLoading(false);
      
    } catch (error) {
      console.error("Error getting images:", error);

      setLoading(false);
    }
  };

  fetchGama();
}, []);
  
  return (
    <div className="md:w-[100%] min-h-screen bg-gray-40 p-6 mt-[100px] ml-[40px] flex items-cente justify-center bg-white">
      <div className="w-full shadow-m h-full flex flex-col gap-7 items-center p-8">
        
          <h6 className="font-bold text-[25px] text-[#23a1db] border-b-[2px] border-b-[#23a1db] pb-2 px-2">All Registered (GAMA)</h6>
          
          {loading ? ( 
              <div className='w-full flex justify-center items-center'>
                  <DatasIsaLoading/>
                </div>
            ) : (
            <div className="w-full flex flex-wrap justify-cente gap-4">
          
              {allGama.map((gam : iGama) => (
                <div key={gam._id} className="shadow-md w-[30.5%]  p-4 rounded-md bg-white flex flex-col gap-2">
                  <div><span className='text-[#23a1db] font-bold'>Name:</span> {gam?.name}</div>

                  <div><span className='text-[#23a1db] font-bold'>Email:</span> {gam?.email}</div>

                  <div><span className='text-[#23a1db] font-bold'>Phone Number:</span> {gam?.phoneNumber}</div>

                  <div><span className='text-[#23a1db] font-bold'>When did you start attending GAC:</span> {gam?.when}</div>

                  <div><span className='text-[#23a1db] font-bold'>How did you get to know about GAC:</span> {gam?.how}</div>

                  <div><span className='text-[#23a1db] font-bold'>Will you like to be a part of the workforce? If yes, please state a unit of interest.:</span> {gam?.will}</div>
                </div>
              ))}
            </div>
          )}
      </div>

    </div>
  )
}

export default AllGama