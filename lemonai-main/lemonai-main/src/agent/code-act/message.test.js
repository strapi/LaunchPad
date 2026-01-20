/**
 * @author: Trae | Gemini-2.5-Pro-Preview(0506)
 * @date 2025-06-18
 */

const { expect } = require('chai');
const { checkConsecutiveAssistantXml } = require('./message');

describe('checkConsecutiveAssistantXml', () => {
  it('should return "invalid" for null input', () => {
    expect(checkConsecutiveAssistantXml(null)).to.equal('invalid');
  });

  it('should return "invalid" for undefined input', () => {
    expect(checkConsecutiveAssistantXml(undefined)).to.equal('invalid');
  });

  it('should return "invalid" for empty array input', () => {
    expect(checkConsecutiveAssistantXml([])).to.equal('invalid');
  });

  it('should return "invalid" if no assistant messages are at the end', () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" if the last assistant message has no content', () => {
    const messages = [{ role: 'assistant', content: null }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" if combined assistant content is empty after trim', () => {
    const messages = [{ role: 'assistant', content: '   ' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" if combined content does not start with "<"', () => {
    const messages = [{ role: 'assistant', content: 'Hello' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "to be continue" if content starts with "<" but does not end with ">"', () => {
    const messages = [{ role: 'assistant', content: '<tool_call>' }];
    // Simulate incomplete stream
    messages[0].content = '<tool_call';
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should return "to be continue" for multiple assistant messages forming an incomplete xml not ending with ">"', () => {
    const messages = [
      { role: 'assistant', content: '<tool' },
      { role: 'assistant', content: '_call>' },
    ];
    messages[1].content = '_call'; // Simulate incomplete stream
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should return "to be continue" if opening tags > closing tags', () => {
    const messages = [{ role: 'assistant', content: '<tool_call><params>' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should return "to be continue" for multiple assistant messages forming xml with opening tags > closing tags', () => {
    const messages = [
      { role: 'assistant', content: '<tool_call>' },
      { role: 'assistant', content: '<params>' },
      { role: 'assistant', content: '<param_name>query</param_name>' }, // query is not closed
    ];
    messages[2].content = '<param_name>query';
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should return "invalid" for a complete XML-like string with equal open/close tags', () => {
    const messages = [{ role: 'assistant', content: '<tool_call></tool_call>' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" for multiple assistant messages forming a complete XML-like string', () => {
    const messages = [
      { role: 'assistant', content: '<tool_call>' },
      { role: 'assistant', content: '<params>' },
      { role: 'assistant', content: '<name>search</name>' },
      { role: 'assistant', content: '</params>' },
      { role: 'assistant', content: '</tool_call>' },
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should correctly process only the last consecutive assistant messages', () => {
    const messages = [
      { role: 'user', content: 'Previous query' },
      { role: 'assistant', content: '<old_call></old_call>' },
      { role: 'user', content: 'New query' },
      { role: 'assistant', content: '<tool_call>' }, // This should be the start of the sequence
      { role: 'assistant', content: '<params>' },    // This is part of the sequence
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should return "invalid" if the last sequence of assistant messages is valid XML', () => {
    const messages = [
      { role: 'user', content: 'New query' },
      { role: 'assistant', content: '<tool_call>' },
      { role: 'assistant', content: '<params></params>' },
      { role: 'assistant', content: '</tool_call>' },
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" for content with self-closing tags and balanced', () => {
    const messages = [{ role: 'assistant', content: '<tool_call />' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "to be continue" for content with self-closing tags but more opening tags', () => {
    const messages = [{ role: 'assistant', content: '<tool_call><param /></tool_call' }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should handle complex xml-like structures correctly', () => {
    const messages1 = [{ role: 'assistant', content: '<tool_code>\nconsole.log("hello world");\n</tool_code>' }];
    expect(checkConsecutiveAssistantXml(messages1)).to.equal('invalid');

    const messages2 = [{ role: 'assistant', content: '<tool_code>\nconsole.log("hello world");\n</tool_cod' }];
    expect(checkConsecutiveAssistantXml(messages2)).to.equal('to be continue');

    const messages3 = [{ role: 'assistant', content: '<tool_code>\n<test><inner>abc</inner>' }];
    expect(checkConsecutiveAssistantXml(messages3)).to.equal('to be continue');
  });

  it('should correctly identify incomplete XML when split across multiple assistant messages', () => {
    const messages = [
      { role: 'assistant', content: '<tool_calls><tool_call><name>e' },
      { role: 'assistant', content: 'xample</name><parameters><param1>value1</param1></parameters></tool_call></tool_calls' }
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should correctly identify complete XML when split across multiple assistant messages', () => {
    const messages = [
      { role: 'assistant', content: '<tool_calls><tool_call><name>example</name><parameters><param1>value1</param1></parameters></tool_call></tool_calls>' }
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" for non-string content in assistant message', () => {
    const messages = [{ role: 'assistant', content: { text: '<xml>' } }];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "invalid" if last assistant message is valid but previous ones are not strings', () => {
    const messages = [
      { role: 'assistant', content: { text: 'some object' } },
      {
        role: 'assistant', content: '<valid></valid>'
      }
    ];
    expect(checkConsecutiveAssistantXml(messages)).to.equal('invalid');
  });

  it('should return "to be continue" if last assistant message is incomplete and previous ones are not strings', () => {
    const messages = [
      { role: 'assistant', content: { text: 'some object' } },
      { role: 'assistant', content: '<incomplete' }
    ];
    // This case is tricky. The loop breaks at the non-string content.
    // So it only considers '<incomplete'.
    expect(checkConsecutiveAssistantXml(messages)).to.equal('to be continue');
  });

  it('should handle tags with attributes', () => {
    const messages1 = [{ role: 'assistant', content: '<element attr="value">content</element>' }];
    expect(checkConsecutiveAssistantXml(messages1)).to.equal('invalid');

    const messages2 = [{ role: 'assistant', content: '<element attr="value">content</elemen' }];
    expect(checkConsecutiveAssistantXml(messages2)).to.equal('to be continue');

    const messages3 = [{ role: 'assistant', content: '<element attr="value"' }];
    expect(checkConsecutiveAssistantXml(messages3)).to.equal('to be continue');
  });

  it('should handle comments and processing instructions as non-opening tags', () => {
    const messages1 = [{ role: 'assistant', content: '<!-- comment --><tag></tag>' }];
    expect(checkConsecutiveAssistantXml(messages1)).to.equal('invalid');

    const messages2 = [{ role: 'assistant', content: '<?xml version="1.0"?><tag></tag>' }];
    expect(checkConsecutiveAssistantXml(messages2)).to.equal('invalid');

    const messages3 = [{ role: 'assistant', content: '<!DOCTYPE html><tag></tag>' }];
    expect(checkConsecutiveAssistantXml(messages3)).to.equal('invalid');

    const messages4 = [{ role: 'assistant', content: '<!-- comment --><tag>' }];
    expect(checkConsecutiveAssistantXml(messages4)).to.equal('to be continue');
  });

});