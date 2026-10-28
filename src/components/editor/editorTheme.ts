import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { syntaxHighlighting, StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { yaml, yamlLanguage } from '@codemirror/lang-yaml';
import { autocompletion, completeFromList, Completion } from '@codemirror/autocomplete';
import { SupportedLanguage } from '../../types';

export const codeShotHighlighting = syntaxHighlighting(oneDarkHighlightStyle);

export const codeShotAutocompletion = autocompletion({
  activateOnTyping: true,
  maxRenderedOptions: 10,
});

export const yamlCompletions: Completion[] = [
  { label: 'version', type: 'keyword', info: 'YAML specification version' },
  { label: 'services', type: 'keyword', info: 'Container services map' },
  { label: 'image', type: 'property', info: 'Docker image tag' },
  { label: 'container_name', type: 'property', info: 'Container instance name' },
  { label: 'ports', type: 'property', info: 'Exposed port mappings' },
  { label: 'environment', type: 'property', info: 'Environment variables' },
  { label: 'volumes', type: 'property', info: 'Mounted storage volumes' },
  { label: 'restart', type: 'keyword', info: 'Restart policy (unless-stopped, always)' },
  { label: 'depends_on', type: 'keyword', info: 'Dependency service list' },
  { label: 'networks', type: 'property', info: 'Virtual networks' },
  { label: 'build', type: 'keyword', info: 'Docker build context' },
  { label: 'command', type: 'property', info: 'Override container entrypoint command' },
  { label: 'healthcheck', type: 'keyword', info: 'Health check probe definition' },
  { label: 'name', type: 'keyword', info: 'Workflow / entity name' },
  { label: 'steps', type: 'keyword', info: 'Pipeline execution step sequence' },
  { label: 'runs-on', type: 'keyword', info: 'Runner target (e.g. ubuntu-latest)' },
  { label: 'uses', type: 'keyword', info: 'GitHub Action dependency' },
  { label: 'with', type: 'keyword', info: 'Action parameters map' },
  { label: 'run', type: 'keyword', info: 'Shell command execution block' },
  { label: 'true', type: 'constant', info: 'Boolean true' },
  { label: 'false', type: 'constant', info: 'Boolean false' },
];

export const codeShotEditorTheme = EditorView.theme(
  {
    '&': {
      color: '#abb2bf',
      backgroundColor: '#12151b',
      fontFamily: "'JetBrains Mono', 'Fira Code', var(--font-mono)",
      fontSize: '14px',
      height: '100%',
    },
    '.cm-content': {
      caretColor: '#528bff',
      padding: '16px 4px',
      fontFamily: "'JetBrains Mono', 'Fira Code', var(--font-mono)",
      lineHeight: '1.75',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#528bff',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#263147 !important',
    },
    '.cm-gutters': {
      backgroundColor: '#12151b',
      color: '#4b5563',
      border: 'none',
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      paddingRight: '4px',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 8px 0 14px',
      minWidth: '32px',
      fontSize: '11px',
      userSelect: 'none',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.035)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: '#9aa5b5',
      fontWeight: '600',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(59, 130, 246, 0.28)',
      color: 'inherit !important',
      outline: 'none',
      borderRadius: '2px',
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: 'inherit',
    },
    /* Autocomplete Tooltip Styles */
    '.cm-tooltip-autocomplete': {
      backgroundColor: '#181c24 !important',
      border: '1px solid #2b3343 !important',
      borderRadius: '6px !important',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5) !important',
      fontFamily: 'var(--font-mono) !important',
      fontSize: '12px !important',
    },
    '.cm-tooltip-autocomplete ul li': {
      padding: '3px 8px !important',
      color: '#abb2bf !important',
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: '#2563eb !important',
      color: '#ffffff !important',
    },
  },
  { dark: true }
);

export function getLanguageExtension(language: SupportedLanguage): Extension[] {
  switch (language) {
    case 'typescript':
      return [javascript({ typescript: true })];
    case 'javascript':
      return [javascript()];
    case 'python':
      return [python()];
    case 'rust':
      return [rust()];
    case 'cpp':
      return [cpp()];
    case 'html':
      return [html()];
    case 'css':
      return [css()];
    case 'json':
      return [json()];
    case 'bash':
      return [StreamLanguage.define(shell)];
    case 'yaml':
      return [yaml(), yamlLanguage.data.of({ autocomplete: completeFromList(yamlCompletions) })];
    default:
      return [];
  }
}
