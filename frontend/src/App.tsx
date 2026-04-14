import { useState, useEffect } from 'react'
import { Home, Smile, BookOpen, Calendar, Bookmark, User as UserIcon, Clock, FileText, AlertTriangle, Users, BarChart, Bell } from 'lucide-react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ScreenRenderer from './components/ScreenRenderer'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import styles from './styles/App.module.css'
import * as api from './api'
import type { Role, User, NavItem, Appointment, MoodLog, Resource, SessionNote, Availability } from './types'

const navItems: Record<Role, NavItem[]> = {
  student: [
    { icon: <Home />, label: 'Dashboard', page: 'student-dashboard' },
    { icon: <Smile />, label: 'Mood Check-in', page: 'mood-checkin' },
    { icon: <BookOpen />, label: 'Resource Library', page: 'resource-library' },
    { icon: <Calendar />, label: 'Appointments', page: 'appointments' },
    { icon: <Bookmark />, label: 'Bookmarks', page: 'bookmarks' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
  counsellor: [
    { icon: <Home />, label: 'Dashboard', page: 'counsellor-dashboard' },
    { icon: <Calendar />, label: 'Appointment Calendar', page: 'appointment-calendar' },
    { icon: <Clock />, label: 'Set Availability', page: 'set-availability' },
    { icon: <FileText />, label: 'Session Notes', page: 'session-notes' },
    { icon: <AlertTriangle />, label: 'Urgent Flags', page: 'urgent-flags' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
  admin: [
    { icon: <Home />, label: 'Dashboard', page: 'admin-dashboard' },
    { icon: <Users />, label: 'Manage Users', page: 'manage-users' },
    { icon: <BarChart />, label: 'Aggregate Wellness', page: 'aggregate-wellness' },
    { icon: <BookOpen />, label: 'Manage Resources', page: 'manage-resources' },
    { icon: <Bell />, label: 'Notifications', page: 'system-notifications' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
}

const defaultUsers: Record<Role, User> = {
  student: { id: '', name: 'Guest', role: 'student', email: '', faculty: '' },
  counsellor: { id: '', name: 'Guest', role: 'counsellor', email: '', faculty: '' },
  admin: { id: '', name: 'Admin', role: 'admin', email: '', faculty: '' },
}

const defaultResources: Resource[] = [
  {
    id: '1',
    title: 'Managing Stress in University',
    description: 'Learn practical techniques to manage stress during your academic journey. Includes time management strategies, study tips, and relaxation methods.',
    type: 'article',
    url: 'https://www.mindtools.com/stress-management',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '10-Minute Guided Meditation for Students',
    description: 'A calming meditation session specifically designed for busy students. Perfect for studying, bedtime, or anytime you need to relax.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Understanding Anxiety & Depression',
    description: 'Comprehensive guide to understanding anxiety and depression symptoms, causes, and evidence-based treatments. Learn when to seek help.',
    type: 'article',
    url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety/',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'The 4-7-8 Breathing Technique',
    description: 'A simple breathing exercise to reduce anxiety and promote sleep. Can be done anywhere, anytime in just 4 minutes.',
    type: 'tool',
    url: 'https://www.headspace.com/work/breathing-exercises',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Sleep Better: Tips for College Students',
    description: 'Evidence-based strategies to improve sleep quality despite irregular schedules and academic pressure. Includes sleep hygiene tips.',
    type: 'article',
    url: 'https://www.sleepfoundation.org/sleep-hygiene',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Mindfulness for Beginners',
    description: 'An introductory guide to mindfulness practices that can improve focus, reduce stress, and enhance overall well-being.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Mood & Sleep Tracker',
    description: 'Interactive tool to track your daily mood and sleep patterns. Identify trends and factors affecting your mental health.',
    type: 'tool',
    url: 'https://www.moodpath.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Dealing with Perfectionism',
    description: 'Learn how perfectionism affects mental health and academic performance. Discover strategies to set realistic goals.',
    type: 'article',
    url: 'https://www.psychologytoday.com/us/basics/perfectionism',
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Progressive Muscle Relaxation',
    description: 'A tension-release technique that helps reduce physical and mental stress. Use during study breaks or before bed.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=vWkSGcn1CvQ',
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Building Healthy Relationships & Support Networks',
    description: 'Guide to nurturing meaningful relationships and building a strong support network during your studies.',
    type: 'article',
    url: 'https://www.verywellmind.com/social-support-and-mental-health-4774376',
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Managing Academic Pressure & Exam Anxiety',
    description: 'Proven strategies to manage exam stress and academic pressure. Includes preparation techniques and coping mechanisms.',
    type: 'article',
    url: 'https://www.headspace.com/articles/exam-anxiety',
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Mental Health Crisis Resources',
    description: 'Emergency resources and hotlines for mental health support. Available 24/7 if you need immediate help.',
    type: 'tool',
    url: 'https://findahelpline.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '13',
    title: 'Grounding Exercises for Anxiety',
    description: 'Simple 5-4-3-2-1 grounding and sensory reset exercises to reduce anxiety in the moment.',
    type: 'article',
    url: 'https://www.healthline.com/health/grounding-techniques',
    created_at: new Date().toISOString(),
  },
  {
    id: '14',
    title: 'Pomodoro Study Timer',
    description: 'Focus tool with work and break cycles to reduce burnout and improve concentration.',
    type: 'tool',
    url: 'https://pomofocus.io/',
    created_at: new Date().toISOString(),
  },
  {
    id: '15',
    title: 'Cognitive Distortions Cheat Sheet',
    description: 'Learn common unhelpful thought patterns and how to challenge them with CBT techniques.',
    type: 'article',
    url: 'https://positivepsychology.com/cognitive-distortions/',
    created_at: new Date().toISOString(),
  },
  {
    id: '16',
    title: 'Short Yoga for Stress Relief',
    description: 'A beginner-friendly routine to release tension from shoulders, back, and neck in under 15 minutes.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=hJbRpHZr_d0',
    created_at: new Date().toISOString(),
  },
  {
    id: '17',
    title: 'How to Build a Better Sleep Schedule',
    description: 'Practical steps to regulate bedtime and wake time for better energy and mood.',
    type: 'article',
    url: 'https://www.sleepfoundation.org/how-sleep-works/how-to-reset-your-sleep-routine',
    created_at: new Date().toISOString(),
  },
  {
    id: '18',
    title: 'Calm Breathing Audio Session',
    description: 'Guided breathing audio to lower stress quickly between classes or before exams.',
    type: 'tool',
    url: 'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/relaxation/',
    created_at: new Date().toISOString(),
  },
  {
    id: '19',
    title: 'Nutrition and Mental Health Basics',
    description: 'Understand how regular meals, hydration, and micronutrients support emotional well-being.',
    type: 'article',
    url: 'https://www.mentalhealth.org.uk/explore-mental-health/publications/food-and-mood',
    created_at: new Date().toISOString(),
  },
  {
    id: '20',
    title: 'Digital Journal Template',
    description: 'Structured prompts to track thoughts, gratitude, and emotional patterns each day.',
    type: 'tool',
    url: 'https://dayoneapp.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '21',
    title: 'What Burnout Feels Like',
    description: 'Early signs of academic burnout and practical recovery actions to take this week.',
    type: 'article',
    url: 'https://www.medicalnewstoday.com/articles/student-burnout',
    created_at: new Date().toISOString(),
  },
  {
    id: '22',
    title: 'Body Scan Meditation',
    description: 'A step-by-step body scan practice that helps reduce racing thoughts and physical tension.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=15q-N-_kkrU',
    created_at: new Date().toISOString(),
  },
  {
    id: '23',
    title: 'Healthy Boundaries at University',
    description: 'Learn how to say no, protect your time, and reduce social and academic overload.',
    type: 'article',
    url: 'https://www.psychologytoday.com/us/blog/in-flux/202201/how-set-healthy-boundaries',
    created_at: new Date().toISOString(),
  },
  {
    id: '24',
    title: 'Habit Tracker for Wellbeing',
    description: 'Track sleep, hydration, movement, and focus habits with an easy visual planner.',
    type: 'tool',
    url: 'https://habitica.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '25',
    title: 'How to Talk to a Friend in Crisis',
    description: 'Guidance on supportive listening and safe referral when someone is struggling.',
    type: 'article',
    url: 'https://www.mind.org.uk/information-support/guides-to-support-and-services/supporting-someone-else/',
    created_at: new Date().toISOString(),
  },
  {
    id: '26',
    title: 'Desk Stretch Routine',
    description: 'Short movement breaks that reduce stress and improve concentration while studying.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=tAUf7aajBWE',
    created_at: new Date().toISOString(),
  },
  {
    id: '27',
    title: 'Self-Compassion Exercises',
    description: 'Practical exercises to reduce harsh self-criticism and improve emotional resilience.',
    type: 'article',
    url: 'https://self-compassion.org/category/exercises/',
    created_at: new Date().toISOString(),
  },
  {
    id: '28',
    title: 'Five-Minute Reset Playlist',
    description: 'A quick audio reset to decompress after difficult lectures or meetings.',
    type: 'tool',
    url: 'https://open.spotify.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '29',
    title: 'Exam Week Survival Guide',
    description: 'Practical checklist for sleep, revision pacing, and anxiety management during exam season.',
    type: 'article',
    url: 'https://www.health.harvard.edu/mind-and-mood/test-anxiety-can-be-treated',
    created_at: new Date().toISOString(),
  },
  {
    id: '30',
    title: 'Guided Relaxation for Sleep',
    description: 'Slow breathing and muscle release audio to help you wind down at night.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=aEqlQvczMJQ',
    created_at: new Date().toISOString(),
  },
  {
    id: '31',
    title: 'Campus Support Planning Template',
    description: 'Use this template to map your trusted contacts, emergency numbers, and support steps.',
    type: 'tool',
    url: 'https://www.suicidecallbackservice.org.au/resource/safety-plan-template/',
    created_at: new Date().toISOString(),
  },
  {
    id: '32',
    title: 'Overthinking and Rumination',
    description: 'Learn strategies to interrupt rumination loops and return to grounded action.',
    type: 'article',
    url: 'https://www.verywellmind.com/repetitive-thinking-2795910',
    created_at: new Date().toISOString(),
  },
  {
    id: '33',
    title: 'Study Music for Focus',
    description: 'Background focus tracks to support deep work sessions and reduce distractions.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=lFcSrYw-ARY',
    created_at: new Date().toISOString(),
  },
  {
    id: '34',
    title: 'Simple Weekly Planning Board',
    description: 'A visual planning board to organize assignments, deadlines, and self-care blocks.',
    type: 'tool',
    url: 'https://trello.com/',
    created_at: new Date().toISOString(),
  },
  {
    id: '35',
    title: 'When to Seek Professional Help',
    description: 'Signs that indicate it may be time to contact a counsellor or health professional.',
    type: 'article',
    url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
    created_at: new Date().toISOString(),
  },
]

const roleNames: Record<Role, string> = {
  student: 'Student',
  counsellor: 'Counsellor',
  admin: 'Administrator',
}

function readStoredUser(): User | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null
    }
    const raw = localStorage.getItem('mh_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function saveSession(token: string, user: User) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem('mh_auth_token', token)
  localStorage.setItem('mh_user', JSON.stringify(user))
}

function clearSession() {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.removeItem('mh_auth_token')
  localStorage.removeItem('mh_user')
}

function mergeResources(remote: Resource[], fallback: Resource[]): Resource[] {
  const byTitle = new Map<string, Resource>()

  remote.forEach(resource => {
    byTitle.set(resource.title.trim().toLowerCase(), resource)
  })

  fallback.forEach(resource => {
    const key = resource.title.trim().toLowerCase()
    if (!byTitle.has(key)) {
      byTitle.set(key, resource)
    }
  })

  return Array.from(byTitle.values())
}

type AppView = 'landing' | 'auth' | 'app'

type AuthMode = 'login' | 'register'

type AuthFormData = {
  mode: AuthMode
  name: string
  email: string
  password: string
  role: Role
  institutionCode: string
}

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<Role>('student')
  const [currentPage, setCurrentPage] = useState('student-dashboard')
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers.student)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])

  const profileToUser = (profile: any): User => ({
    id: profile.id,
    institutionCode: profile.institution_code,
    auth_id: profile.id,
    name: profile.name,
    role: profile.role,
    email: profile.email,
    faculty: profile.faculty,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('mh_auth_token')
    const storedUser = readStoredUser()
    if (storedToken) {
      setAuthToken(storedToken)
    }
    if (storedToken && storedUser) {
      setCurrentUser(storedUser)
      setCurrentRole(storedUser.role)
      setCurrentPage(`${storedUser.role}-dashboard`)
      setView('app')
    }
  }, [])

  useEffect(() => {
    const loadData = async (token: string, userId?: string) => {
      try {
        const [appts, logs, res, notes, avail, profiles] = await Promise.all([
          api.getAppointments(token, userId),
          api.getMoodLogs(token, userId),
          api.getResources(token, userId),
          api.getSessionNotes(token, userId),
          api.getAvailability(token, userId),
          api.getProfiles(token, userId),
        ])

        setAppointments(Array.isArray(appts) ? appts : [])
        setMoodLogs(Array.isArray(logs) ? logs : [])
        setResources(Array.isArray(res) ? mergeResources(res, defaultResources) : defaultResources)
        setSessionNotes(Array.isArray(notes) ? notes : [])
        setAvailability(Array.isArray(avail) ? avail : [])
        setUsers(Array.isArray(profiles) ? profiles.map(profileToUser) : [])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    const restoreSession = async () => {
      if (!authToken || !currentUser.id) return
      try {
        await loadData(authToken, currentUser.id)
        setView('app')
      } catch (error) {
        console.error('Error loading data in restore session:', error)
        // Don't clear the token just because data failed to load
        // The user might still be able to access the app
      }
    }

    restoreSession()
  }, [authToken, currentUser.id])

  const currentRoleName = roleNames[currentRole]
  const items = navItems[currentRole]

  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      handleLogout()
      return
    }
    setCurrentPage(page)
  }

  const handleLogout = () => {
    clearSession()
    setAuthToken(null)
    setView('landing')
    setCurrentRole('student')
    setCurrentPage('student-dashboard')
    setCurrentUser(defaultUsers.student)
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setView('auth')
  }

  const handleAuthSubmit = async (data: AuthFormData) => {
    setAuthError(null)

    try {
      if (data.mode === 'login') {
        const result = await api.login(data.email, data.password, data.role)
        const token = result.token ?? result.session?.access_token
        if (!token) {
          setAuthError('Login failed. No token returned.')
          return
        }

        const profile = result.user
        const loggedUser = profileToUser(profile)
        saveSession(token, loggedUser)
        setAuthToken(token)
        setCurrentUser(loggedUser)
        setCurrentRole(loggedUser.role)
        setCurrentPage(`${loggedUser.role}-dashboard`)
        setView('app')
        return
      }

      await api.registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        faculty: data.role === 'student' ? 'Computing' : undefined,
        institution_code: data.institutionCode || undefined,
      })

      const loginResult = await api.login(data.email, data.password, data.role)
      const token = loginResult.token ?? loginResult.session?.access_token
      if (!token) {
        setAuthError('Registration failed. No token returned.')
        return
      }
      const profile = loginResult.user
      const loggedUser = profileToUser(profile)
      saveSession(token, loggedUser)
      setAuthToken(token)
      setCurrentUser(loggedUser)
      setCurrentRole(loggedUser.role)
      setCurrentPage(`${loggedUser.role}-dashboard`)
      setView('app')
    } catch (error) {
      setAuthError((error as Error).message)
    }
  }

  const handleAddAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addAppointment(appointment, authToken, currentUser.id)
    setAppointments(prev => [...prev, created])
  }

  const handleAddMoodLog = async (moodLog: Omit<MoodLog, 'id' | 'created_at'>) => {
    if (!authToken) {
      throw new Error('Not authenticated. Please log in.')
    }
    try {
      const created = await api.addMoodLog(moodLog, authToken, currentUser.id)
      setMoodLogs(prev => [...prev, created])
      return created
    } catch (error) {
      console.error('Error adding mood log:', error)
      throw error
    }
  }

  const handleAddResource = async (resource: Omit<Resource, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addResource(resource, authToken, currentUser.id)
    setResources(prev => [...prev, created])
  }

  const handleAddSessionNote = async (sessionNote: Omit<SessionNote, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addSessionNote(sessionNote, authToken, currentUser.id)
    setSessionNotes(prev => [...prev, created])
  }

  const handleAddAvailability = async (avail: Omit<Availability, 'id' | 'created_at'>) => {
    if (!authToken) return
    try {
      const created = await api.addAvailability(avail, authToken, currentUser.id)
      setAvailability(prev => [...prev, created])
    } catch (error) {
      console.error('Error adding availability:', error)
    }
  }

  const handleDeleteAvailability = async (availabilityId: string) => {
    if (!authToken) return
    try {
      await api.deleteAvailability(availabilityId, authToken, currentUser.id)
      setAvailability(prev => prev.filter(a => a.id !== availabilityId))
    } catch (error) {
      console.error('Error deleting availability:', error)
    }
  }

  const handleUpdateAvailability = async (availabilityId: string, updates: Partial<Omit<Availability, 'id'>>) => {
    if (!authToken) return
    try {
      const updated = await api.updateAvailability(availabilityId, updates, authToken, currentUser.id)
      setAvailability(prev =>
        prev.map(a =>
          a.id === availabilityId ? updated : a
        )
      )
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleUpdateUser = async (user: User) => {
    const nextUser = { ...user, auth_id: user.auth_id ?? user.id }
    setCurrentUser(nextUser)
    if (!authToken) return
    const updated = await api.updateProfile({
      name: user.name,
      faculty: user.faculty ?? null,
      institution_code: user.institutionCode ?? null,
    }, authToken, currentUser.id)
    if (updated) {
      saveSession(authToken, nextUser)
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...nextUser } : u)))
    }
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    setAppointments(prev => prev.map(a => (a.id === appointment.id ? { ...a, ...appointment } : a)))

    if (!authToken) return

    try {
      const updated = await api.updateAppointment(appointment, authToken, currentUser.id)
      setAppointments(prev => prev.map(a => (a.id === appointment.id ? updated : a)))
    } catch (error) {
      console.error('Error updating appointment on server:', error)
    }
  }

  const screenContext = {
    currentUser,
    currentPage,
    appointments,
    moodLogs,
    resources,
    sessionNotes,
    users,
    availability,
    onNavigate: handleNavigate,
    onFeedback: () => {}, // No more alerts
    onAddAppointment: handleAddAppointment,
    onAddMoodLog: handleAddMoodLog,
    onAddResource: handleAddResource,
    onAddSessionNote: handleAddSessionNote,
    onUpdateAppointment: handleUpdateAppointment,
    onAddAvailability: handleAddAvailability,
    onDeleteAvailability: handleDeleteAvailability,
    onUpdateAvailability: handleUpdateAvailability,
    onUpdateUser: handleUpdateUser,
  }

  if (view === 'landing') {
    return <LandingPage onOpenLogin={() => openAuth('login')} onOpenRegister={() => openAuth('register')} />
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        initialRole={currentRole}
        authError={authError}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        onBack={() => setView('landing')}
      />
    )
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        items={items}
        activePage={currentPage}
        currentRoleName={currentRoleName}
        onNavigate={handleNavigate}
      />

      <div className={styles.main}>
        <TopBar
          title={currentPage === `${currentRole}-dashboard` ? 'Dashboard' : ''}
          userName={currentUser.name}
          userSubtitle={`${currentUser.institutionCode || currentUser.id} • ${currentRoleName}`}
          onShowHelpline={() => alert('🚨 NAMIBIAN CRISIS HELPLINES\nLifeline Namibia: 061 222 222\nMental Health Helpline: 0800 000 111')}
        />

        <main className={styles.content}>
          <ScreenRenderer
            context={screenContext}
          />
        </main>
      </div>
    </div>
  )
}

export default App
