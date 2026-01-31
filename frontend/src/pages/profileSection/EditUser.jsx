import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import { userApi } from "../../api/api";
import "../../styles/EditAll.css";

const EditUser = () => {
  const navigate = useNavigate();

  /* ================= PROFILE INFO ================= */
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phoneNumber: ""
  });

  /* ================= PASSWORD ================= */
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await userApi.get("/");
        const user = res.data.currentuser;

        setProfile({
          username: user.username || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || ""
        });
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  /* ================= HANDLERS ================= */
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await userApi.patch("/update", profile);
      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setSavingPassword(true);

    try {
      await userApi.patch("/password", {
        newPassword: passwords.newPassword
      });

      alert("Password changed successfully");
      setPasswords({
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="edit-container">

        {/* ================= EDIT PROFILE ================= */}
        <form className="edit-card" onSubmit={updateProfile}>
          <h2>Edit Profile</h2>

          <input
            name="username"
            placeholder="Username"
            value={profile.username}
            onChange={handleProfileChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={profile.phoneNumber}
            onChange={handleProfileChange}
            required
          />

          <button type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {/* ================= CHANGE PASSWORD ================= */}
        <form className="edit-card" onSubmit={changePassword}>
          <h2>Change Password</h2>

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            required
          />

          <button type="submit" disabled={savingPassword}>
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>

      </div>
    </>
  );
};

export default EditUser;
