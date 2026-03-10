import React from 'react';
import { X, Package, User, Calendar, DollarSign } from 'lucide-react';

const OrderDetail = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-khmer">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">ព័ត៌មានលម្អិតនៃការបញ្ជាទិញ</h2>
                        <p className="text-sm text-blue-600 font-bold">លេខកូដ: #{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-500">អ្នកបញ្ជាទិញ</p>
                                <p className="font-bold text-gray-800">{order.user?.full_name || 'មិនស្គាល់'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <Calendar className="text-green-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-500">កាលបរិច្ឆេទ</p>
                                <p className="font-bold text-gray-800">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-3">
                            <Package size={18} /> បញ្ជីទំនិញ
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2">ទំនិញ</th>
                                        <th className="px-4 py-2 text-center">ចំនួន</th>
                                        <th className="px-4 py-2 text-right">តម្លៃរាយ</th>
                                        <th className="px-4 py-2 text-right">សរុប</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {/* កន្លែង Loop បង្ហាញទំនិញលម្អិត */}
                                    {order.items?.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    {/* បង្ហាញឈ្មោះផលិតផល ប្រសិនបើរកមិនឃើញឱ្យបង្ហាញ ID ជំនួស */}
                                                    <span className="font-bold text-gray-800">
                                                        {item.product ? (item.product.name || item.product.product_name) : 'មិនស្គាល់ផលិតផល'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">កូដផលិតផល: #{item.product_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right">${Number(item.price).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                ${(item.quantity * item.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-end pt-4 border-t">
                        <div className="text-right">
                            <p className="text-gray-500">ទឹកប្រាក់សរុបដែលត្រូវបង់:</p>
                            <p className="text-3xl font-black text-blue-600">${Number(order.total_amount).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;