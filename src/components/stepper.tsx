"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Step = {
  id: number;
  name: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              "relative",
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            )}
          >
            {stepIdx < currentStep - 1 ? (
              // Completed step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                </div>
                 <p className="absolute -bottom-7 w-max -translate-x-1/3 text-center text-xs font-medium text-primary">{step.name}</p>
              </>
            ) : stepIdx === currentStep - 1 ? (
              // Current step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="absolute -bottom-7 w-max -translate-x-1/3 text-center text-xs font-medium text-primary">{step.name}</p>
              </>
            ) : (
              // Upcoming step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-border" />
                </div>
                <div
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent"
                    aria-hidden="true"
                  />
                </div>
                <p className="absolute -bottom-7 w-max -translate-x-1/3 text-center text-xs text-muted-foreground">{step.name}</p>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
