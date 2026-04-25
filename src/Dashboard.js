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

  // 🔹 LEVEL
  const getLevel = (points) => {
    if (points >= 500) return 4;
    if (points >= 250) return 3;
    if (points >= 100) return 2;
    return 1;
  };

  const level = getLevel(points);

  // 🔹 BADGE
  const getBadge = (points) => {
    if (points >= 500) return "Focus Master";
    if (points >= 300) return "Productivity Pro";
    if (points >= 150) return "Consistent";
    if (points >= 50) return "Focus Learner";
    return "Beginner";
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

  // 🔹 FORMAT TIME
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 🔹 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const userRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setPoints(docSnap.data().points || 0);
        }

        fetchActivities(u.uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

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
      userId: user.uid,
      totalTime: 0
    });

    setActivity("");
    fetchActivities(user.uid);
  };

  // 🔹 DELETE
  const handleDeleteActivity = async (id) => {
    await deleteDoc(doc(db, "activities", id));
    fetchActivities(user.uid);
  };

  // 🔹 START TIMER
  const startTimer = (item) => {
    setSelectedActivity(item);
    setTime(0);
    setRunning(true);
  };

  // 🔹 STOP TIMER (FIXED)
  const stopTimer = async () => {
    setRunning(false);

    const minutes = Math.floor(time / 60);
    const earnedPoints = minutes * 10;

    // 🔥 UPDATE ACTIVITY TIME
    const activityRef = doc(db, "activities", selectedActivity.id);
    const activitySnap = await getDoc(activityRef);

    let prevTime = 0;
    if (activitySnap.exists()) {
      prevTime = activitySnap.data().totalTime || 0;
    }

    const newTotalTime = prevTime + time;

    await setDoc(
      activityRef,
      { totalTime: newTotalTime },
      { merge: true }
    );

    // 🔥 UPDATE USER POINTS
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let currentPoints = 0;
    if (userSnap.exists()) {
      currentPoints = userSnap.data().points || 0;
    }

    const newPoints = currentPoints + earnedPoints;

    await setDoc(
      userRef,
      { points: newPoints },
      { merge: true }
    );

    setPoints(newPoints);

    const messages = [
      "Great focus! 🔥",
      "You're improving 💪",
      "Keep going 🚀"
    ];

    const message =
      messages[Math.floor(Math.random() * messages.length)];

    alert(`Time: ${minutes} mins\nPoints: ${earnedPoints}\n${message}`);

    setSelectedActivity(null);
    setTime(0);

    fetchActivities(user.uid); // 🔥 refresh UI
  };

  // 🔹 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="wrapper">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="card">

        <div className="header">
          <h2>Hello {userData?.name || "User"} </h2>
          <p>Stay focused. Earn points.</p>
        </div>

        <div className="stats">
          <span>⭐ {points}</span>
          <span>🏆 Level {level}</span>
          <span>🎖 {getBadge(points)}</span>
        </div>

        {selectedActivity && (
          <div className="timer">
            <h3>{selectedActivity.name}</h3>
            <h1>{formatTime(time)}</h1>

            {running ? (
              <button onClick={stopTimer}>Stop</button>
            ) : (
              <button onClick={() => setRunning(true)}>Resume</button>
            )}
          </div>
        )}

        <input
          placeholder="Add activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
        <button onClick={handleAddActivity}>Add</button>

        {activities.map((item) => (
          <div
            key={item.id}
            className="activity"
            onClick={() => startTimer(item)}
          >
            <strong>{item.name}</strong>
            <p style={{ fontSize: "12px", color: "gray" }}>
              Total: {formatTime(item.totalTime || 0)}
            </p>
          </div>
        ))}

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;