import { PaperClipIcon } from '@heroicons/react/20/solid'
import { ProgramArea } from '~/lib/database/program-area/program-area-model'

export default function ProgramAreaDetails(
  { programArea }: { programArea: ProgramArea }
) {


  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Program Area Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          created on {programArea.created_date.toLocaleDateString()}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Name
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{programArea.name}</span>
              <span className="ml-4 flex-shrink-0">
                <button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Status
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {programArea.status}
              </span>
              <span className="ml-4 flex-shrink-0">
                <button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Description
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {programArea.description}
              </span>
              <span className="ml-4 flex-shrink-0">
                <button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  )
}
