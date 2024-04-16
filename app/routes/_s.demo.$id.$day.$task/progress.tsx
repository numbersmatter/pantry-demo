import { Link } from "@remix-run/react";


export type Step = {
  step_id: string,
  name: string,
  to: string,
  status: 'complete' | 'current' | 'upcoming',
}
const steps: Step[] = [
  { step_id: "1", name: 'Step 1', to: '#', status: 'complete' },
  { step_id: "2", name: 'Step 2', to: '#', status: 'current' },
  { step_id: "3", name: 'Step 3', to: '#', status: 'upcoming' },
  { step_id: "4", name: 'Step 4', to: '#', status: 'upcoming' },
];

export function ProgressSteps({ steps }: { steps: Step[] }) {
  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <p className="text-sm font-medium">
        Step {steps.findIndex((step) => step.status === 'current') + 1} of {steps.length}
      </p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === 'complete' ? (
              <Link to={step.to} className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                <span className="sr-only">{step.name}</span>
              </Link>
            ) : step.status === 'current' ? (
              <Link to={step.to} className="relative flex items-center justify-center" aria-current="step">
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                <span className="sr-only">{step.name}</span>
              </Link>
            ) : (
              <Link to={step.to} className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                <span className="sr-only">{step.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
