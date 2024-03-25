import { BriefcaseIcon, MapIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";


export function SectionHeaderWithAddAction(
  { title, addButton }: { title: string, addButton: ReactNode }
) {
  return (
    <div className="mt-3 border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-3xl font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">
        {/* <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {addText}
        </button> */}
        {addButton}
      </div>
    </div>
  )
}

export function StandardHeader({
  title,
  text2,
  text3
}: {
  title: string,
  text2: string,
  text3: string
}) {
  return (
    <div className="min-w-0 flex-1">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {title}
      </h2>
      <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {text2}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {text3}
        </div>
      </div>
    </div>
  )
}