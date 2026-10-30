import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, Bell, Bus, CalendarClock, Check, ChevronDown,
  CircleHelp, Clock3, Compass, GraduationCap, Home, LayoutDashboard, MapPin, Menu,
  MessageCircle, Navigation, Pencil, Search, Send, Settings, ShieldCheck, Sparkles,
  TrendingUp, Users, X, Zap
} from 'lucide-react'
import { initialProfile, routes, adminStats } from './data'

const Icon = ({ name, size = 18 }) => {
  const icons = { bus: Bus, route: Compass, users: Users, activity: Activity }
  const C = icons[name] || Activity
  return <C size={size} />
}

function BrandMark() {
  return <div className="brand-mark"><Bus size={21} strokeWidth={2.4}/></div>
}

function MapPanel({ route, progress, setProgress }) {
  const points = [
    {x: 12, y: 72, name: route.stops[0]},
    {x: 31, y: 53, name: route.stops[1]},
    {x: 49, y: 63, name: route.stops[2]},
    {x: 69, y: 32, name: route.stops[3]},
    {x: 88, y: 20, name: route.stops[4]}
  ]
  const p = points.slice(0, Math.min(points.length, route.stops.length))
  const pos = progress < 1 ? {
    x: p[0].x + (p[1].x-p[0].x)*Math.min(progress*4,1) + (p[1].x-p[0].x)*Math.max(progress*4-1,0) * 0,
    y: p[0].y + (p[1].y-p[0].y)*Math.min(progress*4,1)
  } : p[p.length-1]
  const segment = Math.min(Math.floor(progress * (p.length - 1)), p.length - 2)
  const local = progress >= 1 ? 1 : progress * (p.length - 1) - segment
  const marker = progress >= 1 ? p[p.length-1] : {
    x: p[segment].x + (p[segment+1].x-p[segment].x)*local,
    y: p[segment].y + (p[segment+1].y-p[segment].y)*local
  }
  const path = p.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' ')
  return <div className="map-card">
    <div className="map-topline">
      <div><div className="eyebrow">LIVE ROUTE VIEW</div><h3>{route.id} · {route.destination}</h3></div>
      <span className="live-pill"><i/> SIMULATED LIVE</span>
    </div>
    <div className="map-canvas">
      <div className="map-grid"/>
      <div className="map-label label-one">HUMAYUN NAGAR</div>
      <div className="map-label label-two">LAKDIKAPUL</div>
      <div className="map-label label-three">KHAIRATABAD</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="route-svg">
        <path d={path} fill="none" stroke="#d9d8ef" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0"/>
        <path d={path} fill="none" stroke={route.color} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2.5 1.5"/>
        {p.map((pt,i)=><g key={pt.name}>
          <circle cx={pt.x} cy={pt.y} r="2.4" fill="#fff" stroke={i===0?'#a6a1bd':route.color} strokeWidth="1.3"/>
          <circle cx={pt.x} cy={pt.y} r="0.75" fill={route.color}/>
        </g>)}
        <circle cx={marker.x} cy={marker.y} r="4.1" fill={route.color} opacity=".18"/>
        <circle cx={marker.x} cy={marker.y} r="2.5" fill={route.color} stroke="#fff" strokeWidth="1.2"/>
      </svg>
      <div className="map-bus" style={{left:`${marker.x}%`,top:`${marker.y}%`}}><Bus size={15}/></div>
      {p.map((pt,i)=><div className={`stop-label stop-${i}`} key={pt.name} style={{left:`${pt.x}%`,top:`${pt.y}%`}}>
        <span>{i+1}</span><small>{pt.name}</small>
      </div>)}
      <div className="map-compass"><Navigation size={13}/></div>
    </div>
    <div className="map-footer">
      <div className="legend"><span className="legend-dot" style={{background:route.color}}/> Bus location <span className="legend-line"/> Route path</div>
      <div className="progress-control"><span>Route progress</span><input aria-label="Simulate bus position" type="range" min="0" max="100" value={Math.round(progress*100)} onChange={e=>setProgress(Number(e.target.value)/100)}/><b>{Math.round(progress*100)}%</b></div>
    </div>
  </div>
}

