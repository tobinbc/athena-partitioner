# Chunker
Very simple package to turn an array into typed chunks.

```
    import { chunker } from '@tobinbc/chunker'

    const input = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ];
    let output = chunker<typeof input[0]>(input, 3)
    let expected = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11]
    ]
```

