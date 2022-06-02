
// https://github.com/simple-keyboard/simple-keyboard-layouts/blob/master/src/lib/interfaces.ts

// https://github.com/simple-keyboard/simple-keyboard-layouts/tree/master/src/lib/layouts
/**
 * Layout: Spanish
 * Source: Paco Alcantara (https://github.com/pacoalcantara)
 *         Based on: http://ascii-table.com/keyboard.php/171
 *         and http://ascii-table.com/keyboard.php/071-2
 */

// spanish
export const layout_span = {
    default: [
        "` 1 2 3 4 5 6 7 8 9 0 ' \u00bf {bksp}",
        "{tab} q w e r t y u i o p \u0301 +",
        "{lock} a s d f g h j k l \u00f1 \u007b \u007d {enter}",
        "{shift} < z x c v b n m , . - {shift}",
        ".com @ {space}",
      ],
      shift: [
        '` ! " # $ % & / ( ) = ? \u00a1 {bksp}',
        "{tab} Q W E R T Y U I O P \u0308 *",
        "{lock} A S D F G H J K L \u00d1 \u005b \u005d {enter}",
        "{shift} > Z X C V B N M ; : _ {shift}",
        ".com @ {space}",
      ],
};

// punjabi
// https://www.fast-typing.com/keyboard.php?key=punjabi&ln=pa
export const layout_punj = {
    default: [
        "` 1 2 3 4 5 6 7 8 9 0 ' \u00bf {bksp}",
        "{tab} ੌ ੈ ਾ ੀ ੂ ਬ ਹ ਗ ਦ ਜ ਡ ਼",
        "{lock} ੋ ੇ ੍ ਿ ੁ ਪ ਰ ਕ ਤ ਚ ਟ {enter}",
        "{shift} ੰ ਮ ਨ ਵ ਲ ਸ , . ਯ {shift}",
        ".com @ {space}",
      ],
      shift: [
        'ੱ ( ) {bksp}',
        "{tab} ਔ ਐ ਆ ਈ ਊ ਭ ਙ ਘ ਧ ਝ ਢ ਞ",
        "{lock} ਓ ਏ ਅ ਇ ਉ ਫ  ਖ ਥ ਛ ਠ {enter}",
        "{shift} ਂ ਣ ੲ ਲ਼ ਸ਼ । {shift}",
        ".com @ {space}",
      ],
  };

// arabic
export const layout_arab = {
    default: [
        "\u0630 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
        "{tab} \u0636 \u0635 \u062B \u0642 \u0641 \u063A \u0639 \u0647 \u062E \u062D \u062C \u062F \\",
        "{lock} \u0634 \u0633 \u064A \u0628 \u0644 \u0627 \u062A \u0646 \u0645 \u0643 \u0637 {enter}",
        "{shift} \u0626 \u0621 \u0624 \u0631 \u0644\u0627 \u0649 \u0629 \u0648 \u0632 \u0638 {shift}",
        ".com @ {space}",
    ],
    shift: [
        "\u0651 ! @ # $ % ^ & * ) ( _ + {bksp}",
        "{tab} \u064E \u064B \u064F \u064C \u0644\u0625 \u0625 \u2018 \u00F7 \u00D7 \u061B < > |",
        '{lock} \u0650 \u064D ] [ \u0644\u0623 \u0623 \u0640 \u060C / : " {enter}',
        "{shift} ~ \u0652 } { \u0644\u0622 \u0622 \u2019 , . \u061F {shift}",
        ".com @ {space}",
    ],
};

// german
export const layout_germ = {
    default: [
        "^ 1 2 3 4 5 6 7 8 9 0 \u00DF \u00B4 {bksp}",
        "{tab} q w e r t z u i o p \u00FC +",
        "{lock} a s d f g h j k l \u00F6 \u00E4 # {enter}",
        "{shift} < y x c v b n m , . - {shift}",
        ".com @ {space}",
    ],
    shift: [
        '\u00B0 ! " \u00A7 $ % & / ( ) = ? ` {bksp}',
        "{tab} Q W E R T Z U I O P \u00DC *",
        "{lock} A S D F G H J K L \u00D6 \u00C4 ' {enter}",
        "{shift} > Y X C V B N M ; : _ {shift}",
        ".com @ {space}",
    ],
}

// japanese
export const layout_japa = {
    default: [
        "1 2 3 4 5 6 7 8 9 0 - ^ \u00a5 {bksp}",
        "{tab} \u305f \u3066 \u3044 \u3059 \u304b \u3093 \u306a \u306b \u3089 \u305b \u309b \u309c \u3080",
        "{lock} \u3061 \u3068 \u3057 \u306f \u304D \u304f \u307e \u306e \u308a \u308c \u3051 {enter}",
        "{shift} \u3064 \u3055 \u305d \u3072 \u3053 \u307f \u3082 \u306d \u308b \u3081 {shift}",
        ".com @ {space}",
    ],
    shift: [
        "! \" # $ % & ' ( ) \u0301 = ~ | {bksp}",
        "{tab} \u305f \u3066 \u3043 \u3059 \u304b \u3093 \u306a \u306b \u3089 \u305b \u300c \u300d \u3080",
        "{lock} \u3061 \u3068 \u3057 \u306f \u304D \u304f \u307e \u306e \u308a \u308c \u3051 {enter}",
        "{shift} \u3063 \u3055 \u305d \u3072 \u3053 \u307f \u3082 \u3001 \u3002 \u30fb {shift}",
        ".com @ {space}",
    ],
}