function App() {
  const [page, setPage] = useState('Overview')
  const [profile, setProfile] = useState(initialProfile)
  const [selectedRouteId, setSelectedRouteId] = useState('Route 8')
  const [selectedStop, setSelectedStop] = useState(initialProfile.boardingStop)
  const [search, setSearch] = useState('')
  const [progress, setProgress] = useState(.34)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    {from:'ai', text:'Hey Krithika! 👋 I’m watching Route 8 for you. Ask me about your bus, ETA, or when to leave.'}
  ])
  const [editing, setEditing] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [profileDraft, setProfileDraft] = useState(profile)

  const route = routes.find(r=>r.id===selectedRouteId) || routes[0]
  const stopIndex = Math.max(0, route.stops.indexOf(selectedStop))
  const walkMinutes = selectedStop.toLowerCase().includes('post office') ? 6 : selectedStop === 'NMDC' ? 4 : 8
  const busEta = Math.max(2, Math.round(route.eta - progress * 5 + stopIndex * .7))
  const safetyBuffer = 5
  const leaveIn = Math.max(0, busEta - walkMinutes - safetyBuffer)
  const leaveTime = new Date(Date.now() + leaveIn * 60000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  const filteredRoutes = routes.filter(r => `${r.id} ${r.stops.join(' ')} ${r.status}`.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const timer = setInterval(() => setProgress(v => v >= .98 ? .08 : v + .006), 2500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!route.stops.includes(selectedStop)) setSelectedStop(route.stops[Math.min(1, route.stops.length-1)])
  }, [selectedRouteId])

  const answerFor = (q) => {
    const s=q.toLowerCase()
    if (s.includes('leave')) return `For ${selectedStop}, allow ${walkMinutes} min to walk plus a ${safetyBuffer}-min safety buffer. Your ${route.id} bus ETA is about ${busEta} min. Leave in ${leaveIn} minutes (around ${leaveTime}).`
    if (s.includes('where') || s.includes('location')) return `Your ${route.id} bus (${route.bus}) is on the route near ${route.stops[Math.min(Math.floor(progress*4)+1,route.stops.length-1)]}. Route progress is ${Math.round(progress*100)}%. This is simulated demo tracking.`
    if (s.includes('eta') || s.includes('when')) return `${route.id} is estimated to reach ${selectedStop} in ${busEta} minutes. The estimate updates as the simulated bus marker moves.`
    if (s.includes('which') || s.includes('route')) return `Your preferred ${profile.preferredRoute} is a good match. It serves ${route.stops.join(' → ')}. You’re currently tracking ${route.id}.`
    return `I can help with your ${route.id} commute. Current ETA: ${busEta} min, walking time: ${walkMinutes} min, and recommended leave time: ${leaveTime}. Try asking “When should I leave?”`
  }
  const sendMessage = (text=chatInput) => {
    if (!text.trim()) return
    setMessages(m=>[...m,{from:'user',text},{from:'ai',text:answerFor(text)}])
    setChatInput('')
  }

  const navItems = [
    {label:'Overview', icon:LayoutDashboard, group:'WORKSPACE'},
    {label:'Find a bus', icon:MapPin, group:'WORKSPACE'},
    {label:'My commute', icon:CalendarClock, group:'WORKSPACE'},
    {label:'AI assistant', icon:MessageCircle, group:'WORKSPACE'},
    {label:'Admin dashboard', icon:ShieldCheck, group:'MANAGEMENT'},
    {label:'My profile', icon:Users, group:'MANAGEMENT'}
  ]
  const pageTitle = page === 'Overview' ? 'Good morning, Krithika' : page
  const pageSub = page === 'Overview' ? 'Here’s your commute at a glance. Let’s get you to campus on time.' :
    page === 'Admin dashboard' ? 'A live-style snapshot of your campus transport operations.' :
    page === 'My profile' ? 'Manage your personal commute preferences.' :
    page === 'AI assistant' ? 'Your personal campus commute co-pilot.' :
    page === 'My commute' ? 'Your personalized plan from home to campus.' : 'Explore available campus routes and track your bus.'

  const saveProfile = () => {
    setProfile(profileDraft)
    setSelectedRouteId(profileDraft.preferredRoute)
    setSelectedStop(profileDraft.boardingStop)
    setEditing(false)
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
      <div className="brand"><BrandMark/><div><strong>Campus Transit</strong><small>SMART MOBILITY</small></div><button className="close-nav" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="profile-mini"><div className="avatar">BK</div><div><b>{profile.name}</b><span>Student account</span></div><ChevronDown size={15}/></div>
      {['WORKSPACE','MANAGEMENT'].map(group=><div className="nav-group" key={group}><div className="nav-caption">{group}</div>
        {navItems.filter(n=>n.group===group).map(n=><button key={n.label} className={`nav-item ${page===n.label?'active':''}`} onClick={()=>{setPage(n.label);setMobileNav(false)}}><n.icon size={18}/><span>{n.label}</span>{n.label==='AI assistant'&&<span className="nav-new">AI</span>}</button>)}
      </div>)}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Your commute assistant is always here to help.</p><button onClick={()=>setPage('AI assistant')}>Chat with RouteMate <ArrowRight size={14}/></button></div><div className="sidebar-foot"><span>RouteMate AI</span><span>v1.0.0 · Demo</span></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu/></button><div className="crumb">Campus Transit <span>/</span> <b>{page}</b></div><div className="top-actions"><span className="today"><span className="status-dot"/> Service operational</span><button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">BK</div></div></header>
      <div className="page-wrap">
        <section className="page-heading"><div><div className="eyebrow">{page==='Admin dashboard'?'OPERATIONS CENTER':'YOUR CAMPUS, CONNECTED'}</div><h1>{pageTitle}</h1><p>{pageSub}</p></div><div className="heading-date"><span><CalendarClock size={15}/></span><div><b>{new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</b><small>Hyderabad, India</small></div></div></section>

        {page==='Overview' && <>
          <section className="hero-banner"><div className="hero-content"><div className="hero-chip"><Sparkles size={13}/> YOUR AI COMMUTE COMPANION</div><h2>RouteMate AI<br/><span>Your Bus. Your Time. Your Campus.</span></h2><p>Helping Hyderabad college students reach campus on time through intelligent commute planning.</p><button className="hero-btn" onClick={()=>setPage('My commute')}>Plan my commute <ArrowRight size={16}/></button></div><div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-glow"/><div className="hero-bus"><Bus size={76} strokeWidth={1.25}/></div><div className="floating-tag tag-eta"><Clock3 size={14}/><span><b>{busEta} min</b><small>Bus arrival</small></span></div><div className="floating-tag tag-route"><MapPin size={14}/><span><b>Route 8</b><small>Your usual ride</small></span></div><div className="hero-spark spark-a">✦</div><div className="hero-spark spark-b">✧</div></div></section>

          <div className="section-head"><div><h2>Your commute snapshot</h2><p>Personalized just for you</p></div><button className="text-btn" onClick={()=>setPage('My commute')}>View commute <ArrowRight size={15}/></button></div>
          <section className="stat-grid">
            <div className="stat-card"><div className="stat-icon purple"><Bus size={19}/></div><div className="stat-label">YOUR BUS ETA</div><div className="stat-value">{busEta}<small> min</small></div><div className="stat-foot"><span className="tiny-dot green"/> {route.id} · {route.status}</div></div>
            <div className="stat-card"><div className="stat-icon mint"><FootIcon/></div><div className="stat-label">WALK TO STOP</div><div className="stat-value">{walkMinutes}<small> min</small></div><div className="stat-foot">To {selectedStop}</div></div>
            <div className="stat-card"><div className="stat-icon amber"><Zap size={19}/></div><div className="stat-label">LEAVE HOME IN</div><div className="stat-value">{leaveIn}<small> min</small></div><div className="stat-foot">Around {leaveTime}</div></div>
            <div className="stat-card"><div className="stat-icon blue"><Navigation size={19}/></div><div className="stat-label">ROUTE DISTANCE</div><div className="stat-value">{route.distance.split(' ')[0]}<small> km</small></div><div className="stat-foot">Home to campus route</div></div>
          </section>

          <div className="content-grid"><div className="left-column">
            <MapPanel route={route} progress={progress} setProgress={setProgress}/>
            <section className="panel route-list-panel"><div className="panel-head"><div><h3>Available bus routes</h3><p>Find the best ride to your campus</p></div><button className="subtle-btn" onClick={()=>setPage('Find a bus')}>See all <ArrowRight size={14}/></button></div>
              <div className="route-list">{routes.slice(0,3).map(r=><button className={`route-row ${r.id===selectedRouteId?'selected':''}`} key={r.id} onClick={()=>{setSelectedRouteId(r.id);setSelectedStop(r.stops[Math.min(1,r.stops.length-1)])}}><span className="route-color" style={{background:r.color}}/><span className="route-row-main"><b>{r.id}</b><small>{r.stops[0]} <ArrowRight size={11}/> {r.destination}</small></span><span className="route-row-eta"><b>{r.eta} min</b><small>ETA</small></span><span className={`route-status ${r.status.includes('Delayed')?'delayed':''}`}>{r.status}</span><ChevronDown size={15} className="route-chevron"/></button>)}</div>
            </section>
          </div><div className="right-column">
            <LeaveCard route={route} stop={selectedStop} walk={walkMinutes} eta={busEta} buffer={safetyBuffer} leaveIn={leaveIn} leaveTime={leaveTime} onPlan={()=>setPage('My commute')}/>
            <AssistantCard messages={messages} input={chatInput} setInput={setChatInput} send={sendMessage} onExpand={()=>setPage('AI assistant')}/>
          </div></div>
        </>}

        {page==='Find a bus' && <><div className="searchbar"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by route, stop or destination..."/><span>{filteredRoutes.length} routes</span></div><div className="route-catalog">{filteredRoutes.map(r=><div className="catalog-card" key={r.id}><div className="catalog-top"><span className="route-badge" style={{background:r.color+'20',color:r.color}}>{r.id}</span><span className={`route-status ${r.status.includes('Delayed')?'delayed':''}`}>{r.status}</span></div><h3>{r.destination}</h3><p className="muted">{r.bus} · {r.distance}</p><div className="catalog-stops">{r.stops.map((s,i)=><span key={s}>{i>0&&<i/>}{s}</span>)}</div><div className="catalog-bottom"><div><b>{r.eta} min</b><small>Estimated arrival</small></div><button className="primary-btn small" onClick={()=>{setSelectedRouteId(r.id);setSelectedStop(r.stops[Math.min(1,r.stops.length-1)]);setPage('My commute')}}>Track this bus <ArrowRight size={14}/></button></div></div>)}</div>{filteredRoutes.length===0&&<div className="empty-state">No routes match “{search}”. Try another stop or route number.</div>}</>}

        {page==='My commute' && <div className="commute-layout"><div className="left-column"><div className="panel commute-config"><div className="panel-head"><div><h3>Build your commute</h3><p>Choose a route and your boarding point</p></div><span className="pill-ai"><Sparkles size={12}/> Personalized</span></div><label className="field-label">SELECT BUS ROUTE</label><div className="route-choice-grid">{routes.map(r=><button key={r.id} className={`route-choice ${selectedRouteId===r.id?'chosen':''}`} onClick={()=>{setSelectedRouteId(r.id);setSelectedStop(r.stops[Math.min(1,r.stops.length-1)])}}><span className="route-color" style={{background:r.color}}/><b>{r.id}</b><small>{r.eta} min ETA</small>{selectedRouteId===r.id&&<Check size={15}/>}</button>)}</div><label className="field-label">YOUR BOARDING STOP</label><select className="select-field" value={selectedStop} onChange={e=>setSelectedStop(e.target.value)}>{route.stops.map(s=><option key={s}>{s}</option>)}</select><div className="profile-route-note"><Home size={16}/><span>Starting from <b>{profile.home}</b></span><button onClick={()=>{setProfileDraft(profile);setEditing(true)}}>Edit profile</button></div></div><MapPanel route={route} progress={progress} setProgress={setProgress}/></div><div className="right-column"><LeaveCard route={route} stop={selectedStop} walk={walkMinutes} eta={busEta} buffer={safetyBuffer} leaveIn={leaveIn} leaveTime={leaveTime} onPlan={()=>{}}/><div className="panel detail-panel"><h3>Trip details</h3><div className="detail-line"><span>Bus number</span><b>{route.bus}</b></div><div className="detail-line"><span>Boarding at</span><b>{selectedStop}</b></div><div className="detail-line"><span>Destination</span><b>College Campus</b></div><div className="detail-line"><span>Route distance</span><b>{route.distance}</b></div><div className="detail-line"><span>Bus occupancy</span><b>{route.occupancy}%</b></div><div className="occupancy"><span style={{width:`${route.occupancy}%`}}/></div><div className="muted tiny">Occupancy is simulated for this demo.</div></div></div></div>}

        {page==='Admin dashboard' && <><div className="admin-banner"><div className="admin-banner-icon"><ShieldCheck size={23}/></div><div><b>Fleet operations overview</b><p>Demo environment · Data is simulated and refreshes locally</p></div><span className="live-pill"><i/> SYSTEM ONLINE</span></div><div className="stat-grid admin-stats">{adminStats.map(s=><div className="stat-card" key={s.label}><div className="stat-icon purple"><Icon name={s.icon}/></div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-foot"><TrendingUp size={13} className="green-text"/> {s.change}</div></div>)}</div><div className="admin-grid"><div className="panel"><div className="panel-head"><div><h3>Route monitoring</h3><p>Current fleet status by route</p></div><span className="live-pill"><i/> LIVE DEMO</span></div><div className="admin-table"><div className="table-row table-head"><span>ROUTE / BUS</span><span>PASSENGERS</span><span>ETA</span><span>STATUS</span></div>{routes.map(r=><div className="table-row" key={r.id}><span><b><i className="table-dot" style={{background:r.color}}/>{r.id}</b><small>{r.bus}</small></span><span>{Math.round(r.occupancy*.65)} / 50</span><span>{r.eta} min</span><span><i className={`tiny-dot ${r.status.includes('Delayed')?'orange':'green'}`}/> {r.status}</span></div>)}</div></div><div className="panel fleet-panel"><div className="panel-head"><div><h3>Fleet utilization</h3><p>Passenger capacity</p></div></div><div className="fleet-number">68% <small>average occupancy</small></div><div className="fleet-bar"><span/></div><div className="fleet-legend"><span><i className="tiny-dot green"/> Active fleet</span><b>18 / 20 buses</b></div><div className="admin-insight"><Zap size={17}/><p><b>Operations insight</b><br/>Route 12 is running 4 minutes behind schedule. Consider dispatching a standby vehicle if delays increase.</p></div></div></div></>}

        {page==='My profile' && <div className="profile-layout"><div className="panel profile-card"><div className="profile-cover"><div className="profile-big-avatar">BK</div></div><div className="profile-body"><div className="profile-name-row"><div><h2>{profile.name}</h2><p>Student · Campus Transit</p></div><button className="outline-btn" onClick={()=>{setProfileDraft(profile);setEditing(true)}}><Pencil size={14}/> Edit profile</button></div><div className="profile-info-grid"><Info label="HOME LOCATION" value={profile.home} icon={<Home/>}/><Info label="PREFERRED ROUTE" value={profile.preferredRoute} icon={<Bus/>}/><Info label="BOARDING STOP" value={profile.boardingStop} icon={<MapPin/>}/><Info label="ACCOUNT TYPE" value="Student account" icon={<GraduationCap/>}/></div></div></div><div className="panel profile-benefit"><div className="stat-icon purple"><Sparkles/></div><h3>Your commute, your way.</h3><p>RouteMate uses your saved home location, route and boarding stop to calculate a commute plan that fits your day.</p><button className="text-btn" onClick={()=>setPage('My commute')}>View my commute <ArrowRight size={15}/></button></div></div>}

        {page==='AI assistant' && <div className="assistant-page"><div className="assistant-intro"><div className="assistant-big-icon"><Sparkles size={27}/></div><h2>Hey {profile.name}, how can I help?</h2><p>Ask me anything about your campus commute. I’m connected to your demo route data.</p><div className="suggestion-row">{['When should I leave?','Where is my bus?','What is my ETA?','Which route should I take?'].map(q=><button key={q} onClick={()=>sendMessage(q)}>{q}<ArrowRight size={13}/></button>)}</div></div><div className="panel full-chat"><div className="chat-title"><div className="assistant-small"><Sparkles size={16}/></div><div><b>RouteMate AI</b><small><i className="tiny-dot green"/> Commute assistant · Demo mode</small></div></div><div className="chat-messages">{messages.map((m,i)=><div className={`message ${m.from}`} key={i}><div className="message-avatar">{m.from==='ai'?<Sparkles size={14}/>:profile.initials}</div><div className="message-bubble">{m.text}</div></div>)}</div><div className="chat-input"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Ask about your bus, ETA or commute..."/><button onClick={()=>sendMessage()} aria-label="Send message"><Send size={17}/></button></div></div></div>}
      </div>
      <footer className="app-footer"><span>© 2026 RouteMate AI</span><span>Built for smarter campus mobility <span className="footer-heart">♥</span></span><span>Demo data · GPS integration ready</span></footer>
    </main>
    {editing&&<div className="modal-backdrop" onClick={()=>setEditing(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h3>Edit your profile</h3><p>Keep your commute details up to date.</p></div><button className="icon-btn" onClick={()=>setEditing(false)}><X size={18}/></button></div><label className="field-label">YOUR NAME</label><input className="form-field" value={profileDraft.name} onChange={e=>setProfileDraft({...profileDraft,name:e.target.value})}/><label className="field-label">HOME LOCATION</label><input className="form-field" value={profileDraft.home} onChange={e=>setProfileDraft({...profileDraft,home:e.target.value})}/><label className="field-label">PREFERRED ROUTE</label><select className="select-field" value={profileDraft.preferredRoute} onChange={e=>{const r=routes.find(x=>x.id===e.target.value);setProfileDraft({...profileDraft,preferredRoute:e.target.value,boardingStop:r.stops[Math.min(1,r.stops.length-1)]})}}>{routes.map(r=><option key={r.id}>{r.id}</option>)}</select><label className="field-label">BOARDING STOP</label><select className="select-field" value={profileDraft.boardingStop} onChange={e=>setProfileDraft({...profileDraft,boardingStop:e.target.value})}>{(routes.find(r=>r.id===profileDraft.preferredRoute)||routes[0]).stops.map(s=><option key={s}>{s}</option>)}</select><div className="modal-actions"><button className="outline-btn" onClick={()=>setEditing(false)}>Cancel</button><button className="primary-btn" onClick={saveProfile}>Save changes <Check size={15}/></button></div></div></div>}
  </div>
}

function FootIcon(){return <span className="foot-symbol">↗</span>}
function Info({label,value,icon}){return <div className="info-item"><span className="info-icon">{icon}</span><div><small>{label}</small><b>{value}</b></div></div>}

function LeaveCard({route,stop,walk,eta,buffer,leaveIn,leaveTime,onPlan}){
  return <section className="leave-card"><div className="leave-card-head"><div><div className="eyebrow">SMART DEPARTURE PLAN</div><h3>When should I leave?</h3></div><div className="leave-spark"><Sparkles size={17}/></div></div><div className="leave-recommendation"><div className="leave-clock"><Clock3 size={22}/></div><div><small>YOUR RECOMMENDATION</small><strong>Leave in {leaveIn} min</strong><span>Be ready by {leaveTime}</span></div></div><div className="calculation"><div><span>Bus ETA at stop</span><b>{eta} min</b></div><div><span>Walk to {stop.length>21?stop.slice(0,18)+'…':stop}</span><b>− {walk} min</b></div><div><span>Safety buffer</span><b>− {buffer} min</b></div><div className="calculation-total"><span>Recommended lead time</span><b>{leaveIn} min</b></div></div><div className="leave-tip"><Zap size={14}/><span>We’ve included a {buffer}-minute buffer so you don’t have to rush.</span></div><button className="leave-button" onClick={onPlan}>View full commute plan <ArrowRight size={15}/></button></section>
}

function AssistantCard({messages,input,setInput,send,onExpand}){
  const last=messages[messages.length-1]
  return <section className="panel assistant-card"><div className="assistant-card-head"><div className="assistant-small"><Sparkles size={16}/></div><div><b>RouteMate AI</b><small><i className="tiny-dot green"/> Here to help</small></div><button onClick={onExpand}>Open <ArrowRight size={13}/></button></div><div className="assistant-preview">{last?.from==='ai'?last.text:'I’m here to help with your commute.'}</div><div className="quick-questions"><button onClick={()=>send('When should I leave?')}>When to leave?</button><button onClick={()=>send('Where is my bus?')}>Bus location?</button></div><div className="mini-chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask RouteMate..."/><button onClick={()=>send()}><Send size={15}/></button></div></section>
}

export default App
