import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field, { inputClass } from "../components/Field";
import Button from "../components/Button";
import Notice from "../components/Notice";
import AstroWheel from "../components/AstroWheel";
import PlaceAutocompleteInput from "../components/PlaceAutocompleteInput";
import { oauth2Api } from "../api/auth";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { GENDER_OPTIONS } from "../lib/gender";

export default function CompleteBirthDetails() {
  const [form, setForm] = useState({ dateOfBirth: "", birthTime: "", birthPlace: "", gender: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRequiresBirthDetails } = useAuth();

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await oauth2Api.completeBirthDetails(form);
      setRequiresBirthDetails(false);
      navigate("/chat");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
      <div className="hidden lg:flex justify-center">
        <AstroWheel size={360} />
      </div>
      <div className="w-full max-w-md mx-auto">
        <span className="eyebrow">Almost there</span>
        <h1 className="font-display text-4xl mt-3 mb-4">Cast your chart</h1>
        <p className="text-stone mb-8">
          One last thing — your birth details, so Lomas can read your chart accurately. This is the only
          piece your Google account can't give us.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Notice type="error">{error}</Notice>
          <Field label="Date of birth">
            <input
              required
              type="date"
              className={inputClass}
              value={form.dateOfBirth}
              onChange={update("dateOfBirth")}
            />
          </Field>
          <Field label="Time of birth">
            <input
              required
              type="time"
              className={inputClass}
              value={form.birthTime}
              onChange={update("birthTime")}
            />
          </Field>
          <Field label="Place of birth">
            <PlaceAutocompleteInput
              required
              placeholder="City, Country"
              value={form.birthPlace}
              onChange={(val) => setForm((f) => ({ ...f, birthPlace: val }))}
            />
          </Field>
          <Field label="Gender">
            <select required className={inputClass} value={form.gender} onChange={update("gender")}>
              <option value="" disabled>
                Select one
              </option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Save and continue
          </Button>
        </form>
      </div>
    </div>
  );
}
