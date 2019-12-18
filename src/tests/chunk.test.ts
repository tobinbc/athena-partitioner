import { chunker } from "../index";

test("Plain array", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let output = chunker<typeof input[0]>(input, 3);
  let expected = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11]
  ];
  expect(output).toEqual(expected);
});

test("Input type error", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  expect(() => {
    chunker<typeof input[0]>(input, -1);
  }).toThrow(TypeError);
});
