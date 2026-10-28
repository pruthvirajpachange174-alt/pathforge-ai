# TODO - Government Exam Syllabus & Opportunities Inputs

## Problem
Admin form (`GovernmentExamForm.tsx`) was missing `syllabus` input entirely and
missing the `opportunities` input, so newly added exams (e.g. DRDO CEPTAM) were
saved with empty syllabus/opportunities.

## Steps
- [x] Add `syllabus` to form state + Syllabus textarea input in `GovernmentExamForm.tsx`
- [x] Add `opportunities` textarea input in `GovernmentExamForm.tsx`
- [x] Populate both fields when editing an existing exam (stringify JSON syllabus)
- [x] Parse syllabus on submit (JSON object/array, or one-topic-per-line -> array)
- [x] Add `syllabus` to `GovernmentExam` type in `client/src/types/index.ts`
- [x] Add `syllabus` to local `GovernmentExam` type in `client/src/pages/Admin/GovernmentExamAdmin.tsx`
- [x] Verify with `npx tsc --noEmit` in `client/`
- [x] Remove invalid `ignoreDeprecations: "6.0"` from `client/tsconfig.json` (blocked tsc)
- [ ] Edit existing DRDO CEPTAM entry via admin UI to add syllabus & opportunities

## Verification
- [x] Run `npx tsc --noEmit` — ✅ Passed (EXIT_CODE: 0, no errors)

