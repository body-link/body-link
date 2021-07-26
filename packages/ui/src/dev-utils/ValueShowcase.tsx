import React from 'react';
import { makeStyles } from '../theme';

interface IProps {
  value: unknown;
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles((theme) => {
  return {
    root: {
      'display': 'block',
      'whiteSpace': 'pre-wrap',
      'wordWrap': 'break-word',
      'padding': theme.spaceToCSSValue(0.5),
      'backgroundColor': '#272822',
      'borderRadius': theme.spaceToCSSValue(0.5),
      'color': '#f8f8f2',
      '& .string': {
        color: '#a6e22e',
      },
      '& .number': {
        color: '#ae81ff',
      },
      '& .boolean': {
        color: '#66d9ef',
      },
      '& .null': {
        color: '#fd971f',
      },
      '& .key': {
        color: '#e6db74',
      },
    },
  };
});

export const ValueShowcase: React.FC<IProps> = ({ value }) => {
  const json = React.useMemo(() => {
    let json = JSON.stringify(value, undefined, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class='${cls}'>${match}</span>`;
      }
    );
    return json;
  }, [value]);
  return <pre className={useStyles().root} dangerouslySetInnerHTML={{ __html: json }} />;
};
