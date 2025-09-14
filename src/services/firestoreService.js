// services/firestoreService.js
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import { auth, db } from '../firebase/config';

const firestoreService = {
  // Get users sorted by streak descending
  getLeaderboardUsers: async () => {
    const q = query(
      collection(db, firestoreService.USER_COLLECTION),
      orderBy('streak', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
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
      streak: newStreak, 
      lastReflectionDate: Timestamp.fromDate(today)
    }, { merge: true });
  },

  getReflections: async (uid) => {
    const q = query(
      collection(db, firestoreService.USER_COLLECTION, uid, firestoreService.REFLECTIONS_COLLECTION), 
      orderBy('date', 'desc')
    );
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

export default firestoreService;