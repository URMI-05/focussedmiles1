// import { useEffect, useState } from "react";
// import { auth, db } from "./firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   setDoc
// } from "firebase/firestore";
// function Dashboard() {
// const [level, setLevel] = useState(1);
// const [showLevelUp, setShowLevelUp] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [activity, setActivity] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [points, setPoints] = useState(0);

//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [time, setTime] = useState(0);
//   const [running, setRunning] = useState(false);
// const [showBadgeUp, setShowBadgeUp] = useState(false);
// const [prevBadge, setPrevBadge] = useState("");
//   const navigate = useNavigate();
// const getLevel = (points) => {
//   if (points >= 500) return 4;
//   if (points >= 250) return 3;
//   if (points >= 100) return 2;
//   return 1;
// };
// const formatTime = (seconds) => {
//   const hrs = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;

//   if (hrs > 0) {
//     return `${hrs}h ${mins}m ${secs}s`;
//   }
//   return `${mins}m ${secs}s`;
// };
// useEffect(() => {
//   const currentBadge = getBadge(points);

//   if (prevBadge && prevBadge !== currentBadge) {
//     setShowBadgeUp(true);
//   }

//   setPrevBadge(currentBadge);
// }, [points, prevBadge]);
// useEffect(() => {
//   const newLevel = getLevel(points);

//   if (newLevel > level) {
//     setShowLevelUp(true); 
//   }

//   setLevel(newLevel);
// }, [points]);

//   useEffect(() => {
//     let interval;

