import { PaperClipIcon } from '@heroicons/react/20/solid'
import { FamilyAppModel } from '~/lib/database/families/types'


interface family {
}


export default function FamilyDisplay({ family }: { family: FamilyAppModel }) {
  return (
    <>
      <div className="py-3 px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Family Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Family Details.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <SingleTextUpdate
            fieldLabel='Family Name'
            fieldId='family_name'
            fieldValue={family.family_name}
          />

        </dl>
      </div>
    </>
  )
}


function SingleTextUpdate({
  fieldId, fieldLabel, fieldValue
}: {
  fieldId: string,
  fieldLabel: string,
  fieldValue: string
}) {
  return <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">
      {fieldLabel}
    </dt>
    <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
      <span className="flex-grow">
        {fieldValue}
      </span>
      <span className="ml-4 flex-shrink-0">
        <button type="button" className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
          Update
        </button>
      </span>
    </dd>
  </div>
}

