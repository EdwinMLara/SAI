# InputFile

## Structure

- `label` (optional, string): Label displayed above the upload area.
- `onChange` (optional, function): Callback that receives the valid file or null.
- `accept` (string): Allowed file types (e.g. ".pdf,.jpg").
- `className` (optional, string): Extra classes for the main container.
- `error` (optional, string): External error message.
- `helperText` (optional, string): Helper text below the component.
- `multiple` (optional, boolean): Allows selecting multiple files.
- `disabled` (optional, boolean): Disables interaction.

## How to use

```tsx
<InputFile
  label="Upload file"
  accept=".pdf,.jpg"
  onChange={(file) => console.log(file)}
  helperText="Only PDF or JPG"
/>
```
