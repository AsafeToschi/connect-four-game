export type NumericKeypadKeys = "Decimal" | "Key11" | "Key12" | "Multiply" | "Add" | "Clear" | "Divide" | "Subtract" | "Separator" |  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

export type UpperAlpha = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export type LowerAlpha = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

export type ModifierKeys = "Alt" | "AltGraph" | "CapsLock" | "Control" | "Fn" | "FnLock" | "Hyper" | "Meta" | "NumLock" | "ScrollLock" | "Shift" | "Super" | "Symbol" | "SymbolLock"

export type WhitespaceKeys = "Enter" | "Tab" | " "

export type NavigationKeys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "End" | "Home" | "PageDown" | "PageUp"

export type EditingKeys = "Backspace" | "Clear" | "Copy" | "CrSel" | "Cut" | "Delete" | "EraseEof" | "ExSel" | "Insert" | "Paste" | "Redo" | "Undo"

export type FunctionKeys =  "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "Soft1" | "Soft2" | "Soft3" | "Soft4"


export type KeyboardKey = NumericKeypadKeys | UpperAlpha | LowerAlpha | ModifierKeys | WhitespaceKeys | NavigationKeys | EditingKeys | FunctionKeys;
export type LowercaseKeyboardKey = Lowercase<KeyboardKey>;