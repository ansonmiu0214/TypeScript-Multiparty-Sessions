protocols_to_test = [
    ('examples/BinaryNoPayload.scr', [
        ('Hello', {
            'node': ['Bob'],
            'browser': ['Alice'],
        }),
        ('LongHello', {
            'node': ['Bob'],
            'browser': ['Alice'],
        })
    ]),
    ('examples/BinaryComplex.scr', [
        ('Calculator', {
            'node': ['Svr'],
            'browser': ['Client'],
        }),
        ('CompactCalculator', {
            'node': ['Svr'],
            'browser': ['Client'],
        }),
    ]),
]
