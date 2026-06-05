import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, CreditCard, Code, Save, Eye, EyeOff,
  Camera, AlertCircle, CheckCircle, Copy, RefreshCw
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const sections = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'password', icon: Lock, label: 'Password' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'api', icon: Code, label: 'API' },
];

export default function SettingsPage() {
  const { profile, user, refreshProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [notifications, setNotifications] = useState({
    videoComplete: true,
    creditLow: true,
    newsletter: false,
    weeklyDigest: true,
  });

  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const fakeApiKey = 'vf_sk_' + Array(32).fill(0).map(() => Math.random().toString(36)[2]).join('');

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess(false);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user?.id);
    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSuccess(true);
      await refreshProfile();
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setSavingProfile(false);
  };

  const handleSavePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-2">Settings</h1>
        <p className="text-dark-400 mb-8">Manage your account and preferences</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="glass-card p-2 border border-white/5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 lg:w-full ${
                    activeSection === s.id
                      ? 'bg-primary-600/20 text-white border border-primary-500/20'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="glass-card p-6 border border-white/5">
                  <h2 className="text-xl font-bold font-poppins text-white mb-6">Profile Settings</h2>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-2xl font-bold text-white">
                        {initials}
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center border-2 border-dark-900">
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{profile?.full_name || 'Set your name'}</p>
                      <p className="text-dark-400 text-sm">{user?.email}</p>
                      <span className="inline-flex items-center mt-1 text-xs glass px-2 py-0.5 rounded-full capitalize border border-white/10 text-dark-300">
                        {profile?.plan} Plan
                      </span>
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Profile updated successfully
                    </div>
                  )}
                  {profileError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {profileError}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="text-dark-300 text-sm font-medium mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="input-glass"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-dark-300 text-sm font-medium mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input-glass opacity-60 cursor-not-allowed"
                      />
                      <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
                    </div>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn-primary flex items-center gap-2 disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Password Section */}
              {activeSection === 'password' && (
                <div className="glass-card p-6 border border-white/5">
                  <h2 className="text-xl font-bold font-poppins text-white mb-6">Change Password</h2>

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Password updated successfully
                    </div>
                  )}
                  {passwordError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handleSavePassword} className="space-y-5">
                    {[
                      { label: 'New Password', value: newPassword, onChange: setNewPassword, placeholder: 'Min 6 characters' },
                      { label: 'Confirm New Password', value: confirmNewPassword, onChange: setConfirmNewPassword, placeholder: 'Confirm new password' },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="text-dark-300 text-sm font-medium mb-2 block">{field.label}</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            required
                            placeholder={field.placeholder}
                            className="input-glass pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                          >
                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="btn-primary flex items-center gap-2 disabled:opacity-60"
                    >
                      {savingPassword ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="glass-card p-6 border border-white/5">
                  <h2 className="text-xl font-bold font-poppins text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'videoComplete', label: 'Video Generation Complete', desc: 'Get notified when your AI video is ready' },
                      { key: 'creditLow', label: 'Low Credit Alert', desc: 'Alert when credits drop below 2' },
                      { key: 'newsletter', label: 'Product Newsletter', desc: 'New features and platform updates' },
                      { key: 'weeklyDigest', label: 'Weekly Activity Digest', desc: 'Summary of your video creation activity' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5">
                        <div>
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-dark-400 text-xs mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-dark-600'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary mt-6 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className="space-y-5">
                  <div className="glass-card p-6 border border-white/5">
                    <h2 className="text-xl font-bold font-poppins text-white mb-6">Billing & Subscription</h2>
                    <div className="glass rounded-xl p-5 border border-primary-500/20 bg-primary-500/5 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold capitalize">{profile?.plan} Plan</p>
                          <p className="text-dark-400 text-sm">{profile?.plan === 'free' ? '$0/month' : profile?.plan === 'pro' ? '$29/month' : '$79/month'}</p>
                        </div>
                        <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-medium">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                            style={{ width: `${Math.min(100, ((profile?.credits ?? 0) / (profile?.plan === 'premium' ? 999 : profile?.plan === 'pro' ? 100 : 5)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-dark-400 text-xs">{profile?.credits ?? 0} credits left</span>
                      </div>
                    </div>
                    {profile?.plan === 'free' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="btn-primary flex items-center justify-center gap-2 text-sm">
                          Upgrade to Pro — $29/mo
                        </button>
                        <button className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 transition-all duration-200 text-sm">
                          Upgrade to Premium — $79/mo
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6 border border-white/5">
                    <h3 className="text-white font-semibold font-poppins mb-4">Payment Method</h3>
                    <div className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">•••• •••• •••• 4242</p>
                        <p className="text-dark-400 text-xs">Expires 12/26</p>
                      </div>
                      <button className="ml-auto text-primary-400 hover:text-primary-300 text-xs transition-colors">Update</button>
                    </div>
                  </div>
                </div>
              )}

              {/* API Section */}
              {activeSection === 'api' && (
                <div className="glass-card p-6 border border-white/5">
                  <h2 className="text-xl font-bold font-poppins text-white mb-2">API Access</h2>
                  <p className="text-dark-400 text-sm mb-6">Integrate VisionFlow AI into your own applications</p>

                  {profile?.plan !== 'premium' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                      <p className="text-amber-400 text-sm font-medium">API access requires Premium plan</p>
                      <p className="text-dark-400 text-xs mt-1">Upgrade to access the full REST API with video generation capabilities</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="text-dark-300 text-sm font-medium mb-2 block">API Key</label>
                      <div className="flex gap-2">
                        <div className="input-glass flex-1 text-sm font-mono text-dark-300 flex items-center">
                          {profile?.plan === 'premium' ? fakeApiKey : '••••••••••••••••••••••••••••••••'}
                        </div>
                        <button
                          onClick={copyApiKey}
                          disabled={profile?.plan !== 'premium'}
                          className="glass border border-white/10 px-4 rounded-xl text-dark-300 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {apiKeyCopied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          {apiKeyCopied ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          disabled={profile?.plan !== 'premium'}
                          className="glass border border-white/10 p-3 rounded-xl text-dark-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-5 border border-white/5">
                      <h4 className="text-white text-sm font-semibold mb-3">Quick Start</h4>
                      <pre className="text-xs text-accent-300 overflow-x-auto font-mono leading-relaxed">
{`POST https://api.visionflow.ai/v1/generate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "prompt": "Epic cinematic space journey",
  "style": "cinematic",
  "duration": 15,
  "resolution": "1080p"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
