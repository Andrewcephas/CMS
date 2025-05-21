import { useState } from "react";

const tabs = ["Profile", "Security", "Preferences"];

function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-primary">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Profile" && <ProfileTab />}
        {activeTab === "Security" && <SecurityTab />}
        {activeTab === "Preferences" && <PreferencesTab />}
      </div>
    </div>
  );
}

// --- Profile Tab ---
function ProfileTab() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input className="w-full p-2 border rounded" placeholder="John Doe" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input className="w-full p-2 border rounded" placeholder="john@example.com" />
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
        Save Changes
      </button>
    </form>
  );
}

// --- Security Tab ---
function SecurityTab() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input type="password" className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input type="password" className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Confirm New Password</label>
        <input type="password" className="w-full p-2 border rounded" />
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
        Update Password
      </button>
    </form>
  );
}

// --- Preferences Tab ---
function PreferencesTab() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Theme</label>
        <select className="w-full p-2 border rounded">
          <option>System Default</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Notifications</label>
        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" id="emailNotifs" className="mr-2" />
          <label htmlFor="emailNotifs">Email Notifications</label>
        </div>
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
        Save Preferences
      </button>
    </form>
  );
}

export default Settings;
