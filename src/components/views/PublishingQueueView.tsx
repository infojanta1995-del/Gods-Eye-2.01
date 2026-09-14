import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Youtube,
  Facebook,
  Instagram,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
  Play,
  Share2,
  X,
} from 'lucide-react';
import { PublishingQueueItem, GodseyeProject, V2NavigationTab } from '../../types';

interface PublishingQueueViewProps {
  projects: GodseyeProject[];
  onNavigate: (tab: V2NavigationTab) => void;
}

const INITIAL_QUEUE_ITEMS: PublishingQueueItem[] = [
  {
    id: 'pq-1',
    projectId: 'demo-1',
    projectName: 'The $400 Billion Semiconductor Corridor',
    platform: 'YouTube Shorts',
    title: 'How India is quietly building the world’s next silicon hub #Tech #Geopolitics',
    caption: 'Discover the covert infrastructure racing across Gujarat and why global chipmakers are betting billions.',
    scheduledTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    status: 'SCHEDULED',
    videoDuration: '00:58',
    tags: ['#Semiconductors', '#Technology', '#Geopolitics', '#Shorts'],
  },
  {
    id: 'pq-2',
    projectId: 'demo-2',
    projectName: 'Why AI Data Centers Are Outpacing Nuclear Grids',
    platform: 'Instagram',
    title: 'The Hidden Energy Crisis Behind Every AI Search Query ⚡️',
    caption: 'Every time you prompt an LLM, a power grid in Virginia spins up. Here is the reality behind AI hyperscalers.',
    scheduledTime: new Date(Date.now() + 3600000 * 18).toISOString(),
    status: 'QUEUED',
    videoDuration: '00:45',
    tags: ['#AI', '#GreenTech', '#Energy', '#Reels'],
  },
  {
    id: 'pq-3',
    projectId: 'demo-3',
    projectName: 'Secret Geopolitical Deal Inside Iran Sanctions',
    platform: 'Facebook',
    title: 'The covert diplomatic corridor that just altered Asian trade routes forever.',
    caption: 'Exclusive intelligence breakdown on maritime shipping straits and real-time shipping reroutes.',
    scheduledTime: new Date(Date.now() + 3600000 * 36).toISOString(),
    status: 'DRAFT',
    videoDuration: '01:15',
    tags: ['#GlobalTrade', '#News', '#Documentary'],
  },
];

export const PublishingQueueView: React.FC<PublishingQueueViewProps> = ({
  projects,
  onNavigate,
}) => {
  const [items, setItems] = useState<PublishingQueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'YouTube' | 'Instagram' | 'Facebook'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for Adding Releases
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'custom');
  const [formPlatform, setFormPlatform] = useState<'YouTube Shorts' | 'Instagram' | 'Facebook'>('YouTube Shorts');
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formScheduledTime, setFormScheduledTime] = useState('');
  const [formDuration, setFormDuration] = useState('00:58');
  const [formTags, setFormTags] = useState('#GodsEye, #Viral, #Trending');

  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'YouTube') return Boolean(item.platform && item.platform.includes('YouTube'));
    return item.platform === selectedFilter;
  });

  const handleApproveAndPublish = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'PUBLISHED' } : it))
    );
    setNotification('Video packet dispatched to platform queue successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const matchedProject = projects.find((p) => p.id === formProjectId);
    const newItem: PublishingQueueItem = {
      id: `pq-${Date.now()}`,
      projectId: formProjectId,
      projectName: matchedProject?.name || 'Manual Video Release',
      platform: formPlatform,
      title: formTitle.trim(),
      caption: formCaption.trim(),
      scheduledTime: formScheduledTime ? new Date(formScheduledTime).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      status: formScheduledTime ? 'SCHEDULED' : 'QUEUED',
      videoDuration: formDuration || '00:58',
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setFormTitle('');
    setFormCaption('');
    setNotification(`Successfully added "${newItem.title.slice(0, 30)}..." to the distribution queue!`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Send className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Publishing Queue & Distribution
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-platform deployment queue for YouTube Shorts, Instagram Reels, and Facebook Video
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-add-release-modal"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-cyan-950"
          >
            <Plus className="w-4 h-4" />
            <span>Add Release to Queue</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('Scheduler')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Open Post Scheduler</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Platform Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {(['ALL', 'YouTube', 'Instagram', 'Facebook'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total in Pipeline: <span className="text-cyan-400 font-bold">{filteredItems.length}</span>
        </span>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isYouTube = Boolean(item.platform && item.platform.includes('YouTube'));
          const isInstagram = item.platform === 'Instagram';
          const isFacebook = item.platform === 'Facebook';

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c101a] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Platform badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${
                      isYouTube
                        ? 'bg-red-950/60 text-red-300 border-red-800/60'
                        : isInstagram
                        ? 'bg-pink-950/60 text-pink-300 border-pink-800/60'
                        : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                    }`}
                  >
                    {isYouTube && <Youtube className="w-3.5 h-3.5 text-red-400" />}
                    {isInstagram && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                    {isFacebook && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{item.platform}</span>
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.status === 'SCHEDULED'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : item.status === 'QUEUED'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.videoDuration && (
                    <span className="text-[11px] font-mono text-slate-400">
                      Duration: {item.videoDuration}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">{item.caption}</p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400/90 border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Actions & Timing */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-900 flex-shrink-0">
                {item.scheduledTime && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-slate-600">•</span>
                    <span>{new Date(item.scheduledTime).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {item.status !== 'PUBLISHED' && (
                    <button
                      type="button"
                      onClick={() => handleApproveAndPublish(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Approve & Deploy</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-950/40 border border-slate-800 transition-colors cursor-pointer"
                    title="Remove from Queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-[#0c101a]/50 text-center space-y-3">
            <Send className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Releases In Pipeline</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no video packets queued for {selectedFilter === 'ALL' ? 'any platform' : selectedFilter}. Add a new release to get started.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Release</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Release Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d121f] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-700/50 text-cyan-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Queue New Release</h3>
                  <span className="text-[10px] text-slate-400 font-mono">MULTI-PLATFORM DISPATCH</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Associate Project:</label>
                <select
                  value={formProjectId}
                  onChange={(e) => {
                    setFormProjectId(e.target.value);
                    const pr = projects.find((p) => p.id === e.target.value);
                    if (pr) {
                      setFormTitle(pr.name);
                      if (pr.content?.script?.coreMessage) {
                        setFormCaption(pr.content.script.coreMessage);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="custom">Custom Standalone Release</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target Network:</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Instagram">Instagram Reel</option>
                    <option value="Facebook">Facebook Video</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Estimated Duration:</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="00:58"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Release Title:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. How India is quietly building the world's next silicon hub..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Caption / Description:</label>
                <textarea
                  rows={3}
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Write post caption, hook statement, and call-to-action..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Scheduled Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={formScheduledTime}
                    onChange={(e) => setFormScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Tags (comma-separated):</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="#Shorts, #Viral, #Tech"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-new-release"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue Release</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
