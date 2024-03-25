import { Fragment, ReactEventHandler, useState } from 'react'
import {
  ChevronUpDownIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition, Listbox } from '@headlessui/react'
import { classNames } from '~/lib'
import { NavLink, useNavigate } from '@remix-run/react'



export function ServicePeriodHeader({
  programName, servicePeriodName, programAreaName
}: {
  programName: string, servicePeriodName: string, programAreaName: string
}) {
  return (
    <div className="py-4 lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {programName}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {servicePeriodName}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {programAreaName}
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">

        {/* Dropdown */}
        {/* <Menu as="div" className="relative ml-3 sm:hidden">
          <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
            More
            <ChevronDownIcon className="-mr-1 ml-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                  >
                    View
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu> */}
      </div>
    </div>
  )
}

interface TabOption {
  name: string, to: string, end: boolean
}

const tabs: TabOption[] = [
  { name: 'Overview', to: '', end: true },
  { name: 'Seats', to: 'seats', end: false },
  { name: 'Services', to: 'services', end: false },
]



export function ServicePeriodTabs({
  defaultTab, baseUrl
}: {
  defaultTab: string, baseUrl: string
}) {
  const defaultTabObj = tabs.find((tab) => tab.to === defaultTab)




  const linkTo = (segment: string) => `${baseUrl}/${segment}`
  return (
    <div className="border-b border-gray-200 pb-5 sm:pb-0">

      <div className="mt-3 sm:mt-4">
        <div className="sm:hidden">
          <SelectTab tabs={tabs} defaultValue={defaultTab} baseUrl={baseUrl} />
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                end={tab.end}
                to={linkTo(tab.to)}
                className={({ isActive }) => classNames(
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                )}
                aria-current={tab.end ? 'page' : undefined}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}





export default function SelectTab({
  tabs, defaultValue, baseUrl
}: { tabs: TabOption[], defaultValue: string, baseUrl: string }) {
  const defaultTabObj = tabs.find((tab) => tab.to === defaultValue) ?? tabs[0]
  const navigate = useNavigate();
  const linkTo = (segment: string) => `${baseUrl}/${segment}`


  const [selected, setSelected] = useState(defaultTabObj)

  const handleTabChange = (tab: TabOption) => {
    setSelected(tab)
    return navigate(linkTo(tab.to))
  }

  return (
    <Listbox value={selected} onChange={(tab) => handleTabChange(tab)}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {tabs.map((tab, tabIdx) => (
              <Listbox.Option
                key={tabIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={tab}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                        }`}
                    >
                      {tab.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}



