'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const blankLead = {
  project_name: '',
  company: '',
  state: '',
  source_url: '',
  status: 'New',
  priority: 'Medium',
  notes: ''
};

const statuses = ['New', 'Researching', 'Contacted', 'Qualified', 'Dead'];
const priorities = ['High', 'Medium', 'Low'];

export default function ProjectHunt() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(blankLead);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [message, setMessage] = useState('');

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(`Database error: ${error.message}`);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const haystack = `${lead.project_name} ${lead.company} ${lead.state} ${lead.notes}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      newCount: leads.filter((l) => l.status === 'New').length,
      qualified: leads.filter((l) => l.status === 'Qualified').length,
      high: leads.filter((l) => l.priority === 'High').length
    };
  }, [leads]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveLead(event) {
    event.preventDefault();
    setMessage('');

    if (!form.project_name.trim()) {
      setMessage('Project name is required.');
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('leads').update(form).eq('id', editingId);
      if (error) setMessage(`Update failed: ${error.message}`);
      else setMessage('Lead updated.');
    } else {
      const { error } = await supabase.from('leads').insert([form]);
      if (error) setMessage(`Save failed: ${error.message}`);
      else setMessage('Lead added.');
    }

    setForm(blankLead);
    setEditingId(null);
    fetchLeads();
  }

  function editLead(lead) {
    setEditingId(lead.id);
    setForm({
      project_name: lead.project_name || '',
      company: lead.company || '',
      state: lead.state || '',
      source_url: lead.source_url || '',
      status: lead.status || 'New',
      priority: lead.priority || 'Medium',
      notes: lead.notes || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteLead(id) {
    const confirmed = window.confirm('Delete this lead?');
    if (!confirmed) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) setMessage(`Delete failed: ${error.message}`);
    else setMessage('Lead deleted.');
    fetchLeads();
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">IKE PROJECT HUNT</p>
          <h1>Daily Project Lead Command Center</h1>
          <p className="subtext">Track fiber, broadband, utility, make-ready, pole attachment, and construction project opportunities.</p>
        </div>
        <button className="refresh" onClick={fetchLeads}>Refresh</button>
      </section>

      <section className="statsGrid">
        <div className="stat"><span>Total Leads</span><strong>{stats.total}</strong></div>
        <div className="stat"><span>New</span><strong>{stats.newCount}</strong></div>
        <div className="stat"><span>Qualified</span><strong>{stats.qualified}</strong></div>
        <div className="stat"><span>High Priority</span><strong>{stats.high}</strong></div>
      </section>

      <section className="card">
        <h2>{editingId ? 'Edit Lead' : 'Add New Project Lead'}</h2>
        <form onSubmit={saveLead} className="formGrid">
          <label>Project Name<input value={form.project_name} onChange={(e) => updateField('project_name', e.target.value)} placeholder="Example: County fiber expansion" /></label>
          <label>Company / Awardee<input value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Example: contractor, ISP, utility, engineering firm" /></label>
          <label>State<input value={form.state} onChange={(e) => updateField('state', e.target.value)} placeholder="CO, TX, FL..." /></label>
          <label>Source URL<input value={form.source_url} onChange={(e) => updateField('source_url', e.target.value)} placeholder="Paste project, RFP, award, or article link" /></label>
          <label>Status<select value={form.status} onChange={(e) => updateField('status', e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label>Priority<select value={form.priority} onChange={(e) => updateField('priority', e.target.value)}>{priorities.map((p) => <option key={p}>{p}</option>)}</select></label>
          <label className="full">Notes<textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Why this matters, pole volume clues, contact ideas, next step..." /></label>
          <div className="actions full">
            <button type="submit">{editingId ? 'Save Changes' : 'Add Lead'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(blankLead); }}>Cancel Edit</button>}
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="toolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </section>

      <section className="leadList">
        {loading ? <p className="empty">Loading leads...</p> : filteredLeads.length === 0 ? <p className="empty">No leads yet. Add the first one above.</p> : filteredLeads.map((lead) => (
          <article className="leadCard" key={lead.id}>
            <div className="leadHeader">
              <div>
                <h3>{lead.project_name}</h3>
                <p>{lead.company || 'No company yet'} {lead.state ? `• ${lead.state}` : ''}</p>
              </div>
              <div className="badges"><span>{lead.status}</span><span>{lead.priority}</span></div>
            </div>
            {lead.notes && <p className="notes">{lead.notes}</p>}
            {lead.source_url && <a href={lead.source_url} target="_blank" rel="noreferrer">Open source link</a>}
            <div className="leadActions">
              <button onClick={() => editLead(lead)}>Edit</button>
              <button className="danger" onClick={() => deleteLead(lead.id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
