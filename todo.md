# Revision Checklist

## GitHub Pages Publication

- [x] Configure the static build for the repository website path.
- [x] Add a GitHub Actions workflow that publishes the static site to Pages.
- [ ] Enable GitHub Pages from the workflow and verify the public website link.

## GitHub Repository Publication

- [x] Prepare the approved source tree for the private GitHub repository.
- [x] Create the private repository learning-social-emotional-adaptation-questionnaire.
- [x] Push the final project source to the repository and verify its contents.

## Overview PDF Two-Page Layout

- [x] 將「範疇總覽及訓練目標」的學習及社交兩個總覽表壓縮至第 1 頁。
- [x] 讓同一報告的已選訓練目標表格由第 2 頁開始。
- [x] 驗證總覽及訓練目標 PDF 的兩頁排版，並在最終批准前保留 GitHub 原始碼。

## Final PDF Layout Refinement

- [x] 讓「只匯出訓練目標」的目標表格緊接標題而非掉到第二頁。
- [x] 讓「完整評估及訓練目標」自動展開所有小範疇的全部詳細評分。
- [x] 在全部三種 PDF 報告中擴闊訓練目標欄，並收窄小範疇及兒童欄。
- [x] 驗證三種 PDF 報告範圍及分頁，並等待最終批准才提供 GitHub 原始碼。

## PDF Scope Bug Fix

- [x] 改用明確的列印報告內容，不再只依賴畫面 CSS 隱藏不同 PDF 範圍。
- [x] 確保「只匯出訓練目標」只包含已選訓練目標表格。
- [x] 確保「範疇總覽及訓練目標」只包含平均分數總覽表及已選訓練目標表格。
- [x] 確保「完整評估及訓練目標」包含目前展開的詳細評分、平均分數及已選訓練目標表格。
- [x] 驗證每個 PDF 按鈕輸出不同內容並更新 GitHub 原始碼套件。

## Corrected PDF Scope Boundaries

- [x] 讓「只匯出訓練目標」只列印「已選訓練目標」表格。
- [x] 讓「範疇總覽及訓練目標」只列印兩個平均分數總覽表及「已選訓練目標」表格。
- [x] 讓「完整評估及訓練目標」列印目前已展開的詳細評分總覽表及「已選訓練目標」表格。
- [x] 驗證三種範圍在列印預覽中互相有明確差異，並更新 GitHub 原始碼套件。

## Flexible PDF Export and Fuzzy Search

- [x] 新增「訓練目標計劃」、「小範疇總覽及訓練目標」及「完整評估與訓練目標」三種 PDF 匯出範圍。
- [x] 讓各 PDF 匯出範圍套用相應的橫向／直向列印版式及避免不當分頁規則。
- [x] 為兒童名稱、評分項目及相關範疇加入支援不連續中文字元的模糊搜尋。
- [x] 驗證三種列印預覽範圍、模糊搜尋及更新 GitHub 原始碼套件。

## Print Layout and Analysis Search

- [x] 在分析頁頂部加入關鍵字搜尋列，可篩選評分項目及兒童名稱。
- [x] 調整分析頁列印樣式，確保表格以橫向 A4 清晰列印並避免橫向截斷。
- [x] 確保列印時展開內容、評分表格和已選訓練目標可完整跨頁顯示。
- [x] 驗證搜尋、列印／PDF 排版，並更新可直接上傳 GitHub 的原始碼套件。

## Print Layout and Search Validation Notes

- 已建立新的三位兒童測試評估表，準備在分析頁測試關鍵字搜尋及列印版面。
- 已觸發分析頁轉換，準備驗證搜尋列及空白評分表格的列印結構。
- 評分頁操作按鈕已移至可見位置，準備完成分析頁搜尋功能的互動測試。
- 已展開主題時間，準備在遵守規則及指令下輸入測試評分，之後驗證分析搜尋列。
- 已在上課時給予反應的小範疇為兒童 1 輸入分數 1，分析頁可用此項目進行搜尋測試。
- 測試評分已保留在展開的評分表內，準備前往分析頁檢查關鍵字篩選與列印結構。
- 搜尋「上課時給予反應」會自動展開並只顯示該相符小範疇與其評分項目，評分項目搜尋驗證成功。
- 搜尋「兒童 1」會保留完整比較表並以淡綠色標示兒童 1 的欄位；最終 TypeScript 及正式建置檢查通過。

