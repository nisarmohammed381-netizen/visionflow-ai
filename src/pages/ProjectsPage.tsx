import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Trash2, Download, Share2, Eye, Plus, Video, Grid3x3, List, Filter
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import { Link } from 'react-router-dom';

type ViewMode = 'grid' | 'list';

const statusColors: Record<string, 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'> = {
  completed: 'success',
  processing: 'accent',
  pending: 'warning',
  failed: 'error',
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user]);

  const handleDelete = async () => {
    if (!deleteProject) return;
    setDeleting(true);
    await supabase.from('projects').delete().eq('id', deleteProject.id);
    setProjects(prev => prev.filter(p => p.id !== deleteProject.id));
    setDeleteProject(null);
    setDeleting(false);
  };

  const filtered = projects.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const thumbnails = [
    'https://images.pexels.com/photos/7988210/pexels-photo-7988210.jpeg?w=300&h=169&fit=crop',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=300&h=169&fit=crop',
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?w=300&h=169&fit=crop',
    'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?w=300&h=169&fit=crop',
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-1">My Projects</h1>
            <p className="text-dark-400">{projects.length} video{projects.length !== 1 ? 's' : ''} created</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center gap-2 self-start sm:self-auto text-sm">
            <Plus className="w-4 h-4" />
            New Video
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="input-glass pl-9 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="glass border border-white/10 p-2.5 rounded-xl text-dark-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <div className="glass border border-white/10 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card border border-white/5 animate-pulse h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-card border border-white/5">
            <Video className="w-14 h-14 text-dark-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold font-poppins mb-2">
              {search ? 'No results found' : 'No videos yet'}
            </h3>
            <p className="text-dark-400 text-sm mb-6">
              {search ? 'Try a different search term' : 'Create your first AI video to see it here'}
            </p>
            {!search && (
              <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Create First Video
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="glass-card overflow-hidden p-0 border border-white/5 hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div className="relative aspect-video bg-dark-800 overflow-hidden">
                  <img
                    src={thumbnails[i % thumbnails.length]}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewProject(project)}
                        className="glass border border-white/20 text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="glass border border-white/20 text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="glass border border-white/20 text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant={statusColors[project.status]} size="sm">{project.status}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm font-poppins truncate">{project.title}</h3>
                      <p className="text-dark-400 text-xs mt-0.5 truncate">{project.prompt}</p>
                    </div>
                    <button
                      onClick={() => setDeleteProject(project)}
                      className="text-dark-500 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <span className="capitalize">{project.style}</span>
                      <span>•</span>
                      <span>{project.resolution}</span>
                    </div>
                    <span className="text-xs text-dark-500">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-4 border border-white/5 hover:border-primary-500/20 transition-all duration-200 flex items-center gap-4 group"
              >
                <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-800">
                  <img
                    src={thumbnails[i % thumbnails.length]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{project.title}</h3>
                  <p className="text-dark-400 text-xs truncate">{project.prompt}</p>
                </div>
                <Badge variant={statusColors[project.status]} size="sm">{project.status}</Badge>
                <span className="text-dark-500 text-xs hidden md:block">{project.resolution}</span>
                <span className="text-dark-500 text-xs hidden lg:block">{new Date(project.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setPreviewProject(project)} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-dark-400 hover:text-white border border-white/5 transition-colors">
                    <Eye className="w-3 h-3" />
                  </button>
                  <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-dark-400 hover:text-white border border-white/5 transition-colors">
                    <Download className="w-3 h-3" />
                  </button>
                  <button onClick={() => setDeleteProject(project)} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-dark-400 hover:text-red-400 border border-white/5 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={!!previewProject} onClose={() => setPreviewProject(null)} title={previewProject?.title} size="lg">
        {previewProject && (
          <div>
            <div className="aspect-video rounded-xl bg-dark-800 overflow-hidden mb-4">
              <img
                src={thumbnails[projects.indexOf(previewProject) % thumbnails.length] || thumbnails[0]}
                alt={previewProject.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-dark-400 text-xs mb-1">Prompt</p>
                <p className="text-white text-sm">{previewProject.prompt}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Style', value: previewProject.style },
                  { label: 'Resolution', value: previewProject.resolution },
                  { label: 'Duration', value: `${previewProject.duration}s` },
                ].map(s => (
                  <div key={s.label} className="glass rounded-xl p-3 text-center">
                    <p className="text-dark-400 text-xs">{s.label}</p>
                    <p className="text-white font-medium text-sm capitalize">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm px-4">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteProject} onClose={() => setDeleteProject(null)} title="Delete Project" size="sm">
        {deleteProject && (
          <div>
            <p className="text-dark-300 mb-6">Are you sure you want to delete <strong className="text-white">"{deleteProject.title}"</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => setDeleteProject(null)} className="btn-secondary px-6 py-2.5 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
