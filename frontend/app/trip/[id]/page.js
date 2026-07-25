"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ResultsView from "../../../components/results/ResultsView";
import Spinner from "../../../components/ui/Spinner";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { readWizard, writeWizard, seedWizard } from "../../../context/TripContext";
import { trips, generatePlan } from "../../../lib/api";
import { wizardToInput, wizardToPreferences } from "../../../lib/tripPayload";

export default function TripResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = id === "new";

  const [state, setState] = useState({ plan: null, input: null, coverImage: "" });
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  // Load: fresh plan from the wizard (sessionStorage) or a saved trip from the API.
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        if (isNew) {
          const w = readWizard();
          if (!w.plan) {
            setError("No generated plan found. Start planning to create one.");
          } else {
            setState({ plan: w.plan, input: wizardToInput(w), coverImage: w.coverImage });
          }
        } else {
          const trip = await trips.get(id).catch(() => trips.getPublic(id));
          if (active && trip) {
            setState({ plan: trip.plan, input: trip.input, coverImage: trip.coverImage });
            setSavedId(trip._id);
            setSaved(true);
          }
        }
      } catch (err) {
        if (active) setError(err.message || "Could not load this trip.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, isNew]);

  const handleSave = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/trip/new")}`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const trip = await trips.create({
        input: state.input,
        plan: state.plan,
        coverImage: state.coverImage,
      });
      setSaved(true);
      setSavedId(trip._id);
      router.replace(`/trip/${trip._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    // Load this trip's inputs back into the wizard, then open the flow.
    seedWizard({ ...state.input, preferences: state.input?.preferences });
    writeWizard({ plan: state.plan, coverImage: state.coverImage });
    router.push("/plan");
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError("");
    try {
      if (savedId) {
        const trip = await trips.regenerate(savedId);
        setState((s) => ({ ...s, plan: trip.plan }));
      } else {
        const { plan } = await generatePlan(wizardToPreferences({ ...state.input, preferences: state.input.preferences }));
        setState((s) => ({ ...s, plan }));
        writeWizard({ plan });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      let shareId = savedId;
      // Make sure the trip is saved and public before sharing.
      if (!shareId) {
        if (!user) return router.push(`/login?next=${encodeURIComponent("/trip/new")}`);
        const trip = await trips.create({ input: state.input, plan: state.plan, coverImage: state.coverImage });
        shareId = trip._id;
        setSavedId(shareId);
        setSaved(true);
      }
      await trips.update(shareId, { isPublic: true }).catch(() => {});
      const url = `${window.location.origin}/trip/${shareId}`;
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading your trip…" />
      </div>
    );
  }

  if (error && !state.plan) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <Alert type="error">{error}</Alert>
        <Button as={Link} href="/plan" className="mt-6">
          <Sparkles className="h-4 w-4" /> Start planning
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      <ResultsView
        plan={state.plan}
        input={state.input}
        coverImage={state.coverImage}
        actions={{
          onSave: handleSave,
          onEdit: handleEdit,
          onRegenerate: handleRegenerate,
          onShare: handleShare,
          saving,
          regenerating,
          saved,
          shared,
          isSavedTrip: !!savedId,
        }}
      />
    </div>
  );
}
