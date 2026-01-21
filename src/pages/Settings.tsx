import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { Bell, Lock, Palette, Globe, Shield, Zap, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';
  const { theme, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        { 
          name: 'Dark Mode', 
          description: 'Use dark theme across the portal',
          state: theme === 'dark',
          toggle: toggleTheme,
          icon: theme === 'dark' ? Moon : Sun,
          isTheme: true
        },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { 
          name: 'Enable Notifications', 
          description: 'Receive updates about projects and activities',
          state: notifications,
          toggle: () => setNotifications(!notifications),
          icon: Bell,
          isTheme: false
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        { 
          name: 'Public Profile', 
          description: 'Make your profile visible to other alchemists',
          state: publicProfile,
          toggle: () => setPublicProfile(!publicProfile),
          icon: Globe,
          isTheme: false
        },
      ]
    },
    {
      title: 'Performance',
      icon: Zap,
      settings: [
        { 
          name: 'Auto-Save', 
          description: 'Automatically save your work',
          state: autoSave,
          toggle: () => setAutoSave(!autoSave),
          icon: Zap,
          isTheme: false
        },
      ]
    },
  ];

  return (
    <PortalLayout username={username}>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <div
              key={sectionIndex}
              className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <SectionIcon className="w-6 h-6 text-amber-400" />
                <h2 className="text-lg font-bold text-amber-100 tracking-wider">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => {
                  const SettingIcon = setting.icon;
                  return (
                    <div
                      key={settingIndex}
                      className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-amber-900/20 hover:bg-black/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <SettingIcon className="w-5 h-5 text-amber-400/70" />
                        <div>
                          <h3 className="text-sm font-medium text-amber-100">{setting.name}</h3>
                          <p className="text-xs text-amber-200/50 mt-1">{setting.description}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={setting.toggle}
                        className={`relative w-14 h-7 rounded-full transition-all ${
                          setting.state ? 'bg-amber-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                            setting.state ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Account Settings */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-100 tracking-wider">ACCOUNT</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-700/40 text-amber-100 rounded-lg transition-all text-left">
              <span className="text-sm font-medium">Change Password</span>
              <p className="text-xs text-amber-200/50 mt-1">Update your account password</p>
            </button>
            
            <button className="w-full px-4 py-3 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-700/40 text-teal-100 rounded-lg transition-all text-left">
              <span className="text-sm font-medium">Export Data</span>
              <p className="text-xs text-teal-200/50 mt-1">Download all your portal data</p>
            </button>
            
            <button className="w-full px-4 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-700/40 text-red-100 rounded-lg transition-all text-left">
              <span className="text-sm font-medium">Delete Account</span>
              <p className="text-xs text-red-200/50 mt-1">Permanently remove your account</p>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-amber-100 mb-4 tracking-wider">SYSTEM INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Version', value: 'v2.4.1' },
              { label: 'Build', value: '20260121' },
              { label: 'API Status', value: 'Online' },
              { label: 'Last Update', value: '2 hours ago' },
            ].map((info, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-black/20 border border-amber-900/20"
              >
                <p className="text-xs text-amber-200/50 mb-1">{info.label}</p>
                <p className="text-sm font-medium text-amber-100">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
