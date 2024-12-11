# Ternary to If-Else

**Ternary to If-Else** an extension designed to help you easily convert ternary expressions into readable `if-else` statements. Whether you're dealing with simple or nested ternary conditions, this extension enhances the readability and maintainability of your code, making it more intuitive to work with, especially for debugging.

With just a hover, you can instantly see the ternary expression converted into a structured `if-else` block, helping you and your team understand the logic more easily.

![Hover Example](./assets/ternary.gif)

## Features

- **Instant Conversion**: Hover over any ternary expression and see it transformed into an `if-else` statement.
- **Nested Ternary Support**: Automatically handles nested ternary expressions and converts them into readable `if-else` statements.
- **Works for JavaScript & TypeScript**: Supports both JavaScript and TypeScript files, including JSX/TSX.
- **Improve Code Clarity**: Makes complex ternary operations easier to read, especially for new developers or teams reviewing code.

## How to Use

1. **Hover Over Ternary Expressions**: Simply hover your mouse over any ternary condition (`condition ? value1 : value2`).
2. **View Conversion**: The extension will automatically show the corresponding `if-else` statement as a hover preview.
   - Example:

     ```javascript
     const result = condition ? 'yes' : 'no';
     ```
     Will be converted to:

     ```javascript
     if (condition) {
         'yes';
     } else {
         'no';
     }
     ```

3. **Nested Ternaries**: Nested ternary conditions are automatically expanded into a readable structure.
   - Example:

     ```javascript
     const value = conditionA ? (conditionB ? 'B1' : 'B2') : 'A2';
     ```
     Will be converted to:

     ```javascript
     if (conditionA) {
         if (conditionB) {
             'B1';
         } else {
             'B2';
         }
     } else {
         'A2';
     }
     ```

## Supported Languages

This extension supports the following languages:

- JavaScript (`.js`)
- TypeScript (`.ts`)
- JavaScript React (`.jsx`)
- TypeScript React (`.tsx`)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.