//     if (running) {
//       interval = setInterval(() => {
//         setTime((prev) => prev + 1);
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [running]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (u) => {
//       if (u) {
//         setUser(u);

//         const docRef = doc(db, "users", u.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setUserData(docSnap.data());
//           setPoints(docSnap.data().points || 0);
//         } else {
//           setUserData({ name: "User" });
//         }

//         fetchActivities(u.uid);
//       } else {
//         navigate("/");
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   const fetchActivities = async (uid) => {
//     const querySnapshot = await getDocs(collection(db, "activities"));
//     const list = [];

//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       if (data.userId === uid) {
//         list.push({ id: doc.id, ...data });
//       }
//     });

//     setActivities(list);
//   };
//   const handleAddActivity = async () => {
//     if (!activity) return;

//     await addDoc(collection(db, "activities"), {
//       name: activity,
//       userId: user.uid
//     });

//     setActivity("");
//     fetchActivities(user.uid);
//   };

//   const handleDeleteActivity = async (id) => {
//     await deleteDoc(doc(db, "activities", id));
//     fetchActivities(user.uid);
//   };
//   const startTimer = (activityName) => {
//     setSelectedActivity(activityName);
//     setTime(0);
//     setRunning(true);
//   };
// const getBadge = (points) => {
//   if (points >= 500) return " Focus Master";
//   if (points >= 300) return " Productivity Pro";
//   if (points >= 150) return " Consistent";
//   if (points >= 50) return " Focus Learner";
//   return " Beginner";
// };
//  const stopTimer = async () => {
//   setRunning(false);

//   const earnedPoints = Math.floor(time / 10);

//   const userRef = doc(db, "users", user.uid);
//   const docSnap = await getDoc(userRef);

//   let currentPoints = 0;

//   if (docSnap.exists()) {
//     currentPoints = docSnap.data().points || 0;
//   }

//   const newPoints = currentPoints + earnedPoints;

//   await setDoc(
//     userRef,
//     {
//       ...userData,
//       points: newPoints
//     },
//     { merge: true }
//   );

//   setPoints(newPoints);
// };

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/");
//   };
//   if (!user) {
//     return (
//       <div className="wrapper">
//         <div className="card">
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//   <div className="dashboardPage">

//     {/* TOP BAR */}
//     <div className="topBar">
//       <div>
//         <h2>Welcome {userData?.name || "User"} </h2>
//         <p> Points: {points}</p>
//         <p> Badge: {getBadge(points)}</p>
//       </div>

//       <button className="logoutBtn" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>

//     {/* MAIN CARD */}
//     <div className="dashboardCard">

//       {/* TIMER */}
//       {selectedActivity && (
//         <div className="timerBox">
//           <h3>{selectedActivity}</h3>
//           <p className="timeText">{formatTime(time)}</p>

//           {!running ? (
//             <button onClick={() => setRunning(true)}>Resume</button>
//           ) : (
//             <button onClick={stopTimer}>Stop</button>
//           )}
//         </div>
//       )}

//       {/* ADD ACTIVITY */}
//       <div className="inputRow">
//         <input
//           placeholder="Add activity (e.g. Math)"
//           value={activity}
//           onChange={(e) => setActivity(e.target.value)}
//         />
//         <button onClick={handleAddActivity}>Add</button>
//       </div>

//       {/* ACTIVITIES */}
//       <div className="activityList">
//         {activities.map((act) => (
//           <div key={act.id} className="activityItem">

//             <span onClick={() => startTimer(act.name)}>
//               {act.name}
//             </span>

//             <button onClick={() => handleDeleteActivity(act.id)}>
//               ✕
//             </button>

//           </div>
//         ))}
//       </div>

//     </div>

//   </div>
// );
// }

// export default Dashboard;
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc
} from "firebase/firestore";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState(0);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const navigate = useNavigate();

  // 🔹 LEVEL SYSTEM
  const getLevel = (points) => {
    if (points >= 500) return 4;
    if (points >= 250) return 3;
    if (points >= 100) return 2;
    return 1;
  };

  const [level, setLevel] = useState(1);

  useEffect(() => {
    setLevel(getLevel(points));
  }, [points]);

  // 🔹 BADGE SYSTEM
  const getBadge = (points) => {
    if (points >= 500) return "Focus Master";
    if (points >= 300) return "Productivity Pro";
    if (points >= 150) return "Consistent";
    if (points >= 50) return " Focus Learner";
    return "Beginner";
  };

  // 🔹 TIME FORMAT
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // 🔹 TIMER
  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  // 🔹 AUTH + LOAD DATA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setPoints(docSnap.data().points || 0);
        } else {
          setUserData({ name: "User" });
        }

        fetchActivities(u.uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔹 FETCH ACTIVITIES
  const fetchActivities = async (uid) => {
    const querySnapshot = await getDocs(collection(db, "activities"));
    const list = [];

    querySnapshot.forEach((docItem) => {
      const data = docItem.data();
      if (data.userId === uid) {
        list.push({ id: docItem.id, ...data });
      }
    });

    setActivities(list);
  };

  // 🔹 ADD ACTIVITY
  const handleAddActivity = async () => {
    if (!activity) return;

    await addDoc(collection(db, "activities"), {
      name: activity,
      userId: user.uid
    });

    setActivity("");
    fetchActivities(user.uid);
  };

  // 🔹 DELETE ACTIVITY
  const handleDeleteActivity = async (id) => {
    await deleteDoc(doc(db, "activities", id));
    fetchActivities(user.uid);
  };

  // 🔹 START TIMER
  const startTimer = (activityName) => {
    setSelectedActivity(activityName);
    setTime(0);
    setRunning(true);
  };

  // 🔹 STOP TIMER + UPDATE POINTS
  const stopTimer = async () => {
    setRunning(false);

    const earnedPoints = Math.floor(time / 10);

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    let currentPoints = 0;
    if (docSnap.exists()) {
      currentPoints = docSnap.data().points || 0;
    }

    const newPoints = currentPoints + earnedPoints;

    await setDoc(
      userRef,
      {
        ...userData,
        points: newPoints
      },
      { merge: true }
    );

    setPoints(newPoints);
  };

  // 🔹 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // 🔹 LOADING SCREEN
  if (!user) {
    return (
      <div className="wrapper">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // 🔹 UI
  return (
    <div className="dashboardPage">

      {/* TOP BAR */}
      <div className="topBar">
        <div>
          <h2>Welcome {userData?.name || "User"} </h2>
          <p> Points: {points}</p>
          <p> Level: {level}</p>
          <p> Badge: {getBadge(points)}</p>
        </div>

        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="dashboardCard">

        {/* TIMER */}
        {selectedActivity && (
          <div className="timerBox">
            <h3>{selectedActivity}</h3>
            <p className="timeText">{formatTime(time)}</p>

            {!running ? (
              <button onClick={() => setRunning(true)}>Resume</button>
            ) : (
              <button onClick={stopTimer}>Stop</button>
            )}
          </div>
        )}

        {/* ADD ACTIVITY */}
        <div className="inputRow">
          <input
            placeholder="Add activity (e.g. Math)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
          <button onClick={handleAddActivity}>Add</button>
        </div>

        {/* ACTIVITIES */}
        <div className="activityList">
          {activities.map((act) => (
            <div key={act.id} className="activityItem">

              <span onClick={() => startTimer(act.name)}>
                {act.name}
              </span>

              <button onClick={() => handleDeleteActivity(act.id)}>
                ✕
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;