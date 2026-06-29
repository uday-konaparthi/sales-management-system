import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/user.jpg");

  // 🧠 Load saved user data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("profile");
    if (savedData) {
      const { fullName, email, avatar } = JSON.parse(savedData);
      setFullName(fullName);
      setEmail(email);
      setAvatar(avatar || "/user.jpg");
    }
  }, []);

  // 🖼️ Handle avatar upload and preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  // 💾 Save changes to localStorage
  const handleSave = () => {
    localStorage.setItem(
      "profile",
      JSON.stringify({ fullName, email, avatar })
    );
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="pb-30 flex justify-center items-center p-6 transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Profile
        </h2>

        <div className="flex items-center gap-6 mb-8 justify-center">
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
