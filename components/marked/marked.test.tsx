/* eslint-disable react/jsx-key */
import "@testing-library/jest-dom";

import Link from "next/link";
import React from "react";
import { marked } from "./marked";

describe("Markdown like editor", () => {
  test("should render a link", () => {
    const result = marked("[text](url)");
    expect(result).toStrictEqual([<Link href="url">text</Link>, <br />]);
  });

  test("should render two links with a space between", () => {
    const result = marked("[one](url) [two](url)");
    expect(result).toStrictEqual([
      <Link href="url">one</Link>,
      <p> </p>,
      <Link href="url">two</Link>,
      <br />,
    ]);
  });

  test("should render two links with some text between", () => {
    const result = marked("[one](url) two [three](url)");
    expect(result).toStrictEqual([
      <Link href="url">one</Link>,
      <p> two </p>,
      <Link href="url">three</Link>,
      <br />,
    ]);
  });

  test("should render some text, then a link", () => {
    const result = marked("text [link](url)");
    expect(result).toStrictEqual([
      <p>text </p>,
      <Link href="url">link</Link>,
      <br />,
    ]);
  });

  test("should render a link, then some text", () => {
    const result = marked("[link](url) text");
    expect(result).toStrictEqual([
      <Link href="url">link</Link>,
      <p> text</p>,
      <br />,
    ]);
  });

  test("can render newlines", () => {
    const result = marked("one\ntwo");
    expect(result).toStrictEqual([<p>one</p>, <br />, <p>two</p>, <br />]);
  });

  test("can render newlines with spaces", () => {
    const result = marked("one\n two");
    expect(result).toStrictEqual([<p>one</p>, <br />, <p> two</p>, <br />]);
  });

  test("can render two lines, one with a link", () => {
    const result = marked("one\ntwo [link](url)");
    expect(result).toStrictEqual([
      <p>one</p>,
      <br />,
      <p>two </p>,
      <Link href="url">link</Link>,
      <br />,
    ]);
  });

  test("can render a link and a newline then some text", () => {
    const result = marked("[link](url)\n\ntext");
    expect(result).toStrictEqual([
      <Link href="url">link</Link>,
      <br />,
      <br />,
      <p>text</p>,
      <br />,
    ]);
  });

  test("can render some paragraphs of lorem ipsum", () => {
    const result = marked(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Donec euismod, nisl eget consectetur sagittis, nisl nunc
ultricies nisi, euismod aliquet nunc nisl eu nisl.
Donec euismod, nisl eget consectetur sagittis, nisl nunc
ultricies nisi, euismod aliquet nunc nisl eu nisl.
Donec euismod, nisl eget consectetur sagittis, nisl nunc
ultricies nisi, euismod aliquet nunc nisl eu nisl.
Donec euismod, nisl eget consectetur sagittis, nisl nunc
ultricies nisi, euismod aliquet nunc nisl eu nisl.
Donec euismod, nisl eget consectetur sagittis, nisl nunc
ultricies nisi, euismod aliquet nunc nisl eu nisl.`);
    expect(result).toStrictEqual([
      <br />,
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>,
      <br />,
      <p>Donec euismod, nisl eget consectetur sagittis, nisl nunc</p>,
      <br />,
      <p>ultricies nisi, euismod aliquet nunc nisl eu nisl.</p>,
      <br />,
      <p>Donec euismod, nisl eget consectetur sagittis, nisl nunc</p>,
      <br />,
      <p>ultricies nisi, euismod aliquet nunc nisl eu nisl.</p>,
      <br />,
      <p>Donec euismod, nisl eget consectetur sagittis, nisl nunc</p>,
      <br />,
      <p>ultricies nisi, euismod aliquet nunc nisl eu nisl.</p>,
      <br />,
      <p>Donec euismod, nisl eget consectetur sagittis, nisl nunc</p>,
      <br />,
      <p>ultricies nisi, euismod aliquet nunc nisl eu nisl.</p>,
      <br />,
      <p>Donec euismod, nisl eget consectetur sagittis, nisl nunc</p>,
      <br />,
      <p>ultricies nisi, euismod aliquet nunc nisl eu nisl.</p>,
      <br />,
    ]);
  });
});
