# Modal Component

## Structure

- `open` (boolean): Whether the modal is visible.
- `onClose` (function): Function to close the modal.
- `title` (optional, string): Modal title.
- `children`: Content inside the modal.

## How to use

```
<Modal open={true} onClose={() => {}} title="Title">
  <p>Content here</p>
</Modal>
```
