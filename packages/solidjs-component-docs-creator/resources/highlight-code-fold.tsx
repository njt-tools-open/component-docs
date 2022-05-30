import { Show, createSignal, JSXElement } from 'solid-js';
import Stack from '@suid/material/Stack';
import IconButton from '@suid/material/IconButton';
import CodeRoundedIcon from '@suid/icons-material/CodeRounded';
import ContentCopyRoundedIcon from '@suid/icons-material/ContentCopyRounded';

function copyText(text: string) {
  let element!: HTMLTextAreaElement;
  try {
    element = document.createElement('textarea');
    element.value = text;
    element.style.top = '0';
    element.style.left = '0';
    element.style.position = 'fixed';
    document.body.appendChild(element);
    element.focus();
    element.select();
    return document.execCommand('copy');
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    element.remove();
  }
}

type HighlightCodeFoldProps = {
  code: string;
  children: JSXElement;
};

function HighlightCodeFold({ code, children }: HighlightCodeFoldProps) {
  const [visible, setVisible] = createSignal(false);

  return (
    <div>
      <Stack
        direction={'row'}
        spacing={1}
        sx={{
          pt: 1,
          justifyContent: 'end',
        }}
      >
        <IconButton size="small">
          <CodeRoundedIcon
            fontSize="inherit"
            onClick={() => {
              setVisible(!visible());
            }}
          />
        </IconButton>
        <IconButton size="small">
          <ContentCopyRoundedIcon
            fontSize="inherit"
            onClick={() => {
              copyText(code);
            }}
          />
        </IconButton>
      </Stack>
      <Show when={visible()}>{children}</Show>
    </div>
  );
}

export default HighlightCodeFold;
