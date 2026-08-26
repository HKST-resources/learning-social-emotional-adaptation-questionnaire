# Revision Checklist

## Current Revision

- [x] Remove the home-page logo and simplify unselected rating buttons to white.
- [x] Convert the rating form into collapsible major domains, categories, and sub-area lists.
- [x] Replace the analysis cards with fixed-row learning and social overview tables.
- [x] Highlight each child’s five lowest-scoring sub-areas and enable per-cell expansion to detailed items.
- [x] Add multi-score filtering, adjacent per-item goal selection, and a selected-goals box.
- [x] Remove separate shared-ground analysis and simplify 0/1/2 labels in the report/export layout.
- [x] Validate responsive comparison and report export workflows.

## Current Revision Validation Notes

- The home page no longer displays the logo, and the refreshed three-child assessment opens with the requested major-domain, category, and sub-area accordion hierarchy.
- Within an expanded sub-area, unselected 0/1/2 buttons are white and the chosen score visibly changes to its rating colour.
- A contrasting 1/0/2 test pattern has been entered for the same item across three children to verify horizontal overview comparison.
- The analysis page now renders separate fixed-row overview tables for learning and social adaptation, with the test 1/0/2 values aligned horizontally in the same sub-area row and no separate common-ground box.
- Expanding a child’s score cell reveals detailed items subject to the score filter, and selecting an adjacent item control adds it to the separate training-goals box.
- The revised Excel export has been generated after the overview-table change, and no client-side console errors were reported during the rating, analysis, goal-selection, and export checks.

- [x] Simplify the home page to the specified heading and one setup instruction, using DD/MM/YYYY date display.
- [x] Increase typographic scale and revise the assessment matrix for compact, item-first mobile readability.
- [x] Add quick-jump controls for all major questionnaire sections.
- [x] Replace the current analysis panel with a separate filterable analysis page.
- [x] Add three-column per-child score analysis, shared-item highlighting, and individual goal selection.
- [x] Add printable PDF and structured Excel exports for performance analysis and selected goals.
- [x] Add Excel import compatible with the application’s export format and document the PDF-import limitation.
- [x] Validate desktop/mobile workflows and prepare the revised review build.

## Validation Notes

- Live preview confirms the revised setup page uses the requested DD/MM/YYYY presentation and the requested home-page heading/instruction.
- Live preview confirms section-jump controls, larger item text, compact 0/1/2 controls, and compact remarks fields render in the assessment matrix.
- A matching score of 1 has been recorded for the first questionnaire item across all three child columns to validate shared-item highlighting in analysis.
- Live analysis displays the three children horizontally for score 1, highlights the shared item with its three-child count, and records an individual child goal selection.
- Excel export has been invoked from the analysis workspace for verification.
- The generated workbook is present in the download directory and contains the expected report filename and .xlsx format.
- Compatible Excel re-import restores the assessment and preserves blank score cells as unscored after the blank-score guard correction.
