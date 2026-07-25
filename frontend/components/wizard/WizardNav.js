"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export default function WizardNav({ onBack, onNext, nextLabel = "Continue", nextDisabled, backLabel = "Back", hideBack }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {hideBack ? (
        <span />
      ) : (
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> {backLabel}
        </Button>
      )}
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel} <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
