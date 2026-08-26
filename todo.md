# Revision Checklist

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
