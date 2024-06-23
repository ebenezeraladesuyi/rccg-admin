import React, { useEffect } from 'react'

import { iFirst} from "../../types/Interface";
import axios from 'axios';
import { url } from '../../utils/Api';
import { DatasIsaLoading } from '../isLoading/DataIsLoading';

const FirsstTimers = () => {

  const [allFirst, setAllFirst] = React.useState<iFirst[]>([]);
  const [loading, setLoading] = React.useState(false);

  // fetch data from gallery api
useEffect(() => {
  const fetchFirstTimers = async () => {
      setLoading(true);
    try {
      const response = await axios.get(`${url}/firsttimer/allfirsttimers`);

      setAllFirst(response.data.data);
    //   console.log(response.data.data)

      setLoading(false);
      
    } catch (error) {
      console.error("Error getting images:", error);

      setLoading(false);
    }
  };

  fetchFirstTimers();
}, []);
  
  return (
    <div className="md:w-[100%] min-h-screen bg-gray-40 p-6 mt-[100px] ml-[40px] flex items-cente justify-center bg-white">
      <div className="w-full shadow-m h-full flex flex-col gap-7 items-center p-8">
        
          <h6 className="font-bold text-[25px] text-[#23a1db] border-b-[2px] border-b-[#23a1db] pb-2 px-2">First-Timers Database</h6>
          
          {loading ? ( 
              <div className='w-full flex justify-center items-center'>
                  <DatasIsaLoading/>
                </div>
            ) : (
            <div className="w-full flex flex-wrap justify-cente gap-4">
          
              {allFirst && allFirst.map((timers : iFirst) => (
                <div key={timers._id} className="shadow-md w-[30.5%]  p-4 rounded-md bg-white flex flex-col gap-2">
                  <div><span className='text-[#23a1db] font-bold'>Name:</span> {timers?.name}</div>

                  <div><span className='text-[#23a1db] font-bold'>Address:</span> {timers?.address}</div>

                  <div><span className='text-[#23a1db] font-bold'>County:</span> {timers?.county}</div>

                  <div><span className='text-[#23a1db] font-bold'>Occupation:</span> {timers?.occupation}</div>

                  <div><span className='text-[#23a1db] font-bold'>Tel(Home):</span> {timers?.telHome}</div>

                  <div><span className='text-[#23a1db] font-bold'>Tel(Work):</span> {timers?.telWork}</div>

                  <div><span className='text-[#23a1db] font-bold'>Mobile:</span> {timers?.mobile}</div>

                  <div><span className='text-[#23a1db] font-bold'>Email:</span> {timers?.email}</div>

                  <div><span className='text-[#23a1db] font-bold'>Are you visiting or staying:</span> {}</div>

                  <div><span className='text-[#23a1db] font-bold'>Prayer Request:</span> {timers?.prayerRequest}</div>

                  <div><span className='text-[#23a1db] font-bold'>Have you accepted Jesus as your Saviour:</span> {timers?.haveJesus}</div>

                  <div><span className='text-[#23a1db] font-bold'>Would you like a Pastor/Counsellor to visit:</span> {timers?.pastorVisit}</div>
                </div>
              ))}
            </div>
          )}
      </div>

    </div>
  )
}

export default FirsstTimers
