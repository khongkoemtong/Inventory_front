import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProductForm from './form/ProductForm'; // ផ្លូវទៅកាន់ Form ដែលយើងកែមុននេះ

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (submitData) => {
    try {
      // បង្ហាញផ្ទាំង Loading ពេលកំពុងផ្ញើទៅ Backend
      Swal.fire({
        title: 'កំពុងរក្សាទុក...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false
      });

      const res = await axios.post('http://127.0.0.1:8000/api/product/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data' // ចាំបាច់បំផុតសម្រាប់ Upload រូបភាព
        }
      });

      if (res.status === 200 || res.status === 201) {
        Swal.close();
        await Swal.fire('ជោគជ័យ!', 'ផលិតផលត្រូវបានបន្ថែមដោយជោគជ័យ', 'success');
        navigate('/products'); // បោះជំហានទៅទំព័របញ្ជីវិញ
      }
    } catch (err) {
      Swal.close();
      console.error("API Error:", err.response?.data);
      Swal.fire('Error', err.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">គ្រប់គ្រងផលិតផល</h1>
        <p className="text-gray-500">បំពេញព័ត៌មានខាងក្រោមដើម្បីបន្ថែមផលិតផលថ្មី</p>
      </div>
      
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProduct;