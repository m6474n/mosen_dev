# Firestore Security Specification

This document details the security model, invariants, and "Dirty Dozen" attack payloads used to validate our Firestore ruleset.

## 1. Data Invariants
- **Public Collections Readability**: `blogs`, `case_studies`, `projects`, `services`, `resources`, and `posts` are readable by anyone if their state/status is set to `Published` or for operational control.
- **Leads Integrity**: Messages/bookings generated under the `messages` collection can be created by any anonymous client contact form, but must adhere strictly to the `Message` schema bounds.
- **Format Integrity**: All document IDs must be alphanumeric strings (`isValidId`), bounded to 128 characters max.
- **Type Constraints**: Content strings, arrays, integers, and booleans must be strictly typesaved.

## 2. The "Dirty Dozen" Attack Payloads (Validation Constraints)
The following payloads constitute direct violations of database integrity and will be blocked securely:

1. **Self-Appointed Privilege Escalation**: Setting unauthorized flags on systemic fields.
2. **Invalid ID Poisoning**: Using path ID parameter variables containing invalid junk characters.
3. **Denial of Wallet (String Bloat)**: Writing a message with a 5MB payload size.
4. **Missing Required Fields**: Creating entries lacking schema validation roots.
5. **Type Injection (Boolean Spoofing)**: Inserting boolean flags into string titles.
6. **State-Machine Shortcutting**: Bypassing Draft validation transitions.
7. **System Key Spoofing**: Injecting random fields not allowed by strict schema constraints.
8. **Invalid Format Execution**: Uploading a timestamp schema that violates timestamp structure limits.
9. **Spam Spoofing**: Sending an empty message representation.
10. **Malicious Email String Injection**: Forged email addresses that exceed size boundaries.
11. **Immutability Breach**: Attempting to alter invariant identifiers on already established records.
12. **Sub-resource Exhaustion**: Flooding collections with massive list entries.

## 3. Firestore Rules Validation Plan
Our `firestore.rules` will explicitly reject all malicious payloads through rigorous schema blueprints and key constraint validations.
