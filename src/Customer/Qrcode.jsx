import React, { useState, useEffect } from 'react';

function Qrcode() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const IP = "192.168.110.13"; 

  useEffect(() => {
    fetch(`http://${IP}:8000/api/user-inventory/1`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">កំពុងទាញយក QR...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Scan to View Products</h2>
        {data?.qr_code && (
          <img src={data.qr_code} alt="QR" className="w-64 h-64 mx-auto border-2 border-blue-500 p-2" />
        )}
        <p className="mt-4 text-gray-500 font-bold">User ID: {data?.user_id}</p>
      </div>
    </div>
  );
}

export default Qrcode;