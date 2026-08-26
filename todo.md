# Revision Checklist

## Reference-Matched Default View

- [x] Open both major questionnaire domains by default while leaving all second-level toggle sheets collapsed, matching the supplied screenshot.
- [x] Verify the initial rating-page layout against the supplied reference.

## Percentage and Comparison Refinement

- [x] Set the requested questionnaire toggle sheet as the default assessment view.
- [x] Correct all category and sub-area headings so they remain on one line without artificial spacing.
- [x] Calculate and show each child’s percentage of scores 0 plus 1 for every analysis sub-area.
- [x] Rank and gradient-highlight the five highest 0-plus-1 percentage grids for each child.
- [x] Allow multiple analysis detail grids to remain expanded until each is clicked again.
- [x] Display selected goals in ordered side-by-side columns for each child.
- [x] Validate the default rating, percentage analysis, persistent detail, and goal comparison flows.

## Percentage and Comparison Validation Notes

- A fresh three-child assessment opens with the requested learning-adaptation sheet, 主題時間, and 遵守規則及指令 already expanded.
- The previously broken group headings now render as one continuous label, including 上課時給予反應 and 與朋輩討論.
- Test ratings of 0 and 1 have been entered for the first learning item in the first two child columns to validate the combined percentage calculation.
- A contrasting score of 2 has been entered for the third child in the same item; the 0/1/2 test pattern is ready for analysis validation.
- The analysis overview displays 100%, 100%, and 0% for the 0-plus-1 metric across the test row, with the two highest-need cells shown in the ranked gradient treatment.
- Two child cells in the same overview row can remain expanded simultaneously, each retaining its own detailed rating and adjacent goal-selection control.
- Selecting the same item for two children produces one ordered goal row with distinct child columns, making their shared target directly comparable.
- The revised percentage overview exported successfully to a new Excel workbook.
- A fresh assessment now opens with both （一）學習適應 and （二）社交適應 visible, while 主題時間、分組時間／功課時間, and all social second-level sheets remain collapsed as in the supplied screenshot.

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
