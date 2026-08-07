# Workflow Comparison

## Overview

I implemented the same StudyFlow settings page twice using Cursor AI.

The first implementation used a single vague prompt:
"Build a settings page for my study app."

The second implementation used a detailed specification describing the technology stack, validation requirements, accessibility expectations, implementation constraints, and verification steps.

## Correctness

The vague implementation successfully produced a functional settings page with theme switching, profile settings, and persistence using localStorage. However, it did not include structured validation or automated testing.

The precise implementation followed the requirements much more closely by using React Hook Form, Zod validation, reusable components, and automated tests. It also disabled submission while saving and validated all user inputs.

## Accessibility

The vague implementation contained usable forms but did not explicitly address accessibility.

The precise version added proper labels, aria attributes, validation messages, and keyboard-friendly form controls.

## Edge Cases

The vague version accepted most input without enforcing many rules.

The precise version correctly handled:

- Exam dates before today
- Study hours outside the allowed range
- Missing required selections
- Invalid localStorage data

## Review Effort

Although writing the detailed prompt took longer, reviewing the generated code required much less effort because most requirements were already implemented correctly.

The vague prompt was faster initially but required more manual checking to determine what had and had not been implemented.

## AI Mistake

During the vague implementation, Cursor initially reported that it had created the settings page and multiple supporting files. After verifying the project structure and testing the application, I discovered that I had accidentally switched back to the `main` branch, where those files did not exist. This reinforced the importance of verifying generated code and ensuring the correct branch is being reviewed rather than relying solely on AI output.
