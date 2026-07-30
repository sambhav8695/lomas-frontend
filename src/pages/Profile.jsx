import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/user";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import PasswordInput from "../components/PasswordInput";
import { PasswordRequirements, PasswordMatchHint } from "../components/PasswordRequirements";
import PlaceAutocompleteInput from "../components/PlaceAutocompleteInput";
import { passwordMeetsAllRules } from "../lib/passwordRules";
import { GENDER_OPTIONS } from "../lib/gender";

export default function Profile() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", password: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [dangerError, setDangerError] = useState("");
  const [dangerLoading, setDangerLoading] = useState(false);

  useEffect(() => {
    userApi.getProfile().then((profile) => {
      refreshProfile(profile);
      setProfileForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dateOfBirth: profile.dateOfBirth || "",
        birthTime: profile.birthTime ? profile.birthTime.slice(0, 5) : "",
        birthPlace: profile.birthPlace || "",
        gender: profile.gender || "",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateProfileField(key) {
    return (e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const payload = { ...profileForm, gender: profileForm.gender || undefined };
      const updated = await userApi.updateProfile(payload);
      refreshProfile(updated);
      setProfileSuccess("Your profile has been updated.");
    } catch (err) {
      setProfileError(extractErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!passwordMeetsAllRules(pwForm.password)) {
      setPwError("Your new password doesn't meet all the requirements yet.");
      return;
    }
    if (pwForm.password !== pwForm.confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }

    setSavingPw(true);
    try {
      await userApi.changePassword(pwForm);
      setPwSuccess("Password changed successfully.");
      setPwForm({ currentPassword: "", password: "", confirmPassword: "" });
    } catch (err) {
      setPwError(extractErrorMessage(err));
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate your account? You can ask an admin to reactivate it later.")) return;
    setDangerError("");
    setDangerLoading(true);
    try {
      await userApi.deactivateAccount();
      await logout();
      navigate("/");
    } catch (err) {
      setDangerError(extractErrorMessage(err));
    } finally {
      setDangerLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete your account? This cannot be undone from here.")) return;
    setDangerError("");
    setDangerLoading(true);
    try {
      await userApi.deleteAccount();
      await logout();
      navigate("/");
    } catch (err) {
      setDangerError(extractErrorMessage(err));
    } finally {
      setDangerLoading(false);
    }
  }

  if (!profileForm) return <p className="text-center text-stone-light py-24">Loading profile…</p>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-16">
      <div>
        <span className="eyebrow">Your account</span>
        <h1 className="font-display text-4xl mt-3">{user?.firstName ? `Hello, ${user.firstName}` : "Profile"}</h1>
        <p className="text-stone mt-2">
          {user?.email} · signed in via {user?.provider?.toLowerCase() || "email"}
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl mb-6">Birth details & profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Notice type="error">{profileError}</Notice>
          <Notice type="success">{profileSuccess}</Notice>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First name">
              <input
                required
                className={inputClass}
                value={profileForm.firstName}
                onChange={updateProfileField("firstName")}
              />
            </Field>
            <Field label="Last name">
              <input
                required
                className={inputClass}
                value={profileForm.lastName}
                onChange={updateProfileField("lastName")}
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Date of birth">
              <input
                type="date"
                className={inputClass}
                value={profileForm.dateOfBirth}
                onChange={updateProfileField("dateOfBirth")}
              />
            </Field>
            <Field label="Time of birth">
              <input
                type="time"
                className={inputClass}
                value={profileForm.birthTime}
                onChange={updateProfileField("birthTime")}
              />
            </Field>
          </div>
          <Field label="Place of birth">
            <PlaceAutocompleteInput
              value={profileForm.birthPlace}
              onChange={(val) => setProfileForm((f) => ({ ...f, birthPlace: val }))}
            />
          </Field>
          <Field label="Gender">
            <select
              className={inputClass}
              value={profileForm.gender}
              onChange={updateProfileField("gender")}
            >
              <option value="">Not set</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit" loading={savingProfile}>
            Save changes
          </Button>
        </form>
      </section>

      {user?.provider === "LOCAL" && (
        <section>
          <h2 className="font-display text-2xl mb-6">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <Notice type="error">{pwError}</Notice>
            <Notice type="success">{pwSuccess}</Notice>
            <Field label="Current password">
              <PasswordInput
                required
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
            </Field>
            <Field label="New password">
              <PasswordInput
                required
                value={pwForm.password}
                onChange={(e) => setPwForm((f) => ({ ...f, password: e.target.value }))}
              />
              <PasswordRequirements password={pwForm.password} />
            </Field>
            <Field label="Confirm new password">
              <PasswordInput
                required
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              />
              <PasswordMatchHint password={pwForm.password} confirmPassword={pwForm.confirmPassword} />
            </Field>
            <Button
              type="submit"
              loading={savingPw}
              disabled={!passwordMeetsAllRules(pwForm.password) || pwForm.password !== pwForm.confirmPassword}
            >
              Update password
            </Button>
          </form>
        </section>
      )}

      <section className="border border-clay/30 rounded-card p-6">
        <h2 className="font-display text-2xl mb-2 text-clay">Danger zone</h2>
        <p className="text-sm text-stone mb-6">
          Deactivating pauses your account; deleting removes access permanently.
        </p>
        <Notice type="error">{dangerError}</Notice>
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={handleDeactivate} loading={dangerLoading}>
            Deactivate account
          </Button>
          <Button
            onClick={handleDelete}
            loading={dangerLoading}
            className="!bg-clay hover:!bg-clay/90"
          >
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}