## Final Analysis Copy and GitHub Delivery

- [x] Change the analysis Excel export button to a white background.
- [x] Remove the description beneath the analysis page title.
- [x] Replace each summary-table description with the approved Chinese sentence.
- [x] Validate the final production build and package copy-and-paste-ready GitHub source code.

## Prominent Selection and Item-Text Width Refinement

- [x] Increase selected detailed-score borders and sharp green glow for unmistakable goal emphasis.
- [x] Give expanded rating-item text more landscape-table width while narrowing numerical child score columns.
- [x] Validate the selected state and iPad landscape comparison layout without unnecessary horizontal scrolling.

## Selected Score, iPad, and Reusable Skill Refinement

- [x] Preserve pink, yellow, and green score backgrounds after goal selection while adding a sharp green glow and tick.
- [x] Optimise expanded analysis table widths for iPad landscape without horizontal scrolling.
- [x] Create, validate, and package a reusable clinical group-therapy analysis workflow skill.
- [x] Validate selected score states and iPad landscape layout.

## Selected Score and iPad Validation Notes

- A fresh three-child assessment is open for a visual confirmation that selected detailed scores retain their original 0/1/2 colour coding.
- The first learning sub-area is expanded with all child rating controls ready for the selected-score visual-state check.
- A score of 1 has been entered for child two’s first item and analysis has been opened to verify that selecting it keeps the yellow score background.
- The child-two mean grid is expanded and displays the score-one detailed capsule in its aligned item row.
- Selecting the score-one capsule keeps its yellow surface while adding a sharp green outline, green glow, and right-end green tick; iPad-landscape width is now assigned first to the hierarchy columns and then shared among child columns.
- The final selected state uses a four-pixel sharp green border with an expanded glow ring while retaining the score-specific capsule background; production type and build checks pass after the iPad landscape width adjustment.

## Reference-Aligned Expanded Detail Layout

- [x] Remove the separate quick-jump bar and place relevant section-navigation buttons beside each main category title.
- [x] Align expanded rating-item cards and every child’s score control on identical table rows and heights.
- [x] Use short rounded score capsules that are visually distinct from mean-score rectangles.
- [x] Place a selected goal tick at the right end of the detailed score capsule.
- [x] Validate desktop, tablet, and compact-screen detail-row alignment and navigation.

## Reference-Aligned Detail Validation Notes

- A fresh three-child assessment is open after the table-alignment update and is ready for controlled expanded-detail validation.
- The first learning group is open with rating controls available for a compact three-child analysis test.
- A high completed mean for child one and a low item score for child two have been recorded for the aligned-detail analysis check.
- The separate quick-jump bar is removed; each main category now carries its own adjacent context buttons, including 主題時間 and 分組時間／功課時間 beside （一）學習適應.
- Expanded item text and all child score capsules now occupy corresponding fixed table rows and heights, matching the supplied word-document-style reference.
- Selecting a detailed score displays a rounded green treatment with the score centred and a confirmation tick anchored at the capsule’s right end.

## Tied Priority and Goal Navigation Refinement

- [x] Highlight every entered grid at or below each child’s fifth-lowest mean-score threshold, including tied fifth-score grids.
- [x] Merge repeated level-two and level-three category cells in the analysis table.
- [x] Make expanded item rows visually distinct and use compact round or square score controls.
- [x] Add inline level-two jump buttons that reflect highlighted low-score areas.
- [x] Split training-goal hierarchy into merged level-two and level-three columns.
- [x] Remove fully unselected goal rows, restore linked goal navigation with automatic expansion, and add a clear-all-goals action.
- [x] Validate tied highlighting, table structure, navigation, and reset behavior.

## Tied Priority and Goal Navigation Validation Notes

