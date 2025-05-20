// src/hooks/useClientProjects.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

export default function useClientProjects() {
  const { currentUser } = useAuth(); // assumes AuthContext provides currentUser
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const userProjects = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((project) => project.clientId === currentUser.uid);

      setProjects(userProjects);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { projects, loading };
}
