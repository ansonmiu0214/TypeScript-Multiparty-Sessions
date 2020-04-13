protocols_to_test = [
    ('protocols/BinaryNoPayload.scr', [
        ('Hello', {
            'node': ['Bob'],
            'browser': ['Alice'],
        }),
        ('LongHello', {
            'node': ['Bob'],
            'browser': ['Alice'],
        })
    ]),
    ('protocols/BinaryComplex.scr', [
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
