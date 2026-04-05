
"use client"
import {{ useState, useEffect }} from 'react'

export default function Home() {{
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [candidates, setCandidates] = useState([])
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filters, setFilters] = useState({{}})

  const users = {{
    'admin@globalmatch.com': 'admin123',
    'recruiter@test.com': 'test123'
  }}

  useEffect(() => {{
    const saved = localStorage.getItem('candidates')
    if (saved) setCandidates(JSON.parse(saved))
  }}, [])

  const login = (e) => {{
    e.preventDefault()
    if (users[email] === password) {{
      localStorage.setItem('loggedIn', 'true')
      setLoggedIn(true)
    }}
  }}

  const logout = () => {{
    localStorage.clear()
    setLoggedIn(false)
  }}

  const handleFiles = (e) => {{
    const selected = Array.from(e.target.files)
    const cvFiles = selected.filter(f => f.name.match(/\.(pdf|docx|resume|cv)/i))
    setFiles(cvFiles)
    setUploading(true)

    let p = 0
    const iv = setInterval(() => {{
      p += 10
      setProgress(p)
      if (p >= 100) {{
        clearInterval(iv)
        setUploading(false)
        // Add parsed candidates
        cvFiles.forEach((f, i) => {{
          const name = f.name.replace(/\.(pdf|docx|resume|cv)/i, '').replace(/-/g, ' ').trim()
          const newCandidate = {{
            id: Date.now() + i,
            filename: f.name,
            name: name || `Candidate ${{i+1}}`,
            country: '',
            salary: 0,
            english: '',
            skills: [],
            mode: '',
            tz: '',
            years: 0,
            education: '',
            status: 'new',
            missing: ['country', 'salary', 'english', 'skills']
          }}
          setCandidates(prev => [...prev, newCandidate])
        }})
        localStorage.setItem('candidates', JSON.stringify([...candidates, ...cvFiles.map((f, i) => ({{id: Date.now() + i, name: f.name.replace(/\.(pdf|docx)/i, '')}}))]))
      }}
    }}, 200)
  }}

  const updateCandidate = (id, field, value) => {{
    setCandidates(prev => prev.map(c => {{
      if (c.id === id) {{
        const updated = {{...c, [field]: value}}
        const required = ['country', 'salary', 'english', 'skills']
        updated.missing = required.filter(f => !updated[f] || (Array.isArray(updated[f]) && updated[f].length === 0))
        updated.status = updated.missing.length === 0 ? 'complete' : 'new'
        return updated
      }}
      return c
    }}))
  }}

  const deleteCandidate = (id) => {{
    setCandidates(prev => prev.filter(c => c.id !== id))
  }}

  const filteredCandidates = candidates.filter(c => {{
    // Apply filters logic here
    return true
  }})

  if (!loggedIn) {{
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Global Match</h1>
            <p className="text-slate-600">SEA Recruiter Dashboard</p>
          </div>

          <form onSubmit={login}>
            <div className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Admin: admin@globalmatch.com / admin123
          </div>
        </div>
      </div>
    )
  }}

  return (
    <>
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Global Match v8
            </h1>
            <div className="flex items-center space-x-4">
              <span className="font-medium text-slate-700">{email}</span>
              <button onClick={logout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Upload Column */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-6 border">
            <h2 className="text-xl font-bold mb-6">Bulk CV Upload</h2>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-8 text-center cursor-pointer transition-colors" onClick={() => document.getElementById('file-upload').click()}>
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-400 hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div className="font-semibold mb-1">Drop CVs here</div>
              <div className="text-sm text-slate-500">PDF/DOCX • Auto-validates</div>
            </div>
            <input id="file-upload" type="file" multiple accept=".pdf,.docx" className="hidden" onChange={handleFiles} />

            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{width: `${progress}%`}} />
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select className="w-full p-3 border rounded-xl">
                <option>Laos</option>
                <option>Thailand</option>
                <option>Vietnam</option>
              </select>
            </div>
            {/* More filters */}
            <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl font-medium">Apply</button>
          </div>

          {/* Candidates */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Candidates <span>{candidates.length}</span></h2>
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium">Export</button>
            </div>
            <div className="space-y-4">
              {candidates.map(c => (
                <div key={c.id} className="p-5 border rounded-2xl hover:shadow-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{c.name}</h3>
                      <p className="text-sm text-slate-600">{c.filename}</p>
                    </div>
                    <div className="text-emerald-600 font-bold text-xl">85%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}}
