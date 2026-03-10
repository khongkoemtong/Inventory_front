import React, { useState } from 'react';
import { 
  Save, 
  Bell, 
  DollarSign, 
  Calendar, 
  Package, 
  Shield, 
  User, 
  Mail,
  Globe,
  Moon,
  Sun,
  Check,
  AlertCircle
} from 'lucide-react';

const SettingsComponent = () => {
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ការកំណត់ការជូនដំណឹង
  const [notifications, setNotifications] = useState({
    lowStock: true,
    orderConfirmations: true,
    weeklyReports: true,
    supplierUpdates: false,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  });

  // កម្រិតកំណត់ស្តុក
  const [thresholds, setThresholds] = useState({
    minimumStockLevel: 20,
    reorderPoint: 50,
    maxStockLevel: 500,
    criticalStockLevel: 10,
  });

  // ការកំណត់ទូទៅ
  const [generalSettings, setGeneralSettings] = useState({
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Phnom_Penh',
    language: 'km',
    theme: 'light',
  });

  // ការកំណត់គណនី
  const [accountSettings, setAccountSettings] = useState({
    companyName: 'ក្រុមហ៊ុនអុីនវេនធូរីរបស់ខ្ញុំ',
    email: 'admin@inventory.com',
    phone: '+855 (012) 345-678',
    address: 'ផ្ទះលេខ ១២៣, ភ្នំពេញ, កម្ពុជា',
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasUnsavedChanges(true);
  };

  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
    setHasUnsavedChanges(true);
  };

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleAccountSettingChange = (key, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    if (thresholds.minimumStockLevel >= thresholds.reorderPoint) {
      alert('ចំណុចបញ្ជាទិញឡើងវិញត្រូវតែធំជាងកម្រិតស្តុកអប្បបរមា');
      return;
    }

    if (thresholds.criticalStockLevel >= thresholds.minimumStockLevel) {
      alert('កម្រិតស្តុកប្រកាសអាសន្នត្រូវតែតិចជាងកម្រិតស្តុកអប្បបរមា');
      return;
    }

    setShowSaveNotification(true);
    setHasUnsavedChanges(false);

    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់កំណត់ការកំណត់ទាំងអស់ទៅជាដើមវិញមែនទេ?')) {
      // Logic សម្រាប់កំណត់ទៅដើមវិញ...
      setHasUnsavedChanges(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-kantumruy">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ចំណងជើង */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">ការកំណត់</h1>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle size={16} />
              <span>អ្នកមានការផ្លាស់ប្តូរដែលមិនទាន់បានរក្សាទុក</span>
            </div>
          )}
        </div>

        {/* ការជូនដំណឹងពេលរក្សាទុកជោគជ័យ */}
        {showSaveNotification && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Check className="text-green-600 mr-3" size={20} />
              <p className="text-green-800 font-medium">បានរក្សាទុកការកំណត់ដោយជោគជ័យ!</p>
            </div>
          </div>
        )}

        {/* ការកំណត់ការជូនដំណឹង */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="text-blue-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">ចំណូលចិត្តការជូនដំណឹង</h3>
            </div>
            <p className="text-sm text-gray-600">គ្រប់គ្រងរបៀបដែលអ្នកទទួលបានការដាស់តឿន</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="text-gray-800 font-medium">ការដាស់តឿនស្តុកទាប</p>
                  <p className="text-sm text-gray-500">ជូនដំណឹងនៅពេលទំនិញជិតអស់ពីស្តុក</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.lowStock} onChange={() => handleNotificationChange('lowStock')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="text-gray-800 font-medium">ការបញ្ជាក់ការបញ្ជាទិញ</p>
                  <p className="text-sm text-gray-500">ទទួលបានព័ត៌មានថ្មីៗអំពីស្ថានភាពបញ្ជាទិញ</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.orderConfirmations} onChange={() => handleNotificationChange('orderConfirmations')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">បណ្តាញជូនដំណឹង</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">អុីមែល</span>
                  </div>
                  <input type="checkbox" checked={notifications.emailNotifications} onChange={() => handleNotificationChange('emailNotifications')} className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Push</span>
                  </div>
                  <input type="checkbox" checked={notifications.pushNotifications} onChange={() => handleNotificationChange('pushNotifications')} className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">SMS</span>
                  </div>
                  <input type="checkbox" checked={notifications.smsNotifications} onChange={() => handleNotificationChange('smsNotifications')} className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* កម្រិតកំណត់ស្តុក */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Package className="text-green-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">កម្រិតកំណត់ស្តុក</h3>
            </div>
            <p className="text-sm text-gray-600">កំណត់ចំណុចបញ្ជាទិញឡើងវិញ និងកម្រិតស្តុកដោយស្វ័យប្រវត្តិ</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">កម្រិតស្តុកប្រកាសអាសន្ន</label>
                <input type="number" value={thresholds.criticalStockLevel} onChange={(e) => handleThresholdChange('criticalStockLevel', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <p className="text-xs text-gray-500 mt-1">ដាស់តឿននៅពេលស្តុកដល់កម្រិតគ្រោះថ្នាក់នេះ</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">កម្រិតស្តុកអប្បបរមា</label>
                <input type="number" value={thresholds.minimumStockLevel} onChange={(e) => handleThresholdChange('minimumStockLevel', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <p className="text-xs text-gray-500 mt-1">បរិមាណស្តុកតិចបំផុតដែលអាចទទួលយកបាន</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ចំណុចបញ្ជាទិញឡើងវិញ</label>
                <input type="number" value={thresholds.reorderPoint} onChange={(e) => handleThresholdChange('reorderPoint', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <p className="text-xs text-gray-500 mt-1">ចំណុចសម្រាប់ចាប់ផ្តើមកម្ម៉ង់ទំនិញថ្មី</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">កម្រិតស្តុកអតិបរមា</label>
                <input type="number" value={thresholds.maxStockLevel} onChange={(e) => handleThresholdChange('maxStockLevel', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <p className="text-xs text-gray-500 mt-1">សមត្ថភាពផ្ទុកអតិបរមានៃឃ្លាំង</p>
              </div>
            </div>

            {/* បន្ទាត់បង្ហាញកម្រិតស្តុក */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">ការបង្ហាញកម្រិតស្តុក</p>
              <div className="relative h-8 bg-white rounded-lg border border-gray-300 overflow-hidden">
                <div className="absolute h-full bg-red-200" style={{ width: `${(thresholds.criticalStockLevel / thresholds.maxStockLevel) * 100}%` }}></div>
                <div className="absolute h-full bg-yellow-200" style={{ left: `${(thresholds.criticalStockLevel / thresholds.maxStockLevel) * 100}%`, width: `${((thresholds.minimumStockLevel - thresholds.criticalStockLevel) / thresholds.maxStockLevel) * 100}%` }}></div>
                <div className="absolute h-full bg-blue-200" style={{ left: `${(thresholds.minimumStockLevel / thresholds.maxStockLevel) * 100}%`, width: `${((thresholds.reorderPoint - thresholds.minimumStockLevel) / thresholds.maxStockLevel) * 100}%` }}></div>
                <div className="absolute h-full bg-green-200" style={{ left: `${(thresholds.reorderPoint / thresholds.maxStockLevel) * 100}%`, width: `${((thresholds.maxStockLevel - thresholds.reorderPoint) / thresholds.maxStockLevel) * 100}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>0</span>
                <span className="text-red-600">អាសន្ន</span>
                <span className="text-yellow-600">ទាប</span>
                <span className="text-blue-600">ទិញថែម</span>
                <span className="text-green-600">ល្អ</span>
                <span>{thresholds.maxStockLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ការកំណត់ទូទៅ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Globe className="text-purple-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">ការកំណត់ទូទៅ</h3>
            </div>
            <p className="text-sm text-gray-600">កំណត់តំបន់ និងចំណង់ចំណូលចិត្តការបង្ហាញ</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} /> រូបិយប័ណ្ណ
                </label>
                <select value={generalSettings.currency} onChange={(e) => handleGeneralSettingChange('currency', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option value="USD">ដុល្លារ ($)</option>
                  <option value="KHR">រៀល (៛)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} /> ទម្រង់កាលបរិច្ឆេទ
                </label>
                <select value={generalSettings.dateFormat} onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option value="DD/MM/YYYY">ថ្ងៃ/ខែ/ឆ្នាំ</option>
                  <option value="MM/DD/YYYY">ខែ/ថ្ងៃ/ឆ្នាំ</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">ស្បែក (Theme)</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleGeneralSettingChange('theme', 'light')} className={`p-4 rounded-lg border-2 ${generalSettings.theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <Sun size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">ភ្លឺ</p>
                </button>
                <button onClick={() => handleGeneralSettingChange('theme', 'dark')} className={`p-4 rounded-lg border-2 ${generalSettings.theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <Moon size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">ងងឹត</p>
                </button>
                <button onClick={() => handleGeneralSettingChange('theme', 'auto')} className={`p-4 rounded-lg border-2 ${generalSettings.theme === 'auto' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                  <Globe size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">ស្វ័យប្រវត្តិ</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ប៊ូតុងសកម្មភាព */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleSaveSettings} className="flex-1 sm:flex-initial inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            <Save size={20} className="mr-2" />
            រក្សាទុកការកំណត់
          </button>
          <button onClick={handleResetToDefaults} className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            កំណត់ទៅដើមវិញ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;