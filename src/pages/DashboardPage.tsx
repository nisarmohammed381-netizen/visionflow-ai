import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Video, TrendingUp, Zap, Clock, Plus, ArrowRight, Eye, Download, Sparkles,
  BarChart3, Play
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

const quickActions = [
  { icon: Zap, label: 'Text to Video', color: 'from-primary-600 to-primary-700', path: '/create?type=text' },
  { icon: Play, label: 'Image to Video', color: 'from-secondary-600 to-secondary-700', path: '/create?type=image' },
  { icon: Video, label: 'Script to Video', color: 'from-accent-600 to-accent-700', path: '/create?type=script' },
  { icon: Sparkles, label: 'Templates', color: 'from-pink-600 to-pink-700', path: '/templates' },
];

const statusColors: Record<string, string> = {
  completed: 'success',
  processing: 'accent',
  pending: 'warning',
  failed: 'error',
};

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setProjects((data as Project[]) || []);
      setLoadingProjects(false);
    })();
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'Creator';

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white">
              {greeting()}, {firstName}! 👋
            </h1>
            <p className="text-dark-400 mt-1">
              You have <span className="text-primary-400 font-semibold">{profile?.credits ?? 0} credits</span> remaining
            </p>
          </div>
          <Link to="/create" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Create New Video
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Video className="w-5 h-5" />}
            label="Total Videos"
            value={String(projects.length)}
            color="primary"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Credits Left"
            value={String(profile?.credits ?? 0)}
            color="accent"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Plan"
            value={profile?.plan?.charAt(0).toUpperCase() + (profile?.plan?.slice(1) ?? '')}
            color="secondary"
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="This Month"
            value={String(projects.filter(p => {
              const d = new Date(p.created_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length)}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-white font-semibold font-poppins mb-4">Quick Create</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <motion.div key={action.label} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={action.path}
                  className="glass-card p-5 flex flex-col items-center gap-3 border border-white/5 hover:border-primary-500/30 transition-all duration-200 text-center group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark-300 group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold font-poppins">Recent Projects</h2>
            <Link to="/projects" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card h-16 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card p-12 border border-white/5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold font-poppins mb-2">No videos yet</h3>
              <p className="text-dark-400 text-sm mb-6">Create your first AI video to get started</p>
              <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Create Your First Video
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 border border-white/5 hover:border-primary-500/20 transition-all duration-200 flex items-center gap-4"
                >
                  <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-primary-600/30 to-secondary-600/30 flex items-center justify-center flex-shrink-0 border border-white/5">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Video className="w-4 h-4 text-primary-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{project.title}</p>
                    <p className="text-dark-400 text-xs truncate">{project.prompt}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={statusColors[project.status] as any} size="sm">
                      {project.status}
                    </Badge>
                    <span className="text-dark-500 text-xs hidden sm:block">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-dark-400 hover:text-white transition-colors border border-white/5">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-dark-400 hover:text-white transition-colors border border-white/5">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Banner if free */}
        {profile?.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border border-primary-500/30 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold font-poppins">Upgrade to Pro</h3>
                  <p className="text-dark-400 text-sm">Get 100 videos/month, 1080p, AI Voiceover & more</p>
                </div>
              </div>
              <Link to="/pricing" className="btn-primary text-sm flex items-center gap-2 flex-shrink-0">
                <Zap className="w-4 h-4" />
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
