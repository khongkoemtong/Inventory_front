import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FileText, Download, Printer, X, Loader2, Eye, RefreshCw, Search } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => { 
    fetchReports(); 
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/orders/read-all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.data && response.data.message) {
        setReports(response.data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- មុខងារបោះពុម្ព ---
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Invoice-ORD-${selectedOrder?.id}`,
  });

  // --- មុខងារទាញយក PDF (Fixed oklch & ReferenceError) ---
  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      console.log("Generating PDF...");
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        // ដំណោះស្រាយសម្រាប់ oklch color error
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[data-receipt="true"]');
          if (el) {
            el.style.color = '#000000';
            el.style.backgroundColor = '#ffffff';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [80, 160] 
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 80, (canvas.height * 80) / canvas.width);
      pdf.save(`Invoice-ORD-${selectedOrder.id}.pdf`);
      console.log("Download Success!");
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("មិនអាចទាញយកបានទេ ដោយសារបញ្ហា CSS ពណ៌ (oklch)។ សូមព្យាយាមបោះពុម្ព (Print) ជំនួសវិញ!");
    }
  };

  const filteredReports = reports.filter(order => {
    const orderId = `ORD-${order.id}`;
    const customerName = order.user?.full_name || "";
    return orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-khmer">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">របាយការណ៍លក់ <span className="text-blue-600 italic">Medusa</span></h1>
          <button onClick={fetchReports} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> ធ្វើបច្ចុប្បន្នភាព
          </button>
        </div>

        {/* Search Input */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-2 text-gray-400"><Search size={20} /></div>
          <input
            type="text"
            placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ ឬឈ្មោះអតិថិជន..."
            className="w-full p-2 outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
            <p>កំពុងផ្ទុកទិន្នន័យ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredReports.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-bold">PAID</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">#ORD-{order.id}</h3>
                <p className="text-sm text-gray-500 mb-4">{order.user?.full_name || 'Guest Customer'}</p>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium flex justify-center items-center hover:bg-blue-600 transition-colors"
                >
                  <Eye size={16} className="mr-2" /> ពិនិត្យវិក្កយបត្រ
                </button>
              </div>
            ))}
          </div>
        )}

        {/* --- RECEIPT MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-800">វិក្កយបត្រឌីជីថល</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 bg-gray-50 flex justify-center">
                {/* កន្លែង Print/Capture (ប្រើ Inline Style ដើម្បី Fix Color Error) */}
                <div
                  ref={receiptRef}
                  data-receipt="true"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    width: '80mm',
                    padding: '25px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', letterSpacing: '1px' }}>MEDUSA STORE</h2>
                    <p style={{ margin: '4px 0', fontSize: '10px' }}>Phnom Penh, Cambodia</p>
                    <p style={{ margin: '2px 0', fontSize: '10px' }}>Tel: 012-345-678</p>
                    <div style={{ borderBottom: '1px dashed #000', margin: '15px 0' }}></div>
                  </div>

                  <div style={{ marginBottom: '15px', fontSize: '11px' }}>
                    <p style={{ margin: '4px 0' }}>Invoice: ORD-{selectedOrder.id}</p>
                    <p style={{ margin: '4px 0' }}>Date: {new Date(selectedOrder.created_at).toLocaleString('km-KH')}</p>
                    <p style={{ margin: '4px 0' }}>Customer: {selectedOrder.user?.full_name || 'General'}</p>
                  </div>

                  <div style={{ borderBottom: '1px dashed #000', margin: '15px 0' }}></div>

                  <table style={{ width: '100%', marginBottom: '15px', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid #000' }}>
                        <th style={{ paddingBottom: '8px' }}>ទំនិញ</th>
                        <th style={{ paddingBottom: '8px', textAlign: 'center' }}>ចំនួន</th>
                        <th style={{ paddingBottom: '8px', textAlign: 'right' }}>សរុប</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{item.product?.name || 'Product'}</td>
                          <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>x{item.quantity}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', verticalAlign: 'top' }}>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ borderBottom: '1px dashed #000', margin: '15px 0' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
                    <span>សរុបរួម:</span>
                    <span>${Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>

                  <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', margin: '0', fontSize: '14px' }}>សូមអរគុណ!</p>
                    <p style={{ fontSize: '10px', marginTop: '5px', color: '#666' }}>ទំនិញទិញហើយមិនអាចប្តូរវិញបានទេ</p>
                    <div style={{ marginTop: '15px', height: '40px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '6px', fontSize: '12px', border: '1px solid #eee' }}>
                      *ORD{selectedOrder.id}*
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 border-t bg-white grid grid-cols-2 gap-4">
                <button onClick={handlePrint} className="bg-gray-100 text-gray-800 py-4 rounded-2xl flex justify-center items-center hover:bg-gray-200 font-bold transition-all active:scale-95">
                  <Printer size={20} className="mr-2" /> បោះពុម្ព
                </button>
                <button onClick={downloadPDF} className="bg-blue-600 text-white py-4 rounded-2xl flex justify-center items-center hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <Download size={20} className="mr-2" /> ទាញយក PDF
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;