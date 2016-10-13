#interactive-expandable-cards

Groups of expandable "winners and losers"-style cards that can be embedded in stories.

## Note on Phase 2 transition

Until the Phase 2 transition is complete, all styles contained within `(min-width: 700px)` media queries must be duplicated and applied directly to Phase 1 desktop instances using the `.platform-standard:not(.platform-mobile)` selector prefix, because that site isn't fluid at any stage and should look consistent at any screen width. After Phase 1 is decommissioned, these duplicate styles can be removed.
