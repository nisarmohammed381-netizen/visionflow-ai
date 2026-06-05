import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Sparkles, ChevronDown, Play, Zap, Clock, Monitor, Film,
  Mic, Music, Video, Image, FileText, Check
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { VideoStyle, VideoResolution, AspectRatio } from '../types';

const videoStyles: { value: VideoStyle; label: string; icon: string; description: string }[] = [
  { value: 'cinematic', label: 'Cinematic', icon: '🎬', description: 'Hollywood-style scenes' },
  { value: 'anime', label: 'Anime', icon: '⛩️', description: 'Japanese animation style' },
  { value: 'realistic', label: 'Realistic', icon: '📸', description: 'Photo-realistic footage' },
  { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Professional ads' },
  { value: 'educational', label: 'Educational', icon: '🎓', description: 'Explainer videos' },
  { value: 'documentary', label: 'Documentary', icon: '🌍', description: 'Nature & documentary' },
  { value: 'fantasy', label: 'Fantasy', icon: '🧙', description: 'Magical fantasy worlds' },
  { value: 'gaming', label: 'Gaming', icon: '🎮', description: 'Game cinematic style' },
];

const durations = [
  { value: 5, label: '5 seconds' },
  { value: 10, label: '10 seconds' },
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
];

const resolutions: VideoResolution[] = ['720p', '1080p', '4K'];
const aspectRatios: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3'];

const voiceLanguages = [
  'English (US)', 'English (UK)', 'Spanish', 'French', 'German',
  'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Arabic',
];

const musicStyles = [
  'None', 'Epic Orchestral', 'Upbeat Electronic', 'Calm Ambient',
  'Cinematic Drama', 'Uplifting Pop', 'Dark Atmospheric', 'Jazz & Soul',
];

const creationModes = [
  { icon: FileText, label: 'Text to Video', value: 'text' },
  { icon: Image, label: 'Image to Video', value: 'image' },
  { icon: Video, label: 'Script to Video', value: 'script' },
];

export default function CreateVideoPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [mode, setMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('cinematic');
  const [duration, setDuration] = useState(15);
  const [resolution, setResolution] = useState<VideoResolution>('1080p');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [voiceLanguage, setVoiceLanguage] = useState('English (US)');
  const [backgroundMusic, setBackgroundMusic] = useState('Cinematic Drama');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;
    if ((profile?.credits ?? 0) <= 0) return;

    setGenerating(true);
    setGenerated(false);

    const title = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title,
        prompt,
        style: selectedStyle,
        duration,
        resolution,
        aspect_ratio: aspectRatio,
        status: 'processing',
      })
      .select()
      .single();

    if (!error && data) {
      setProjectId(data.id);
      // Simulate processing time
      await new Promise(r => setTimeout(r, 3000));
      await supabase.from('projects').update({ status: 'completed' }).eq('id', data.id);
      await supabase.from('profiles').update({ credits: (profile?.credits ?? 1) - 1 }).eq('id', user.id);
      await refreshProfile();
      setGenerated(true);
    }

    setGenerating(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-2">AI Video Generator</h1>
          <p className="text-dark-400">Transform your ideas into stunning AI-generated videos</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Creation mode tabs */}
            <div className="glass-card p-1 flex gap-1 border border-white/5 rounded-xl">
              {creationModes.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    mode === m.value
                      ? 'bg-primary-600 text-white shadow-glow'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="glass-card p-5 border border-white/5">
              <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary-400" />
                {mode === 'text' ? 'Describe your video' : mode === 'image' ? 'Describe the motion' : 'Enter your script'}
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={5}
                placeholder={
                  mode === 'text'
                    ? 'An astronaut walks on the surface of Mars, stunning red landscapes, cinematic lighting, dust particles floating...'
                    : mode === 'image'
                    ? 'Describe how the image should come to life, what should move, camera direction...'
                    : 'Paste your full script here. Each paragraph will become a new scene...'
                }
                className="input-glass resize-none text-sm"
                maxLength={1000}
              />
              <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                  {['Epic space journey', 'Product showcase', 'Anime adventure'].map(s => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="text-xs glass border border-white/10 text-dark-400 hover:text-white px-2 py-1 rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="text-dark-500 text-xs">{prompt.length}/1000</span>
              </div>
            </div>

            {/* Style Selector */}
            <div className="glass-card p-5 border border-white/5">
              <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                <Film className="w-4 h-4 text-secondary-400" />
                Video Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {videoStyles.map(style => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedStyle === style.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/5 bg-white/2 hover:border-white/15 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{style.icon}</span>
                    <p className="text-white text-xs font-medium">{style.label}</p>
                    <p className="text-dark-500 text-xs">{style.description}</p>
                    {selectedStyle === style.value && (
                      <div className="mt-1 flex justify-end">
                        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Resolution row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 border border-white/5">
                <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-400" />
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all duration-200 ${
                        duration === d.value
                          ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                          : 'border-white/5 text-dark-400 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5 border border-white/5">
                <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary-400" />
                  Resolution
                </label>
                <div className="flex gap-2 mb-4">
                  {resolutions.map(r => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                        resolution === r
                          ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                          : 'border-white/5 text-dark-400 hover:border-white/15 hover:text-white'
                      } ${r === '4K' && profile?.plan === 'free' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={r === '4K' && profile?.plan === 'free'}
                    >
                      {r} {r === '4K' && profile?.plan === 'free' && '🔒'}
                    </button>
                  ))}
                </div>
                <label className="text-dark-400 text-xs mb-2 block">Aspect Ratio</label>
                <div className="flex gap-2">
                  {aspectRatios.map(ar => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        aspectRatio === ar
                          ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                          : 'border-white/5 text-dark-400 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice & Music */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 border border-white/5">
                <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                  <Mic className="w-4 h-4 text-secondary-400" />
                  Voice Language
                </label>
                <div className="relative">
                  <select
                    value={voiceLanguage}
                    onChange={e => setVoiceLanguage(e.target.value)}
                    className="input-glass appearance-none pr-8 text-sm"
                  >
                    {voiceLanguages.map(lang => (
                      <option key={lang} value={lang} className="bg-dark-800">{lang}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
                </div>
              </div>

              <div className="glass-card p-5 border border-white/5">
                <label className="text-white font-semibold text-sm mb-3 block flex items-center gap-2">
                  <Music className="w-4 h-4 text-accent-400" />
                  Background Music
                </label>
                <div className="relative">
                  <select
                    value={backgroundMusic}
                    onChange={e => setBackgroundMusic(e.target.value)}
                    className="input-glass appearance-none pr-8 text-sm"
                  >
                    {musicStyles.map(m => (
                      <option key={m} value={m} className="bg-dark-800">{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating || (profile?.credits ?? 0) <= 0}
              className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed animated-gradient shadow-glow"
            >
              {generating ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating Your Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate AI Video
                  <span className="text-sm font-normal opacity-75">(-1 credit)</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-5">
            <div className="glass-card p-5 border border-white/5">
              <h3 className="text-white font-semibold font-poppins mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-primary-400" />
                Video Preview
              </h3>

              <div className="aspect-video rounded-xl bg-dark-800 border border-white/5 flex items-center justify-center overflow-hidden relative">
                {generating ? (
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary-400" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">Generating...</p>
                    <p className="text-dark-400 text-xs mt-1">This takes ~30 seconds</p>
                  </div>
                ) : generated ? (
                  <div className="w-full h-full relative">
                    <img
                      src={`https://images.pexels.com/photos/7988210/pexels-photo-7988210.jpeg?w=600&h=338&fit=crop`}
                      alt="Generated video preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-xs glass px-2 py-1 rounded-full text-white">{duration}s • {resolution}</span>
                      <span className="text-xs glass px-2 py-1 rounded-full text-accent-300">{selectedStyle}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-3">
                      <Video className="w-7 h-7 text-primary-400" />
                    </div>
                    <p className="text-dark-400 text-sm">Your video preview will appear here</p>
                  </div>
                )}
              </div>

              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex gap-2"
                >
                  <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Download
                  </button>
                  <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    Regenerate
                  </button>
                </motion.div>
              )}
            </div>

            {/* Video Settings Summary */}
            <div className="glass-card p-5 border border-white/5">
              <h3 className="text-white font-semibold text-sm mb-4 font-poppins">Settings Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Style', value: selectedStyle },
                  { label: 'Duration', value: `${duration}s` },
                  { label: 'Resolution', value: resolution },
                  { label: 'Aspect Ratio', value: aspectRatio },
                  { label: 'Voice', value: voiceLanguage },
                  { label: 'Music', value: backgroundMusic },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">{s.label}</span>
                    <span className="text-white font-medium capitalize">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credits */}
            <div className="glass-card p-4 border border-primary-500/20 bg-primary-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{profile?.credits ?? 0} credits remaining</p>
                  <p className="text-dark-400 text-xs">Each video costs 1 credit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
