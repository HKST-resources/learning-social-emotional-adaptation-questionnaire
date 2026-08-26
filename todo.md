# Revision Checklist

## Fixed Item and iPad Comparison Refinement

- [x] Use alternating lavender and white surfaces to distinguish rating hierarchy levels and indent every third-level sheet.
- [x] Restore fixed detailed rating-item rows directly under each child in the analysis comparison tables.
- [x] Round all mean-score display and exports to two decimal places.
- [x] Highlight only each child’s five lowest mean-score cells with the vibrant gradient treatment; keep all other cells white.
- [x] Optimise rating, analysis, and selected-goal tables to prioritise all child columns across iPad and compact screens.
- [x] Keep selected training goals concise and visible as a one-sentence item while retaining child columns.
- [x] Validate responsive rating, analysis, goal-table, and report views.

## Fixed Item and iPad Comparison Validation Notes

- The initial rating view now shows major domains on white surfaces, level-two contexts on light lavender surfaces, and the hierarchy is ready for third-level indentation testing.
- The third-level sheet is visibly indented beneath 主題時間 and shows all three child columns together, using alternating white and lavender child-column backgrounds.
- The tightened rating grid keeps the item text and all three child columns visible together in the test view while retaining compact score and remarks controls.
- The rebuilt analysis keeps every rating item in a fixed horizontal row under the child columns, displays means as 2.00 and 0.00, and marks the two test children’s lowest sub-area mean cells with the same violet-to-pink gradient while leaving the unscored grid white.
- Turning off score 2 hides only child-one score-two content while retaining each rating item’s fixed row; selecting child-two’s score-zero item creates the compact grouped goal row with all child columns retained.
- The iPad portrait setup screen remains readable, and the live rating and analysis tests preserve all three child columns without horizontal overflow.

## Mean Score and Goal-Table Refinement

- [x] Visually differentiate the first and second levels of the rating toggle hierarchy.
- [x] Alternate child-column backgrounds and add one-click score-two completion for a child within an expanded sub-level.
- [x] Replace 0-plus-1 percentages with mean scores and saturation-based emphasis for each child’s five lowest grids.
- [x] Preserve each detailed item’s row position when score filters hide its content.
- [x] Narrow analysis category columns on small screens while retaining readable item and child columns.
- [x] Redesign selected goals with grouped category cells, per-child green tick controls, reversible selection, and linked scrolling to analysis detail.
- [x] Update exports and validate the revised comparison workflow.

## Mean Score and Goal-Table Validation Notes

- The assessment entry page now presents major domains as stronger lavender panels and second-level sheets as nested, visibly distinct controls.
- The rating instruction explicitly identifies the child-name shortcut that sets every item in an expanded sub-level to score 2.
- The expanded sub-level presents alternating child-column background treatments and a clickable child-name header for setting the full sub-level to score 2.
- The child-one shortcut marked all five visible items in 遵守規則及指令 as 2 while a contrasting score of 0 was recorded for child two on the first item.
- The overview now displays numerical mean scores only; the test row shows 2.0 for child one, 0.0 for child two, and an unscored dash for child three, with low-score emphasis expressed through violet saturation rather than gradients.
- Turning off score 2 hides the detailed score content while preserving the item rows and their horizontal positions for comparison.
- A selected training goal appears as a green check in the individual child’s detailed cell and creates a grouped category-and-item row in the selected-goals table.
- Selecting the training-goal text in the lower table returns the view to its corresponding detailed analysis item.
- After the final goal tick is removed, its grouped goal row remains visible with blank, clickable child cells so a teacher can select it again directly.
- Re-selecting the previously blank child-two grid restores the green tick without leaving the selected-goals table.

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
