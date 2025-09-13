import React, { useState, useEffect, useCallback } from 'react';
import './eco-theme.css';

// --- Firebase and Date-fns Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { format, differenceInCalendarDays } from 'date-fns';

// --- PASTE YOUR FIREBASE CONFIGURATION HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyAbMq-w_wnJW2CwtFpbWeXY_L588G_jLy4",
  authDomain: "eco-reflection.firebaseapp.com",
  projectId: "eco-reflection",
  storageBucket: "eco-reflection.firebasestorage.app",
  messagingSenderId: "224456023962",
  appId: "1:224456023962:web:0e060c14057d6d1ae12423"
};
// ---------------------------------------------

// --- Firebase Initialization ---
let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// --- Constants: Daily Actions ---
const DAILY_ACTIONS = [
    { id: 'a1', text: 'Shower with a bucket to save 50+ liters per wash.' },
    { id: 'a2', text: 'Use the "Fridge First" rule to cut food waste.' },
    { id: 'a3', text: 'Delete old emails to reduce digital carbon footprints.' },
    { id: 'a4', text: 'Turn off lights if leaving a room for 5+ minutes.' },
    { id: 'a5', text: 'Only buy items that can be reused or upcycled.' },
    { id: 'a6', text: 'Place a filled bottle in the toilet tank to save water.' },
];

