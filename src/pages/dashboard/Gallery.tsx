import React from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { iGallery } from '../../types/Interface';
import axios from 'axios';
import { url } from '../../utils/Api';
import { DatasIsaLoading } from '../isLoading/DataIsLoading';

const Gallery = () => {

    const [formData, setFormData] = React.useState<iGallery>({
        rccgGallImage: '',
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
          // Create FormData to send both file and other form data
          const formDataToSend = new FormData();
          if (formData.rccgGallImage) {
              formDataToSend.append('rccgGallImage', formData.rccgGallImage); // Correct key should be 'image'
          } else {
              throw new Error('No file selected');
          }

          const response = await axios.post(`${url}/gallery/uploadimage`, formDataToSend);
    
          console.log('Image uploaded successfully:', response.data);
    
          setFormData({
            rccgGallImage: '',
          });
          setError(null);
    
          toast.success('Image uploaded successfully');
    
        } catch (error) {
          console.error('Failed to upload Image:', error);
          setError('Failed to upload Image');
    
          toast.error('Error uploading Image. Please try again.');
    
        } finally {
          setLoading(false);
        }
      };

    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        if (name === 'rccgGallImage' && files && files.length > 0) {
            setFormData({ ...formData, rccgGallImage: files[0] });
        } else {
            setFormData({ ...formData, rccgGallImage: '' }); // Reset if no file selected
        }
    };
    


  return (
    <div className="md:w-[70%] min-h-screen bg-gray-40 p-6 mt-[100px] ml-[100px] flex items-cente justify-center bg-white">
        <div className="w-[60%] h-full flex flex-col gap-7 items-center p-8">
            <h6 className="font-bold text-[25px]">Upload Image</h6>

            <form  onSubmit={handleSubmit} className=" w-full flex flex-col gap-5">

                <div className="w-full flex flex-col gap-2">
                    <h6 className="text-[17px]">Image File</h6>
                    <input
                    type="file"
                    accept="image/*"
                    className="w-full h-[60px] border-[1px] border-gray-200 rounded-[25px] outline-none p-4"
                    name='rccgGallImage' onChange={handleChange}
                    />
                </div>

                { loading ? (
                    <div className='w-full flex items-center justify-center'>
                        <DatasIsaLoading />
                    </div>
                ) : (
                    <button type="submit" className="w-full h-[55px] rounded-[25px] bg-[#23a1db] text-white ouline-none font-bold text-[18px]">
                        Upload Image
                    </button>
                )}

                {error && <p className='text-[5px]'>{error}</p>}

            </form>
        </div>
    </div>
  )
}

export default Gallery