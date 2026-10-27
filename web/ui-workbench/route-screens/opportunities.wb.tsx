import { useEffect, useState } from "react"
import {
  Building2Icon,
  CalendarClockIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
  WalletIcon,
  XIcon,
} from "lucide-react"

import {
  OPPORTUNITY_TYPE_LABELS,
  formatEligibilities,
  getDeadlinePresentation,
  normalizeMajors,
  type Opportunity,
} from "@/lib/opportunities"
import type {
  EducationLevel,
  OpportunityMajor,
  OpportunityType,
} from "@/lib/opportunities"
import { formatCampusDate } from "@/lib/utils"
import { Page } from "@/components/shared/page"
import { CardGrid } from "@/components/shared/page/card-grid"
import { SearchFilter } from "@/components/shared/list-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Toggle } from "@/components/ui/toggle"

import { SiteHeader } from "../components/site-header.wb"
import { SignedInToggle } from "../components/signed-in"
import { SiteFooter } from "../components/site-footer.wb"

import {
  EDUCATION_OPTIONS,
  FIXTURES,
  MAJOR_OPTIONS,
  TOTAL,
  TYPE_OPTIONS,
  YEAR_OPTIONS,
} from "./opportunities.wb.demo"

interface Filters {
  type: OpportunityType[]
  education: EducationLevel[]
  years: string[]
  majors: string[]
  q: string
  hideExpired: boolean
}

const INITIAL: Filters = {
  type: ["research", "internship"],
  education: [],
  years: [],
  majors: [],
  q: "",
  hideExpired: true,
}

function activeCount(filters: Filters) {
  return (
    filters.type.length +
    filters.education.length +
    filters.years.length +
    filters.majors.length
  )
}

function useIsWide() {
  const [isWide, setIsWide] = useState(
    () => window.matchMedia("(min-width: 80rem)").matches
  )
  useEffect(() => {
    const query = window.matchMedia("(min-width: 80rem)")
    const onChange = () => {
      setIsWide(query.matches)
    }
    query.addEventListener("change", onChange)
    return () => {
      query.removeEventListener("change", onChange)
    }
  }, [])
  return isWide
}

function RailFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
  defaultOpen,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  selected: readonly T[]
  onChange: (next: T[]) => void
  defaultOpen?: boolean
}) {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()
  const shown = needle
    ? options.filter((option) => option.label.toLowerCase().includes(needle))
    : options
  const allSelected = selected.length === options.length

  const toggle = (value: T) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    )
  }

  const trigger = (
    <Button variant="outline" className="w-full justify-between font-normal">
      <span className="truncate">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        {selected.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground tabular-nums">
            {selected.length}
          </span>
        )}
        <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden />
      </span>
    </Button>
  )

  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <div className="flex items-center justify-between gap-2">
            <PopoverTitle>{label}</PopoverTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                onChange(
                  allSelected ? [] : options.map((option) => option.value)
                )
              }}
            >
              {allSelected ? "Clear all" : "Select all"}
            </Button>
          </div>
        </PopoverHeader>

        {options.length > 12 && (
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            placeholder={`Search ${label.toLowerCase()}`}
            aria-label={`Search ${label.toLowerCase()}`}
            className="h-8"
          />
        )}

        <div className="-mx-0.5 max-h-64 overflow-y-auto">
          {shown.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onCheckedChange={() => {
                  toggle(option.value)
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
          {shown.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              No {label.toLowerCase()} matches “{query}”.
            </p>
          )}
        </div>

        {selected.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              onChange([])
            }}
          >
            <XIcon aria-hidden />
            Clear {label.toLowerCase()}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

function Rail({
  filters,
  setFilters,
}: {
  filters: Filters
  setFilters: (next: Filters) => void
}) {
  const active = activeCount(filters)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontalIcon
            className="size-4 text-muted-foreground"
            aria-hidden
          />
          Filters
        </CardTitle>
        <CardAction>
          {active > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="-mr-2 h-7 text-xs"
              onClick={() => {
                setFilters({ ...INITIAL, q: filters.q })
              }}
            >
              <XIcon className="size-3.5" aria-hidden />
              Clear
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <RailFilter
            label="Type"
            options={TYPE_OPTIONS}
            selected={filters.type}
            onChange={(type) => {
              setFilters({ ...filters, type })
            }}
          />
          <RailFilter
            label="Education"
            options={EDUCATION_OPTIONS}
            selected={filters.education}
            onChange={(education) => {
              setFilters({ ...filters, education })
            }}
          />
          <RailFilter
            label="Year"
            options={YEAR_OPTIONS}
            selected={filters.years}
            onChange={(years) => {
              setFilters({ ...filters, years })
            }}
          />
          <RailFilter
            label="Major"
            options={MAJOR_OPTIONS}
            selected={filters.majors as OpportunityMajor[]}
            defaultOpen
            onChange={(majors) => {
              setFilters({ ...filters, majors })
            }}
          />
        </div>

        <Separator className="my-4" />

        <Toggle
          variant="outline"
          pressed={filters.hideExpired}
          onPressedChange={(hideExpired) => {
            setFilters({ ...filters, hideExpired })
          }}
          className="w-full justify-start"
        >
          {filters.hideExpired
            ? "Active opportunities only"
            : "Including expired"}
        </Toggle>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Majors are a guide, not a strict requirement. Always check the
          official programme page.
        </p>
      </CardContent>
    </Card>
  )
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [areMajorsExpanded, setAreMajorsExpanded] = useState(false)
  const majors = normalizeMajors(opportunity.majors)
  const eligibilities = formatEligibilities(opportunity.eligibilities)
  const deadline = getDeadlinePresentation(opportunity.deadline)
  const expired = deadline.kind === "closed"
  const description = opportunity.description ?? ""
  const canExpandDescription = description.length > 280
  const visibleMajors = areMajorsExpanded ? majors : majors.slice(0, 5)

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="secondary">
          {OPPORTUNITY_TYPE_LABELS[opportunity.type]}
        </Badge>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              deadline.kind === "closing-soon"
                ? "default"
                : deadline.kind === "closed"
                  ? "outline"
                  : "secondary"
            }
          >
            {deadline.label}
          </Badge>
          {opportunity.deadline && (
            <span className="text-xs text-muted-foreground">
              {formatCampusDate(opportunity.deadline)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg/snug font-semibold text-balance">
          {opportunity.name}
        </h3>
        {opportunity.host && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2Icon className="size-4 shrink-0" aria-hidden />
            {opportunity.host}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p
          className={
            canExpandDescription && !isDescriptionExpanded
              ? "line-clamp-4 text-sm/relaxed text-muted-foreground"
              : "text-sm/relaxed text-muted-foreground"
          }
        >
          {description}
        </p>
        {canExpandDescription && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3"
            onClick={() => {
              setIsDescriptionExpanded((value) => !value)
            }}
          >
            {isDescriptionExpanded ? (
              <ChevronUpIcon aria-hidden />
            ) : (
              <ChevronDownIcon aria-hidden />
            )}
            {isDescriptionExpanded ? "Show less" : "Read full description"}
          </Button>
        )}
      </div>

      <dl className="flex flex-wrap gap-2 text-xs">
        {opportunity.deadline && deadline.relative && (
          <Badge
            variant="secondary"
            className="h-auto px-2.5 py-1 text-muted-foreground"
            render={<div />}
          >
            <dt className="sr-only">Deadline</dt>
            <CalendarClockIcon className="size-3.5 shrink-0" aria-hidden />
            <dd>{deadline.relative}</dd>
          </Badge>
        )}
        {opportunity.location && (
          <Badge
            variant="secondary"
            className="h-auto px-2.5 py-1 text-muted-foreground"
            render={<div />}
          >
            <dt className="sr-only">Location</dt>
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
            <dd>{opportunity.location}</dd>
          </Badge>
        )}
        {opportunity.funding && (
          <Badge
            variant="secondary"
            className="h-auto px-2.5 py-1 text-muted-foreground"
            render={<div />}
          >
            <dt className="sr-only">Funding</dt>
            <WalletIcon className="size-3.5 shrink-0" aria-hidden />
            <dd>{opportunity.funding}</dd>
          </Badge>
        )}
      </dl>

      {eligibilities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Eligibility
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {eligibilities.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {majors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Eligible majors
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {visibleMajors.map((major) => (
              <Badge key={major} variant="secondary">
                <GraduationCapIcon aria-hidden />
                {major}
              </Badge>
            ))}
            {majors.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setAreMajorsExpanded((value) => !value)
                }}
              >
                {areMajorsExpanded
                  ? "Show fewer"
                  : `Show ${String(majors.length - 5)} more`}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {opportunity.link ? (
          <Button
            nativeButton={false}
            size="sm"
            render={
              // The real link leaves the app; here it has nowhere to go.
              // oxlint-disable-next-line jsx-a11y/anchor-is-valid
              <a href="#">
                <ExternalLinkIcon aria-hidden />
                Application link
              </a>
            }
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            No application link provided
          </span>
        )}
        {opportunity.deadline && !expired && (
          <Button variant="outline" size="sm">
            <CalendarPlusIcon aria-hidden />
            Add deadline to calendar
          </Button>
        )}
        <Button variant="ghost" size="sm">
          <PencilIcon aria-hidden />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon aria-hidden />
          Delete
        </Button>
      </div>
    </Card>
  )
}

const ACCOUNT = { name: "Aiza Tursyn", handle: "@aiza.t" }

export default function OpportunitiesRail() {
  const [signedIn, setSignedIn] = useState(false)
  const [filters, setFilters] = useState(INITIAL)
  const [isRailOpen, setIsRailOpen] = useState(false)
  const isWide = useIsWide()
  const rail = <Rail filters={filters} setFilters={setFilters} />

  return (
    <div className="flex min-h-full flex-col bg-background">
      <SiteHeader account={signedIn ? ACCOUNT : null} />
      <SignedInToggle signedIn={signedIn} onToggle={setSignedIn} />

      <main className="flex-1 px-4 py-6 sm:px-6">
        <Page
          title="Opportunities Digest"
          description="Research, internships, grants and scholarships for NU students."
          width="wide"
          actions={
            <Button>
              <PlusIcon aria-hidden />
              Add opportunity
            </Button>
          }
        >
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
            {isWide && <aside className="top-[4.5rem] xl:sticky">{rail}</aside>}

            <div className="min-w-0 space-y-4">
              <Card className="flex-row flex-wrap items-center gap-3 p-3">
                <div className="w-64 min-w-0">
                  <SearchFilter
                    className="w-full flex-none"
                    value={filters.q}
                    onChange={(q) => {
                      setFilters({ ...filters, q })
                    }}
                    placeholder="Search"
                  />
                </div>
                <Button
                  variant="outline"
                  className="xl:hidden"
                  onClick={() => {
                    setIsRailOpen(true)
                  }}
                >
                  <SlidersHorizontalIcon aria-hidden />
                  Filters
                  {activeCount(filters) > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground tabular-nums">
                      {activeCount(filters)}
                    </span>
                  )}
                </Button>
                <span className="ml-auto hidden shrink-0 text-sm text-muted-foreground sm:block">
                  {TOTAL} opportunities
                </span>
              </Card>

              <CardGrid columns={1}>
                {FIXTURES.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </CardGrid>

              <p className="text-sm text-muted-foreground">
                Showing {FIXTURES.length} of {TOTAL} opportunities
              </p>
            </div>
          </div>
        </Page>
      </main>

      <SiteFooter />

      <Sheet open={isRailOpen} onOpenChange={setIsRailOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="sr-only">Filters</SheetTitle>
          </SheetHeader>
          {rail}
        </SheetContent>
      </Sheet>
    </div>
  )
}