// --- Firestore Service Module ---
const firestoreService = {
    USER_COLLECTION: 'users',
    REFLECTIONS_COLLECTION: 'reflections',
    STREAK_BREAKS_COLLECTION: 'streakBreaks',

    isStreakBroken: (lastReflectionDate, currentStreak) => {
        if (!lastReflectionDate || currentStreak === 0) return false;
        return differenceInCalendarDays(new Date(), lastReflectionDate) > 1;
    },

    getUserData: async (uid) => {
        const userDocRef = doc(db, firestoreService.USER_COLLECTION, uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        // If user is new, create their document
        const user = auth.currentUser;
        const initialData = {
            streak: 0,
            lastReflectionDate: null,
            displayName: user.displayName,
            email: user.email,
            createdAt: Timestamp.now()
        };
        await setDoc(userDocRef, initialData);
        return initialData;
    },
    
    saveReflection: async (uid, answers, totalActions, currentStreak, lastReflectionDate) => {
        const today = new Date();
        await addDoc(collection(db, firestoreService.USER_COLLECTION, uid, firestoreService.REFLECTIONS_COLLECTION), {
            answers,
            date: Timestamp.fromDate(today),
            totalActions: totalActions,
        });

        let newStreak = 1;
        if (lastReflectionDate) {
            const lastDate = lastReflectionDate.toDate();
            if (differenceInCalendarDays(today, lastDate) === 1) {
                newStreak = currentStreak + 1;
            }
        }
        const userDocRef = doc(db, firestoreService.USER_COLLECTION, uid);
        await setDoc(userDocRef, {
            streak: newStreak, lastReflectionDate: Timestamp.fromDate(today)
        }, { merge: true });
    },

    getReflections: async (uid) => {
        const q = query(collection(db, firestoreService.USER_COLLECTION, uid, firestoreService.REFLECTIONS_COLLECTION), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    logStreakBreak: async (uid, breakData) => {
        await addDoc(collection(db, firestoreService.USER_COLLECTION, uid, firestoreService.STREAK_BREAKS_COLLECTION), breakData);
    },

    resetStreak: async (uid) => {
        const userDocRef = doc(db, firestoreService.USER_COLLECTION, uid);
        await setDoc(userDocRef, { streak: 0 }, { merge: true });
    }
};

// --- Reusable Components ---

const Loader = ({ text = "Loading..."}) => (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--background)'}}>
        <svg style={{animation:'spin 1s linear infinite',height:40,width:40,color:'var(--primary-green)'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p style={{marginTop:16,fontSize:'1.1rem',fontWeight:500,color:'var(--text-muted)'}}>{text}</p>
    </div>
);

const AppHeader = ({ user, onSignOut }) => (
    <header className="header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
            <span className="text-muted" style={{fontSize:'0.95rem'}}>Signed in as</span>
            <div style={{fontWeight:600,color:'var(--primary-green)'}}>{user.displayName}</div>
        </div>
        <button onClick={onSignOut} className="button" style={{fontSize:'0.95rem',padding:'8px 18px'}}>Sign Out</button>
    </header>
);


const StreakDisplay = ({ streak }) => (
    <div className="action-card" style={{margin:'24px auto',maxWidth:320,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span className="icon" style={{fontSize:'2rem'}}>
            <svg height="40" width="40" style={{color:streak>0?'#43a047':'#cfd8dc'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014a7.986 7.986 0 014.243 2.242c.386.386.73.804 1.034 1.257l.028.042c.245.352.45.72.613 1.1.25.6.366 1.233.366 1.886 0 2.625-1.414 4.97-3.535 7.091A8.001 8.001 0 0117.657 18.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.043 15.122l-1.414 1.414A8.001 8.001 0 019.043 15.122z" />
            </svg>
        </span>
        <div style={{marginLeft:16}}>
            <div style={{fontSize:'2.2rem',fontWeight:700,color:'var(--primary-green)'}}>{streak}</div>
            <span className="text-muted">Day Streak</span>
        </div>
    </div>
);

const CalendarButton = () => {
    const handleAddToCalendar = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const startTime = `${year}${month}${day}T200000`;
        const endTime = `${year}${month}${day}T203000`;

        const event = {
            title: "Daily Eco-Reflection",
            description: `Time to reflect on your daily waste reduction! Keep your streak going.\n\nClick here to open the app: ${window.location.href}`,
            location: "IIT Madras",
            startTime,
            endTime,
            recurrence: "RRULE:FREQ=DAILY"
        };
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&recur=${encodeURIComponent(event.recurrence)}`;
        window.open(googleCalendarUrl, '_blank');
    };

    return (
        <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 rounded-lg p-4 my-6 text-center">
            <p className="font-semibold mb-2">Want reliable reminders?</p>
            <button onClick={handleAddToCalendar} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full shadow-md transition-transform transform hover:scale-105 text-sm inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                Add Daily 8 PM Reminder to Calendar
            </button>
        </div>
    );
};

const ActionItem = ({ action, isChecked, onToggle }) => (
    <div onClick={onToggle} className="action-card" style={{cursor:'pointer',marginBottom:12}}>
        <div style={{width:24,height:24,borderRadius:8,border:'2px solid',borderColor:isChecked?'var(--primary-green)':'#cfd8dc',background:isChecked?'var(--primary-green)':'#f5f7f4',display:'flex',alignItems:'center',justifyContent:'center',marginRight:12,marginTop:2}}>
            {isChecked && (
                <svg width="16" height="16" style={{color:'#fff'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span style={{fontWeight:500,color:isChecked?'#bdbdbd':'var(--text-main)',textDecoration:isChecked?'line-through':'none'}}>{action.text}</span>
    </div>
);

const StreakBreakModal = ({ show, streak, lastDate, onLog }) => {
    const [reason, setReason] = useState('');
    if (!show) return null;
    const handleSubmit = () => {
        if (reason.trim() === '') {
            alert('Please provide a brief reason.');
            return;
        }
        onLog(reason);
        setReason('');
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all animate-fadeIn">
                <h2 className="text-2xl font-bold text-red-600">Streak Broken!</h2>
                <p className="text-gray-600 my-3">You broke your {streak}-day streak! Your last reflection was on {format(lastDate, 'MMMM d')}.</p>
                <p className="text-gray-700 font-medium">It's okay! What was the reason?</p>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="4" placeholder="e.g., Was too busy with exams..." />
                <button onClick={handleSubmit} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">
                    Log Reason & Reset Streak
                </button>
            </div>
        </div>
    );
};

// --- Screen Components ---

const HomeScreen = ({ user, navigate, userData, refreshUserData }) => {
    const [checkedActions, setCheckedActions] = useState({});
    const [isStreakModalOpen, setStreakModalOpen] = useState(false);

    useEffect(() => {
        if (userData.lastReflectionDate) {
            const lastDate = userData.lastReflectionDate.toDate();
            if (firestoreService.isStreakBroken(lastDate, userData.streak)) {
                setStreakModalOpen(true);
            }
        }
    }, [userData]);

    const handleToggleAction = (actionId) => {
        setCheckedActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));
    };
    
    const handleSubmit = async () => {
        try {
            await firestoreService.saveReflection(user.uid, checkedActions, DAILY_ACTIONS.length, userData.streak, userData.lastReflectionDate);
            alert('Success! Your checklist has been saved.');
            refreshUserData();
            setCheckedActions({});
        } catch (error) {
            console.error("Error saving reflection:", error);
            alert('Error: Could not save your checklist.');
        }
    };
    
    const handleLogStreakBreak = async (reason) => {
        try {
            await firestoreService.logStreakBreak(user.uid, { reason, streakBroken: userData.streak, date: new Date(), lastReflectionDate: userData.lastReflectionDate.toDate() });
            await firestoreService.resetStreak(user.uid);
            setStreakModalOpen(false);
            refreshUserData();
        } catch (error) { console.error("Error logging streak break:", error); }
    };

    const hasReflectedToday = userData.lastReflectionDate && differenceInCalendarDays(new Date(), userData.lastReflectionDate.toDate()) === 0;

    return (
        <div className="animate-fadeIn">
            <StreakDisplay streak={userData.streak || 0} />
            <CalendarButton />
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <header className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-800">The Green Game-Changer Checklist</h1>
                    <p className="text-gray-500 mt-2">Complete these actions today to build your streak!</p>
                </header>
                {hasReflectedToday ? (
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold text-green-700">Well Done!</h2>
                        <p className="text-gray-600 mt-2">You've completed your checklist for today. Come back tomorrow!</p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6">
                            {DAILY_ACTIONS.map((action) => (
                                <ActionItem key={action.id} action={action} isChecked={!!checkedActions[action.id]} onToggle={() => handleToggleAction(action.id)} />
                            ))}
                        </div>
                        <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 text-lg">
                            Complete for Today
                        </button>
                    </div>
                )}
            </div>
            <button onClick={() => navigate('history')} className="w-full mt-6 text-center text-blue-600 hover:text-blue-800 font-semibold py-2">
                View My Progress History
            </button>
            <StreakBreakModal show={isStreakModalOpen} streak={userData.streak} lastDate={userData.lastReflectionDate?.toDate()} onLog={handleLogStreakBreak} />
        </div>
    );
};

const HistoryScreen = ({ userId, navigate }) => {
    const [reflections, setReflections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) return;
            try {
                const data = await firestoreService.getReflections(userId);
                setReflections(data);
            } catch (error) { console.error("Error fetching history:", error); } 
            finally { setLoading(false); }
        };
        fetchHistory();
    }, [userId]);

    return (
        <div className="animate-fadeIn">
            <header className="flex items-center mb-6">
                <button onClick={() => navigate('home')} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl font-bold text-green-800">Progress History</h1>
            </header>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                {loading ? <p>Loading history...</p> : (
                    reflections.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Your history is empty. Complete a checklist to begin!</p>
                    ) : (
                        <div className="space-y-3">
                            {reflections.map(item => {
                                const completedCount = Object.values(item.answers || {}).filter(Boolean).length;
                                const total = item.totalActions || DAILY_ACTIONS.length;
                                return (
                                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border">
                                        <p className="font-semibold text-gray-700">{format(item.date.toDate(), 'MMMM d, yyyy')}</p>
                                        <p className={`font-bold text-lg ${completedCount > 3 ? 'text-green-600' : 'text-amber-500'}`}>
                                            {completedCount} / {total}
                                            <span className="text-sm font-medium text-gray-500 ml-1">actions</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const LoginScreen = () => {
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert("Could not sign in with Google. Please try again.");
        }
    };

    return (
        <div className="app-container" style={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
            <h1 className="header" style={{fontSize:'2.2rem',fontWeight:700,color:'var(--primary-green)'}}>Welcome to the</h1>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'var(--accent-green)',margin:'8px 0'}}>Green Game-Changer</h2>
            <p className="text-muted" style={{marginTop:16,maxWidth:340}}>Track your daily eco-friendly actions, build a streak, and make a positive impact on the environment at IIT Madras.</p>
            <button onClick={handleGoogleSignIn} className="button" style={{marginTop:32,display:'inline-flex',alignItems:'center',fontSize:'1.05rem'}}>
                <svg width="20" height="20" style={{marginRight:10}} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.057 4.844C14.655 15.108 18.96 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.861 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Sign In with Google
            </button>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({ streak: 0, lastReflectionDate: null });
    const [currentScreen, setCurrentScreen] = useState('home');

    const fetchUserData = useCallback(async (uid) => {
        if (!uid) return;
        setLoading(true);
        try {
            const data = await firestoreService.getUserData(uid);
            setUserData(data);
        } catch (error) { console.error("Error fetching user data:", error); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchUserData(currentUser.uid);
            } else {
                setLoading(false); // No user, stop loading
            }
        });
        return () => unsubscribe();
    }, [fetchUserData]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // The onAuthStateChanged listener will handle setting user to null
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    if (loading) {
        return <Loader text={user ? "Loading Your Checklist..." : "Connecting..."} />;
    }

    if (!user) {
        return <LoginScreen />;
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case 'history':
                return <HistoryScreen userId={user.uid} navigate={setCurrentScreen} />;
            case 'home':
            default:
                return <HomeScreen user={user} navigate={setCurrentScreen} userData={userData} refreshUserData={() => fetchUserData(user.uid)} />;
        }
    };
    
    return (
        <div className="app-container">
            <AppHeader user={user} onSignOut={handleSignOut} />
            {renderScreen()}
        </div>
    );
}

