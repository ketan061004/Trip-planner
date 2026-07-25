"use client";

import { Save, Pencil, RefreshCw, Share2, Download, Check } from "lucide-react";
import Button from "../ui/Button";

export default function ActionBar({
  onSave, onEdit, onRegenerate, onShare, onDownload,
  saving, regenerating, saved, shared, isSavedTrip,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {onSave && (
        <Button onClick={onSave} loading={saving} variant={saved ? "outline" : "gradient"}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? (isSavedTrip ? "Saved" : "Saved!") : "Save Trip"}
        </Button>
      )}
      {onEdit && (
        <Button onClick={onEdit} variant="outline">
          <Pencil className="h-4 w-4" /> Edit Preferences
        </Button>
      )}
      {onRegenerate && (
        <Button onClick={onRegenerate} loading={regenerating} variant="outline">
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
      )}
      {onShare && (
        <Button onClick={onShare} variant="outline">
          {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {shared ? "Link copied" : "Share"}
        </Button>
      )}
      {onDownload && (
        <Button onClick={onDownload} variant="outline">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      )}
    </div>
  );
}