- A fresh three-child assessment has been opened for the final merged-hierarchy, category-jump, linked-goal, and clear-all-goals validation.
- The first learning group is expanded with all child score controls available for the tied-priority test.
- A high mean for child one and a low rating for child two have been entered to exercise the revised overview and training-goal interactions.
- The refreshed analysis renders inline category jump buttons, a clear-all-goals control, and merged level-two cells in both learning and social overview tables.
- Expanding a mean grid now nests high-contrast lavender item cards below the level-three label and presents compact round score controls in the corresponding child columns.
- Selecting a detailed child score adds a three-column selected-goals table with separate merged 類別 and 小範疇 fields; collapsing the source area prepares the automatic re-expansion check.
- Selecting the training-goal text returns to the source area and automatically re-expands its detailed rating rows.
- The clear-all-goals action has been invoked for the final reset verification.
- The reset clears the selected goal count to zero and removes the training-goal table; the previous goal text link correctly returned to and expanded its source item.
- 三種 PDF 匯出範圍現於頁面狀態完成更新後才觸發瀏覽器列印：訓練目標只顯示已選訓練目標、範疇總覽隱藏詳細列、完整評估則保留教師目前已展開的詳細列；TypeScript 與正式建置檢查已通過。
- 已建立新的三位兒童測試表，準備驗證獨立列印報告是否在三個 PDF 按鈕下輸出不同內容。
- 已展開「遵守規則及指令」的五項詳細評分，準備輸入測試分數並檢查完整報告是否只包含目前展開內容。
- 已為兒童 1 的「能安坐」輸入分數 1，準備在分析頁進行獨立 PDF 報告內容檢查。
- 分析頁已展開「遵守規則及指令」，因此「完整評估及訓練目標」應包含此小範疇的五項詳細評分，而總覽匯出不應包含這些詳細列。
- 已直接攔截三個 PDF 按鈕產生的獨立報告內容：訓練目標報告只含目標表、總覽報告含總覽及目標表而不含「能安坐」詳細列、完整報告同時含總覽、目標表及目前展開的「能安坐」詳細列。
- 更新後完整報告已改為無論頁面展開狀態均包含所有小範疇及每個評分項目的詳細列；訓練目標專用報告取消強制換頁，並在三種報告中把訓練目標欄固定為最寬（54%）欄位。
- 「範疇總覽及訓練目標」已使用專用緊湊列印規則：減少標題、段落、儲存格及兩個總覽區塊的佔位，讓學習及社交總覽表先放在第 1 頁；已選訓練目標仍以強制換頁從第 2 頁開始。正式建置檢查通過。

## Exact Five-Lowest Priority Refinement

- [x] Limit gradient priority styling to each child’s five lowest entered mean scores only.
- [x] Keep every non-priority scored grid and every unscored grid on a white background.
- [x] Strengthen selected detailed rating grids with a thick green border, translucent green fill, and visible green tick by the score.
- [x] Validate priority ranking and grid-selection feedback using multi-area ratings.

## Exact Five-Lowest Validation Notes

- A fresh three-child assessment is open for the final visual and interaction check of the global five-lowest rule and strengthened selected-score treatment.
- The test sub-level is open with all three child columns available for controlled scoring before reopening analysis.
- The final test now contains a high mean case for child one and a low mean case for child two, ready for global priority and selected-grid visual verification.
- In the refreshed analysis, the only entered mean cells are the current global lowest values and receive the priority gradient, while all unscored cells remain white.
- A selected child-two score-zero grid now visibly carries a thick green outline, translucent green surface, and green tick adjacent to its score.

## Restored Expandable Analysis Grid

- [x] Retain the current project version; no rollback to e022c982 is required.
- [x] Default analysis to collapsed level-three mean-score grids, with only five lowest grids highlighted.
- [x] Expand a pressed score grid into its detailed item ratings below the category columns.
- [x] Narrow and centre children’s mean-score columns; remove individual detail-row tick controls.
- [x] Toggle a whole grid as a training goal using a green border and translucent green selection effect.
- [x] Apply alternating row backgrounds for each level-three category in analysis and the goal table.
- [x] Validate expansion, grid selection, deselection, and selected-goal display.

## Restored Expandable Analysis Validation Notes

- The current project version remains active; a fresh three-child assessment opens successfully with both major domains visible and second-level sheets collapsed.
- The first learning sub-level is open and ready for controlled three-child ratings to validate the collapsed analysis-grid workflow.
- Test data now includes a completed score-two sub-level for child one and a score-zero item for child two, providing distinct mean-score cases for the analysis grid.
- The analysis transition has been triggered with the controlled test ratings and is ready for collapsed-grid inspection.
- The analysis initially shows only level-three mean-score cells; pressing the 遵守規則及指令 score grid expands its item-level rows beneath columns A and B while preserving the other level-three grids in their collapsed state.
- Selecting child two’s detailed score grid replaces the former right-side tick with a green bordered, translucent-green score cell and adds the item to the grouped selected-goals table.
- Pressing that selected grid again clears the green selection effect and removes the active goal while leaving the grouped goal row available for direct re-selection.

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
