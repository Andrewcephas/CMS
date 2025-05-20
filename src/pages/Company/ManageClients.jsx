import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function ManageClients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addClient = async () => {
    if (!newClient) return;
    if (clients.some((c) => c.name === newClient)) return alert("Client exists!");
    await addDoc(collection(db, "clients"), { name: newClient });
    setNewClient("");
  };

  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Manage Clients</h2>
      <div className="flex gap-3 mb-3">
        <input
          type="text"
          className="border p-2 rounded-xl w-full"
          placeholder="Enter client name"
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded-xl hover:bg-red-700" onClick={addClient}>
          Add Client
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {clients.map((client) => (
          <li key={client.id} className="bg-gray-200 px-4 py-1 rounded-xl flex items-center gap-2">
            {client.name}
            <button className="text-red-600" onClick={() => deleteClient(client.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageClients;
