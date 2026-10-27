import {
  EDUCATION_LEVELS,
  EDUCATION_LEVEL_LABELS,
  OPPORTUNITY_MAJORS,
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_LABELS,
} from "@/lib/opportunities/constants"
import type { Opportunity, OpportunityMajor } from "@/lib/opportunities/types"

export const TYPE_OPTIONS = OPPORTUNITY_TYPES.map((value) => ({
  value,
  label: OPPORTUNITY_TYPE_LABELS[value],
}))

export const EDUCATION_OPTIONS = EDUCATION_LEVELS.map((value) => ({
  value,
  label: EDUCATION_LEVEL_LABELS[value],
}))

export const YEAR_OPTIONS = [1, 2, 3, 4].map((value) => ({
  value: String(value),
  label: `Year ${value}`,
}))

export const MAJOR_OPTIONS = OPPORTUNITY_MAJORS.map((value) => ({
  value,
  label: value,
}))

const majors = (id: number, ...names: OpportunityMajor[]) =>
  names.map((major, index) => ({ id: index + 1, opportunity_id: id, major }))

const eligibility = (
  education_level: "UG" | "GrM" | "PhD",
  year: number | null
) => ({ id: 0, education_level, year })

const STAMP = {
  created_at: "2026-09-01T09:00:00Z",
  updated_at: "2026-09-01T09:00:00Z",
}

export const FIXTURES: Opportunity[] = [
  {
    ...STAMP,
    id: 1,
    name: "Undergraduate Research Assistantship in Applied Mathematics",
    description:
      "The Department of Mathematics is looking for two undergraduate students to join a research group on numerical methods for PDEs. You will work under a faculty supervisor, attend the weekly seminar, and present your results at the spring symposium. No prior research experience is required — we read how you think, not what you have already done.",
    host: "Department of Mathematics, School of Engineering and Digital Sciences",
    type: "research",
    deadline: "2026-10-28",
    location: "Astana",
    funding: "₸120,000 per month",
    link: "https://nuspace.kz/o/1",
    eligibilities: [eligibility("UG", 3)],
    majors: majors(
      1,
      "Applied Mathematics",
      "Computer Science",
      "Data Science"
    ),
  },
  {
    ...STAMP,
    id: 2,
    name: "Summer Internship Programme at KazMunayGas",
    description:
      "A twelve-week paid internship across drilling, refining and logistics divisions. Interns are assigned to a site, paired with a mentor, and finish with a project they present to the leadership team. Housing and travel from Astana are covered.",
    host: "KazMunayGas",
    type: "internship",
    deadline: "2026-10-17",
    location: "Aktau, Kazakhstan",
    funding: "Covered — housing and travel included",
    link: "https://nuspace.kz/o/2",
    eligibilities: [
      eligibility("UG", 2),
      eligibility("UG", 3),
      eligibility("UG", 4),
    ],
    majors: majors(
      2,
      "Petroleum Engineering",
      "Chemical and Materials Engineering",
      "Mechanical and Aerospace Engineering",
      "Mining Engineering"
    ),
  },
  {
    ...STAMP,
    id: 3,
    name: "NU Summer School: Sustainable Cities",
    description:
      "Four weeks of lectures, fieldwork and a studio project on urban heat, water and mobility. Open to students of any year and any major, taught jointly with TU Delft. Applications are reviewed on a rolling basis until the cohort is full.",
    host: "NU School of Engineering and Digital Sciences",
    type: "summer_school",
    deadline: null,
    location: "Astana",
    funding: "Tuition waiver for enrolled NU students",
    link: "https://nuspace.kz/o/3",
    eligibilities: [eligibility("GrM", 1)],
    majors: majors(
      3,
      "Civil and Environmental Engineering",
      "Public Policy",
      "Public Administration"
    ),
  },
  {
    ...STAMP,
    id: 4,
    name: "Nazarbayev University Full Tuition Scholarship",
    description:
      "Full tuition, monthly stipend and accommodation for undergraduate and master's students. The application is a single form plus a short statement; shortlisted applicants are interviewed in March.",
    host: "Nazarbayev University",
    type: "scholarship",
    deadline: "2027-03-01",
    location: "Astana",
    link: "https://nuspace.kz/o/4",
    eligibilities: [
      eligibility("UG", 1),
      eligibility("GrM", 1),
      eligibility("PhD", null),
    ],
    majors: majors(
      4,
      "Computer Science",
      "Economics",
      "Political Science and International Relations"
    ),
  },
  {
    ...STAMP,
    id: 5,
    name: "International Conference on Mining Technology 2026",
    description:
      "Three days of keynotes, technical sessions and a student poster hall. Registration is free for NU students presenting; the early-bird rate for attendees closes a week before the event.",
    host: "Satbayev University",
    type: "conference",
    deadline: "2026-09-30",
    location: "Almaty, Kazakhstan",
    funding: "₸45,000 registration (free for presenters)",
    link: "https://nuspace.kz/o/5",
    eligibilities: [eligibility("UG", 4)],
    majors: majors(5, "Mining Engineering", "Geology", "Geosciences"),
  },
  {
    ...STAMP,
    id: 6,
    name: "Seed Grant for Student Research Clubs",
    description:
      "A small grant for a registered student club to run a one-year research programme: up to twenty thousand dollars for equipment, travel and a part-time research assistant.",
    host: "NU Research Office",
    type: "grant",
    deadline: null,
    link: "https://nuspace.kz/o/6",
    eligibilities: [eligibility("UG", 3), eligibility("UG", 4)],
    majors: majors(6, "Biomedical Engineering", "Life Sciences", "Physics"),
  },
]

export const TOTAL = 128
