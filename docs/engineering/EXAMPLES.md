# Engineering Examples and Failure Log
Known source defects from preserved Clover audit (not attributed to a specific agent):
- Bad: deleteMany catalog before import. Good: dry-run diff and transactional upserts preserving IDs. Regression: repeat import and interrupted import.
- Bad: synthetic imported IDs treated as Clover IDs. Good: permanent POF IDs and separately verified provider mappings. Regression: reject unmapped external fulfillment.
- Bad: display fallback used for checkout. Good: authoritative quote fails closed. Regression: fallback unavailable for checkout.
- Bad: claiming deployment or tests passed from code existence. Good: executed evidence and immutable deployment ID when applicable.
Automated checks NOT TESTED. Add rule, good/bad example and automated regression where possible for future violations.