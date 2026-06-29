import React, { useEffect, useState } from "react";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  // 🌓 Apply dark mode to <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ darkMode, notifications, autoUpdate })
    );
    alert("✅ Preferences saved successfully!");
  };

  // 🧠 Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDarkMode(parsed.darkMode);
      setNotifications(parsed.notifications);
      setAutoUpdate(parsed.autoUpdate);
    }
  }, []);

  return (
    <div className="py-35 flex justify-center items-center p-6 transition-colors duration-300 bg-black">
      <div className="w-full max-w-2xl bg-white dark:bg-black/10 rounded-2xl shadow-lg p-8 border border-gray-400 dark:border-gray-300 transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Dark Mode */}
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Dark Mode
            </p>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Email Notifications
            </p>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                notifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  notifications ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>

          {/* Auto Updates */}
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Auto Updates
            </p>
            <button
              onClick={() => setAutoUpdate(!autoUpdate)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                autoUpdate ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  autoUpdate ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
